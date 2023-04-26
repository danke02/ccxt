# -*- coding: utf-8 -*-

# PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
# https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

from ccxt.async_support.base.exchange import Exchange
from ccxt.base.types import OrderSide
from typing import Optional
from ccxt.base.errors import ExchangeError
from ccxt.base.errors import ArgumentsRequired
from ccxt.base.decimal_to_precision import TICK_SIZE
from ccxt.base.precise import Precise


class btctradeua(Exchange):

    def describe(self):
        return self.deep_extend(super(btctradeua, self).describe(), {
            'id': 'btctradeua',
            'name': 'BTC Trade UA',
            'countries': ['UA'],  # Ukraine,
            'rateLimit': 3000,
            'has': {
                'CORS': None,
                'spot': True,
                'margin': False,
                'swap': False,
                'future': False,
                'option': False,
                'addMargin': False,
                'cancelOrder': True,
                'createMarketOrder': False,
                'createOrder': True,
                'createReduceOnlyOrder': False,
                'fetchBalance': True,
                'fetchBorrowRate': False,
                'fetchBorrowRateHistories': False,
                'fetchBorrowRateHistory': False,
                'fetchBorrowRates': False,
                'fetchBorrowRatesPerSymbol': False,
                'fetchFundingHistory': False,
                'fetchFundingRate': False,
                'fetchFundingRateHistory': False,
                'fetchFundingRates': False,
                'fetchIndexOHLCV': False,
                'fetchLeverage': False,
                'fetchMarginMode': False,
                'fetchMarkOHLCV': False,
                'fetchOpenInterestHistory': False,
                'fetchOpenOrders': True,
                'fetchOrderBook': True,
                'fetchPosition': False,
                'fetchPositionMode': False,
                'fetchPositions': False,
                'fetchPositionsRisk': False,
                'fetchPremiumIndexOHLCV': False,
                'fetchTicker': True,
                'fetchTrades': True,
                'fetchTradingFee': False,
                'fetchTradingFees': False,
                'reduceMargin': False,
                'setLeverage': False,
                'setMarginMode': False,
                'setPositionMode': False,
                'signIn': True,
            },
            'urls': {
                'referral': 'https://btc-trade.com.ua/registration/22689',
                'logo': 'https://user-images.githubusercontent.com/1294454/27941483-79fc7350-62d9-11e7-9f61-ac47f28fcd96.jpg',
                'api': {
                    'rest': 'https://btc-trade.com.ua/api',
                },
                'www': 'https://btc-trade.com.ua',
                'doc': 'https://docs.google.com/document/d/1ocYA0yMy_RXd561sfG3qEPZ80kyll36HUxvCRe5GbhE/edit',
            },
            'api': {
                'public': {
                    'get': [
                        'deals/{symbol}',
                        'trades/sell/{symbol}',
                        'trades/buy/{symbol}',
                        'japan_stat/high/{symbol}',
                    ],
                },
                'private': {
                    'post': [
                        'auth',
                        'ask/{symbol}',
                        'balance',
                        'bid/{symbol}',
                        'buy/{symbol}',
                        'my_orders/{symbol}',
                        'order/status/{id}',
                        'remove/order/{id}',
                        'sell/{symbol}',
                    ],
                },
            },
            'precisionMode': TICK_SIZE,
            'markets': {
                'BCH/UAH': {'id': 'bch_uah', 'symbol': 'BCH/UAH', 'base': 'BCH', 'quote': 'UAH', 'baseId': 'bch', 'quoteId': 'uah', 'type': 'spot', 'spot': True},
                'BTC/UAH': {'id': 'btc_uah', 'symbol': 'BTC/UAH', 'base': 'BTC', 'quote': 'UAH', 'baseId': 'btc', 'quoteId': 'uah', 'precision': {'price': self.parse_number('1e-1')}, 'limits': {'amount': {'min': self.parse_number('1e-10')}}, 'type': 'spot', 'spot': True},
                'DASH/BTC': {'id': 'dash_btc', 'symbol': 'DASH/BTC', 'base': 'DASH', 'quote': 'BTC', 'baseId': 'dash', 'quoteId': 'btc', 'type': 'spot', 'spot': True},
                'DASH/UAH': {'id': 'dash_uah', 'symbol': 'DASH/UAH', 'base': 'DASH', 'quote': 'UAH', 'baseId': 'dash', 'quoteId': 'uah', 'type': 'spot', 'spot': True},
                'DOGE/BTC': {'id': 'doge_btc', 'symbol': 'DOGE/BTC', 'base': 'DOGE', 'quote': 'BTC', 'baseId': 'doge', 'quoteId': 'btc', 'type': 'spot', 'spot': True},
                'DOGE/UAH': {'id': 'doge_uah', 'symbol': 'DOGE/UAH', 'base': 'DOGE', 'quote': 'UAH', 'baseId': 'doge', 'quoteId': 'uah', 'type': 'spot', 'spot': True},
                'ETH/UAH': {'id': 'eth_uah', 'symbol': 'ETH/UAH', 'base': 'ETH', 'quote': 'UAH', 'baseId': 'eth', 'quoteId': 'uah', 'type': 'spot', 'spot': True},
                'ITI/UAH': {'id': 'iti_uah', 'symbol': 'ITI/UAH', 'base': 'ITI', 'quote': 'UAH', 'baseId': 'iti', 'quoteId': 'uah', 'type': 'spot', 'spot': True},
                'KRB/UAH': {'id': 'krb_uah', 'symbol': 'KRB/UAH', 'base': 'KRB', 'quote': 'UAH', 'baseId': 'krb', 'quoteId': 'uah', 'type': 'spot', 'spot': True},
                'LTC/BTC': {'id': 'ltc_btc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC', 'baseId': 'ltc', 'quoteId': 'btc', 'type': 'spot', 'spot': True},
                'LTC/UAH': {'id': 'ltc_uah', 'symbol': 'LTC/UAH', 'base': 'LTC', 'quote': 'UAH', 'baseId': 'ltc', 'quoteId': 'uah', 'type': 'spot', 'spot': True},
                'NVC/BTC': {'id': 'nvc_btc', 'symbol': 'NVC/BTC', 'base': 'NVC', 'quote': 'BTC', 'baseId': 'nvc', 'quoteId': 'btc', 'type': 'spot', 'spot': True},
                'NVC/UAH': {'id': 'nvc_uah', 'symbol': 'NVC/UAH', 'base': 'NVC', 'quote': 'UAH', 'baseId': 'nvc', 'quoteId': 'uah', 'type': 'spot', 'spot': True},
                'PPC/BTC': {'id': 'ppc_btc', 'symbol': 'PPC/BTC', 'base': 'PPC', 'quote': 'BTC', 'baseId': 'ppc', 'quoteId': 'btc', 'type': 'spot', 'spot': True},
                'SIB/UAH': {'id': 'sib_uah', 'symbol': 'SIB/UAH', 'base': 'SIB', 'quote': 'UAH', 'baseId': 'sib', 'quoteId': 'uah', 'type': 'spot', 'spot': True},
                'XMR/UAH': {'id': 'xmr_uah', 'symbol': 'XMR/UAH', 'base': 'XMR', 'quote': 'UAH', 'baseId': 'xmr', 'quoteId': 'uah', 'type': 'spot', 'spot': True},
                'ZEC/UAH': {'id': 'zec_uah', 'symbol': 'ZEC/UAH', 'base': 'ZEC', 'quote': 'UAH', 'baseId': 'zec', 'quoteId': 'uah', 'type': 'spot', 'spot': True},
            },
            'fees': {
                'trading': {
                    'maker': self.parse_number('0.001'),
                    'taker': self.parse_number('0.001'),
                },
            },
        })

    async def sign_in(self, params={}):
        """
        sign in, must be called prior to using other authenticated methods
        :param dict params: extra parameters specific to the btctradeua api endpoint
        :returns: response from exchange
        """
        return await self.privatePostAuth(params)

    def parse_balance(self, response):
        result = {'info': response}
        balances = self.safe_value(response, 'accounts', [])
        for i in range(0, len(balances)):
            balance = balances[i]
            currencyId = self.safe_string(balance, 'currency')
            code = self.safe_currency_code(currencyId)
            account = self.account()
            account['total'] = self.safe_string(balance, 'balance')
            result[code] = account
        return self.safe_balance(result)

    async def fetch_balance(self, params={}):
        """
        query for balance and get the amount of funds available for trading or funds locked in orders
        :param dict params: extra parameters specific to the btctradeua api endpoint
        :returns dict: a `balance structure <https://docs.ccxt.com/en/latest/manual.html?#balance-structure>`
        """
        await self.load_markets()
        response = await self.privatePostBalance(params)
        return self.parse_balance(response)

    async def fetch_order_book(self, symbol: str, limit: Optional[int] = None, params={}):
        """
        fetches information on open orders with bid(buy) and ask(sell) prices, volumes and other data
        :param str symbol: unified symbol of the market to fetch the order book for
        :param int|None limit: the maximum amount of order book entries to return
        :param dict params: extra parameters specific to the btctradeua api endpoint
        :returns dict: A dictionary of `order book structures <https://docs.ccxt.com/#/?id=order-book-structure>` indexed by market symbols
        """
        await self.load_markets()
        market = self.market(symbol)
        request = {
            'symbol': market['id'],
        }
        bids = await self.publicGetTradesBuySymbol(self.extend(request, params))
        asks = await self.publicGetTradesSellSymbol(self.extend(request, params))
        orderbook = {
            'bids': [],
            'asks': [],
        }
        if bids:
            if 'list' in bids:
                orderbook['bids'] = bids['list']
        if asks:
            if 'list' in asks:
                orderbook['asks'] = asks['list']
        return self.parse_order_book(orderbook, market['symbol'], None, 'bids', 'asks', 'price', 'currency_trade')

    def parse_ticker(self, ticker, market=None):
        #
        # [
        #     [1640789101000, 1292663.0, 1311823.61303, 1295794.252, 1311823.61303, 0.030175],
        #     [1640790902000, 1311823.61303, 1310820.96, 1290000.0, 1290000.0, 0.042533],
        # ],
        #
        symbol = self.safe_symbol(None, market)
        timestamp = self.milliseconds()
        result = {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': self.iso8601(timestamp),
            'high': None,
            'low': None,
            'bid': None,
            'bidVolume': None,
            'ask': None,
            'askVolume': None,
            'vwap': None,
            'open': None,
            'close': None,
            'last': None,
            'previousClose': None,
            'change': None,
            'percentage': None,
            'average': None,
            'baseVolume': None,
            'quoteVolume': None,
            'info': ticker,
        }
        tickerLength = len(ticker)
        if tickerLength > 0:
            start = max(tickerLength - 48, 0)
            for i in range(start, len(ticker)):
                candle = ticker[i]
                if result['open'] is None:
                    result['open'] = self.safe_string(candle, 1)
                high = self.safe_string(candle, 2)
                if (result['high'] is None) or ((high is not None) and Precise.string_lt(result['high'], high)):
                    result['high'] = high
                low = self.safe_string(candle, 3)
                if (result['low'] is None) or ((low is not None) and Precise.string_lt(result['low'], low)):
                    result['low'] = low
                baseVolume = self.safe_string(candle, 5)
                if result['baseVolume'] is None:
                    result['baseVolume'] = baseVolume
                else:
                    result['baseVolume'] = Precise.string_add(result['baseVolume'], baseVolume)
            last = tickerLength - 1
            result['last'] = self.safe_string(ticker[last], 4)
            result['close'] = result['last']
        return self.safe_ticker(result, market)

    async def fetch_ticker(self, symbol: str, params={}):
        """
        fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
        :param str symbol: unified symbol of the market to fetch the ticker for
        :param dict params: extra parameters specific to the btctradeua api endpoint
        :returns dict: a `ticker structure <https://docs.ccxt.com/#/?id=ticker-structure>`
        """
        await self.load_markets()
        market = self.market(symbol)
        request = {
            'symbol': market['id'],
        }
        response = await self.publicGetJapanStatHighSymbol(self.extend(request, params))
        ticker = self.safe_value(response, 'trades')
        #
        # {
        #     "status": True,
        #     "volume_trade": "0.495703",
        #     "trades": [
        #         [1640789101000, 1292663.0, 1311823.61303, 1295794.252, 1311823.61303, 0.030175],
        #         [1640790902000, 1311823.61303, 1310820.96, 1290000.0, 1290000.0, 0.042533],
        #     ],
        # }
        #
        return self.parse_ticker(ticker, market)

    def convert_month_name_to_string(self, cyrillic):
        months = {
            'Jan': '01',
            'January': '01',
            'Feb': '02',
            'February': '02',
            'Mar': '03',
            'March': '03',
            'Apr': '04',
            'April': '04',
            'May': '05',
            'Jun': '06',
            'June': '06',
            'Jul': '07',
            'July': '07',
            'Aug': '08',
            'August': '08',
            'Sept': '09',
            'September': '09',
            'Oct': '10',
            'October': '10',
            'Nov': '11',
            'November': '11',
            'Dec': '12',
            'December': '12',
        }
        return self.safe_string(months, cyrillic)

    def parse_exchange_specific_datetime(self, cyrillic):
        parts = cyrillic.split(' ')
        month = parts[0]
        day = parts[1].replace(',', '')
        if len(day) < 2:
            day = '0' + day
        year = parts[2].replace(',', '')
        month = month.replace(',', '')
        month = month.replace('.', '')
        month = self.convert_month_name_to_string(month)
        if not month:
            raise ExchangeError(self.id + ' parseTrade() unrecognized month name: ' + cyrillic)
        hms = parts[3]
        hmsParts = hms.split(':')
        h = self.safe_string(hmsParts, 0)
        m = '00'
        ampm = self.safe_string(parts, 4)
        if h == 'noon':
            h = '12'
        else:
            intH = int(h)
            if (ampm is not None) and (ampm[0] == 'p'):
                intH = 12 + intH
                if intH > 23:
                    intH = 0
            h = str(intH)
            if len(h) < 2:
                h = '0' + h
            m = self.safe_string(hmsParts, 1, '00')
            if len(m) < 2:
                m = '0' + m
        ymd = '-'.join([year, month, day])
        ymdhms = ymd + 'T' + h + ':' + m + ':00'
        timestamp = self.parse8601(ymdhms)
        # server reports local time, adjust to UTC
        # a special case for DST
        # subtract 2 hours during winter
        intM = int(m)
        if intM < 11 or intM > 2:
            return timestamp - 7200000
        # subtract 3 hours during summer
        return timestamp - 10800000

    def parse_trade(self, trade, market=None):
        timestamp = self.parse_exchange_specific_datetime(self.safe_string(trade, 'pub_date'))
        id = self.safe_string(trade, 'id')
        type = 'limit'
        side = self.safe_string(trade, 'type')
        priceString = self.safe_string(trade, 'price')
        amountString = self.safe_string(trade, 'amnt_trade')
        market = self.safe_market(None, market)
        return self.safe_trade({
            'id': id,
            'info': trade,
            'timestamp': timestamp,
            'datetime': self.iso8601(timestamp),
            'symbol': market['symbol'],
            'type': type,
            'side': side,
            'order': None,
            'takerOrMaker': None,
            'price': priceString,
            'amount': amountString,
            'cost': None,
            'fee': None,
        }, market)

    async def fetch_trades(self, symbol: str, since: Optional[int] = None, limit: Optional[int] = None, params={}):
        """
        get the list of most recent trades for a particular symbol
        :param str symbol: unified symbol of the market to fetch trades for
        :param int|None since: timestamp in ms of the earliest trade to fetch
        :param int|None limit: the maximum amount of trades to fetch
        :param dict params: extra parameters specific to the btctradeua api endpoint
        :returns [dict]: a list of `trade structures <https://docs.ccxt.com/en/latest/manual.html?#public-trades>`
        """
        await self.load_markets()
        market = self.market(symbol)
        request = {
            'symbol': market['id'],
        }
        response = await self.publicGetDealsSymbol(self.extend(request, params))
        # they report each trade twice(once for both of the two sides of the fill)
        # deduplicate trades for that reason
        trades = []
        for i in range(0, len(response)):
            id = self.safe_integer(response[i], 'id')
            if id % 2:
                trades.append(response[i])
        return self.parse_trades(trades, market, since, limit)

    async def create_order(self, symbol: str, type, side: OrderSide, amount, price=None, params={}):
        """
        create a trade order
        :param str symbol: unified symbol of the market to create an order in
        :param str type: must be 'limit'
        :param str side: 'buy' or 'sell'
        :param float amount: how much of currency you want to trade in units of base currency
        :param float|None price: the price at which the order is to be fullfilled, in units of the quote currency, ignored in market orders
        :param dict params: extra parameters specific to the btctradeua api endpoint
        :returns dict: an `order structure <https://docs.ccxt.com/#/?id=order-structure>`
        """
        if type == 'market':
            raise ExchangeError(self.id + ' createOrder() allows limit orders only')
        await self.load_markets()
        market = self.market(symbol)
        method = 'privatePost' + self.capitalize(side) + 'Id'
        request = {
            'count': amount,
            'currency1': market['quoteId'],
            'currency': market['baseId'],
            'price': price,
        }
        return getattr(self, method)(self.extend(request, params))

    async def cancel_order(self, id: str, symbol: Optional[str] = None, params={}):
        """
        cancels an open order
        :param str id: order id
        :param str|None symbol: not used by btctradeua cancelOrder()
        :param dict params: extra parameters specific to the btctradeua api endpoint
        :returns dict: An `order structure <https://docs.ccxt.com/#/?id=order-structure>`
        """
        request = {
            'id': id,
        }
        return await self.privatePostRemoveOrderId(self.extend(request, params))

    def parse_order(self, order, market=None):
        timestamp = self.milliseconds()
        symbol = self.safe_symbol(None, market)
        side = self.safe_string(order, 'type')
        price = self.safe_string(order, 'price')
        amount = self.safe_string(order, 'amnt_trade')
        remaining = self.safe_string(order, 'amnt_trade')
        return self.safe_order({
            'id': self.safe_string(order, 'id'),
            'clientOrderId': None,
            'timestamp': timestamp,  # until they fix their timestamp
            'datetime': self.iso8601(timestamp),
            'lastTradeTimestamp': None,
            'status': 'open',
            'symbol': symbol,
            'type': None,
            'timeInForce': None,
            'postOnly': None,
            'side': side,
            'price': price,
            'stopPrice': None,
            'triggerPrice': None,
            'amount': amount,
            'filled': None,
            'remaining': remaining,
            'trades': None,
            'info': order,
            'cost': None,
            'average': None,
            'fee': None,
        }, market)

    async def fetch_open_orders(self, symbol: Optional[str] = None, since: Optional[int] = None, limit: Optional[int] = None, params={}):
        """
        fetch all unfilled currently open orders
        :param str symbol: unified market symbol
        :param int|None since: the earliest time in ms to fetch open orders for
        :param int|None limit: the maximum number of  open orders structures to retrieve
        :param dict params: extra parameters specific to the btctradeua api endpoint
        :returns [dict]: a list of `order structures <https://docs.ccxt.com/#/?id=order-structure>`
        """
        if symbol is None:
            raise ArgumentsRequired(self.id + ' fetchOpenOrders() requires a symbol argument')
        await self.load_markets()
        market = self.market(symbol)
        request = {
            'symbol': market['id'],
        }
        response = await self.privatePostMyOrdersSymbol(self.extend(request, params))
        orders = self.safe_value(response, 'your_open_orders')
        return self.parse_orders(orders, market, since, limit)

    def nonce(self):
        return self.milliseconds()

    def sign(self, path, api='public', method='GET', params={}, headers=None, body=None):
        url = self.urls['api']['rest'] + '/' + self.implode_params(path, params)
        query = self.omit(params, self.extract_params(path))
        if api == 'public':
            if query:
                url += self.implode_params(path, query)
        else:
            self.check_required_credentials()
            nonce = self.nonce()
            body = self.urlencode(self.extend({
                'out_order_id': nonce,
                'nonce': nonce,
            }, query))
            auth = body + self.secret
            headers = {
                'public-key': self.apiKey,
                'api-sign': self.hash(self.encode(auth), 'sha256'),
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        return {'url': url, 'method': method, 'body': body, 'headers': headers}
