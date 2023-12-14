<?php

namespace ccxt\pro;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

use Exception; // a common import
use ccxt\ExchangeError;
use React\Async;
use React\Promise\PromiseInterface;

class bitopro extends \ccxt\async\bitopro {

    public function describe() {
        return $this->deep_extend(parent::describe(), array(
            'has' => array(
                'ws' => true,
                'watchBalance' => true,
                'watchMyTrades' => false,
                'watchOHLCV' => false,
                'watchOrderBook' => true,
                'watchOrders' => false,
                'watchTicker' => true,
                'watchTickers' => false,
                'watchTrades' => true,
            ),
            'urls' => array(
                'ws' => array(
                    'public' => 'wss://stream.bitopro.com:9443/ws/v1/pub',
                    'private' => 'wss://stream.bitopro.com:9443/ws/v1/pub/auth',
                ),
            ),
            'requiredCredentials' => array(
                'apiKey' => true,
                'secret' => true,
                'login' => true,
            ),
            'options' => array(
                'tradesLimit' => 1000,
                'ordersLimit' => 1000,
                'ws' => array(
                    'options' => array(
                        // headers is required for the authentication
                        'headers' => array(),
                    ),
                ),
            ),
        ));
    }

    public function watch_public($path, $messageHash, $marketId) {
        return Async\async(function () use ($path, $messageHash, $marketId) {
            $url = $this->urls['ws']['public'] . '/' . $path . '/' . $marketId;
            return Async\await($this->watch($url, $messageHash, null, $messageHash));
        }) ();
    }

    public function watch_order_book(string $symbol, ?int $limit = null, $params = array ()): PromiseInterface {
        return Async\async(function () use ($symbol, $limit, $params) {
            /**
             * watches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
             * @param {string} $symbol unified $symbol of the $market to fetch the order book for
             * @param {int} [$limit] the maximum amount of order book entries to return
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {array} A dictionary of ~@link https://docs.ccxt.com/#/?id=order-book-structure order book structures~ indexed by $market symbols
             */
            if ($limit !== null) {
                if (($limit !== 5) && ($limit !== 10) && ($limit !== 20) && ($limit !== 50) && ($limit !== 100) && ($limit !== 500) && ($limit !== 1000)) {
                    throw new ExchangeError($this->id . ' watchOrderBook $limit argument must be null, 5, 10, 20, 50, 100, 500 or 1000');
                }
            }
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            $symbol = $market['symbol'];
            $messageHash = 'ORDER_BOOK' . ':' . $symbol;
            $endPart = null;
            if ($limit === null) {
                $endPart = $market['id'];
            } else {
                $endPart = $market['id'] . ':' . $limit;
            }
            $orderbook = Async\await($this->watch_public('order-books', $messageHash, $endPart));
            return $orderbook->limit ();
        }) ();
    }

    public function handle_order_book(Client $client, $message) {
        //
        //     {
        //         "event" => "ORDER_BOOK",
        //         "timestamp" => 1650121915308,
        //         "datetime" => "2022-04-16T15:11:55.308Z",
        //         "pair" => "BTC_TWD",
        //         "limit" => 5,
        //         "scale" => 0,
        //         "bids" => array(
        //             array( price => "1188178", amount => '0.0425', count => 1, total => "0.0425" ),
        //         ),
        //         "asks" => array(
        //             array(
        //                 "price" => "1190740",
        //                 "amount" => "0.40943964",
        //                 "count" => 1,
        //                 "total" => "0.40943964"
        //             ),
        //         )
        //     }
        //
        $marketId = $this->safe_string($message, 'pair');
        $market = $this->safe_market($marketId, null, '_');
        $symbol = $market['symbol'];
        $event = $this->safe_string($message, 'event');
        $messageHash = $event . ':' . $symbol;
        $orderbook = $this->safe_value($this->orderbooks, $symbol);
        if ($orderbook === null) {
            $orderbook = $this->order_book(array());
        }
        $timestamp = $this->safe_integer($message, 'timestamp');
        $snapshot = $this->parse_order_book($message, $symbol, $timestamp, 'bids', 'asks', 'price', 'amount');
        $orderbook->reset ($snapshot);
        $client->resolve ($orderbook, $messageHash);
    }

    public function watch_trades(string $symbol, ?int $since = null, ?int $limit = null, $params = array ()): PromiseInterface {
        return Async\async(function () use ($symbol, $since, $limit, $params) {
            /**
             * get the list of most recent $trades for a particular $symbol
             * @param {string} $symbol unified $symbol of the $market to fetch $trades for
             * @param {int} [$since] timestamp in ms of the earliest trade to fetch
             * @param {int} [$limit] the maximum amount of $trades to fetch
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {array[]} a list of ~@link https://docs.ccxt.com/#/?id=public-$trades trade structures~
             */
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            $symbol = $market['symbol'];
            $messageHash = 'TRADE' . ':' . $symbol;
            $trades = Async\await($this->watch_public('trades', $messageHash, $market['id']));
            if ($this->newUpdates) {
                $limit = $trades->getLimit ($symbol, $limit);
            }
            return $this->filter_by_since_limit($trades, $since, $limit, 'timestamp', true);
        }) ();
    }

    public function handle_trade(Client $client, $message) {
        //
        //     {
        //         "event" => "TRADE",
        //         "timestamp" => 1650116346665,
        //         "datetime" => "2022-04-16T13:39:06.665Z",
        //         "pair" => "BTC_TWD",
        //         "data" => array(
        //             array(
        //                 "event" => '',
        //                 "datetime" => '',
        //                 "pair" => '',
        //                 "timestamp" => 1650116227,
        //                 "price" => "1189429",
        //                 "amount" => "0.0153127",
        //                 "isBuyer" => true
        //             ),
        //         )
        //     }
        //
        $marketId = $this->safe_string($message, 'pair');
        $market = $this->safe_market($marketId, null, '_');
        $symbol = $market['symbol'];
        $event = $this->safe_string($message, 'event');
        $messageHash = $event . ':' . $symbol;
        $rawData = $this->safe_value($message, 'data', array());
        $trades = $this->parse_trades($rawData, $market);
        $tradesCache = $this->safe_value($this->trades, $symbol);
        if ($tradesCache === null) {
            $limit = $this->safe_integer($this->options, 'tradesLimit', 1000);
            $tradesCache = new ArrayCache ($limit);
        }
        for ($i = 0; $i < count($trades); $i++) {
            $tradesCache->append ($trades[$i]);
        }
        $this->trades[$symbol] = $tradesCache;
        $client->resolve ($tradesCache, $messageHash);
    }

    public function watch_ticker(string $symbol, $params = array ()): PromiseInterface {
        return Async\async(function () use ($symbol, $params) {
            /**
             * watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific $market
             * @param {string} $symbol unified $symbol of the $market to fetch the ticker for
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {array} a ~@link https://docs.ccxt.com/#/?id=ticker-structure ticker structure~
             */
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            $symbol = $market['symbol'];
            $messageHash = 'TICKER' . ':' . $symbol;
            return Async\await($this->watch_public('tickers', $messageHash, $market['id']));
        }) ();
    }

    public function handle_ticker(Client $client, $message) {
        //
        //     {
        //         "event" => "TICKER",
        //         "timestamp" => 1650119165710,
        //         "datetime" => "2022-04-16T14:26:05.710Z",
        //         "pair" => "BTC_TWD",
        //         "lastPrice" => "1189110",
        //         "lastPriceUSD" => "40919.1328",
        //         "lastPriceTWD" => "1189110",
        //         "isBuyer" => true,
        //         "priceChange24hr" => "1.23",
        //         "volume24hr" => "7.2090",
        //         "volume24hrUSD" => "294985.5375",
        //         "volume24hrTWD" => "8572279",
        //         "high24hr" => "1193656",
        //         "low24hr" => "1179321"
        //     }
        //
        $marketId = $this->safe_string($message, 'pair');
        $market = $this->safe_market($marketId, null, '_');
        $symbol = $market['symbol'];
        $event = $this->safe_string($message, 'event');
        $messageHash = $event . ':' . $symbol;
        $result = $this->parse_ticker($message);
        $timestamp = $this->safe_integer($message, 'timestamp');
        $datetime = $this->safe_string($message, 'datetime');
        $result['timestamp'] = $timestamp;
        $result['datetime'] = $datetime;
        $this->tickers[$symbol] = $result;
        $client->resolve ($result, $messageHash);
    }

    public function authenticate($url) {
        if (($this->clients !== null) && (is_array($this->clients) && array_key_exists($url, $this->clients))) {
            return;
        }
        $this->check_required_credentials();
        $nonce = $this->milliseconds();
        $rawData = $this->json(array(
            'nonce' => $nonce,
            'identity' => $this->login,
        ));
        $payload = base64_encode($rawData);
        $signature = $this->hmac($payload, $this->encode($this->secret), 'sha384');
        $defaultOptions = array(
            'ws' => array(
                'options' => array(
                    'headers' => array(),
                ),
            ),
        );
        $this->options = array_merge($defaultOptions, $this->options);
        $originalHeaders = $this->options['ws']['options']['headers'];
        $headers = array(
            'X-BITOPRO-API' => 'ccxt',
            'X-BITOPRO-APIKEY' => $this->apiKey,
            'X-BITOPRO-PAYLOAD' => $payload,
            'X-BITOPRO-SIGNATURE' => $signature,
        );
        $this->options['ws']['options']['headers'] = $headers;
        // instantiate client
        $this->client($url);
        $this->options['ws']['options']['headers'] = $originalHeaders;
    }

    public function watch_balance($params = array ()): PromiseInterface {
        return Async\async(function () use ($params) {
            /**
             * watch balance and get the amount of funds available for trading or funds locked in orders
             * @param {array} [$params] extra parameters specific to the exchange API endpoint
             * @return {array} a ~@link https://docs.ccxt.com/#/?id=balance-structure balance structure~
             */
            $this->check_required_credentials();
            Async\await($this->load_markets());
            $messageHash = 'ACCOUNT_BALANCE';
            $url = $this->urls['ws']['private'] . '/' . 'account-balance';
            $this->authenticate($url);
            return Async\await($this->watch($url, $messageHash, null, $messageHash));
        }) ();
    }

    public function handle_balance(Client $client, $message) {
        //
        //     {
        //         "event" => "ACCOUNT_BALANCE",
        //         "timestamp" => 1650450505715,
        //         "datetime" => "2022-04-20T10:28:25.715Z",
        //         "data" => {
        //           "ADA" => array(
        //             "currency" => "ADA",
        //             "amount" => "0",
        //             "available" => "0",
        //             "stake" => "0",
        //             "tradable" => true
        //           ),
        //         }
        //     }
        //
        $event = $this->safe_string($message, 'event');
        $data = $this->safe_value($message, 'data');
        $timestamp = $this->safe_integer($message, 'timestamp');
        $datetime = $this->safe_string($message, 'datetime');
        $currencies = is_array($data) ? array_keys($data) : array();
        $result = array(
            'info' => $data,
            'timestamp' => $timestamp,
            'datetime' => $datetime,
        );
        for ($i = 0; $i < count($currencies); $i++) {
            $currency = $this->safe_string($currencies, $i);
            $balance = $this->safe_value($data, $currency);
            $currencyId = $this->safe_string($balance, 'currency');
            $code = $this->safe_currency_code($currencyId);
            $account = $this->account();
            $account['free'] = $this->safe_string($balance, 'available');
            $account['total'] = $this->safe_string($balance, 'amount');
            $result[$code] = $account;
        }
        $this->balance = $this->safe_balance($result);
        $client->resolve ($this->balance, $event);
    }

    public function handle_message(Client $client, $message) {
        $methods = array(
            'TRADE' => array($this, 'handle_trade'),
            'TICKER' => array($this, 'handle_ticker'),
            'ORDER_BOOK' => array($this, 'handle_order_book'),
            'ACCOUNT_BALANCE' => array($this, 'handle_balance'),
        );
        $event = $this->safe_string($message, 'event');
        $method = $this->safe_value($methods, $event);
        if ($method === null) {
            return $message;
        } else {
            return $method($client, $message);
        }
    }
}
