# -*- coding: utf-8 -*-

# PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
# https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

from ccxtpro.base.exchange import Exchange
import ccxt.async_support as ccxt
from ccxtpro.base.cache import ArrayCache, ArrayCacheBySymbolById, ArrayCacheByTimestamp
import hashlib
from ccxt.base.errors import ExchangeError
from ccxt.base.errors import AuthenticationError
from ccxt.base.errors import ArgumentsRequired
from ccxt.base.errors import BadRequest
from ccxt.base.errors import NotSupported


class gateio(Exchange, ccxt.gateio):

    def describe(self):
        return self.deep_extend(super(gateio, self).describe(), {
            'has': {
                'ws': True,
                'watchOrderBook': True,
                'watchTicker': True,
                'watchTickers': False,  # for now
                'watchTrades': True,
                'watchMyTrades': True,
                'watchOHLCV': True,
                'watchBalance': True,
                'watchOrders': True,
            },
            'urls': {
                'api': {
                    'ws': 'wss://ws.gate.io/v4',
                    'spot': 'wss://api.gateio.ws/ws/v4/',
                    'swap': {
                        'usdt': 'wss://fx-ws.gateio.ws/v4/ws/usdt',
                        'btc': 'wss://fx-ws.gateio.ws/v4/ws/btc',
                    },
                    'future': {
                        'usdt': 'wss://fx-ws.gateio.ws/v4/ws/delivery/usdt',
                        'btc': 'wss://fx-ws.gateio.ws/v4/ws/delivery/btc',
                    },
                    'option': 'wss://op-ws.gateio.live/v4/ws',
                },
                'test': {
                    'swap': {
                        'usdt': 'wss://fx-ws-testnet.gateio.ws/v4/ws/usdt',
                        'btc': 'wss://fx-ws-testnet.gateio.ws/v4/ws/btc',
                    },
                    'future': {
                        'usdt': 'wss://fx-ws-testnet.gateio.ws/v4/ws/usdt',
                        'btc': 'wss://fx-ws-testnet.gateio.ws/v4/ws/btc',
                    },
                    'option': 'wss://op-ws-testnet.gateio.live/v4/ws',
                },
            },
            'options': {
                'tradesLimit': 1000,
                'OHLCVLimit': 1000,
                'watchTradesSubscriptions': {},
                'watchTickerSubscriptions': {},
                'watchOrderBookSubscriptions': {},
            },
            'exceptions': {
                'ws': {
                    'exact': {
                        '2': BadRequest,
                        '4': AuthenticationError,
                        '6': AuthenticationError,
                        '11': AuthenticationError,
                    },
                },
            },
        })

    async def watch_order_book(self, symbol, limit=None, params={}):
        await self.load_markets()
        market = self.market(symbol)
        marketId = market['id']
        uppercaseId = marketId.upper()
        requestId = self.nonce()
        url = self.urls['api']['ws']
        options = self.safe_value(self.options, 'watchOrderBook', {})
        defaultLimit = self.safe_integer(options, 'limit', 30)
        if not limit:
            limit = defaultLimit
        elif limit != 1 and limit != 5 and limit != 10 and limit != 20 and limit != 30:
            raise ExchangeError(self.id + ' watchOrderBook limit argument must be None, 1, 5, 10, 20, or 30')
        interval = self.safe_string(params, 'interval', '100ms')
        parameters = [uppercaseId, limit, interval]
        subscriptions = self.safe_value(options, 'subscriptions', {})
        subscriptions[symbol] = parameters
        options['subscriptions'] = subscriptions
        self.options['watchOrderBook'] = options
        toSend = list(subscriptions.values())
        messageHash = 'depth.update' + ':' + marketId
        subscribeMessage = {
            'id': requestId,
            'method': 'depth.subscribe',
            'params': toSend,
        }
        subscription = {
            'id': requestId,
        }
        orderbook = await self.watch(url, messageHash, subscribeMessage, messageHash, subscription)
        return orderbook.limit(limit)

    def handle_delta(self, bookside, delta):
        price = self.safe_float(delta, 0)
        amount = self.safe_float(delta, 1)
        bookside.store(price, amount)

    def handle_deltas(self, bookside, deltas):
        for i in range(0, len(deltas)):
            self.handle_delta(bookside, deltas[i])

    def handle_order_book(self, client, message):
        #
        #     {
        #         "method":"depth.update",
        #         "params":[
        #             True,  # snapshot or not
        #             {
        #                 "asks":[
        #                     ["7449.62","0.3933"],
        #                     ["7450","3.58662932"],
        #                     ["7450.44","0.15"],
        #                 "bids":[
        #                     ["7448.31","0.69984534"],
        #                     ["7447.08","0.7506"],
        #                     ["7445.74","0.4433"],
        #                 ]
        #             },
        #             "BTC_USDT"
        #         ],
        #         "id":null
        #     }
        #
        params = self.safe_value(message, 'params', [])
        clean = self.safe_value(params, 0)
        book = self.safe_value(params, 1)
        marketId = self.safe_string(params, 2)
        symbol = self.safe_symbol(marketId)
        method = self.safe_string(message, 'method')
        messageHash = method + ':' + marketId
        orderBook = None
        options = self.safe_value(self.options, 'watchOrderBook', {})
        subscriptions = self.safe_value(options, 'subscriptions', {})
        subscription = self.safe_value(subscriptions, symbol, [])
        defaultLimit = self.safe_integer(options, 'limit', 30)
        limit = self.safe_value(subscription, 1, defaultLimit)
        if clean:
            orderBook = self.order_book({}, limit)
            self.orderbooks[symbol] = orderBook
        else:
            orderBook = self.orderbooks[symbol]
        self.handle_deltas(orderBook['asks'], self.safe_value(book, 'asks', []))
        self.handle_deltas(orderBook['bids'], self.safe_value(book, 'bids', []))
        client.resolve(orderBook, messageHash)

    async def watch_ticker(self, symbol, params={}):
        await self.load_markets()
        market = self.market(symbol)
        marketId = market['id']
        uppercaseId = marketId.upper()
        requestId = self.nonce()
        url = self.urls['api']['ws']
        options = self.safe_value(self.options, 'watchTicker', {})
        subscriptions = self.safe_value(options, 'subscriptions', {})
        subscriptions[uppercaseId] = True
        options['subscriptions'] = subscriptions
        self.options['watchTicker'] = options
        subscribeMessage = {
            'id': requestId,
            'method': 'ticker.subscribe',
            'params': list(subscriptions.keys()),
        }
        subscription = {
            'id': requestId,
        }
        messageHash = 'ticker.update' + ':' + marketId
        return await self.watch(url, messageHash, subscribeMessage, messageHash, subscription)

    def handle_ticker(self, client, message):
        #
        #     {
        #         'method': 'ticker.update',
        #         'params': [
        #             'BTC_USDT',
        #             {
        #                 'period': 86400,  # 24 hours = 86400 seconds
        #                 'open': '9027.96',
        #                 'close': '9282.93',
        #                 'high': '9428.57',
        #                 'low': '8900',
        #                 'last': '9282.93',
        #                 'change': '2.8',
        #                 'quoteVolume': '1838.9950613035',
        #                 'baseVolume': '17032535.24172142379566994715'
        #             }
        #         ],
        #         'id': null
        #     }
        #
        params = self.safe_value(message, 'params', [])
        marketId = self.safe_string(params, 0)
        market = self.safe_market(marketId, None, '_')
        symbol = market['symbol']
        ticker = self.safe_value(params, 1, {})
        result = self.parse_ticker(ticker, market)
        methodType = message['method']
        messageHash = methodType + ':' + marketId
        self.tickers[symbol] = result
        client.resolve(result, messageHash)

    async def watch_trades(self, symbol, since=None, limit=None, params={}):
        await self.load_markets()
        market = self.market(symbol)
        marketId = market['id']
        uppercaseId = marketId.upper()
        requestId = self.nonce()
        url = self.urls['api']['ws']
        options = self.safe_value(self.options, 'watchTrades', {})
        subscriptions = self.safe_value(options, 'subscriptions', {})
        subscriptions[uppercaseId] = True
        options['subscriptions'] = subscriptions
        self.options['watchTrades'] = options
        subscribeMessage = {
            'id': requestId,
            'method': 'trades.subscribe',
            'params': list(subscriptions.keys()),
        }
        subscription = {
            'id': requestId,
        }
        messageHash = 'trades.update' + ':' + marketId
        trades = await self.watch(url, messageHash, subscribeMessage, messageHash, subscription)
        if self.newUpdates:
            limit = trades.getLimit(symbol, limit)
        return self.filter_by_since_limit(trades, since, limit, 'timestamp', True)

    def handle_trades(self, client, message):
        #
        #     [
        #         'BTC_USDT',
        #         [
        #             {
        #                 id: 221994511,
        #                 time: 1580311438.618647,
        #                 price: '9309',
        #                 amount: '0.0019',
        #                 type: 'sell'
        #             },
        #             {
        #                 id: 221994501,
        #                 time: 1580311433.842509,
        #                 price: '9311.31',
        #                 amount: '0.01',
        #                 type: 'buy'
        #             },
        #         ]
        #     ]
        #
        params = self.safe_value(message, 'params', [])
        marketId = self.safe_string(params, 0)
        market = self.safe_market(marketId, None, '_')
        symbol = market['symbol']
        stored = self.safe_value(self.trades, symbol)
        if stored is None:
            limit = self.safe_integer(self.options, 'tradesLimit', 1000)
            stored = ArrayCache(limit)
            self.trades[symbol] = stored
        trades = self.safe_value(params, 1, [])
        parsed = self.parse_trades(trades, market)
        for i in range(0, len(parsed)):
            stored.append(parsed[i])
        methodType = message['method']
        messageHash = methodType + ':' + marketId
        client.resolve(stored, messageHash)

    async def watch_ohlcv(self, symbol, timeframe='1m', since=None, limit=None, params={}):
        await self.load_markets()
        market = self.market(symbol)
        marketId = market['id']
        uppercaseId = marketId.upper()
        requestId = self.nonce()
        url = self.urls['api']['ws']
        interval = self.parse_timeframe(timeframe)
        subscribeMessage = {
            'id': requestId,
            'method': 'kline.subscribe',
            'params': [uppercaseId, interval],
        }
        subscription = {
            'id': requestId,
        }
        # gateio sends candles without a timeframe identifier
        # making it impossible to differentiate candles from
        # two or more different timeframes within the same symbol
        # thus the exchange API is limited to one timeframe per symbol
        messageHash = 'kline.update' + ':' + marketId
        ohlcv = await self.watch(url, messageHash, subscribeMessage, messageHash, subscription)
        if self.newUpdates:
            limit = ohlcv.getLimit(symbol, limit)
        return self.filter_by_since_limit(ohlcv, since, limit, 0, True)

    def handle_ohlcv(self, client, message):
        #
        #     {
        #         method: 'kline.update',
        #         params: [
        #             [
        #                 1580661060,
        #                 '9432.37',
        #                 '9435.77',
        #                 '9435.77',
        #                 '9429.93',
        #                 '0.0879',
        #                 '829.1875889352',
        #                 'BTC_USDT'
        #             ]
        #         ],
        #         id: null
        #     }
        #
        params = self.safe_value(message, 'params', [])
        ohlcv = self.safe_value(params, 0, [])
        marketId = self.safe_string(ohlcv, 7)
        parsed = [
            self.safe_timestamp(ohlcv, 0),  # t
            self.safe_number(ohlcv, 1),  # o
            self.safe_number(ohlcv, 3),  # h
            self.safe_number(ohlcv, 4),  # l
            self.safe_number(ohlcv, 2),  # c
            self.safe_number(ohlcv, 5),  # v
        ]
        symbol = self.safe_symbol(marketId, None, '_')
        # gateio sends candles without a timeframe identifier
        # making it impossible to differentiate candles from
        # two or more different timeframes within the same symbol
        # thus the exchange API is limited to one timeframe per symbol
        # --------------------------------------------------------------------
        # self.ohlcvs[symbol] = self.safe_value(self.ohlcvs, symbol, {})
        # stored = self.safe_value(self.ohlcvs[symbol], timeframe, [])
        # --------------------------------------------------------------------
        stored = self.safe_value(self.ohlcvs, symbol)
        if stored is None:
            limit = self.safe_integer(self.options, 'OHLCVLimit', 1000)
            stored = ArrayCacheByTimestamp(limit)
            self.ohlcvs[symbol] = stored
        stored.append(parsed)
        # --------------------------------------------------------------------
        # self.ohlcvs[symbol][timeframe] = stored
        # --------------------------------------------------------------------
        methodType = message['method']
        messageHash = methodType + ':' + marketId
        client.resolve(stored, messageHash)

    async def authenticate(self, params={}):
        url = self.urls['api']['ws']
        client = self.client(url)
        future = client.future('authenticated')
        method = 'server.sign'
        authenticate = self.safe_value(client.subscriptions, method)
        if authenticate is None:
            requestId = self.milliseconds()
            requestIdString = str(requestId)
            signature = self.hmac(self.encode(requestIdString), self.encode(self.secret), hashlib.sha512, 'hex')
            authenticateMessage = {
                'id': requestId,
                'method': method,
                'params': [self.apiKey, signature, requestId],
            }
            subscribe = {
                'id': requestId,
                'method': self.handle_authentication_message,
            }
            self.spawn(self.watch, url, requestId, authenticateMessage, method, subscribe)
        return await future

    async def watch_my_trades(self, symbol=None, since=None, limit=None, params={}):
        await self.load_markets()
        self.check_required_credentials()
        type = 'spot'
        marketId = None
        marketSymbol = None
        if symbol is not None:
            market = self.market(symbol)
            type = market['type']
            marketId = market['id']
            marketSymbol = market['symbol']
        if type != 'spot':
            raise BadRequest(self.id + ' watchMyTrades symbol supports spot markets only')
        url = self.get_url_by_market_type(type)
        channel = 'spot.usertrades'
        messageHash = channel
        payload = []
        if marketId is not None:
            payload = [marketId]
            messageHash += ':' + marketSymbol
        trades = await self.subscribe_private(url, channel, messageHash, payload, None)
        if self.newUpdates:
            limit = trades.getLimit(symbol, limit)
        return self.filter_by_symbol_since_limit(trades, symbol, since, limit, True)

    def handle_my_trades(self, client, message):
        #
        # {
        #     "time": 1605176741,
        #     "channel": "spot.usertrades",
        #     "event": "update",
        #     "result": [
        #       {
        #         "id": 5736713,
        #         "user_id": 1000001,
        #         "order_id": "30784428",
        #         "currency_pair": "BTC_USDT",
        #         "create_time": 1605176741,
        #         "create_time_ms": "1605176741123.456",
        #         "side": "sell",
        #         "amount": "1.00000000",
        #         "role": "taker",
        #         "price": "10000.00000000",
        #         "fee": "0.00200000000000",
        #         "point_fee": "0",
        #         "gt_fee": "0",
        #         "text": "apiv4"
        #       }
        #     ]
        #   }
        #
        channel = self.safe_string(message, 'channel')
        trades = self.safe_value(message, 'result', [])
        if len(trades) > 0:
            if self.myTrades is None:
                limit = self.safe_integer(self.options, 'tradesLimit', 1000)
                self.myTrades = ArrayCache(limit)
            stored = self.myTrades
            parsedTrades = self.parse_trades(trades)
            for i in range(0, len(parsedTrades)):
                stored.append(parsedTrades[i])
            client.resolve(self.myTrades, channel)
            for i in range(0, len(parsedTrades)):
                messageHash = channel + ':' + parsedTrades[i]['symbol']
                client.resolve(self.myTrades, messageHash)

    async def watch_balance(self, params={}):
        await self.load_markets()
        self.check_required_credentials()
        url = self.urls['api']['ws']
        await self.authenticate()
        requestId = self.nonce()
        method = 'balance.update'
        subscribeMessage = {
            'id': requestId,
            'method': 'balance.subscribe',
            'params': [],
        }
        subscription = {
            'id': requestId,
            'method': self.handle_balance_subscription,
        }
        return await self.watch(url, method, subscribeMessage, method, subscription)

    async def fetch_balance_snapshot(self):
        await self.load_markets()
        self.check_required_credentials()
        url = self.urls['api']['ws']
        await self.authenticate()
        requestId = self.nonce()
        method = 'balance.query'
        subscribeMessage = {
            'id': requestId,
            'method': method,
            'params': [],
        }
        subscription = {
            'id': requestId,
            'method': self.handle_balance_snapshot,
        }
        return await self.watch(url, requestId, subscribeMessage, method, subscription)

    def handle_balance_snapshot(self, client, message):
        messageHash = self.safe_string(message, 'id')
        result = self.safe_value(message, 'result')
        self.handle_balance_message(client, messageHash, result)
        client.resolve(self.balance, 'balance.update')
        if 'balance.query' in client.subscriptions:
            del client.subscriptions['balance.query']

    def handle_balance(self, client, message):
        messageHash = message['method']
        result = message['params'][0]
        self.handle_balance_message(client, messageHash, result)

    def handle_balance_message(self, client, messageHash, result):
        keys = list(result.keys())
        for i in range(0, len(keys)):
            account = self.account()
            key = keys[i]
            code = self.safe_currency_code(key)
            balance = result[key]
            account['free'] = self.safe_string(balance, 'available')
            account['used'] = self.safe_string(balance, 'freeze')
            self.balance[code] = account
        self.balance = self.safe_balance(self.balance)
        client.resolve(self.balance, messageHash)

    async def watch_orders(self, symbol=None, since=None, limit=None, params={}):
        if symbol is None:
            raise ArgumentsRequired(self.id + ' watchOrders requires a symbol argument')
        await self.load_markets()
        market = self.market(symbol)
        type = 'spot'
        if market['future'] or market['swap']:
            type = 'futures'
        elif market['option']:
            type = 'options'
        method = type + '.orders'
        messageHash = method
        messageHash = method + ':' + market['id']
        isSettleBtc = market['settleId'] == 'btc'
        isBtcContract = True if (market['contract'] and isSettleBtc) else False
        url = self.get_url_by_market_type(market['type'], isBtcContract)
        payload = [market['id']]
        # uid required for non spot markets
        requiresUid = (type != 'spot')
        orders = await self.subscribe_private(url, method, messageHash, payload, requiresUid)
        if self.newUpdates:
            limit = orders.getLimit(symbol, limit)
        return self.filter_by_since_limit(orders, since, limit, 'timestamp', True)

    def handle_order(self, client, message):
        #
        # {
        #     "time": 1605175506,
        #     "channel": "spot.orders",
        #     "event": "update",
        #     "result": [
        #       {
        #         "id": "30784435",
        #         "user": 123456,
        #         "text": "t-abc",
        #         "create_time": "1605175506",
        #         "create_time_ms": "1605175506123",
        #         "update_time": "1605175506",
        #         "update_time_ms": "1605175506123",
        #         "event": "put",
        #         "currency_pair": "BTC_USDT",
        #         "type": "limit",
        #         "account": "spot",
        #         "side": "sell",
        #         "amount": "1",
        #         "price": "10001",
        #         "time_in_force": "gtc",
        #         "left": "1",
        #         "filled_total": "0",
        #         "fee": "0",
        #         "fee_currency": "USDT",
        #         "point_fee": "0",
        #         "gt_fee": "0",
        #         "gt_discount": True,
        #         "rebated_fee": "0",
        #         "rebated_fee_currency": "USDT"
        #       }
        #     ]
        # }
        #
        orders = self.safe_value(message, 'result', [])
        channel = self.safe_string(message, 'channel')
        ordersLength = len(orders)
        if ordersLength > 0:
            limit = self.safe_integer(self.options, 'ordersLimit', 1000)
            if self.orders is None:
                self.orders = ArrayCacheBySymbolById(limit)
            stored = self.orders
            marketIds = {}
            parsedOrders = self.parse_orders(orders)
            for i in range(0, len(parsedOrders)):
                parsed = parsedOrders[i]
                # inject order status
                info = self.safe_value(parsed, 'info')
                event = self.safe_string(info, 'event')
                if event == 'put':
                    parsed['status'] = 'open'
                elif event == 'finish':
                    parsed['status'] = 'closed'
                stored.append(parsed)
                symbol = parsed['symbol']
                market = self.market(symbol)
                marketIds[market['id']] = True
            keys = list(marketIds.keys())
            for i in range(0, len(keys)):
                messageHash = channel + ':' + keys[i]
                client.resolve(self.orders, messageHash)

    def handle_authentication_message(self, client, message, subscription):
        result = self.safe_value(message, 'result')
        status = self.safe_string(result, 'status')
        if status == 'success':
            # client.resolve(True, 'authenticated') will del the future
            # we want to remember that we are authenticated in subsequent call to private methods
            future = self.safe_value(client.futures, 'authenticated')
            if future is not None:
                future.resolve(True)
        else:
            # del authenticate subscribeHash to release the "subscribe lock"
            # allows subsequent calls to subscribe to reauthenticate
            # avoids sending two authentication messages before receiving a reply
            error = AuthenticationError(self.id + ' handleAuthenticationMessage() error')
            client.reject(error, 'authenticated')
            if 'server.sign' in client.subscriptions:
                del client.subscriptions['server.sign']

    def handle_error_message(self, client, message):
        # {
        #     time: 1647274664,
        #     channel: 'futures.orders',
        #     event: 'subscribe',
        #     error: {code: 2, message: 'unknown contract BTC_USDT_20220318'},
        # }
        # {
        #     time: 1647276473,
        #     channel: 'futures.orders',
        #     event: 'subscribe',
        #     error: {
        #       code: 4,
        #       message: '{"label":"INVALID_KEY","message":"Invalid key provided"}\n'
        #     },
        #     result: null
        #   }
        error = self.safe_value(message, 'error', {})
        code = self.safe_integer(error, 'code')
        if code is not None:
            id = self.safe_string(message, 'id')
            subscriptionsById = self.index_by(client.subscriptions, 'id')
            subscription = self.safe_value(subscriptionsById, id)
            if subscription is not None:
                try:
                    self.throw_exactly_matched_exception(self.exceptions['ws']['exact'], code, self.json(message))
                except Exception as e:
                    messageHash = self.safe_string(subscription, 'messageHash')
                    client.reject(e, messageHash)
                    client.reject(e, id)
                    if id in client.subscriptions:
                        del client.subscriptions[id]

    def handle_balance_subscription(self, client, message, subscription):
        self.spawn(self.fetch_balance_snapshot)

    def handle_subscription_status(self, client, message):
        messageId = self.safe_integer(message, 'id')
        if messageId is not None:
            subscriptionsById = self.index_by(client.subscriptions, 'id')
            subscription = self.safe_value(subscriptionsById, messageId, {})
            method = self.safe_value(subscription, 'method')
            if method is not None:
                method(client, message, subscription)
            client.resolve(message, messageId)

    def handle_message(self, client, message):
        # orders
        # {
        #     "time": 1630654851,
        #     "channel": "options.orders", or futures.orders or spot.orders
        #     "event": "update",
        #     "result": [
        #        {
        #           "contract": "BTC_USDT-20211130-65000-C",
        #           "create_time": 1637897000,
        #             (...)
        #     ]
        # }
        self.handle_error_message(client, message)
        methods = {
            'depth.update': self.handle_order_book,
            'ticker.update': self.handle_ticker,
            'trades.update': self.handle_trades,
            'kline.update': self.handle_ohlcv,
            'balance.update': self.handle_balance,
        }
        methodType = self.safe_string(message, 'method')
        method = self.safe_value(methods, methodType)
        if method is None:
            messageId = self.safe_integer(message, 'id')
            if messageId is not None:
                self.handle_subscription_status(client, message)
                return
            event = self.safe_string(message, 'event')
            if event == 'subscribe':
                self.handle_subscription_status(client, message)
                return
            channel = self.safe_string(message, 'channel', '')
            channelParts = channel.split('.')
            channelType = self.safe_value(channelParts, 1)
            if channelType == 'usertrades':
                self.handle_my_trades(client, message)
                return
            if channelType == 'orders':
                self.handle_order(client, message)
        else:
            method(client, message)

    def get_url_by_market_type(self, type, isBtcContract=False):
        if type == 'spot':
            spotUrl = self.urls['api']['spot']
            if spotUrl is None:
                raise NotSupported(self.id + ' does not have a testnet for the ' + type + ' market type.')
            return spotUrl
        if type == 'swap':
            baseUrl = self.urls['api']['swap']
            return baseUrl['btc'] if isBtcContract else baseUrl['usdt']
        if type == 'future':
            baseUrl = self.urls['api']['future']
            return baseUrl['btc'] if isBtcContract else baseUrl['usdt']
        if type == 'option':
            return self.urls['api']['option']

    async def subscribe_private(self, url, channel, messageHash, payload, requiresUid=False):
        self.check_required_credentials()
        # uid is required for some subscriptions only so it's not a part of required credentials
        if requiresUid:
            if self.uid is None or len(self.uid) == 0:
                raise ArgumentsRequired(self.id + ' requires uid to subscribe')
            idArray = [self.uid]
            payload = self.array_concat(idArray, payload)
        time = self.seconds()
        event = 'subscribe'
        signaturePayload = 'channel=' + channel + '&event=' + event + '&time=' + str(time)
        signature = self.hmac(self.encode(signaturePayload), self.encode(self.secret), hashlib.sha512, 'hex')
        auth = {
            'method': 'api_key',
            'KEY': self.apiKey,
            'SIGN': signature,
        }
        requestId = self.nonce()
        request = {
            'id': requestId,
            'time': time,
            'channel': channel,
            'event': 'subscribe',
            'payload': payload,
            'auth': auth,
        }
        subscription = {
            'id': requestId,
            'messageHash': messageHash,
        }
        return await self.watch(url, messageHash, request, messageHash, subscription)
