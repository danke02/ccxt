'use strict';

var cryptocom$1 = require('./abstract/cryptocom.js');
var Precise = require('./base/Precise.js');
var errors = require('./base/errors.js');
var number = require('./base/functions/number.js');
var sha256 = require('./static_dependencies/noble-hashes/sha256.js');

//  ---------------------------------------------------------------------------
/**
 * @class cryptocom
 * @augments Exchange
 */
class cryptocom extends cryptocom$1 {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'cryptocom',
            'name': 'Crypto.com',
            'countries': ['MT'],
            'version': 'v2',
            'rateLimit': 10,
            'certified': true,
            'pro': true,
            'has': {
                'CORS': false,
                'spot': true,
                'margin': true,
                'swap': true,
                'future': true,
                'option': true,
                'addMargin': false,
                'cancelAllOrders': true,
                'cancelOrder': true,
                'cancelOrders': true,
                'cancelOrdersForSymbols': true,
                'closeAllPositions': false,
                'closePosition': true,
                'createMarketBuyOrderWithCost': false,
                'createMarketOrderWithCost': false,
                'createMarketSellOrderWithCost': false,
                'createOrder': true,
                'createOrders': true,
                'fetchAccounts': true,
                'fetchBalance': true,
                'fetchBidsAsks': false,
                'fetchBorrowInterest': false,
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': false,
                'fetchClosedOrders': 'emulated',
                'fetchCrossBorrowRate': false,
                'fetchCrossBorrowRates': false,
                'fetchCurrencies': false,
                'fetchDepositAddress': true,
                'fetchDepositAddressesByNetwork': true,
                'fetchDeposits': true,
                'fetchDepositsWithdrawals': false,
                'fetchDepositWithdrawFee': 'emulated',
                'fetchDepositWithdrawFees': true,
                'fetchFundingHistory': false,
                'fetchFundingRate': false,
                'fetchFundingRateHistory': true,
                'fetchFundingRates': false,
                'fetchGreeks': false,
                'fetchIndexOHLCV': false,
                'fetchIsolatedBorrowRate': false,
                'fetchIsolatedBorrowRates': false,
                'fetchLedger': true,
                'fetchLeverage': false,
                'fetchLeverageTiers': false,
                'fetchMarginAdjustmentHistory': false,
                'fetchMarginMode': false,
                'fetchMarketLeverageTiers': false,
                'fetchMarkets': true,
                'fetchMarkOHLCV': false,
                'fetchMySettlementHistory': false,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenOrders': true,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrders': true,
                'fetchPosition': true,
                'fetchPositionHistory': false,
                'fetchPositionMode': false,
                'fetchPositions': true,
                'fetchPositionsHistory': false,
                'fetchPremiumIndexOHLCV': false,
                'fetchSettlementHistory': true,
                'fetchStatus': false,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTime': false,
                'fetchTrades': true,
                'fetchTradingFee': false,
                'fetchTradingFees': false,
                'fetchTransactionFees': false,
                'fetchTransactions': false,
                'fetchTransfers': false,
                'fetchUnderlyingAssets': false,
                'fetchVolatilityHistory': false,
                'fetchWithdrawals': true,
                'reduceMargin': false,
                'repayCrossMargin': false,
                'repayIsolatedMargin': false,
                'sandbox': true,
                'setLeverage': false,
                'setMarginMode': false,
                'setPositionMode': false,
                'transfer': false,
                'withdraw': true,
            },
            'timeframes': {
                '1m': '1m',
                '5m': '5m',
                '15m': '15m',
                '30m': '30m',
                '1h': '1h',
                '4h': '4h',
                '6h': '6h',
                '12h': '12h',
                '1d': '1D',
                '1w': '7D',
                '2w': '14D',
                '1M': '1M',
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/147792121-38ed5e36-c229-48d6-b49a-48d05fc19ed4.jpeg',
                'test': {
                    'v1': 'https://uat-api.3ona.co/exchange/v1',
                    'v2': 'https://uat-api.3ona.co/v2',
                    'derivatives': 'https://uat-api.3ona.co/v2',
                },
                'api': {
                    'v1': 'https://api.crypto.com/exchange/v1',
                    'v2': 'https://api.crypto.com/v2',
                    'derivatives': 'https://deriv-api.crypto.com/v1',
                },
                'www': 'https://crypto.com/',
                'referral': {
                    'url': 'https://crypto.com/exch/kdacthrnxt',
                    'discount': 0.15,
                },
                'doc': [
                    'https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html',
                    'https://exchange-docs.crypto.com/spot/index.html',
                    'https://exchange-docs.crypto.com/derivatives/index.html',
                ],
                'fees': 'https://crypto.com/exchange/document/fees-limits',
            },
            'api': {
                'v1': {
                    'public': {
                        'get': {
                            'public/auth': 10 / 3,
                            'public/get-instruments': 10 / 3,
                            'public/get-book': 1,
                            'public/get-candlestick': 1,
                            'public/get-trades': 1,
                            'public/get-tickers': 1,
                            'public/get-valuations': 1,
                            'public/get-expired-settlement-price': 10 / 3,
                            'public/get-insurance': 1,
                        },
                    },
                    'private': {
                        'post': {
                            'private/set-cancel-on-disconnect': 10 / 3,
                            'private/get-cancel-on-disconnect': 10 / 3,
                            'private/user-balance': 10 / 3,
                            'private/user-balance-history': 10 / 3,
                            'private/get-positions': 10 / 3,
                            'private/create-order': 2 / 3,
                            'private/create-order-list': 10 / 3,
                            'private/cancel-order': 2 / 3,
                            'private/cancel-order-list': 10 / 3,
                            'private/cancel-all-orders': 2 / 3,
                            'private/close-position': 10 / 3,
                            'private/get-order-history': 100,
                            'private/get-open-orders': 10 / 3,
                            'private/get-order-detail': 1 / 3,
                            'private/get-trades': 100,
                            'private/change-account-leverage': 10 / 3,
                            'private/get-transactions': 10 / 3,
                            'private/create-subaccount-transfer': 10 / 3,
                            'private/get-subaccount-balances': 10 / 3,
                            'private/get-order-list': 10 / 3,
                            'private/create-withdrawal': 10 / 3,
                            'private/get-currency-networks': 10 / 3,
                            'private/get-deposit-address': 10 / 3,
                            'private/get-accounts': 10 / 3,
                            'private/get-withdrawal-history': 10 / 3,
                            'private/get-deposit-history': 10 / 3,
                        },
                    },
                },
                'v2': {
                    'public': {
                        'get': {
                            'public/auth': 1,
                            'public/get-instruments': 1,
                            'public/get-book': 1,
                            'public/get-candlestick': 1,
                            'public/get-ticker': 1,
                            'public/get-trades': 1,
                            'public/margin/get-transfer-currencies': 1,
                            'public/margin/get-load-currenices': 1,
                            'public/respond-heartbeat': 1,
                        },
                    },
                    'private': {
                        'post': {
                            'private/set-cancel-on-disconnect': 10 / 3,
                            'private/get-cancel-on-disconnect': 10 / 3,
                            'private/create-withdrawal': 10 / 3,
                            'private/get-withdrawal-history': 10 / 3,
                            'private/get-currency-networks': 10 / 3,
                            'private/get-deposit-history': 10 / 3,
                            'private/get-deposit-address': 10 / 3,
                            'private/export/create-export-request': 10 / 3,
                            'private/export/get-export-requests': 10 / 3,
                            'private/export/download-export-output': 10 / 3,
                            'private/get-account-summary': 10 / 3,
                            'private/create-order': 2 / 3,
                            'private/cancel-order': 2 / 3,
                            'private/cancel-all-orders': 2 / 3,
                            'private/create-order-list': 10 / 3,
                            'private/get-order-history': 10 / 3,
                            'private/get-open-orders': 10 / 3,
                            'private/get-order-detail': 1 / 3,
                            'private/get-trades': 100,
                            'private/get-accounts': 10 / 3,
                            'private/get-subaccount-balances': 10 / 3,
                            'private/create-subaccount-transfer': 10 / 3,
                            'private/otc/get-otc-user': 10 / 3,
                            'private/otc/get-instruments': 10 / 3,
                            'private/otc/request-quote': 100,
                            'private/otc/accept-quote': 100,
                            'private/otc/get-quote-history': 10 / 3,
                            'private/otc/get-trade-history': 10 / 3,
                            'private/otc/create-order': 10 / 3,
                        },
                    },
                },
                'derivatives': {
                    'public': {
                        'get': {
                            'public/auth': 10 / 3,
                            'public/get-instruments': 10 / 3,
                            'public/get-book': 1,
                            'public/get-candlestick': 1,
                            'public/get-trades': 1,
                            'public/get-tickers': 1,
                            'public/get-valuations': 1,
                            'public/get-expired-settlement-price': 10 / 3,
                            'public/get-insurance': 1,
                        },
                    },
                    'private': {
                        'post': {
                            'private/set-cancel-on-disconnect': 10 / 3,
                            'private/get-cancel-on-disconnect': 10 / 3,
                            'private/user-balance': 10 / 3,
                            'private/user-balance-history': 10 / 3,
                            'private/get-positions': 10 / 3,
                            'private/create-order': 2 / 3,
                            'private/create-order-list': 10 / 3,
                            'private/cancel-order': 2 / 3,
                            'private/cancel-order-list': 10 / 3,
                            'private/cancel-all-orders': 2 / 3,
                            'private/close-position': 10 / 3,
                            'private/convert-collateral': 10 / 3,
                            'private/get-order-history': 100,
                            'private/get-open-orders': 10 / 3,
                            'private/get-order-detail': 1 / 3,
                            'private/get-trades': 100,
                            'private/change-account-leverage': 10 / 3,
                            'private/get-transactions': 10 / 3,
                            'private/create-subaccount-transfer': 10 / 3,
                            'private/get-subaccount-balances': 10 / 3,
                            'private/get-order-list': 10 / 3,
                        },
                    },
                },
            },
            'fees': {
                'trading': {
                    'maker': this.parseNumber('0.004'),
                    'taker': this.parseNumber('0.004'),
                    'tiers': {
                        'maker': [
                            [this.parseNumber('0'), this.parseNumber('0.004')],
                            [this.parseNumber('25000'), this.parseNumber('0.0035')],
                            [this.parseNumber('50000'), this.parseNumber('0.0015')],
                            [this.parseNumber('100000'), this.parseNumber('0.001')],
                            [this.parseNumber('250000'), this.parseNumber('0.0009')],
                            [this.parseNumber('1000000'), this.parseNumber('0.0008')],
                            [this.parseNumber('20000000'), this.parseNumber('0.0007')],
                            [this.parseNumber('100000000'), this.parseNumber('0.0006')],
                            [this.parseNumber('200000000'), this.parseNumber('0.0004')],
                        ],
                        'taker': [
                            [this.parseNumber('0'), this.parseNumber('0.004')],
                            [this.parseNumber('25000'), this.parseNumber('0.0035')],
                            [this.parseNumber('50000'), this.parseNumber('0.0025')],
                            [this.parseNumber('100000'), this.parseNumber('0.0016')],
                            [this.parseNumber('250000'), this.parseNumber('0.00015')],
                            [this.parseNumber('1000000'), this.parseNumber('0.00014')],
                            [this.parseNumber('20000000'), this.parseNumber('0.00013')],
                            [this.parseNumber('100000000'), this.parseNumber('0.00012')],
                            [this.parseNumber('200000000'), this.parseNumber('0.0001')],
                        ],
                    },
                },
            },
            'options': {
                'defaultType': 'spot',
                'accountsById': {
                    'funding': 'SPOT',
                    'spot': 'SPOT',
                    'margin': 'MARGIN',
                    'derivatives': 'DERIVATIVES',
                    'swap': 'DERIVATIVES',
                    'future': 'DERIVATIVES',
                },
                'networks': {
                    'BEP20': 'BSC',
                    'ERC20': 'ETH',
                    'TRC20': 'TRON',
                },
                'broker': 'CCXT',
            },
            // https://exchange-docs.crypto.com/spot/index.html#response-and-reason-codes
            'commonCurrencies': {
                'USD_STABLE_COIN': 'USDC',
            },
            'precisionMode': number.TICK_SIZE,
            'exceptions': {
                'exact': {
                    '219': errors.InvalidOrder,
                    '314': errors.InvalidOrder,
                    '10001': errors.ExchangeError,
                    '10002': errors.PermissionDenied,
                    '10003': errors.PermissionDenied,
                    '10004': errors.BadRequest,
                    '10005': errors.PermissionDenied,
                    '10006': errors.DDoSProtection,
                    '10007': errors.InvalidNonce,
                    '10008': errors.BadRequest,
                    '10009': errors.BadRequest,
                    '20001': errors.BadRequest,
                    '20002': errors.InsufficientFunds,
                    '20005': errors.AccountNotEnabled,
                    '30003': errors.BadSymbol,
                    '30004': errors.BadRequest,
                    '30005': errors.BadRequest,
                    '30006': errors.InvalidOrder,
                    '30007': errors.InvalidOrder,
                    '30008': errors.InvalidOrder,
                    '30009': errors.InvalidOrder,
                    '30010': errors.BadRequest,
                    '30013': errors.InvalidOrder,
                    '30014': errors.InvalidOrder,
                    '30016': errors.InvalidOrder,
                    '30017': errors.InvalidOrder,
                    '30023': errors.InvalidOrder,
                    '30024': errors.InvalidOrder,
                    '30025': errors.InvalidOrder,
                    '40001': errors.BadRequest,
                    '40002': errors.BadRequest,
                    '40003': errors.BadRequest,
                    '40004': errors.BadRequest,
                    '40005': errors.BadRequest,
                    '40006': errors.BadRequest,
                    '40007': errors.BadRequest,
                    '40101': errors.AuthenticationError,
                    '50001': errors.BadRequest,
                    '9010001': errors.OnMaintenance, // {"code":9010001,"message":"SYSTEM_MAINTENANCE","details":"Crypto.com Exchange is currently under maintenance. Please refer to https://status.crypto.com for more details."}
                },
                'broad': {},
            },
        });
    }
    async fetchMarkets(params = {}) {
        /**
         * @method
         * @name cryptocom#fetchMarkets
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#public-get-instruments
         * @description retrieves data on all markets for cryptocom
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} an array of objects representing market data
         */
        const response = await this.v1PublicGetPublicGetInstruments(params);
        //
        //     {
        //         "id": 1,
        //         "method": "public/get-instruments",
        //         "code": 0,
        //         "result": {
        //             "data": [
        //                 {
        //                     "symbol": "BTC_USDT",
        //                     "inst_type": "CCY_PAIR",
        //                     "display_name": "BTC/USDT",
        //                     "base_ccy": "BTC",
        //                     "quote_ccy": "USDT",
        //                     "quote_decimals": 2,
        //                     "quantity_decimals": 5,
        //                     "price_tick_size": "0.01",
        //                     "qty_tick_size": "0.00001",
        //                     "max_leverage": "50",
        //                     "tradable": true,
        //                     "expiry_timestamp_ms": 0,
        //                     "beta_product": false,
        //                     "margin_buy_enabled": false,
        //                     "margin_sell_enabled": true
        //                 },
        //                 {
        //                     "symbol": "RUNEUSD-PERP",
        //                     "inst_type": "PERPETUAL_SWAP",
        //                     "display_name": "RUNEUSD Perpetual",
        //                     "base_ccy": "RUNE",
        //                     "quote_ccy": "USD",
        //                     "quote_decimals": 3,
        //                     "quantity_decimals": 1,
        //                     "price_tick_size": "0.001",
        //                     "qty_tick_size": "0.1",
        //                     "max_leverage": "50",
        //                     "tradable": true,
        //                     "expiry_timestamp_ms": 0,
        //                     "beta_product": false,
        //                     "underlying_symbol": "RUNEUSD-INDEX",
        //                     "contract_size": "1",
        //                     "margin_buy_enabled": false,
        //                     "margin_sell_enabled": false
        //                 },
        //                 {
        //                     "symbol": "ETHUSD-230825",
        //                     "inst_type": "FUTURE",
        //                     "display_name": "ETHUSD Futures 20230825",
        //                     "base_ccy": "ETH",
        //                     "quote_ccy": "USD",
        //                     "quote_decimals": 2,
        //                     "quantity_decimals": 4,
        //                     "price_tick_size": "0.01",
        //                     "qty_tick_size": "0.0001",
        //                     "max_leverage": "100",
        //                     "tradable": true,
        //                     "expiry_timestamp_ms": 1692950400000,
        //                     "beta_product": false,
        //                     "underlying_symbol": "ETHUSD-INDEX",
        //                     "contract_size": "1",
        //                     "margin_buy_enabled": false,
        //                     "margin_sell_enabled": false
        //                 },
        //                 {
        //                     "symbol": "BTCUSD-230630-CW30000",
        //                     "inst_type": "WARRANT",
        //                     "display_name": "BTCUSD-230630-CW30000",
        //                     "base_ccy": "BTC",
        //                     "quote_ccy": "USD",
        //                     "quote_decimals": 3,
        //                     "quantity_decimals": 0,
        //                     "price_tick_size": "0.001",
        //                     "qty_tick_size": "10",
        //                     "max_leverage": "50",
        //                     "tradable": true,
        //                     "expiry_timestamp_ms": 1688112000000,
        //                     "beta_product": false,
        //                     "underlying_symbol": "BTCUSD-INDEX",
        //                     "put_call": "CALL",
        //                     "strike": "30000",
        //                     "contract_size": "0.0001",
        //                     "margin_buy_enabled": false,
        //                     "margin_sell_enabled": false
        //                 },
        //             ]
        //         }
        //     }
        //
        const resultResponse = this.safeValue(response, 'result', {});
        const data = this.safeValue(resultResponse, 'data', []);
        const result = [];
        for (let i = 0; i < data.length; i++) {
            const market = data[i];
            const inst_type = this.safeString(market, 'inst_type');
            const spot = inst_type === 'CCY_PAIR';
            const swap = inst_type === 'PERPETUAL_SWAP';
            const future = inst_type === 'FUTURE';
            const option = inst_type === 'WARRANT';
            const baseId = this.safeString(market, 'base_ccy');
            const quoteId = this.safeString(market, 'quote_ccy');
            const settleId = spot ? undefined : quoteId;
            const base = this.safeCurrencyCode(baseId);
            const quote = this.safeCurrencyCode(quoteId);
            const settle = spot ? undefined : this.safeCurrencyCode(settleId);
            const optionType = this.safeStringLower(market, 'put_call');
            const strike = this.safeString(market, 'strike');
            const marginBuyEnabled = this.safeValue(market, 'margin_buy_enabled');
            const marginSellEnabled = this.safeValue(market, 'margin_sell_enabled');
            const expiryString = this.omitZero(this.safeString(market, 'expiry_timestamp_ms'));
            const expiry = (expiryString !== undefined) ? parseInt(expiryString) : undefined;
            let symbol = base + '/' + quote;
            let type = undefined;
            let contract = undefined;
            if (inst_type === 'CCY_PAIR') {
                type = 'spot';
                contract = false;
            }
            else if (inst_type === 'PERPETUAL_SWAP') {
                type = 'swap';
                symbol = symbol + ':' + quote;
                contract = true;
            }
            else if (inst_type === 'FUTURE') {
                type = 'future';
                symbol = symbol + ':' + quote + '-' + this.yymmdd(expiry);
                contract = true;
            }
            else if (inst_type === 'WARRANT') {
                type = 'option';
                const symbolOptionType = (optionType === 'call') ? 'C' : 'P';
                symbol = symbol + ':' + quote + '-' + this.yymmdd(expiry) + '-' + strike + '-' + symbolOptionType;
                contract = true;
            }
            result.push({
                'id': this.safeString(market, 'symbol'),
                'symbol': symbol,
                'base': base,
                'quote': quote,
                'settle': settle,
                'baseId': baseId,
                'quoteId': quoteId,
                'settleId': settleId,
                'type': type,
                'spot': spot,
                'margin': ((marginBuyEnabled) || (marginSellEnabled)),
                'swap': swap,
                'future': future,
                'option': option,
                'active': this.safeValue(market, 'tradable'),
                'contract': contract,
                'linear': (contract) ? true : undefined,
                'inverse': (contract) ? false : undefined,
                'contractSize': this.safeNumber(market, 'contract_size'),
                'expiry': expiry,
                'expiryDatetime': this.iso8601(expiry),
                'strike': this.parseNumber(strike),
                'optionType': optionType,
                'precision': {
                    'price': this.parseNumber(this.safeString(market, 'price_tick_size')),
                    'amount': this.parseNumber(this.safeString(market, 'qty_tick_size')),
                },
                'limits': {
                    'leverage': {
                        'min': this.parseNumber('1'),
                        'max': this.safeNumber(market, 'max_leverage'),
                    },
                    'amount': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'price': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'cost': {
                        'min': undefined,
                        'max': undefined,
                    },
                },
                'created': undefined,
                'info': market,
            });
        }
        return result;
    }
    async fetchTickers(symbols = undefined, params = {}) {
        /**
         * @method
         * @name cryptocom#fetchTickers
         * @description fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
         * @see https://exchange-docs.crypto.com/spot/index.html#public-get-ticker
         * @see https://exchange-docs.crypto.com/derivatives/index.html#public-get-tickers
         * @param {string[]|undefined} symbols unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets();
        let market = undefined;
        const request = {};
        if (symbols !== undefined) {
            let symbol = undefined;
            if (Array.isArray(symbols)) {
                const symbolsLength = symbols.length;
                if (symbolsLength > 1) {
                    throw new errors.BadRequest(this.id + ' fetchTickers() symbols argument cannot contain more than 1 symbol');
                }
                symbol = symbols[0];
            }
            else {
                symbol = symbols;
            }
            market = this.market(symbol);
            request['instrument_name'] = market['id'];
        }
        const response = await this.v1PublicGetPublicGetTickers(this.extend(request, params));
        //
        //     {
        //         "id": -1,
        //         "method": "public/get-tickers",
        //         "code": 0,
        //         "result": {
        //             "data": [
        //                 {
        //                     "i": "AVAXUSD-PERP",
        //                     "h": "13.209",
        //                     "l": "12.148",
        //                     "a": "13.209",
        //                     "v": "1109.8",
        //                     "vv": "14017.33",
        //                     "c": "0.0732",
        //                     "b": "13.210",
        //                     "k": "13.230",
        //                     "oi": "10888.9",
        //                     "t": 1687402657575
        //                 },
        //             ]
        //         }
        //     }
        //
        const result = this.safeValue(response, 'result', {});
        const data = this.safeList(result, 'data', []);
        return this.parseTickers(data, symbols);
    }
    async fetchTicker(symbol, params = {}) {
        /**
         * @method
         * @name cryptocom#fetchTicker
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#public-get-tickers
         * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets();
        symbol = this.symbol(symbol);
        const tickers = await this.fetchTickers([symbol], params);
        return this.safeValue(tickers, symbol);
    }
    async fetchOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name cryptocom#fetchOrders
         * @description fetches information on multiple orders made by the user
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-order-history
         * @param {string} symbol unified market symbol of the market the orders were made in
         * @param {int} [since] the earliest time in ms to fetch orders for, max date range is one day
         * @param {int} [limit] the maximum number of order structures to retrieve, default 100 max 100
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {int} [params.until] timestamp in ms for the ending date filter, default is the current time
         * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
         * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets();
        let paginate = false;
        [paginate, params] = this.handleOptionAndParams(params, 'fetchOrders', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDynamic('fetchOrders', symbol, since, limit, params);
        }
        let market = undefined;
        const request = {};
        if (symbol !== undefined) {
            market = this.market(symbol);
            request['instrument_name'] = market['id'];
        }
        if (since !== undefined) {
            request['start_time'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const until = this.safeInteger(params, 'until');
        params = this.omit(params, ['until']);
        if (until !== undefined) {
            request['end_time'] = until;
        }
        const response = await this.v1PrivatePostPrivateGetOrderHistory(this.extend(request, params));
        //
        //     {
        //         "id": 1686881486183,
        //         "method": "private/get-order-history",
        //         "code": 0,
        //         "result": {
        //             "data": [
        //                 {
        //                     "account_id": "ce075bef-1234-4321-bd6g-ff9007252e63",
        //                     "order_id": "6142909895014042762",
        //                     "client_oid": "4e918597-1234-4321-8201-a7577e1e1d91",
        //                     "order_type": "MARKET",
        //                     "time_in_force": "GOOD_TILL_CANCEL",
        //                     "side": "SELL",
        //                     "exec_inst": [ ],
        //                     "quantity": "0.00024",
        //                     "order_value": "5.7054672",
        //                     "maker_fee_rate": "0",
        //                     "taker_fee_rate": "0",
        //                     "avg_price": "25023.97",
        //                     "trigger_price": "0",
        //                     "ref_price": "0",
        //                     "ref_price_type": "NULL_VAL",
        //                     "cumulative_quantity": "0.00024",
        //                     "cumulative_value": "6.0057528",
        //                     "cumulative_fee": "0.001501438200",
        //                     "status": "FILLED",
        //                     "update_user_id": "ce075bef-1234-4321-bd6g-ff9007252e63",
        //                     "order_date": "2023-06-15",
        //                     "instrument_name": "BTC_USD",
        //                     "fee_instrument_name": "USD",
        //                     "create_time": 1686805465891,
        //                     "create_time_ns": "1686805465891812578",
        //                     "update_time": 1686805465891
        //                 }
        //             ]
        //         }
        //     }
        //
        const data = this.safeValue(response, 'result', {});
        const orders = this.safeList(data, 'data', []);
        return this.parseOrders(orders, market, since, limit);
    }
    async fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name cryptocom#fetchTrades
         * @description get a list of the most recent trades for a particular symbol
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#public-get-trades
         * @param {string} symbol unified symbol of the market to fetch trades for
         * @param {int} [since] timestamp in ms of the earliest trade to fetch, maximum date range is one day
         * @param {int} [limit] the maximum number of trades to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {int} [params.until] timestamp in ms for the ending date filter, default is the current time
         * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
         * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}
         */
        await this.loadMarkets();
        let paginate = false;
        [paginate, params] = this.handleOptionAndParams(params, 'fetchTrades', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDynamic('fetchTrades', symbol, since, limit, params);
        }
        const market = this.market(symbol);
        const request = {
            'instrument_name': market['id'],
        };
        if (since !== undefined) {
            request['start_ts'] = since;
        }
        if (limit !== undefined) {
            request['count'] = limit;
        }
        const until = this.safeInteger(params, 'until');
        params = this.omit(params, ['until']);
        if (until !== undefined) {
            request['end_ts'] = until;
        }
        const response = await this.v1PublicGetPublicGetTrades(this.extend(request, params));
        //
        //     {
        //         "id": -1,
        //         "method": "public/get-trades",
        //         "code": 0,
        //         "result": {
        //             "data": [
        //                 {
        //                     "s": "sell",
        //                     "p": "26386.00",
        //                     "q": "0.00453",
        //                     "t": 1686944282062,
        //                     "tn" : 1704476468851524373,
        //                     "d": "4611686018455979970",
        //                     "i": "BTC_USD"
        //                 },
        //             ]
        //         }
        //     }
        //
        const result = this.safeValue(response, 'result', {});
        const trades = this.safeList(result, 'data', []);
        return this.parseTrades(trades, market, since, limit);
    }
    async fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name cryptocom#fetchOHLCV
         * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#public-get-candlestick
         * @param {string} symbol unified symbol of the market to fetch OHLCV data for
         * @param {string} timeframe the length of time each candle represents
         * @param {int} [since] timestamp in ms of the earliest candle to fetch
         * @param {int} [limit] the maximum amount of candles to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {int} [params.until] timestamp in ms for the ending date filter, default is the current time
         * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
         * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
         */
        await this.loadMarkets();
        let paginate = false;
        [paginate, params] = this.handleOptionAndParams(params, 'fetchOHLCV', 'paginate', false);
        if (paginate) {
            return await this.fetchPaginatedCallDeterministic('fetchOHLCV', symbol, since, limit, timeframe, params, 300);
        }
        const market = this.market(symbol);
        const request = {
            'instrument_name': market['id'],
            'timeframe': this.safeString(this.timeframes, timeframe, timeframe),
        };
        if (since !== undefined) {
            request['start_ts'] = since;
        }
        if (limit !== undefined) {
            request['count'] = limit;
        }
        const until = this.safeInteger(params, 'until');
        params = this.omit(params, ['until']);
        if (until !== undefined) {
            request['end_ts'] = until;
        }
        const response = await this.v1PublicGetPublicGetCandlestick(this.extend(request, params));
        //
        //     {
        //         "id": -1,
        //         "method": "public/get-candlestick",
        //         "code": 0,
        //         "result": {
        //             "interval": "1m",
        //             "data": [
        //                 {
        //                     "o": "26949.89",
        //                     "h": "26957.64",
        //                     "l": "26948.24",
        //                     "c": "26950.00",
        //                     "v": "0.0670",
        //                     "t": 1687237080000
        //                 },
        //             ],
        //             "instrument_name": "BTC_USD"
        //         }
        //     }
        //
        const result = this.safeValue(response, 'result', {});
        const data = this.safeList(result, 'data', []);
        return this.parseOHLCVs(data, market, timeframe, since, limit);
    }
    async fetchOrderBook(symbol, limit = undefined, params = {}) {
        /**
         * @method
         * @name cryptocom#fetchOrderBook
         * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#public-get-book
         * @param {string} symbol unified symbol of the market to fetch the order book for
         * @param {int} [limit] the number of order book entries to return, max 50
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'instrument_name': market['id'],
        };
        if (limit) {
            request['depth'] = limit;
        }
        const response = await this.v1PublicGetPublicGetBook(this.extend(request, params));
        //
        //     {
        //         "id": -1,
        //         "method": "public/get-book",
        //         "code": 0,
        //         "result": {
        //             "depth": 3,
        //             "data": [
        //                 {
        //                     "bids": [ [ "30025.00", "0.00004", "1" ], [ "30020.15", "0.02498", "1" ], [ "30020.00", "0.00004", "1" ] ],
        //                     "asks": [ [ "30025.01", "0.04090", "1" ], [ "30025.70", "0.01000", "1" ], [ "30026.94", "0.02681", "1" ] ],
        //                     "t": 1687491287380
        //                 }
        //             ],
        //             "instrument_name": "BTC_USD"
        //         }
        //     }
        //
        const result = this.safeValue(response, 'result', {});
        const data = this.safeValue(result, 'data', []);
        const orderBook = this.safeValue(data, 0);
        const timestamp = this.safeInteger(orderBook, 't');
        return this.parseOrderBook(orderBook, symbol, timestamp);
    }
    parseBalance(response) {
        const responseResult = this.safeValue(response, 'result', {});
        const data = this.safeValue(responseResult, 'data', []);
        const positionBalances = this.safeValue(data[0], 'position_balances', []);
        const result = { 'info': response };
        for (let i = 0; i < positionBalances.length; i++) {
            const balance = positionBalances[i];
            const currencyId = this.safeString(balance, 'instrument_name');
            const code = this.safeCurrencyCode(currencyId);
            const account = this.account();
            account['total'] = this.safeString(balance, 'quantity');
            account['used'] = this.safeString(balance, 'reserved_qty');
            result[code] = account;
        }
        return this.safeBalance(result);
    }
    async fetchBalance(params = {}) {
        /**
         * @method
         * @name cryptocom#fetchBalance
         * @description query for balance and get the amount of funds available for trading or funds locked in orders
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-user-balance
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [balance structure]{@link https://docs.ccxt.com/#/?id=balance-structure}
         */
        await this.loadMarkets();
        const response = await this.v1PrivatePostPrivateUserBalance(params);
        //
        //     {
        //         "id": 1687300499018,
        //         "method": "private/user-balance",
        //         "code": 0,
        //         "result": {
        //             "data": [
        //                 {
        //                     "total_available_balance": "5.84684368",
        //                     "total_margin_balance": "5.84684368",
        //                     "total_initial_margin": "0",
        //                     "total_maintenance_margin": "0",
        //                     "total_position_cost": "0",
        //                     "total_cash_balance": "6.44412101",
        //                     "total_collateral_value": "5.846843685",
        //                     "total_session_unrealized_pnl": "0",
        //                     "instrument_name": "USD",
        //                     "total_session_realized_pnl": "0",
        //                     "position_balances": [
        //                         {
        //                             "quantity": "0.0002119875",
        //                             "reserved_qty": "0",
        //                             "collateral_weight": "0.9",
        //                             "collateral_amount": "5.37549592",
        //                             "market_value": "5.97277325",
        //                             "max_withdrawal_balance": "0.00021198",
        //                             "instrument_name": "BTC",
        //                             "hourly_interest_rate": "0"
        //                         },
        //                     ],
        //                     "total_effective_leverage": "0",
        //                     "position_limit": "3000000",
        //                     "used_position_limit": "0",
        //                     "total_borrow": "0",
        //                     "margin_score": "0",
        //                     "is_liquidating": false,
        //                     "has_risk": false,
        //                     "terminatable": true
        //                 }
        //             ]
        //         }
        //     }
        //
        return this.parseBalance(response);
    }
    async fetchOrder(id, symbol = undefined, params = {}) {
        /**
         * @method
         * @name cryptocom#fetchOrder
         * @description fetches information on an order made by the user
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-order-detail
         * @param {string} symbol unified symbol of the market the order was made in
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets();
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market(symbol);
        }
        const request = {
            'order_id': id,
        };
        const response = await this.v1PrivatePostPrivateGetOrderDetail(this.extend(request, params));
        //
        //     {
        //         "id": 1686872583882,
        //         "method": "private/get-order-detail",
        //         "code": 0,
        //         "result": {
        //             "account_id": "ae075bef-1234-4321-bd6g-bb9007252a63",
        //             "order_id": "6142909895025252686",
        //             "client_oid": "CCXT_c2d2152cc32d40a3ae7fbf",
        //             "order_type": "LIMIT",
        //             "time_in_force": "GOOD_TILL_CANCEL",
        //             "side": "BUY",
        //             "exec_inst": [ ],
        //             "quantity": "0.00020",
        //             "limit_price": "20000.00",
        //             "order_value": "4",
        //             "avg_price": "0",
        //             "trigger_price": "0",
        //             "ref_price": "0",
        //             "cumulative_quantity": "0",
        //             "cumulative_value": "0",
        //             "cumulative_fee": "0",
        //             "status": "ACTIVE",
        //             "update_user_id": "ae075bef-1234-4321-bd6g-bb9007252a63",
        //             "order_date": "2023-06-15",
        //             "instrument_name": "BTC_USD",
        //             "fee_instrument_name": "BTC",
        //             "create_time": 1686870220684,
        //             "create_time_ns": "1686870220684239675",
        //             "update_time": 1686870220684
        //         }
        //     }
        //
        const order = this.safeDict(response, 'result', {});
        return this.parseOrder(order, market);
    }
    createOrderRequest(symbol, type, side, amount, price = undefined, params = {}) {
        const market = this.market(symbol);
        const uppercaseType = type.toUpperCase();
        const request = {
            'instrument_name': market['id'],
            'side': side.toUpperCase(),
            'quantity': this.amountToPrecision(symbol, amount),
        };
        if ((uppercaseType === 'LIMIT') || (uppercaseType === 'STOP_LIMIT') || (uppercaseType === 'TAKE_PROFIT_LIMIT')) {
            request['price'] = this.priceToPrecision(symbol, price);
        }
        const broker = this.safeString(this.options, 'broker', 'CCXT');
        request['broker_id'] = broker;
        let marketType = undefined;
        let marginMode = undefined;
        [marketType, params] = this.handleMarketTypeAndParams('createOrder', market, params);
        [marginMode, params] = this.customHandleMarginModeAndParams('createOrder', params);
        if ((marketType === 'margin') || (marginMode !== undefined)) {
            request['spot_margin'] = 'MARGIN';
        }
        else if (marketType === 'spot') {
            request['spot_margin'] = 'SPOT';
        }
        const timeInForce = this.safeStringUpper2(params, 'timeInForce', 'time_in_force');
        if (timeInForce !== undefined) {
            if (timeInForce === 'GTC') {
                request['time_in_force'] = 'GOOD_TILL_CANCEL';
            }
            else if (timeInForce === 'IOC') {
                request['time_in_force'] = 'IMMEDIATE_OR_CANCEL';
            }
            else if (timeInForce === 'FOK') {
                request['time_in_force'] = 'FILL_OR_KILL';
            }
            else {
                request['time_in_force'] = timeInForce;
            }
        }
        const postOnly = this.safeBool(params, 'postOnly', false);
        if ((postOnly) || (timeInForce === 'PO')) {
            request['exec_inst'] = ['POST_ONLY'];
            request['time_in_force'] = 'GOOD_TILL_CANCEL';
        }
        const triggerPrice = this.safeStringN(params, ['stopPrice', 'triggerPrice', 'ref_price']);
        const stopLossPrice = this.safeNumber(params, 'stopLossPrice');
        const takeProfitPrice = this.safeNumber(params, 'takeProfitPrice');
        const isTrigger = (triggerPrice !== undefined);
        const isStopLossTrigger = (stopLossPrice !== undefined);
        const isTakeProfitTrigger = (takeProfitPrice !== undefined);
        if (isTrigger) {
            request['ref_price'] = this.priceToPrecision(symbol, triggerPrice);
            const priceString = this.numberToString(price);
            if ((uppercaseType === 'LIMIT') || (uppercaseType === 'STOP_LIMIT') || (uppercaseType === 'TAKE_PROFIT_LIMIT')) {
                if (side === 'buy') {
                    if (Precise["default"].stringLt(priceString, triggerPrice)) {
                        request['type'] = 'TAKE_PROFIT_LIMIT';
                    }
                    else {
                        request['type'] = 'STOP_LIMIT';
                    }
                }
                else {
                    if (Precise["default"].stringLt(priceString, triggerPrice)) {
                        request['type'] = 'STOP_LIMIT';
                    }
                    else {
                        request['type'] = 'TAKE_PROFIT_LIMIT';
                    }
                }
            }
            else {
                if (side === 'buy') {
                    if (Precise["default"].stringLt(priceString, triggerPrice)) {
                        request['type'] = 'TAKE_PROFIT';
                    }
                    else {
                        request['type'] = 'STOP_LOSS';
                    }
                }
                else {
                    if (Precise["default"].stringLt(priceString, triggerPrice)) {
                        request['type'] = 'STOP_LOSS';
                    }
                    else {
                        request['type'] = 'TAKE_PROFIT';
                    }
                }
            }
        }
        else if (isStopLossTrigger) {
            if ((uppercaseType === 'LIMIT') || (uppercaseType === 'STOP_LIMIT')) {
                request['type'] = 'STOP_LIMIT';
            }
            else {
                request['type'] = 'STOP_LOSS';
            }
            request['ref_price'] = this.priceToPrecision(symbol, stopLossPrice);
        }
        else if (isTakeProfitTrigger) {
            if ((uppercaseType === 'LIMIT') || (uppercaseType === 'TAKE_PROFIT_LIMIT')) {
                request['type'] = 'TAKE_PROFIT_LIMIT';
            }
            else {
                request['type'] = 'TAKE_PROFIT';
            }
            request['ref_price'] = this.priceToPrecision(symbol, takeProfitPrice);
        }
        else {
            request['type'] = uppercaseType;
        }
        params = this.omit(params, ['postOnly', 'clientOrderId', 'timeInForce', 'stopPrice', 'triggerPrice', 'stopLossPrice', 'takeProfitPrice']);
        return this.extend(request, params);
    }
    async createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        /**
         * @method
         * @name cryptocom#createOrder
         * @description create a trade order
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-create-order
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {string} type 'market', 'limit', 'stop_loss', 'stop_limit', 'take_profit', 'take_profit_limit'
         * @param {string} side 'buy' or 'sell'
         * @param {float} amount how much you want to trade in units of base currency
         * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {string} [params.timeInForce] 'GTC', 'IOC', 'FOK' or 'PO'
         * @param {string} [params.ref_price_type] 'MARK_PRICE', 'INDEX_PRICE', 'LAST_PRICE' which trigger price type to use, default is MARK_PRICE
         * @param {float} [params.stopPrice] price to trigger a stop order
         * @param {float} [params.stopLossPrice] price to trigger a stop-loss trigger order
         * @param {float} [params.takeProfitPrice] price to trigger a take-profit trigger order
         * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = this.createOrderRequest(symbol, type, side, amount, price, params);
        const response = await this.v1PrivatePostPrivateCreateOrder(request);
        //
        //     {
        //         "id": 1686804664362,
        //         "method": "private/create-order",
        //         "code" : 0,
        //         "result": {
        //             "order_id": "6540219377766741832",
        //             "client_oid": "CCXT_d6ef7c3db6c1495aa8b757"
        //         }
        //     }
        //
        const result = this.safeDict(response, 'result', {});
        return this.parseOrder(result, market);
    }
    async createOrders(orders, params = {}) {
        /**
         * @method
         * @name cryptocom#createOrders
         * @description create a list of trade orders
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-create-order-list-list
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-create-order-list-oco
         * @param {Array} orders list of orders to create, each object should contain the parameters required by createOrder, namely symbol, type, side, amount, price and params
         * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets();
        const ordersRequests = [];
        for (let i = 0; i < orders.length; i++) {
            const rawOrder = orders[i];
            const marketId = this.safeString(rawOrder, 'symbol');
            const type = this.safeString(rawOrder, 'type');
            const side = this.safeString(rawOrder, 'side');
            const amount = this.safeValue(rawOrder, 'amount');
            const price = this.safeValue(rawOrder, 'price');
            const orderParams = this.safeValue(rawOrder, 'params', {});
            const orderRequest = this.createAdvancedOrderRequest(marketId, type, side, amount, price, orderParams);
            ordersRequests.push(orderRequest);
        }
        const contigency = this.safeString(params, 'contingency_type', 'LIST');
        const request = {
            'contingency_type': contigency,
            'order_list': ordersRequests,
        };
        const response = await this.v1PrivatePostPrivateCreateOrderList(this.extend(request, params));
        //
        // {
        //     "id": 12,
        //     "method": "private/create-order-list",
        //     "code": 10001,
        //     "result": {
        //       "result_list": [
        //         {
        //           "index": 0,
        //           "code": 0,
        //           "order_id": "2015106383706015873",
        //           "client_oid": "my_order_0001"
        //         },
        //         {
        //           "index": 1,
        //           "code": 20007,
        //           "message": "INVALID_REQUEST",
        //           "client_oid": "my_order_0002"
        //         }
        //       ]
        //     }
        // }
        //
        //   {
        //       "id" : 1698068111133,
        //       "method" : "private/create-order-list",
        //       "code" : 0,
        //       "result" : [ {
        //         "code" : 0,
        //         "index" : 0,
        //         "client_oid" : "1698068111133_0",
        //         "order_id" : "6142909896519488206"
        //       }, {
        //         "code" : 306,
        //         "index" : 1,
        //         "client_oid" : "1698068111133_1",
        //         "message" : "INSUFFICIENT_AVAILABLE_BALANCE",
        //         "order_id" : "6142909896519488207"
        //       } ]
        //   }
        //
        const result = this.safeValue(response, 'result', []);
        const listId = this.safeString(result, 'list_id');
        if (listId !== undefined) {
            const ocoOrders = [{ 'order_id': listId }];
            return this.parseOrders(ocoOrders);
        }
        return this.parseOrders(result);
    }
    createAdvancedOrderRequest(symbol, type, side, amount, price = undefined, params = {}) {
        // differs slightly from createOrderRequest
        // since the advanced order endpoint requires a different set of parameters
        // namely here we don't support ref_price or spot_margin
        // and market-buy orders need to send notional instead of quantity
        const market = this.market(symbol);
        const uppercaseType = type.toUpperCase();
        const request = {
            'instrument_name': market['id'],
            'side': side.toUpperCase(),
        };
        if ((uppercaseType === 'LIMIT') || (uppercaseType === 'STOP_LIMIT') || (uppercaseType === 'TAKE_PROFIT_LIMIT')) {
            request['price'] = this.priceToPrecision(symbol, price);
        }
        const broker = this.safeString(this.options, 'broker', 'CCXT');
        request['broker_id'] = broker;
        const timeInForce = this.safeStringUpper2(params, 'timeInForce', 'time_in_force');
        if (timeInForce !== undefined) {
            if (timeInForce === 'GTC') {
                request['time_in_force'] = 'GOOD_TILL_CANCEL';
            }
            else if (timeInForce === 'IOC') {
                request['time_in_force'] = 'IMMEDIATE_OR_CANCEL';
            }
            else if (timeInForce === 'FOK') {
                request['time_in_force'] = 'FILL_OR_KILL';
            }
            else {
                request['time_in_force'] = timeInForce;
            }
        }
        const postOnly = this.safeBool(params, 'postOnly', false);
        if ((postOnly) || (timeInForce === 'PO')) {
            request['exec_inst'] = ['POST_ONLY'];
            request['time_in_force'] = 'GOOD_TILL_CANCEL';
        }
        const triggerPrice = this.safeStringN(params, ['stopPrice', 'triggerPrice', 'ref_price']);
        const stopLossPrice = this.safeNumber(params, 'stopLossPrice');
        const takeProfitPrice = this.safeNumber(params, 'takeProfitPrice');
        const isTrigger = (triggerPrice !== undefined);
        const isStopLossTrigger = (stopLossPrice !== undefined);
        const isTakeProfitTrigger = (takeProfitPrice !== undefined);
        if (isTrigger) {
            const priceString = this.numberToString(price);
            if ((uppercaseType === 'LIMIT') || (uppercaseType === 'STOP_LIMIT') || (uppercaseType === 'TAKE_PROFIT_LIMIT')) {
                if (side === 'buy') {
                    if (Precise["default"].stringLt(priceString, triggerPrice)) {
                        request['type'] = 'TAKE_PROFIT_LIMIT';
                    }
                    else {
                        request['type'] = 'STOP_LIMIT';
                    }
                }
                else {
                    if (Precise["default"].stringLt(priceString, triggerPrice)) {
                        request['type'] = 'STOP_LIMIT';
                    }
                    else {
                        request['type'] = 'TAKE_PROFIT_LIMIT';
                    }
                }
            }
            else {
                if (side === 'buy') {
                    if (Precise["default"].stringLt(priceString, triggerPrice)) {
                        request['type'] = 'TAKE_PROFIT';
                    }
                    else {
                        request['type'] = 'STOP_LOSS';
                    }
                }
                else {
                    if (Precise["default"].stringLt(priceString, triggerPrice)) {
                        request['type'] = 'STOP_LOSS';
                    }
                    else {
                        request['type'] = 'TAKE_PROFIT';
                    }
                }
            }
        }
        else if (isStopLossTrigger) {
            if ((uppercaseType === 'LIMIT') || (uppercaseType === 'STOP_LIMIT')) {
                request['type'] = 'STOP_LIMIT';
            }
            else {
                request['type'] = 'STOP_LOSS';
            }
        }
        else if (isTakeProfitTrigger) {
            if ((uppercaseType === 'LIMIT') || (uppercaseType === 'TAKE_PROFIT_LIMIT')) {
                request['type'] = 'TAKE_PROFIT_LIMIT';
            }
            else {
                request['type'] = 'TAKE_PROFIT';
            }
        }
        else {
            request['type'] = uppercaseType;
        }
        if ((side === 'buy') && ((uppercaseType === 'MARKET') || (uppercaseType === 'STOP_LOSS') || (uppercaseType === 'TAKE_PROFIT'))) {
            // use createmarketBuy logic here
            let quoteAmount = undefined;
            let createMarketBuyOrderRequiresPrice = true;
            [createMarketBuyOrderRequiresPrice, params] = this.handleOptionAndParams(params, 'createOrder', 'createMarketBuyOrderRequiresPrice', true);
            const cost = this.safeNumber2(params, 'cost', 'notional');
            params = this.omit(params, 'cost');
            if (cost !== undefined) {
                quoteAmount = this.costToPrecision(symbol, cost);
            }
            else if (createMarketBuyOrderRequiresPrice) {
                if (price === undefined) {
                    throw new errors.InvalidOrder(this.id + ' createOrder() requires the price argument for market buy orders to calculate the total cost to spend (amount * price), alternatively set the createMarketBuyOrderRequiresPrice option or param to false and pass the cost to spend (quote quantity) in the amount argument');
                }
                else {
                    const amountString = this.numberToString(amount);
                    const priceString = this.numberToString(price);
                    const costRequest = Precise["default"].stringMul(amountString, priceString);
                    quoteAmount = this.costToPrecision(symbol, costRequest);
                }
            }
            else {
                quoteAmount = this.costToPrecision(symbol, amount);
            }
            request['notional'] = quoteAmount;
        }
        else {
            request['quantity'] = this.amountToPrecision(symbol, amount);
        }
        params = this.omit(params, ['postOnly', 'clientOrderId', 'timeInForce', 'stopPrice', 'triggerPrice', 'stopLossPrice', 'takeProfitPrice']);
        return this.extend(request, params);
    }
    async cancelAllOrders(symbol = undefined, params = {}) {
        /**
         * @method
         * @name cryptocom#cancelAllOrders
         * @description cancel all open orders
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-cancel-all-orders
         * @param {string} symbol unified market symbol of the orders to cancel
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} Returns exchange raw message{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets();
        let market = undefined;
        const request = {};
        if (symbol !== undefined) {
            market = this.market(symbol);
            request['instrument_name'] = market['id'];
        }
        return await this.v1PrivatePostPrivateCancelAllOrders(this.extend(request, params));
    }
    async cancelOrder(id, symbol = undefined, params = {}) {
        /**
         * @method
         * @name cryptocom#cancelOrder
         * @description cancels an open order
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-cancel-order
         * @param {string} id the order id of the order to cancel
         * @param {string} [symbol] unified symbol of the market the order was made in
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets();
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market(symbol);
        }
        const request = {
            'order_id': id,
        };
        const response = await this.v1PrivatePostPrivateCancelOrder(this.extend(request, params));
        //
        //     {
        //         "id": 1686882846638,
        //         "method": "private/cancel-order",
        //         "code": 0,
        //         "message": "NO_ERROR",
        //         "result": {
        //             "client_oid": "CCXT_c2d2152cc32d40a3ae7fbf",
        //             "order_id": "6142909895025252686"
        //         }
        //     }
        //
        const result = this.safeDict(response, 'result', {});
        return this.parseOrder(result, market);
    }
    async cancelOrders(ids, symbol = undefined, params = {}) {
        /**
         * @method
         * @name cryptocom#cancelOrders
         * @description cancel multiple orders
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-cancel-order-list-list
         * @param {string[]} ids order ids
         * @param {string} symbol unified market symbol
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} an list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' cancelOrders() requires a symbol argument');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        const orderRequests = [];
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const order = {
                'instrument_name': market['id'],
                'order_id': id.toString(),
            };
            orderRequests.push(order);
        }
        const request = {
            'contingency_type': 'LIST',
            'order_list': orderRequests,
        };
        const response = await this.v1PrivatePostPrivateCancelOrderList(this.extend(request, params));
        const result = this.safeList(response, 'result', []);
        return this.parseOrders(result, market, undefined, undefined, params);
    }
    async cancelOrdersForSymbols(orders, params = {}) {
        /**
         * @method
         * @name cryptocom#cancelOrdersForSymbols
         * @description cancel multiple orders for multiple symbols
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-cancel-order-list-list
         * @param {CancellationRequest[]} orders each order should contain the parameters required by cancelOrder namely id and symbol
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} an list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets();
        const orderRequests = [];
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            const id = this.safeString(order, 'id');
            const symbol = this.safeString(order, 'symbol');
            const market = this.market(symbol);
            const orderItem = {
                'instrument_name': market['id'],
                'order_id': id.toString(),
            };
            orderRequests.push(orderItem);
        }
        const request = {
            'contingency_type': 'LIST',
            'order_list': orderRequests,
        };
        const response = await this.v1PrivatePostPrivateCancelOrderList(this.extend(request, params));
        const result = this.safeList(response, 'result', []);
        return this.parseOrders(result, undefined, undefined, undefined, params);
    }
    async fetchOpenOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name cryptocom#fetchOpenOrders
         * @description fetch all unfilled currently open orders
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-open-orders
         * @param {string} symbol unified market symbol
         * @param {int} [since] the earliest time in ms to fetch open orders for
         * @param {int} [limit] the maximum number of open order structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets();
        let market = undefined;
        const request = {};
        if (symbol !== undefined) {
            market = this.market(symbol);
            request['instrument_name'] = market['id'];
        }
        const response = await this.v1PrivatePostPrivateGetOpenOrders(this.extend(request, params));
        //
        //     {
        //         "id": 1686806134961,
        //         "method": "private/get-open-orders",
        //         "code": 0,
        //         "result": {
        //             "data": [
        //                 {
        //                     "account_id": "ce075bef-1234-4321-bd6g-ff9007252e63",
        //                     "order_id": "6530219477767564494",
        //                     "client_oid": "CCXT_7ce730f0388441df9bc218",
        //                     "order_type": "LIMIT",
        //                     "time_in_force": "GOOD_TILL_CANCEL",
        //                     "side": "BUY",
        //                     "exec_inst": [ ],
        //                     "quantity": "0.00020",
        //                     "limit_price": "20000.00",
        //                     "order_value": "4",
        //                     "avg_price": "0",
        //                     "trigger_price": "0",
        //                     "ref_price": "0",
        //                     "cumulative_quantity": "0",
        //                     "cumulative_value": "0",
        //                     "cumulative_fee": "0",
        //                     "status": "ACTIVE",
        //                     "update_user_id": "ce075bef-1234-4321-bd6g-gg9007252e63",
        //                     "order_date": "2023-06-15",
        //                     "instrument_name": "BTC_USD",
        //                     "fee_instrument_name": "BTC",
        //                     "create_time": 1686806053992,
        //                     "create_time_ns": "1686806053992921880",
        //                     "update_time": 1686806053993
        //                 }
        //             ]
        //         }
        //     }
        //
        const data = this.safeValue(response, 'result', {});
        const orders = this.safeList(data, 'data', []);
        return this.parseOrders(orders, market, since, limit);
    }
    async fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name cryptocom#fetchMyTrades
         * @description fetch all trades made by the user
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-trades
         * @param {string} symbol unified market symbol
         * @param {int} [since] the earliest time in ms to fetch trades for, maximum date range is one day
         * @param {int} [limit] the maximum number of trade structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {int} [params.until] timestamp in ms for the ending date filter, default is the current time
         * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
         * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
         */
        await this.loadMarkets();
        let paginate = false;
        [paginate, params] = this.handleOptionAndParams(params, 'fetchMyTrades', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDynamic('fetchMyTrades', symbol, since, limit, params);
        }
        const request = {};
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market(symbol);
            request['instrument_name'] = market['id'];
        }
        if (since !== undefined) {
            request['start_time'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const until = this.safeInteger(params, 'until');
        params = this.omit(params, ['until']);
        if (until !== undefined) {
            request['end_time'] = until;
        }
        const response = await this.v1PrivatePostPrivateGetTrades(this.extend(request, params));
        //
        //     {
        //         "id": 1686942003520,
        //         "method": "private/get-trades",
        //         "code": 0,
        //         "result": {
        //             "data": [
        //                 {
        //                     "account_id": "ds075abc-1234-4321-bd6g-ff9007252r63",
        //                     "event_date": "2023-06-16",
        //                     "journal_type": "TRADING",
        //                     "side": "BUY",
        //                     "instrument_name": "BTC_USD",
        //                     "fees": "-0.0000000525",
        //                     "trade_id": "6142909898247428343",
        //                     "trade_match_id": "4611686018455978480",
        //                     "create_time": 1686941992887,
        //                     "traded_price": "26347.16",
        //                     "traded_quantity": "0.00021",
        //                     "fee_instrument_name": "BTC",
        //                     "client_oid": "d1c70a60-810e-4c92-b2a0-72b931cb31e0",
        //                     "taker_side": "TAKER",
        //                     "order_id": "6142909895036331486",
        //                     "create_time_ns": "1686941992887207066"
        //                 }
        //             ]
        //         }
        //     }
        //
        const result = this.safeValue(response, 'result', {});
        const trades = this.safeList(result, 'data', []);
        return this.parseTrades(trades, market, since, limit);
    }
    parseAddress(addressString) {
        let address = undefined;
        let tag = undefined;
        let rawTag = undefined;
        if (addressString.indexOf('?') > 0) {
            [address, rawTag] = addressString.split('?');
            const splitted = rawTag.split('=');
            tag = splitted[1];
        }
        else {
            address = addressString;
        }
        return [address, tag];
    }
    async withdraw(code, amount, address, tag = undefined, params = {}) {
        /**
         * @method
         * @name cryptocom#withdraw
         * @description make a withdrawal
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-create-withdrawal
         * @param {string} code unified currency code
         * @param {float} amount the amount to withdraw
         * @param {string} address the address to withdraw to
         * @param {string} tag
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [transaction structure]{@link https://docs.ccxt.com/#/?id=transaction-structure}
         */
        [tag, params] = this.handleWithdrawTagAndParams(tag, params);
        await this.loadMarkets();
        const currency = this.safeCurrency(code); // for instance, USDC is not inferred from markets but it's still available
        const request = {
            'currency': currency['id'],
            'amount': amount,
            'address': address,
        };
        if (tag !== undefined) {
            request['address_tag'] = tag;
        }
        let networkCode = undefined;
        [networkCode, params] = this.handleNetworkCodeAndParams(params);
        const networkId = this.networkCodeToId(networkCode);
        if (networkId !== undefined) {
            request['network_id'] = networkId;
        }
        const response = await this.v1PrivatePostPrivateCreateWithdrawal(this.extend(request, params));
        //
        //    {
        //        "id":-1,
        //        "method":"private/create-withdrawal",
        //        "code":0,
        //        "result": {
        //            "id": 2220,
        //            "amount": 1,
        //            "fee": 0.0004,
        //            "symbol": "BTC",
        //            "address": "2NBqqD5GRJ8wHy1PYyCXTe9ke5226FhavBf",
        //            "client_wid": "my_withdrawal_002",
        //            "create_time":1607063412000
        //        }
        //     }
        //
        const result = this.safeDict(response, 'result');
        return this.parseTransaction(result, currency);
    }
    async fetchDepositAddressesByNetwork(code, params = {}) {
        /**
         * @method
         * @name cryptocom#fetchDepositAddressesByNetwork
         * @description fetch a dictionary of addresses for a currency, indexed by network
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-deposit-address
         * @param {string} code unified currency code of the currency for the deposit address
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of [address structures]{@link https://docs.ccxt.com/#/?id=address-structure} indexed by the network
         */
        await this.loadMarkets();
        const currency = this.safeCurrency(code);
        const request = {
            'currency': currency['id'],
        };
        const response = await this.v1PrivatePostPrivateGetDepositAddress(this.extend(request, params));
        //
        //     {
        //         "id": 1234555011221,
        //         "method": "private/get-deposit-address",
        //         "code": 0,
        //         "result": {
        //             "deposit_address_list": [
        //                 {
        //                     "currency": "BTC",
        //                     "create_time": 1686730755000,
        //                     "id": "3737377",
        //                     "address": "3N9afggxTSmJ3H4jaMQuWyEiLBzZdAbK6d",
        //                     "status":"1",
        //                     "network": "BTC"
        //                 },
        //             ]
        //         }
        //     }
        //
        const data = this.safeValue(response, 'result', {});
        const addresses = this.safeValue(data, 'deposit_address_list', []);
        const addressesLength = addresses.length;
        if (addressesLength === 0) {
            throw new errors.ExchangeError(this.id + ' fetchDepositAddressesByNetwork() generating address...');
        }
        const result = {};
        for (let i = 0; i < addressesLength; i++) {
            const value = this.safeValue(addresses, i);
            const addressString = this.safeString(value, 'address');
            const currencyId = this.safeString(value, 'currency');
            const responseCode = this.safeCurrencyCode(currencyId);
            const [address, tag] = this.parseAddress(addressString);
            this.checkAddress(address);
            const networkId = this.safeString(value, 'network');
            const network = this.networkIdToCode(networkId, responseCode);
            result[network] = {
                'info': value,
                'currency': responseCode,
                'address': address,
                'tag': tag,
                'network': network,
            };
        }
        return result;
    }
    async fetchDepositAddress(code, params = {}) {
        /**
         * @method
         * @name cryptocom#fetchDepositAddress
         * @description fetch the deposit address for a currency associated with this account
         * @param {string} code unified currency code
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} an [address structure]{@link https://docs.ccxt.com/#/?id=address-structure}
         */
        const network = this.safeStringUpper(params, 'network');
        params = this.omit(params, ['network']);
        const depositAddresses = await this.fetchDepositAddressesByNetwork(code, params);
        if (network in depositAddresses) {
            return depositAddresses[network];
        }
        else {
            const keys = Object.keys(depositAddresses);
            return depositAddresses[keys[0]];
        }
    }
    safeNetwork(networkId) {
        const networksById = {
            'BTC': 'BTC',
            'ETH': 'ETH',
            'SOL': 'SOL',
            'BNB': 'BNB',
            'CRONOS': 'CRONOS',
            'MATIC': 'MATIC',
            'OP': 'OP',
        };
        return this.safeString(networksById, networkId, networkId);
    }
    async fetchDeposits(code = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name cryptocom#fetchDeposits
         * @description fetch all deposits made to an account
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-deposit-history
         * @param {string} code unified currency code
         * @param {int} [since] the earliest time in ms to fetch deposits for
         * @param {int} [limit] the maximum number of deposits structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {int} [params.until] timestamp in ms for the ending date filter, default is the current time
         * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
         */
        await this.loadMarkets();
        let currency = undefined;
        const request = {};
        if (code !== undefined) {
            currency = this.safeCurrency(code);
            request['currency'] = currency['id'];
        }
        if (since !== undefined) {
            // 90 days date range
            request['start_ts'] = since;
        }
        if (limit !== undefined) {
            request['page_size'] = limit;
        }
        const until = this.safeInteger(params, 'until');
        params = this.omit(params, ['until']);
        if (until !== undefined) {
            request['end_ts'] = until;
        }
        const response = await this.v1PrivatePostPrivateGetDepositHistory(this.extend(request, params));
        //
        //     {
        //         "id": 1688701375714,
        //         "method": "private/get-deposit-history",
        //         "code": 0,
        //         "result": {
        //             "deposit_list": [
        //                 {
        //                     "currency": "BTC",
        //                     "fee": 0,
        //                     "create_time": 1688023659000,
        //                     "id": "6201135",
        //                     "update_time": 1688178509000,
        //                     "amount": 0.00114571,
        //                     "address": "1234fggxTSmJ3H4jaMQuWyEiLBzZdAbK6d",
        //                     "status": "1",
        //                     "txid": "f0ae4202b76eb999c301eccdde44dc639bee42d1fdd5974105286ca3393f6065/2"
        //                 },
        //             ]
        //         }
        //     }
        //
        const data = this.safeValue(response, 'result', {});
        const depositList = this.safeList(data, 'deposit_list', []);
        return this.parseTransactions(depositList, currency, since, limit);
    }
    async fetchWithdrawals(code = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name cryptocom#fetchWithdrawals
         * @description fetch all withdrawals made from an account
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-withdrawal-history
         * @param {string} code unified currency code
         * @param {int} [since] the earliest time in ms to fetch withdrawals for
         * @param {int} [limit] the maximum number of withdrawals structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {int} [params.until] timestamp in ms for the ending date filter, default is the current time
         * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
         */
        await this.loadMarkets();
        let currency = undefined;
        const request = {};
        if (code !== undefined) {
            currency = this.safeCurrency(code);
            request['currency'] = currency['id'];
        }
        if (since !== undefined) {
            // 90 days date range
            request['start_ts'] = since;
        }
        if (limit !== undefined) {
            request['page_size'] = limit;
        }
        const until = this.safeInteger(params, 'until');
        params = this.omit(params, ['until']);
        if (until !== undefined) {
            request['end_ts'] = until;
        }
        const response = await this.v1PrivatePostPrivateGetWithdrawalHistory(this.extend(request, params));
        //
        //     {
        //         "id": 1688613879534,
        //         "method": "private/get-withdrawal-history",
        //         "code": 0,
        //         "result": {
        //             "withdrawal_list": [
        //                 {
        //                     "currency": "BTC",
        //                     "client_wid": "",
        //                     "fee": 0.0005,
        //                     "create_time": 1688613850000,
        //                     "id": "5275977",
        //                     "update_time": 1688613850000,
        //                     "amount": 0.0005,
        //                     "address": "1234NMEWbiF8ZkwUMxmfzMxi2A1MQ44bMn",
        //                     "status": "1",
        //                     "txid": "",
        //                     "network_id": "BTC"
        //                 }
        //             ]
        //         }
        //     }
        //
        const data = this.safeValue(response, 'result', {});
        const withdrawalList = this.safeList(data, 'withdrawal_list', []);
        return this.parseTransactions(withdrawalList, currency, since, limit);
    }
    parseTicker(ticker, market = undefined) {
        //
        // fetchTicker
        //
        //     {
        //         "i": "BTC_USD",
        //         "h": "30821.45",
        //         "l": "28685.11",
        //         "a": "30446.00",
        //         "v": "1767.8734",
        //         "vv": "52436726.42",
        //         "c": "0.0583",
        //         "b": "30442.00",
        //         "k": "30447.66",
        //         "t": 1687403045415
        //     }
        //
        // fetchTickers
        //
        //     {
        //         "i": "AVAXUSD-PERP",
        //         "h": "13.209",
        //         "l": "12.148",
        //         "a": "13.209",
        //         "v": "1109.8",
        //         "vv": "14017.33",
        //         "c": "0.0732",
        //         "b": "13.210",
        //         "k": "13.230",
        //         "oi": "10888.9",
        //         "t": 1687402657575
        //     }
        //
        const timestamp = this.safeInteger(ticker, 't');
        const marketId = this.safeString(ticker, 'i');
        market = this.safeMarket(marketId, market, '_');
        const quote = this.safeString(market, 'quote');
        const last = this.safeString(ticker, 'a');
        return this.safeTicker({
            'symbol': market['symbol'],
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'high': this.safeNumber(ticker, 'h'),
            'low': this.safeNumber(ticker, 'l'),
            'bid': this.safeNumber(ticker, 'b'),
            'bidVolume': undefined,
            'ask': this.safeNumber(ticker, 'k'),
            'askVolume': undefined,
            'vwap': undefined,
            'open': undefined,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': undefined,
            'percentage': this.safeString(ticker, 'c'),
            'average': undefined,
            'baseVolume': this.safeString(ticker, 'v'),
            'quoteVolume': (quote === 'USD') ? this.safeString(ticker, 'vv') : undefined,
            'info': ticker,
        }, market);
    }
    parseTrade(trade, market = undefined) {
        //
        // fetchTrades
        //
        //     {
        //         "s": "sell",
        //         "p": "26386.00",
        //         "q": "0.00453",
        //         "tn": 1686944282062,
        //         "tn": 1704476468851524373,
        //         "d": "4611686018455979970",
        //         "i": "BTC_USD"
        //     }
        //
        // fetchMyTrades
        //
        //     {
        //         "account_id": "ds075abc-1234-4321-bd6g-ff9007252r63",
        //         "event_date": "2023-06-16",
        //         "journal_type": "TRADING",
        //         "side": "BUY",
        //         "instrument_name": "BTC_USD",
        //         "fees": "-0.0000000525",
        //         "trade_id": "6142909898247428343",
        //         "trade_match_id": "4611686018455978480",
        //         "create_time": 1686941992887,
        //         "traded_price": "26347.16",
        //         "traded_quantity": "0.00021",
        //         "fee_instrument_name": "BTC",
        //         "client_oid": "d1c70a60-1234-4c92-b2a0-72b931cb31e0",
        //         "taker_side": "TAKER",
        //         "order_id": "6142909895036331486",
        //         "create_time_ns": "1686941992887207066"
        //     }
        //
        const timestamp = this.safeInteger2(trade, 't', 'create_time');
        const marketId = this.safeString2(trade, 'i', 'instrument_name');
        market = this.safeMarket(marketId, market, '_');
        const feeCurrency = this.safeString(trade, 'fee_instrument_name');
        const feeCostString = this.safeString(trade, 'fees');
        return this.safeTrade({
            'info': trade,
            'id': this.safeString2(trade, 'd', 'trade_id'),
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': market['symbol'],
            'order': this.safeString(trade, 'order_id'),
            'side': this.safeStringLower2(trade, 's', 'side'),
            'takerOrMaker': this.safeStringLower(trade, 'taker_side'),
            'price': this.safeNumber2(trade, 'p', 'traded_price'),
            'amount': this.safeNumber2(trade, 'q', 'traded_quantity'),
            'cost': undefined,
            'type': undefined,
            'fee': {
                'currency': this.safeCurrencyCode(feeCurrency),
                'cost': this.parseNumber(Precise["default"].stringNeg(feeCostString)),
            },
        }, market);
    }
    parseOHLCV(ohlcv, market = undefined) {
        //
        //     {
        //         "o": "26949.89",
        //         "h": "26957.64",
        //         "l": "26948.24",
        //         "c": "26950.00",
        //         "v": "0.0670",
        //         "t": 1687237080000
        //     }
        //
        return [
            this.safeInteger(ohlcv, 't'),
            this.safeNumber(ohlcv, 'o'),
            this.safeNumber(ohlcv, 'h'),
            this.safeNumber(ohlcv, 'l'),
            this.safeNumber(ohlcv, 'c'),
            this.safeNumber(ohlcv, 'v'),
        ];
    }
    parseOrderStatus(status) {
        const statuses = {
            'ACTIVE': 'open',
            'CANCELED': 'canceled',
            'FILLED': 'closed',
            'REJECTED': 'rejected',
            'EXPIRED': 'expired',
        };
        return this.safeString(statuses, status, status);
    }
    parseTimeInForce(timeInForce) {
        const timeInForces = {
            'GOOD_TILL_CANCEL': 'GTC',
            'IMMEDIATE_OR_CANCEL': 'IOC',
            'FILL_OR_KILL': 'FOK',
        };
        return this.safeString(timeInForces, timeInForce, timeInForce);
    }
    parseOrder(order, market = undefined) {
        //
        // createOrder, cancelOrder
        //
        //     {
        //         "order_id": "6540219377766741832",
        //         "client_oid": "CCXT_d6ef7c3db6c1495aa8b757"
        //     }
        //
        // fetchOpenOrders, fetchOrder, fetchOrders
        //
        //     {
        //         "account_id": "ce075bef-1234-4321-bd6g-ff9007252e63",
        //         "order_id": "6530219477767564494",
        //         "client_oid": "CCXT_7ce730f0388441df9bc218",
        //         "order_type": "LIMIT",
        //         "time_in_force": "GOOD_TILL_CANCEL",
        //         "side": "BUY",
        //         "exec_inst": [ ],
        //         "quantity": "0.00020",
        //         "limit_price": "20000.00",
        //         "order_value": "4",
        //         "avg_price": "0",
        //         "trigger_price": "0",
        //         "ref_price": "0",
        //         "cumulative_quantity": "0",
        //         "cumulative_value": "0",
        //         "cumulative_fee": "0",
        //         "status": "ACTIVE",
        //         "update_user_id": "ce075bef-1234-4321-bd6g-gg9007252e63",
        //         "order_date": "2023-06-15",
        //         "instrument_name": "BTC_USD",
        //         "fee_instrument_name": "BTC",
        //         "create_time": 1686806053992,
        //         "create_time_ns": "1686806053992921880",
        //         "update_time": 1686806053993
        //     }
        //
        // createOrders
        //     {
        //             "code" : 306,
        //             "index" : 1,
        //             "client_oid" : "1698068111133_1",
        //             "message" : "INSUFFICIENT_AVAILABLE_BALANCE",
        //             "order_id" : "6142909896519488207"
        //     }
        //
        const code = this.safeInteger(order, 'code');
        if ((code !== undefined) && (code !== 0)) {
            return this.safeOrder({
                'id': this.safeString(order, 'order_id'),
                'clientOrderId': this.safeString(order, 'client_oid'),
                'info': order,
                'status': 'rejected',
            });
        }
        const created = this.safeInteger(order, 'create_time');
        const marketId = this.safeString(order, 'instrument_name');
        const symbol = this.safeSymbol(marketId, market);
        const execInst = this.safeValue(order, 'exec_inst');
        let postOnly = undefined;
        if (execInst !== undefined) {
            postOnly = false;
            for (let i = 0; i < execInst.length; i++) {
                const inst = execInst[i];
                if (inst === 'POST_ONLY') {
                    postOnly = true;
                    break;
                }
            }
        }
        const feeCurrency = this.safeString(order, 'fee_instrument_name');
        return this.safeOrder({
            'info': order,
            'id': this.safeString(order, 'order_id'),
            'clientOrderId': this.safeString(order, 'client_oid'),
            'timestamp': created,
            'datetime': this.iso8601(created),
            'lastTradeTimestamp': this.safeInteger(order, 'update_time'),
            'status': this.parseOrderStatus(this.safeString(order, 'status')),
            'symbol': symbol,
            'type': this.safeStringLower(order, 'order_type'),
            'timeInForce': this.parseTimeInForce(this.safeString(order, 'time_in_force')),
            'postOnly': postOnly,
            'side': this.safeStringLower(order, 'side'),
            'price': this.safeNumber(order, 'limit_price'),
            'amount': this.safeNumber(order, 'quantity'),
            'filled': this.safeNumber(order, 'cumulative_quantity'),
            'remaining': undefined,
            'average': this.safeNumber(order, 'avg_price'),
            'cost': this.safeNumber(order, 'cumulative_value'),
            'fee': {
                'currency': this.safeCurrencyCode(feeCurrency),
                'cost': this.safeNumber(order, 'cumulative_fee'),
            },
            'trades': [],
        }, market);
    }
    parseDepositStatus(status) {
        const statuses = {
            '0': 'pending',
            '1': 'ok',
            '2': 'failed',
            '3': 'pending',
        };
        return this.safeString(statuses, status, status);
    }
    parseWithdrawalStatus(status) {
        const statuses = {
            '0': 'pending',
            '1': 'pending',
            '2': 'failed',
            '3': 'pending',
            '4': 'failed',
            '5': 'ok',
            '6': 'canceled',
        };
        return this.safeString(statuses, status, status);
    }
    parseTransaction(transaction, currency = undefined) {
        //
        // fetchDeposits
        //
        //     {
        //         "currency": "BTC",
        //         "fee": 0,
        //         "create_time": 1688023659000,
        //         "id": "6201135",
        //         "update_time": 1688178509000,
        //         "amount": 0.00114571,
        //         "address": "1234fggxTSmJ3H4jaMQuWyEiLBzZdAbK6d",
        //         "status": "1",
        //         "txid": "f0ae4202b76eb999c301eccdde44dc639bee42d1fdd5974105286ca3393f6065/2"
        //     }
        //
        // fetchWithdrawals
        //
        //     {
        //         "currency": "BTC",
        //         "client_wid": "",
        //         "fee": 0.0005,
        //         "create_time": 1688613850000,
        //         "id": "5775977",
        //         "update_time": 1688613850000,
        //         "amount": 0.0005,
        //         "address": "1234NMEWbiF8ZkwUMxmfzMxi2A1MQ44bMn",
        //         "status": "1",
        //         "txid": "",
        //         "network_id": "BTC"
        //     }
        //
        // withdraw
        //
        //     {
        //         "id": 2220,
        //         "amount": 1,
        //         "fee": 0.0004,
        //         "symbol": "BTC",
        //         "address": "2NBqqD5GRJ8wHy1PYyCXTe9ke5226FhavBf",
        //         "client_wid": "my_withdrawal_002",
        //         "create_time":1607063412000
        //     }
        //
        let type = undefined;
        const rawStatus = this.safeString(transaction, 'status');
        let status = undefined;
        if ('client_wid' in transaction) {
            type = 'withdrawal';
            status = this.parseWithdrawalStatus(rawStatus);
        }
        else {
            type = 'deposit';
            status = this.parseDepositStatus(rawStatus);
        }
        const addressString = this.safeString(transaction, 'address');
        const [address, tag] = this.parseAddress(addressString);
        const currencyId = this.safeString(transaction, 'currency');
        const code = this.safeCurrencyCode(currencyId, currency);
        const timestamp = this.safeInteger(transaction, 'create_time');
        const feeCost = this.safeNumber(transaction, 'fee');
        let fee = undefined;
        if (feeCost !== undefined) {
            fee = { 'currency': code, 'cost': feeCost };
        }
        return {
            'info': transaction,
            'id': this.safeString(transaction, 'id'),
            'txid': this.safeString(transaction, 'txid'),
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'network': undefined,
            'address': address,
            'addressTo': address,
            'addressFrom': undefined,
            'tag': tag,
            'tagTo': tag,
            'tagFrom': undefined,
            'type': type,
            'amount': this.safeNumber(transaction, 'amount'),
            'currency': code,
            'status': status,
            'updated': this.safeInteger(transaction, 'update_time'),
            'internal': undefined,
            'comment': this.safeString(transaction, 'client_wid'),
            'fee': fee,
        };
    }
    customHandleMarginModeAndParams(methodName, params = {}) {
        /**
         * @ignore
         * @method
         * @description marginMode specified by params["marginMode"], this.options["marginMode"], this.options["defaultMarginMode"], params["margin"] = true or this.options["defaultType"] = 'margin'
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {Array} the marginMode in lowercase
         */
        const defaultType = this.safeString(this.options, 'defaultType');
        const isMargin = this.safeBool(params, 'margin', false);
        params = this.omit(params, 'margin');
        let marginMode = undefined;
        [marginMode, params] = this.handleMarginModeAndParams(methodName, params);
        if (marginMode !== undefined) {
            if (marginMode !== 'cross') {
                throw new errors.NotSupported(this.id + ' only cross margin is supported');
            }
        }
        else {
            if ((defaultType === 'margin') || (isMargin === true)) {
                marginMode = 'cross';
            }
        }
        return [marginMode, params];
    }
    parseDepositWithdrawFee(fee, currency = undefined) {
        //
        //    {
        //        "full_name": "Alchemix",
        //        "default_network": "ETH",
        //        "network_list": [
        //          {
        //            "network_id": "ETH",
        //            "withdrawal_fee": "0.25000000",
        //            "withdraw_enabled": true,
        //            "min_withdrawal_amount": "0.5",
        //            "deposit_enabled": true,
        //            "confirmation_required": "0"
        //          }
        //        ]
        //    }
        //
        const networkList = this.safeValue(fee, 'network_list');
        const networkListLength = networkList.length;
        const result = {
            'info': fee,
            'withdraw': {
                'fee': undefined,
                'percentage': undefined,
            },
            'deposit': {
                'fee': undefined,
                'percentage': undefined,
            },
            'networks': {},
        };
        if (networkList !== undefined) {
            for (let i = 0; i < networkListLength; i++) {
                const networkInfo = networkList[i];
                const networkId = this.safeString(networkInfo, 'network_id');
                const currencyCode = this.safeString(currency, 'code');
                const networkCode = this.networkIdToCode(networkId, currencyCode);
                result['networks'][networkCode] = {
                    'deposit': { 'fee': undefined, 'percentage': undefined },
                    'withdraw': { 'fee': this.safeNumber(networkInfo, 'withdrawal_fee'), 'percentage': false },
                };
                if (networkListLength === 1) {
                    result['withdraw']['fee'] = this.safeNumber(networkInfo, 'withdrawal_fee');
                    result['withdraw']['percentage'] = false;
                }
            }
        }
        return result;
    }
    async fetchDepositWithdrawFees(codes = undefined, params = {}) {
        /**
         * @method
         * @name cryptocom#fetchDepositWithdrawFees
         * @description fetch deposit and withdraw fees
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-currency-networks
         * @param {string[]|undefined} codes list of unified currency codes
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a list of [fee structures]{@link https://docs.ccxt.com/#/?id=fee-structure}
         */
        await this.loadMarkets();
        const response = await this.v1PrivatePostPrivateGetCurrencyNetworks(params);
        const data = this.safeValue(response, 'result');
        const currencyMap = this.safeList(data, 'currency_map');
        return this.parseDepositWithdrawFees(currencyMap, codes, 'full_name');
    }
    async fetchLedger(code = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name cryptocom#fetchLedger
         * @description fetch the history of changes, actions done by the user or operations that altered the balance of the user
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-transactions
         * @param {string} code unified currency code
         * @param {int} [since] timestamp in ms of the earliest ledger entry
         * @param {int} [limit] max number of ledger entries to return
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {int} [params.until] timestamp in ms for the ending date filter, default is the current time
         * @returns {object} a [ledger structure]{@link https://docs.ccxt.com/#/?id=ledger-structure}
         */
        await this.loadMarkets();
        const request = {};
        let currency = undefined;
        if (code !== undefined) {
            currency = this.safeCurrency(code);
        }
        if (since !== undefined) {
            request['start_time'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const until = this.safeInteger(params, 'until');
        params = this.omit(params, ['until']);
        if (until !== undefined) {
            request['end_time'] = until;
        }
        const response = await this.v1PrivatePostPrivateGetTransactions(this.extend(request, params));
        //
        //     {
        //         "id": 1686813195698,
        //         "method": "private/get-transactions",
        //         "code": 0,
        //         "result": {
        //             "data": [
        //                 {
        //                     "account_id": "ce075cef-1234-4321-bd6e-gf9007351e64",
        //                     "event_date": "2023-06-15",
        //                     "journal_type": "TRADING",
        //                     "journal_id": "6530219460124075091",
        //                     "transaction_qty": "6.0091224",
        //                     "transaction_cost": "6.0091224",
        //                     "realized_pnl": "0",
        //                     "order_id": "6530219477766741833",
        //                     "trade_id": "6530219495775954765",
        //                     "trade_match_id": "4611686018455865176",
        //                     "event_timestamp_ms": 1686804665013,
        //                     "event_timestamp_ns": "1686804665013642422",
        //                     "client_oid": "CCXT_d6ea7c5db6c1495aa8b758",
        //                     "taker_side": "",
        //                     "side": "BUY",
        //                     "instrument_name": "USD"
        //                 },
        //             ]
        //         }
        //     }
        //
        const result = this.safeValue(response, 'result', {});
        const ledger = this.safeValue(result, 'data', []);
        return this.parseLedger(ledger, currency, since, limit);
    }
    parseLedgerEntry(item, currency = undefined) {
        //
        //     {
        //         "account_id": "ce075cef-1234-4321-bd6e-gf9007351e64",
        //         "event_date": "2023-06-15",
        //         "journal_type": "TRADING",
        //         "journal_id": "6530219460124075091",
        //         "transaction_qty": "6.0091224",
        //         "transaction_cost": "6.0091224",
        //         "realized_pnl": "0",
        //         "order_id": "6530219477766741833",
        //         "trade_id": "6530219495775954765",
        //         "trade_match_id": "4611686018455865176",
        //         "event_timestamp_ms": 1686804665013,
        //         "event_timestamp_ns": "1686804665013642422",
        //         "client_oid": "CCXT_d6ea7c5db6c1495aa8b758",
        //         "taker_side": "",
        //         "side": "BUY",
        //         "instrument_name": "USD"
        //     }
        //
        const timestamp = this.safeInteger(item, 'event_timestamp_ms');
        const currencyId = this.safeString(item, 'instrument_name');
        let amount = this.safeString(item, 'transaction_qty');
        let direction = undefined;
        if (Precise["default"].stringLt(amount, '0')) {
            direction = 'out';
            amount = Precise["default"].stringAbs(amount);
        }
        else {
            direction = 'in';
        }
        return {
            'id': this.safeString(item, 'order_id'),
            'direction': direction,
            'account': this.safeString(item, 'account_id'),
            'referenceId': this.safeString(item, 'trade_id'),
            'referenceAccount': this.safeString(item, 'trade_match_id'),
            'type': this.parseLedgerEntryType(this.safeString(item, 'journal_type')),
            'currency': this.safeCurrencyCode(currencyId, currency),
            'amount': this.parseNumber(amount),
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'before': undefined,
            'after': undefined,
            'status': undefined,
            'fee': {
                'currency': undefined,
                'cost': undefined,
            },
            'info': item,
        };
    }
    parseLedgerEntryType(type) {
        const ledgerType = {
            'TRADING': 'trade',
            'TRADE_FEE': 'fee',
            'WITHDRAW_FEE': 'fee',
            'WITHDRAW': 'withdrawal',
            'DEPOSIT': 'deposit',
            'ROLLBACK_WITHDRAW': 'rollback',
            'ROLLBACK_DEPOSIT': 'rollback',
            'FUNDING': 'fee',
            'REALIZED_PNL': 'trade',
            'INSURANCE_FUND': 'insurance',
            'SOCIALIZED_LOSS': 'trade',
            'LIQUIDATION_FEE': 'fee',
            'SESSION_RESET': 'reset',
            'ADJUSTMENT': 'adjustment',
            'SESSION_SETTLE': 'settlement',
            'UNCOVERED_LOSS': 'trade',
            'ADMIN_ADJUSTMENT': 'adjustment',
            'DELIST': 'delist',
            'SETTLEMENT_FEE': 'fee',
            'AUTO_CONVERSION': 'conversion',
            'MANUAL_CONVERSION': 'conversion',
        };
        return this.safeString(ledgerType, type, type);
    }
    async fetchAccounts(params = {}) {
        /**
         * @method
         * @name cryptocom#fetchAccounts
         * @description fetch all the accounts associated with a profile
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-accounts
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of [account structures]{@link https://docs.ccxt.com/#/?id=account-structure} indexed by the account type
         */
        await this.loadMarkets();
        const response = await this.v1PrivatePostPrivateGetAccounts(params);
        //
        //     {
        //         "id": 1234567894321,
        //         "method": "private/get-accounts",
        //         "code": 0,
        //         "result": {
        //             "master_account": {
        //                 "uuid": "a1234abc-1234-4321-q5r7-b1ab0a0b12b",
        //                 "user_uuid": "a1234abc-1234-4321-q5r7-b1ab0a0b12b",
        //                 "enabled": true,
        //                 "tradable": true,
        //                 "name": "YOUR_NAME",
        //                 "country_code": "CAN",
        //                 "phone_country_code": "CAN",
        //                 "incorp_country_code": "",
        //                 "margin_access": "DEFAULT",
        //                 "derivatives_access": "DEFAULT",
        //                 "create_time": 1656445188000,
        //                 "update_time": 1660794567262,
        //                 "two_fa_enabled": true,
        //                 "kyc_level": "ADVANCED",
        //                 "suspended": false,
        //                 "terminated": false,
        //                 "spot_enabled": false,
        //                 "margin_enabled": false,
        //                 "derivatives_enabled": false
        //             },
        //             "sub_account_list": []
        //         }
        //     }
        //
        const result = this.safeValue(response, 'result', {});
        const masterAccount = this.safeValue(result, 'master_account', {});
        const accounts = this.safeValue(result, 'sub_account_list', []);
        accounts.push(masterAccount);
        return this.parseAccounts(accounts, params);
    }
    parseAccount(account) {
        //
        //     {
        //         "uuid": "a1234abc-1234-4321-q5r7-b1ab0a0b12b",
        //         "user_uuid": "a1234abc-1234-4321-q5r7-b1ab0a0b12b",
        //         "master_account_uuid": "a1234abc-1234-4321-q5r7-b1ab0a0b12b",
        //         "label": "FORMER_MASTER_MARGIN",
        //         "enabled": true,
        //         "tradable": true,
        //         "name": "YOUR_NAME",
        //         "country_code": "YOUR_COUNTRY_CODE",
        //         "incorp_country_code": "",
        //         "margin_access": "DEFAULT",
        //         "derivatives_access": "DEFAULT",
        //         "create_time": 1656481992000,
        //         "update_time": 1667272884594,
        //         "two_fa_enabled": false,
        //         "kyc_level": "ADVANCED",
        //         "suspended": false,
        //         "terminated": false,
        //         "spot_enabled": false,
        //         "margin_enabled": false,
        //         "derivatives_enabled": false,
        //         "system_label": "FORMER_MASTER_MARGIN"
        //     }
        //
        return {
            'id': this.safeString(account, 'uuid'),
            'type': this.safeString(account, 'label'),
            'code': undefined,
            'info': account,
        };
    }
    async fetchSettlementHistory(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name cryptocom#fetchSettlementHistory
         * @description fetches historical settlement records
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#public-get-expired-settlement-price
         * @param {string} symbol unified market symbol of the settlement history
         * @param {int} [since] timestamp in ms
         * @param {int} [limit] number of records
         * @param {object} [params] exchange specific params
         * @param {int} [params.type] 'future', 'option'
         * @returns {object[]} a list of [settlement history objects]{@link https://docs.ccxt.com/#/?id=settlement-history-structure}
         */
        await this.loadMarkets();
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market(symbol);
        }
        let type = undefined;
        [type, params] = this.handleMarketTypeAndParams('fetchSettlementHistory', market, params);
        this.checkRequiredArgument('fetchSettlementHistory', type, 'type', ['future', 'option', 'WARRANT', 'FUTURE']);
        if (type === 'option') {
            type = 'WARRANT';
        }
        const request = {
            'instrument_type': type.toUpperCase(),
        };
        const response = await this.v1PublicGetPublicGetExpiredSettlementPrice(this.extend(request, params));
        //
        //     {
        //         "id": -1,
        //         "method": "public/get-expired-settlement-price",
        //         "code": 0,
        //         "result": {
        //             "data": [
        //                 {
        //                     "i": "BTCUSD-230526",
        //                     "x": 1685088000000,
        //                     "v": "26464.1",
        //                     "t": 1685087999500
        //                 }
        //             ]
        //         }
        //     }
        //
        const result = this.safeValue(response, 'result', {});
        const data = this.safeValue(result, 'data', []);
        const settlements = this.parseSettlements(data, market);
        const sorted = this.sortBy(settlements, 'timestamp');
        return this.filterBySymbolSinceLimit(sorted, symbol, since, limit);
    }
    parseSettlement(settlement, market) {
        //
        //     {
        //         "i": "BTCUSD-230526",
        //         "x": 1685088000000,
        //         "v": "26464.1",
        //         "t": 1685087999500
        //     }
        //
        const timestamp = this.safeInteger(settlement, 'x');
        const marketId = this.safeString(settlement, 'i');
        return {
            'info': settlement,
            'symbol': this.safeSymbol(marketId, market),
            'price': this.safeNumber(settlement, 'v'),
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
        };
    }
    parseSettlements(settlements, market) {
        //
        //     [
        //         {
        //             "i": "BTCUSD-230526",
        //             "x": 1685088000000,
        //             "v": "26464.1",
        //             "t": 1685087999500
        //         }
        //     ]
        //
        const result = [];
        for (let i = 0; i < settlements.length; i++) {
            result.push(this.parseSettlement(settlements[i], market));
        }
        return result;
    }
    async fetchFundingRateHistory(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name cryptocom#fetchFundingRateHistory
         * @description fetches historical funding rates
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#public-get-valuations
         * @param {string} symbol unified symbol of the market to fetch the funding rate history for
         * @param {int} [since] timestamp in ms of the earliest funding rate to fetch
         * @param {int} [limit] the maximum amount of [funding rate structures] to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {int} [params.until] timestamp in ms for the ending date filter, default is the current time
         * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
         * @returns {object[]} a list of [funding rate structures]{@link https://docs.ccxt.com/#/?id=funding-rate-history-structure}
         */
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' fetchFundingRateHistory() requires a symbol argument');
        }
        await this.loadMarkets();
        let paginate = false;
        [paginate, params] = this.handleOptionAndParams(params, 'fetchFundingRateHistory', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDeterministic('fetchFundingRateHistory', symbol, since, limit, '8h', params);
        }
        const market = this.market(symbol);
        if (!market['swap']) {
            throw new errors.BadSymbol(this.id + ' fetchFundingRateHistory() supports swap contracts only');
        }
        const request = {
            'instrument_name': market['id'],
            'valuation_type': 'funding_hist',
        };
        if (since !== undefined) {
            request['start_ts'] = since;
        }
        if (limit !== undefined) {
            request['count'] = limit;
        }
        const until = this.safeInteger(params, 'until');
        params = this.omit(params, ['until']);
        if (until !== undefined) {
            request['end_ts'] = until;
        }
        const response = await this.v1PublicGetPublicGetValuations(this.extend(request, params));
        //
        //     {
        //         "id": -1,
        //         "method": "public/get-valuations",
        //         "code": 0,
        //         "result": {
        //             "data": [
        //                 {
        //                     "v": "-0.000001884",
        //                     "t": 1687892400000
        //                 },
        //             ],
        //             "instrument_name": "BTCUSD-PERP"
        //         }
        //     }
        //
        const result = this.safeValue(response, 'result', {});
        const data = this.safeValue(result, 'data', []);
        const marketId = this.safeString(result, 'instrument_name');
        const rates = [];
        for (let i = 0; i < data.length; i++) {
            const entry = data[i];
            const timestamp = this.safeInteger(entry, 't');
            rates.push({
                'info': entry,
                'symbol': this.safeSymbol(marketId, market),
                'fundingRate': this.safeNumber(entry, 'v'),
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
            });
        }
        const sorted = this.sortBy(rates, 'timestamp');
        return this.filterBySymbolSinceLimit(sorted, market['symbol'], since, limit);
    }
    async fetchPosition(symbol, params = {}) {
        /**
         * @method
         * @name cryptocom#fetchPosition
         * @description fetch data on a single open contract trade position
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-positions
         * @param {string} symbol unified market symbol of the market the position is held in
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [position structure]{@link https://docs.ccxt.com/#/?id=position-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'instrument_name': market['id'],
        };
        const response = await this.v1PrivatePostPrivateGetPositions(this.extend(request, params));
        //
        //     {
        //         "id": 1688015952050,
        //         "method": "private/get-positions",
        //         "code": 0,
        //         "result": {
        //             "data": [
        //                 {
        //                     "account_id": "ce075bef-b600-4277-bd6e-ff9007251e63",
        //                     "quantity": "0.0001",
        //                     "cost": "3.02392",
        //                     "open_pos_cost": "3.02392",
        //                     "open_position_pnl": "-0.0010281328",
        //                     "session_pnl": "-0.0010281328",
        //                     "update_timestamp_ms": 1688015919091,
        //                     "instrument_name": "BTCUSD-PERP",
        //                     "type": "PERPETUAL_SWAP"
        //                 }
        //             ]
        //         }
        //     }
        //
        const result = this.safeDict(response, 'result', {});
        const data = this.safeList(result, 'data', []);
        return this.parsePosition(this.safeDict(data, 0), market);
    }
    async fetchPositions(symbols = undefined, params = {}) {
        /**
         * @method
         * @name cryptocom#fetchPositions
         * @description fetch all open positions
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-get-positions
         * @param {string[]|undefined} symbols list of unified market symbols
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} a list of [position structure]{@link https://docs.ccxt.com/#/?id=position-structure}
         */
        await this.loadMarkets();
        symbols = this.marketSymbols(symbols);
        const request = {};
        let market = undefined;
        if (symbols !== undefined) {
            let symbol = undefined;
            if (Array.isArray(symbols)) {
                const symbolsLength = symbols.length;
                if (symbolsLength > 1) {
                    throw new errors.BadRequest(this.id + ' fetchPositions() symbols argument cannot contain more than 1 symbol');
                }
                symbol = symbols[0];
            }
            else {
                symbol = symbols;
            }
            market = this.market(symbol);
            request['instrument_name'] = market['id'];
        }
        const response = await this.v1PrivatePostPrivateGetPositions(this.extend(request, params));
        //
        //     {
        //         "id": 1688015952050,
        //         "method": "private/get-positions",
        //         "code": 0,
        //         "result": {
        //             "data": [
        //                 {
        //                     "account_id": "ce075bef-b600-4277-bd6e-ff9007251e63",
        //                     "quantity": "0.0001",
        //                     "cost": "3.02392",
        //                     "open_pos_cost": "3.02392",
        //                     "open_position_pnl": "-0.0010281328",
        //                     "session_pnl": "-0.0010281328",
        //                     "update_timestamp_ms": 1688015919091,
        //                     "instrument_name": "BTCUSD-PERP",
        //                     "type": "PERPETUAL_SWAP"
        //                 }
        //             ]
        //         }
        //     }
        //
        const responseResult = this.safeValue(response, 'result', {});
        const positions = this.safeValue(responseResult, 'data', []);
        const result = [];
        for (let i = 0; i < positions.length; i++) {
            const entry = positions[i];
            const marketId = this.safeString(entry, 'instrument_name');
            const marketInner = this.safeMarket(marketId, undefined, undefined, 'contract');
            result.push(this.parsePosition(entry, marketInner));
        }
        return this.filterByArrayPositions(result, 'symbol', undefined, false);
    }
    parsePosition(position, market = undefined) {
        //
        //     {
        //         "account_id": "ce075bef-b600-4277-bd6e-ff9007251e63",
        //         "quantity": "0.0001",
        //         "cost": "3.02392",
        //         "open_pos_cost": "3.02392",
        //         "open_position_pnl": "-0.0010281328",
        //         "session_pnl": "-0.0010281328",
        //         "update_timestamp_ms": 1688015919091,
        //         "instrument_name": "BTCUSD-PERP",
        //         "type": "PERPETUAL_SWAP"
        //     }
        //
        const marketId = this.safeString(position, 'instrument_name');
        market = this.safeMarket(marketId, market, undefined, 'contract');
        const symbol = this.safeSymbol(marketId, market, undefined, 'contract');
        const timestamp = this.safeInteger(position, 'update_timestamp_ms');
        const amount = this.safeString(position, 'quantity');
        return this.safePosition({
            'info': position,
            'id': undefined,
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'hedged': undefined,
            'side': Precise["default"].stringGt(amount, '0') ? 'buy' : 'sell',
            'contracts': Precise["default"].stringAbs(amount),
            'contractSize': market['contractSize'],
            'entryPrice': undefined,
            'markPrice': undefined,
            'notional': undefined,
            'leverage': undefined,
            'collateral': this.safeNumber(position, 'open_pos_cost'),
            'initialMargin': this.safeNumber(position, 'cost'),
            'maintenanceMargin': undefined,
            'initialMarginPercentage': undefined,
            'maintenanceMarginPercentage': undefined,
            'unrealizedPnl': this.safeNumber(position, 'open_position_pnl'),
            'liquidationPrice': undefined,
            'marginMode': undefined,
            'percentage': undefined,
            'marginRatio': undefined,
            'stopLossPrice': undefined,
            'takeProfitPrice': undefined,
        });
    }
    nonce() {
        return this.milliseconds();
    }
    paramsToString(object, level) {
        const maxLevel = 3;
        if (level >= maxLevel) {
            return object.toString();
        }
        if (typeof object === 'string') {
            return object;
        }
        let returnString = '';
        let paramsKeys = undefined;
        if (Array.isArray(object)) {
            paramsKeys = object;
        }
        else {
            const sorted = this.keysort(object);
            paramsKeys = Object.keys(sorted);
        }
        for (let i = 0; i < paramsKeys.length; i++) {
            const key = paramsKeys[i];
            returnString += key;
            const value = object[key];
            if (value === 'undefined') {
                returnString += 'null';
            }
            else if (Array.isArray(value)) {
                for (let j = 0; j < value.length; j++) {
                    returnString += this.paramsToString(value[j], level + 1);
                }
            }
            else {
                returnString += value.toString();
            }
        }
        return returnString;
    }
    async closePosition(symbol, side = undefined, params = {}) {
        /**
         * @method
         * @name cryptocom#closePositions
         * @description closes open positions for a market
         * @see https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-close-position
         * @param {string} symbol Unified CCXT market symbol
         * @param {string} [marginMode] not used by cryptocom.closePositions
         * @param {string} [side] not used by cryptocom.closePositions
         * @param {object} [params] extra parameters specific to the okx api endpoint
         *
         * EXCHANGE SPECIFIC PARAMETERS
         * @param {string} [params.type] LIMIT or MARKET
         * @param {number} [params.price] for limit orders only
         * @returns {object[]} [A list of position structures]{@link https://docs.ccxt.com/#/?id=position-structure}
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'instrument_name': market['id'],
            'type': 'MARKET',
        };
        const type = this.safeStringUpper(params, 'type');
        const price = this.safeString(params, 'price');
        if (type !== undefined) {
            request['type'] = type;
        }
        if (price !== undefined) {
            request['price'] = this.priceToPrecision(market['symbol'], price);
        }
        const response = await this.v1PrivatePostPrivateClosePosition(this.extend(request, params));
        //
        //    {
        //        "id" : 1700830813298,
        //        "method" : "private/close-position",
        //        "code" : 0,
        //        "result" : {
        //            "client_oid" : "179a909d-5614-655b-0d0e-9e85c9a25c85",
        //            "order_id" : "6142909897021751347"
        //        }
        //    }
        //
        const result = this.safeDict(response, 'result');
        return this.parseOrder(result, market);
    }
    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const type = this.safeString(api, 0);
        const access = this.safeString(api, 1);
        let url = this.urls['api'][type] + '/' + path;
        const query = this.omit(params, this.extractParams(path));
        if (access === 'public') {
            if (Object.keys(query).length) {
                url += '?' + this.urlencode(query);
            }
        }
        else {
            this.checkRequiredCredentials();
            const nonce = this.nonce().toString();
            const requestParams = this.extend({}, params);
            const paramsKeys = Object.keys(requestParams);
            const strSortKey = this.paramsToString(requestParams, 0);
            const payload = path + nonce + this.apiKey + strSortKey + nonce;
            const signature = this.hmac(this.encode(payload), this.encode(this.secret), sha256.sha256);
            const paramsKeysLength = paramsKeys.length;
            body = this.json({
                'id': nonce,
                'method': path,
                'params': params,
                'api_key': this.apiKey,
                'sig': signature,
                'nonce': nonce,
            });
            // fix issue https://github.com/ccxt/ccxt/issues/11179
            // php always encodes dictionaries as arrays
            // if an array is empty, php will put it in square brackets
            // python and js will put it in curly brackets
            // the code below checks and replaces those brackets in empty requests
            if (paramsKeysLength === 0) {
                const paramsString = '{}';
                const arrayString = '[]';
                body = body.replace(arrayString, paramsString);
            }
            headers = {
                'Content-Type': 'application/json',
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
    handleErrors(code, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        const errorCode = this.safeString(response, 'code');
        if (errorCode !== '0') {
            const feedback = this.id + ' ' + body;
            this.throwExactlyMatchedException(this.exceptions['exact'], errorCode, feedback);
            throw new errors.ExchangeError(this.id + ' ' + body);
        }
        return undefined;
    }
}

module.exports = cryptocom;
