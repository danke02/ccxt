# -*- coding: utf-8 -*-

# PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
# https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

import ccxt.async_support
from ccxt.async_support.base.ws.cache import ArrayCache, ArrayCacheBySymbolById, ArrayCacheByTimestamp
import math
from ccxt.base.types import Int, Order, OrderBook, Str, Ticker, Trade
from ccxt.async_support.base.ws.client import Client
from typing import List
from ccxt.base.errors import ExchangeError


class lbank(ccxt.async_support.lbank):

    def describe(self):
        return self.deep_extend(super(lbank, self).describe(), {
            'has': {
                'ws': True,
                'fetchOHLCVWs': True,
                'fetchOrderBookWs': True,
                'fetchTickerWs': True,
                'fetchTradesWs': True,
                'watchBalance': False,
                'watchTicker': True,
                'watchTickers': False,
                'watchTrades': True,
                'watchMyTrades': False,
                'watchOrders': True,
                'watchOrderBook': True,
                'watchOHLCV': True,
            },
            'urls': {
                'api': {
                    'ws': 'wss://www.lbkex.net/ws/V2/',
                },
            },
            'options': {
                'watchOHLCV': {
                    'timeframes': {
                        '1m': '1min',
                        '5m': '5min',
                        '15m': '15min',
                        '30m': '30min',
                        '1h': '1hr',
                        '4h': '4hr',
                        '1d': 'day',
                        '1w': 'week',
                        '1M': 'month',
                        '1y': 'year',
                    },
                },
            },
            'streaming': {
            },
            'exceptions': {
            },
        })

    def request_id(self):
        previousValue = self.safe_integer(self.options, 'requestId', 0)
        newValue = self.sum(previousValue, 1)
        self.options['requestId'] = newValue
        return newValue

    async def fetch_ohlcv_ws(self, symbol: str, timeframe='1m', since: Int = None, limit: Int = None, params={}) -> List[list]:
        """
        :see: https://www.lbank.com/en-US/docs/index.html#request-amp-subscription-instruction
        watches historical candlestick data containing the open, high, low, and close price, and the volume of a market
        :param str symbol: unified symbol of the market to fetch OHLCV data for
        :param str timeframe: the length of time each candle represents
        :param int [since]: timestamp in ms of the earliest candle to fetch
        :param int [limit]: the maximum amount of candles to fetch
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns int[][]: A list of candles ordered, open, high, low, close, volume
        """
        await self.load_markets()
        market = self.market(symbol)
        url = self.urls['api']['ws']
        watchOHLCVOptions = self.safe_value(self.options, 'watchOHLCV', {})
        timeframes = self.safe_value(watchOHLCVOptions, 'timeframes', {})
        timeframeId = self.safe_string(timeframes, timeframe, timeframe)
        messageHash = 'fetchOHLCV:' + market['symbol'] + ':' + timeframeId
        message = {
            'action': 'request',
            'request': 'kbar',
            'kbar': timeframeId,
            'pair': market['id'],
        }
        if since is not None:
            message['start'] = self.parse_to_int(int(math.floor(since / 1000)))
        if limit is not None:
            message['size'] = limit
        request = self.deep_extend(message, params)
        requestId = self.request_id()
        return await self.watch(url, messageHash, request, requestId, request)

    async def watch_ohlcv(self, symbol: str, timeframe='1m', since: Int = None, limit: Int = None, params={}) -> List[list]:
        """
        :see: https://www.lbank.com/en-US/docs/index.html#subscription-of-k-line-data
        watches historical candlestick data containing the open, high, low, and close price, and the volume of a market
        :param str symbol: unified symbol of the market to fetch OHLCV data for
        :param str timeframe: the length of time each candle represents
        :param int [since]: timestamp in ms of the earliest candle to fetch
        :param int [limit]: the maximum amount of candles to fetch
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns int[][]: A list of candles ordered, open, high, low, close, volume
        """
        await self.load_markets()
        market = self.market(symbol)
        watchOHLCVOptions = self.safe_value(self.options, 'watchOHLCV', {})
        timeframes = self.safe_value(watchOHLCVOptions, 'timeframes', {})
        timeframeId = self.safe_string(timeframes, timeframe, timeframe)
        messageHash = 'ohlcv:' + market['symbol'] + ':' + timeframeId
        url = self.urls['api']['ws']
        subscribe = {
            'action': 'subscribe',
            'subscribe': 'kbar',
            'kbar': timeframeId,
            'pair': market['id'],
        }
        request = self.deep_extend(subscribe, params)
        ohlcv = await self.watch(url, messageHash, request, messageHash)
        if self.newUpdates:
            limit = ohlcv.getLimit(symbol, limit)
        return self.filter_by_since_limit(ohlcv, since, limit, 0, True)

    def handle_ohlcv(self, client, message):
        #
        # request
        #    {
        #        "records":[
        #           [
        #              1705364400,
        #              42614,
        #              42624.57,
        #              42532.15,
        #              42537.43,
        #              13.2615,
        #              564568.931565,
        #              433
        #           ]
        #        ],
        #        "columns":[
        #           "timestamp",
        #           "open",
        #           "high",
        #           "low",
        #           "close",
        #           "volume",
        #           "turnover",
        #           "count"
        #        ],
        #        "SERVER":"V2",
        #        "count":1,
        #        "kbar":"5min",
        #        "type":"kbar",
        #        "pair":"btc_usdt",
        #        "TS":"2024-01-16T08:29:41.718"
        #    }
        # subscribe
        #      {
        #          SERVER: 'V2',
        #          kbar: {
        #              a: 26415.891476,
        #              c: 19315.51,
        #              t: '2022-10-02T12:44:00.000',
        #              v: 1.3676,
        #              h: 19316.66,
        #              slot: '1min',
        #              l: 19315.51,
        #              n: 1,
        #              o: 19316.66
        #          },
        #          type: 'kbar',
        #          pair: 'btc_usdt',
        #          TS: '2022-10-02T12:44:15.865'
        #      }
        #
        marketId = self.safe_string(message, 'pair')
        symbol = self.safe_symbol(marketId, None, '_')
        watchOHLCVOptions = self.safe_value(self.options, 'watchOHLCV', {})
        timeframes = self.safe_value(watchOHLCVOptions, 'timeframes', {})
        records = self.safe_value(message, 'records')
        if records is not None:  # from request
            rawOHLCV = self.safe_value(records, 0, [])
            parsed = [
                self.safe_integer(rawOHLCV, 0),
                self.safe_number(rawOHLCV, 1),
                self.safe_number(rawOHLCV, 2),
                self.safe_number(rawOHLCV, 3),
                self.safe_number(rawOHLCV, 4),
                self.safe_number(rawOHLCV, 5),
            ]
            timeframeId = self.safe_string(message, 'kbar')
            timeframe = self.find_timeframe(timeframeId, timeframes)
            self.ohlcvs[symbol] = self.safe_value(self.ohlcvs, symbol, {})
            stored = self.safe_value(self.ohlcvs[symbol], timeframe)
            if stored is None:
                limit = self.safe_integer(self.options, 'OHLCVLimit', 1000)
                stored = ArrayCacheByTimestamp(limit)
                self.ohlcvs[symbol][timeframe] = stored
            stored.append(parsed)
            messageHash = 'fetchOHLCV:' + symbol + ':' + timeframeId
            client.resolve(stored, messageHash)
        else:  # from subscription
            rawOHLCV = self.safe_value(message, 'kbar', {})
            timeframeId = self.safe_string(rawOHLCV, 'slot')
            datetime = self.safe_string(rawOHLCV, 't')
            parsed = [
                self.parse8601(datetime),
                self.safe_number(rawOHLCV, 'o'),
                self.safe_number(rawOHLCV, 'h'),
                self.safe_number(rawOHLCV, 'l'),
                self.safe_number(rawOHLCV, 'c'),
                self.safe_number(rawOHLCV, 'v'),
            ]
            timeframe = self.find_timeframe(timeframeId, timeframes)
            self.ohlcvs[symbol] = self.safe_value(self.ohlcvs, symbol, {})
            stored = self.safe_value(self.ohlcvs[symbol], timeframe)
            if stored is None:
                limit = self.safe_integer(self.options, 'OHLCVLimit', 1000)
                stored = ArrayCacheByTimestamp(limit)
                self.ohlcvs[symbol][timeframe] = stored
            stored.append(parsed)
            messageHash = 'ohlcv:' + symbol + ':' + timeframeId
            client.resolve(stored, messageHash)

    async def fetch_ticker_ws(self, symbol, params={}) -> Ticker:
        """
        :see: https://www.lbank.com/en-US/docs/index.html#request-amp-subscription-instruction
        fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
        :param str symbol: unified symbol of the market to fetch the ticker for
        :param dict [params]: extra parameters specific to the cex api endpoint
        :returns dict: a `ticker structure <https://docs.ccxt.com/#/?id=ticker-structure>`
        """
        await self.load_markets()
        market = self.market(symbol)
        url = self.urls['api']['ws']
        messageHash = 'fetchTicker:' + market['symbol']
        message = {
            'action': 'request',
            'request': 'tick',
            'pair': market['id'],
        }
        request = self.deep_extend(message, params)
        requestId = self.request_id()
        return await self.watch(url, messageHash, request, requestId, request)

    async def watch_ticker(self, symbol: str, params={}) -> Ticker:
        """
        :see: https://www.lbank.com/en-US/docs/index.html#market
        watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
        :param str symbol: unified symbol of the market to fetch the ticker for
        :param dict params: extra parameters specific to the lbank api endpoint
        :returns dict: a `ticker structure <https://docs.ccxt.com/en/latest/manual.html#ticker-structure>`
        """
        await self.load_markets()
        market = self.market(symbol)
        url = self.urls['api']['ws']
        messageHash = 'ticker:' + market['symbol']
        message = {
            'action': 'subscribe',
            'subscribe': 'tick',
            'pair': market['id'],
        }
        request = self.deep_extend(message, params)
        return await self.watch(url, messageHash, request, messageHash, request)

    def handle_ticker(self, client, message):
        #
        #     {
        #         "tick":{
        #             "to_cny":76643.5,
        #             "high":0.02719761,
        #             "vol":497529.7686,
        #             "low":0.02603071,
        #             "change":2.54,
        #             "usd":299.12,
        #             "to_usd":11083.66,
        #             "dir":"sell",
        #             "turnover":13224.0186,
        #             "latest":0.02698749,
        #             "cny":2068.41
        #         },
        #         "type":"tick",
        #         "pair":"eth_btc",
        #         "SERVER":"V2",
        #         "TS":"2019-07-01T11:33:55.188"
        #     }
        #
        marketId = self.safe_string(message, 'pair')
        symbol = self.safe_symbol(marketId)
        market = self.safe_market(marketId)
        parsedTicker = self.parse_ws_ticker(message, market)
        self.tickers[symbol] = parsedTicker
        messageHash = 'ticker:' + symbol
        client.resolve(parsedTicker, messageHash)
        messageHash = 'fetchTicker:' + symbol
        client.resolve(parsedTicker, messageHash)

    def parse_ws_ticker(self, ticker, market=None):
        #
        #     {
        #         "tick":{
        #             "to_cny":76643.5,
        #             "high":0.02719761,
        #             "vol":497529.7686,
        #             "low":0.02603071,
        #             "change":2.54,
        #             "usd":299.12,
        #             "to_usd":11083.66,
        #             "dir":"sell",
        #             "turnover":13224.0186,
        #             "latest":0.02698749,
        #             "cny":2068.41
        #         },
        #         "type":"tick",
        #         "pair":"eth_btc",
        #         "SERVER":"V2",
        #         "TS":"2019-07-01T11:33:55.188"
        #     }
        #
        marketId = self.safe_string(ticker, 'pair')
        symbol = self.safe_symbol(marketId, market)
        datetime = self.safe_string(ticker, 'TS')
        tickerData = self.safe_value(ticker, 'tick')
        return self.safe_ticker({
            'symbol': symbol,
            'timestamp': self.parse8601(datetime),
            'datetime': datetime,
            'high': self.safe_string(tickerData, 'high'),
            'low': self.safe_string(tickerData, 'low'),
            'bid': None,
            'bidVolume': None,
            'ask': None,
            'askVolume': None,
            'vwap': None,
            'open': None,
            'close': None,
            'last': self.safe_string(tickerData, 'latest'),
            'previousClose': None,
            'change': None,
            'percentage': self.safe_string(tickerData, 'change'),
            'average': None,
            'baseVolume': self.safe_string(tickerData, 'vol'),
            'quoteVolume': self.safe_string(tickerData, 'turnover'),
            'info': ticker,
        }, market)

    async def fetch_trades_ws(self, symbol: str, since: Int = None, limit: Int = None, params={}) -> List[Trade]:
        """
        get the list of most recent trades for a particular symbol
        :see: https://www.lbank.com/en-US/docs/index.html#request-amp-subscription-instruction
        :param str symbol: unified symbol of the market to fetch trades for
        :param int [since]: timestamp in ms of the earliest trade to fetch
        :param int [limit]: the maximum amount of trades to fetch
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns Trade[]: a list of `trade structures <https://docs.ccxt.com/#/?id=public-trades>`
        """
        await self.load_markets()
        market = self.market(symbol)
        url = self.urls['api']['ws']
        messageHash = 'fetchTrades:' + market['symbol']
        if limit is None:
            limit = 10
        message = {
            'action': 'request',
            'request': 'trade',
            'pair': market['id'],
            'size': limit,
        }
        request = self.deep_extend(message, params)
        requestId = self.request_id()
        return await self.watch(url, messageHash, request, requestId, request)

    async def watch_trades(self, symbol: str, since: Int = None, limit: Int = None, params={}) -> List[Trade]:
        """
        :see: https://www.lbank.com/en-US/docs/index.html#trade-record
        get the list of most recent trades for a particular symbol
        :param str symbol: unified symbol of the market to fetch trades for
        :param int [since]: timestamp in ms of the earliest trade to fetch
        :param int [limit]: the maximum amount of trades to fetch
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict[]: a list of `trade structures <https://docs.ccxt.com/#/?id=public-trades>`
        """
        await self.load_markets()
        market = self.market(symbol)
        url = self.urls['api']['ws']
        messageHash = 'trades:' + market['symbol']
        message = {
            'action': 'subscribe',
            'subscribe': 'trade',
            'pair': market['id'],
        }
        request = self.deep_extend(message, params)
        trades = await self.watch(url, messageHash, request, messageHash, request)
        return self.filter_by_since_limit(trades, since, limit, 'timestamp', True)

    def handle_trades(self, client, message):
        #
        # request
        #     {
        #         columns: ['timestamp', 'price', 'volume', 'direction'],
        #         SERVER: 'V2',
        #         count: 100,
        #         trades: [],
        #         type: 'trade',
        #         pair: 'btc_usdt',
        #         TS: '2024-01-16T08:48:24.470'
        #     }
        # subscribe
        #     {
        #         "trade":{
        #             "volume":6.3607,
        #             "amount":77148.9303,
        #             "price":12129,
        #             "direction":"sell",  # or "sell_market"
        #             "TS":"2019-06-28T19:55:49.460"
        #         },
        #         "type":"trade",
        #         "pair":"btc_usdt",
        #         "SERVER":"V2",
        #         "TS":"2019-06-28T19:55:49.466"
        #     }
        #
        marketId = self.safe_string(message, 'pair')
        symbol = self.safe_symbol(marketId)
        market = self.safe_market(marketId)
        stored = self.safe_value(self.trades, symbol)
        if stored is None:
            limit = self.safe_integer(self.options, 'tradesLimit', 1000)
            stored = ArrayCache(limit)
            self.trades[symbol] = stored
        rawTrade = self.safe_value(message, 'trade')
        rawTrades = self.safe_value(message, 'trades', [rawTrade])
        for i in range(0, len(rawTrades)):
            trade = self.parse_ws_trade(rawTrades[i], market)
            trade['symbol'] = symbol
            stored.append(trade)
        self.trades[symbol] = stored
        messageHash = 'trades:' + symbol
        client.resolve(self.trades[symbol], messageHash)
        messageHash = 'fetchTrades:' + symbol
        client.resolve(self.trades[symbol], messageHash)

    def parse_ws_trade(self, trade, market=None):
        #
        # request
        #    ['timestamp', 'price', 'volume', 'direction']
        # subscribe
        #    {
        #        "volume":6.3607,
        #        "amount":77148.9303,
        #        "price":12129,
        #        "direction":"sell",  # or "sell_market"
        #        "TS":"2019-06-28T19:55:49.460"
        #    }
        #
        timestamp = self.safe_integer(trade, 0)
        datetime = (self.iso8601(timestamp)) if (timestamp is not None) else (self.safe_string(trade, 'TS'))
        if timestamp is None:
            timestamp = self.parse8601(datetime)
        side = self.safe_string_2(trade, 'direction', 3)
        side = side.replace('_market', '')
        return self.safe_trade({
            'timestamp': timestamp,
            'datetime': datetime,
            'symbol': None,
            'id': None,
            'order': None,
            'type': None,
            'takerOrMaker': None,
            'side': side,
            'price': self.safe_string_2(trade, 'price', 1),
            'amount': self.safe_string_2(trade, 'volume', 2),
            'cost': self.safe_string(trade, 'amount'),
            'fee': None,
            'info': trade,
        }, market)

    async def watch_orders(self, symbol: Str = None, since: Int = None, limit: Int = None, params={}) -> List[Order]:
        """
        :see: https://github.com/LBank-exchange/lbank-official-api-docs/blob/master/API-For-Spot-EN/WebSocket%20API(Asset%20%26%20Order).md#websocketsubscribeunsubscribe
        get the list of trades associated with the user
        :param str [symbol]: unified symbol of the market to fetch trades for
        :param int [since]: timestamp in ms of the earliest trade to fetch
        :param int [limit]: the maximum amount of trades to fetch
        :param dict params: extra parameters specific to the lbank api endpoint
        :returns dict[]: a list of `trade structures <https://docs.ccxt.com/#/?id=public-trades>`
        """
        await self.load_markets()
        key = await self.authenticate(params)
        url = self.urls['api']['ws']
        messageHash = None
        pair = 'all'
        if symbol is None:
            messageHash = 'orders:all'
        else:
            market = self.market(symbol)
            symbol = self.symbol(symbol)
            messageHash = 'orders:' + market['symbol']
            pair = market['id']
        message = {
            'action': 'subscribe',
            'subscribe': 'orderUpdate',
            'subscribeKey': key,
            'pair': pair,
        }
        request = self.deep_extend(message, params)
        orders = await self.watch(url, messageHash, request, messageHash, request)
        return self.filter_by_symbol_since_limit(orders, symbol, since, limit, True)

    def handle_orders(self, client, message):
        #
        #     {
        #         "orderUpdate":{
        #             "amount":"0.003",
        #             "orderStatus":2,
        #             "price":"0.02455211",
        #             "role":"maker",
        #             "updateTime":1561704577786,
        #             "uuid":"d0db191d-xxxxx-4418-xxxxx-fbb1xxxx2ea9",
        #             "txUuid":"da88f354d5xxxxxxa12128aa5bdcb3",
        #             "volumePrice":"0.00007365633"
        #         },
        #         "pair":"eth_btc",
        #         "type":"orderUpdate",
        #         "SERVER":"V2",
        #         "TS":"2019-06-28T14:49:37.816"
        #     }
        #
        marketId = self.safe_string(message, 'pair')
        symbol = self.safe_symbol(marketId, None, '_')
        myOrders = None
        if self.orders is None:
            limit = self.safe_integer(self.options, 'ordersLimit', 1000)
            myOrders = ArrayCacheBySymbolById(limit)
        else:
            myOrders = self.orders
        order = self.parse_ws_order(message)
        myOrders.append(order)
        self.orders = myOrders
        client.resolve(myOrders, 'orders')
        messageHash = 'orders:' + symbol
        client.resolve(myOrders, messageHash)

    def parse_ws_order(self, order, market=None):
        #
        #     {
        #         "orderUpdate":{
        #             "amount":"0.003",
        #             "orderStatus":2,
        #             "price":"0.02455211",
        #             "role":"maker",
        #             "updateTime":1561704577786,
        #             "uuid":"d0db191d-xxxxx-4418-xxxxx-fbb1xxxx2ea9",
        #             "txUuid":"da88f354d5xxxxxxa12128aa5bdcb3",
        #             "volumePrice":"0.00007365633"
        #         },
        #         "pair":"eth_btc",
        #         "type":"orderUpdate",
        #         "SERVER":"V2",
        #         "TS":"2019-06-28T14:49:37.816"
        #     }
        #     {
        #         "SERVER": "V2",
        #         "orderUpdate": {
        #            "accAmt": "0",
        #            "amount": "0",
        #            "avgPrice": "0",
        #            "customerID": "",
        #            "orderAmt": "5",
        #            "orderPrice": "0.009834",
        #            "orderStatus": 0,
        #            "price": "0.009834",
        #            "remainAmt": "5",
        #            "role": "taker",
        #            "symbol": "lbk_usdt",
        #            "type": "buy_market",
        #            "updateTime": 1705676718532,
        #            "uuid": "9b94ab2d-a510-4abe-a784-44a9d9c38ec7",
        #            "volumePrice": "0"
        #         },
        #         "type": "orderUpdate",
        #         "pair": "lbk_usdt",
        #         "TS": "2024-01-19T23:05:18.548"
        #     }
        #
        orderUpdate = self.safe_value(order, 'orderUpdate', {})
        rawType = self.safe_string(orderUpdate, 'type', '')
        typeParts = rawType.split('_')
        side = self.safe_string(typeParts, 0)
        exchangeType = self.safe_string(typeParts, 1)
        type = None
        if rawType != 'buy' and rawType != 'sell':
            type = 'market' if (exchangeType == 'market') else 'limit'
        marketId = self.safe_string(order, 'pair')
        symbol = self.safe_symbol(marketId, market, '_')
        timestamp = self.safe_integer(orderUpdate, 'updateTime')
        status = self.safe_string(orderUpdate, 'orderStatus')
        orderAmount = self.safe_string(orderUpdate, 'orderAmt')
        cost = None
        if (type == 'market') and (side == 'buy'):
            cost = orderAmount
        return self.safe_order({
            'info': order,
            'id': self.safe_string(orderUpdate, 'uuid'),
            'clientOrderId': self.safe_string(orderUpdate, 'customerID'),
            'timestamp': timestamp,
            'datetime': self.iso8601(timestamp),
            'lastTradeTimestamp': None,
            'lastUpdateTimestamp': self.safe_integer(orderUpdate, 'updateTime'),
            'symbol': symbol,
            'type': type,
            'side': side,
            'price': self.safe_string_2(orderUpdate, 'price', 'orderPrice'),
            'stopPrice': None,
            'average': self.safe_string(orderUpdate, 'avgPrice'),
            'amount': self.safe_string_2(orderUpdate, 'amount', 'orderAmt'),
            'remaining': self.safe_string(orderUpdate, 'remainAmt'),
            'filled': self.safe_string(orderUpdate, 'accAmt'),
            'status': self.parse_ws_order_status(status),
            'fee': None,
            'cost': cost,
            'trades': None,
        }, market)

    def parse_ws_order_status(self, status):
        statuses = {
            '-1': 'canceled',  # Withdrawn
            '0': 'open',   # Unsettled
            '1': 'open',   # Partial sale
            '2': 'closed',  # Completed
            '4': 'closed',  # Withrawing
        }
        return self.safe_string(statuses, status, status)

    async def fetch_order_book_ws(self, symbol: str, limit: Int = None, params={}) -> OrderBook:
        """
        :see: https://www.lbank.com/en-US/docs/index.html#request-amp-subscription-instruction
        watches information on open orders with bid(buy) and ask(sell) prices, volumes and other data
        :param str symbol: unified symbol of the market to fetch the order book for
        :param int|None limit: the maximum amount of order book entries to return
        :param dict params: extra parameters specific to the lbank api endpoint
        :returns dict: A dictionary of `order book structures <https://docs.ccxt.com/en/latest/manual.html#order-book-structure>` indexed by market symbols
        """
        await self.load_markets()
        market = self.market(symbol)
        url = self.urls['api']['ws']
        messageHash = 'fetchOrderbook:' + market['symbol']
        if limit is None:
            limit = 100
        subscribe = {
            'action': 'request',
            'request': 'depth',
            'depth': limit,
            'pair': market['id'],
        }
        request = self.deep_extend(subscribe, params)
        orderbook = await self.watch(url, messageHash, request, messageHash)
        return orderbook.limit()

    async def watch_order_book(self, symbol: str, limit: Int = None, params={}) -> OrderBook:
        """
        :see: https://www.lbank.com/en-US/docs/index.html#market-depth
        :see: https://www.lbank.com/en-US/docs/index.html#market-increment-depth
        watches information on open orders with bid(buy) and ask(sell) prices, volumes and other data
        :param str symbol: unified symbol of the market to fetch the order book for
        :param int|None limit: the maximum amount of order book entries to return
        :param dict params: extra parameters specific to the lbank api endpoint
        :returns dict: A dictionary of `order book structures <https://docs.ccxt.com/en/latest/manual.html#order-book-structure>` indexed by market symbols
        """
        await self.load_markets()
        market = self.market(symbol)
        url = self.urls['api']['ws']
        messageHash = 'orderbook:' + market['symbol']
        params = self.omit(params, 'aggregation')
        if limit is None:
            limit = 100
        subscribe = {
            'action': 'subscribe',
            'subscribe': 'depth',
            'depth': limit,
            'pair': market['id'],
        }
        request = self.deep_extend(subscribe, params)
        orderbook = await self.watch(url, messageHash, request, messageHash)
        return orderbook.limit()

    def handle_order_book(self, client, message):
        #
        # request
        #    {
        #        "SERVER":"V2",
        #        "asks":[
        #           [
        #              42585.84,
        #              1.4422
        #           ],
        #           ...
        #        ],
        #        "bids":[
        #           [
        #              42585.83,
        #              1.8054
        #           ],
        #          ,,,
        #        ],
        #        "count":100,
        #        "type":"depth",
        #        "pair":"btc_usdt",
        #        "TS":"2024-01-16T08:26:00.413"
        #    }
        # subscribe
        #     {
        #         "depth": {
        #             "asks": [
        #                 [
        #                     0.0252,
        #                     0.5833
        #                 ],
        #                 [
        #                     0.025215,
        #                     4.377
        #                 ],
        #                 ...
        #             ],
        #             "bids": [
        #                 [
        #                     0.025135,
        #                     3.962
        #                 ],
        #                 [
        #                     0.025134,
        #                     3.46
        #                 ],
        #                 ...
        #             ]
        #         },
        #         "count": 100,
        #         "type": "depth",
        #         "pair": "eth_btc",
        #         "SERVER": "V2",
        #         "TS": "2019-06-28T17:49:22.722"
        #     }
        #
        marketId = self.safe_string(message, 'pair')
        symbol = self.safe_symbol(marketId)
        orderBook = self.safe_value(message, 'depth', message)
        datetime = self.safe_string(message, 'TS')
        timestamp = self.parse8601(datetime)
        orderbook = self.safe_value(self.orderbooks, symbol)
        if orderbook is None:
            orderbook = self.order_book({})
            self.orderbooks[symbol] = orderbook
        snapshot = self.parse_order_book(orderBook, symbol, timestamp, 'bids', 'asks')
        orderbook.reset(snapshot)
        messageHash = 'orderbook:' + symbol
        client.resolve(orderbook, messageHash)
        messageHash = 'fetchOrderbook:' + symbol
        client.resolve(orderbook, messageHash)

    def handle_error_message(self, client, message):
        #
        #    {
        #        SERVER: 'V2',
        #        message: "Missing parameter ['kbar']",
        #        status: 'error',
        #        TS: '2024-01-16T08:09:43.314'
        #    }
        #
        errMsg = self.safe_string(message, 'message', '')
        error = ExchangeError(self.id + ' ' + errMsg)
        client.reject(error)

    async def handle_ping(self, client: Client, message):
        #
        #  {ping: 'a13a939c-5f25-4e06-9981-93cb3b890707', action: 'ping'}
        #
        pingId = self.safe_string(message, 'ping')
        await client.send({
            'action': 'pong',
            'pong': pingId,
        })

    def handle_message(self, client, message):
        status = self.safe_string(message, 'status')
        if status == 'error':
            self.handle_error_message(client, message)
            return
        type = self.safe_string_2(message, 'type', 'action')
        if type == 'ping':
            self.spawn(self.handle_ping, client, message)
            return
        handlers = {
            'kbar': self.handle_ohlcv,
            'depth': self.handle_order_book,
            'trade': self.handle_trades,
            'tick': self.handle_ticker,
            'orderUpdate': self.handle_orders,
        }
        handler = self.safe_value(handlers, type)
        if handler is not None:
            handler(client, message)

    async def authenticate(self, params={}):
        # when we implement more private streams, we need to refactor the authentication
        # to be concurent-safe and respect the same authentication token
        url = self.urls['api']['ws']
        client = self.client(url)
        now = self.milliseconds()
        messageHash = 'authenticated'
        authenticated = self.safe_value(client.subscriptions, messageHash)
        if authenticated is None:
            self.check_required_credentials()
            response = await self.spotPrivatePostSubscribeGetKey(params)
            #
            # {"result":true,"data":"4e9958623e6006bd7b13ff9f36c03b36132f0f8da37f70b14ff2c4eab1fe0c97","error_code":0,"ts":1705602277198}
            #
            result = self.safe_value(response, 'result')
            if result is not True:
                raise ExchangeError(self.id + ' failed to get subscribe key')
            client.subscriptions['authenticated'] = {
                'key': self.safe_string(response, 'data'),
                'expires': self.sum(now, 3300000),  # SubscribeKey lasts one hour, refresh it every 55 minutes
            }
        else:
            expires = self.safe_integer(authenticated, 'expires', 0)
            if expires < now:
                request = {
                    'subscribeKey': authenticated['key'],
                }
                response = await self.spotPrivatePostSubscribeRefreshKey(self.extend(request, params))
                #
                #    {"result": "true"}
                #
                result = self.safe_string(response, 'result')
                if result != 'true':
                    raise ExchangeError(self.id + ' failed to refresh the SubscribeKey')
                client['subscriptions']['authenticated']['expires'] = self.sum(now, 3300000)  # SubscribeKey lasts one hour, refresh it 5 minutes before it expires
        return client.subscriptions['authenticated']['key']
