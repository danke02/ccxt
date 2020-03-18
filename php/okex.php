<?php

namespace ccxtpro;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

use Exception; // a common import
use \ccxt\AuthenticationError;
use \ccxt\ArgumentsRequired;

class okex extends \ccxt\okex {

    use ClientTrait;

    public function describe () {
        return array_replace_recursive(parent::describe (), array(
            'has' => array(
                'ws' => true,
                'watchTicker' => true,
                'watchTickers' => false, // for now
                'watchOrderBook' => true,
                'watchTrades' => true,
                'watchBalance' => true,
                'watchOHLCV' => true,
            ),
            'urls' => array(
                'api' => array(
                    'ws' => 'wss://real.okex.com:8443/ws/v3',
                ),
            ),
            'options' => array(
                'watchOrderBook' => array(
                    'limit' => 400, // max
                    'type' => 'spot', // margin
                ),
                'watchBalance' => 'spot', // margin, futures, swap
                'ws' => array(
                    'inflate' => true,
                ),
            ),
            'streaming' => array(
                // okex does not support built-in ws protocol-level ping-pong
                // instead it requires a custom text-based ping-pong
                'ping' => array($this, 'ping'),
                'keepAlive' => 20000,
            ),
        ));
    }

    public function subscribe ($channel, $symbol, $params = array ()) {
        $this->load_markets();
        $market = $this->market ($symbol);
        $url = $this->urls['api']['ws'];
        $messageHash = $market['type'] . '/' . $channel . ':' . $market['id'];
        $request = array(
            'op' => 'subscribe',
            'args' => array( $messageHash ),
        );
        return $this->watch ($url, $messageHash, array_replace_recursive($request, $params), $messageHash);
    }

    public function watch_trades ($symbol, $since = null, $limit = null, $params = array ()) {
        $future = $this->subscribe ('trade', $symbol, $params);
        return $this->after ($future, array($this, 'filter_array_by_since_limit'), $since, $limit, 'timestamp', true);
    }

    public function filter_array_by_since_limit ($array, $since = null, $limit = null, $key = 'timestamp', $tail = false) {
        return $this->filter_by_since_limit($array, $since, $limit, $key, $tail);
    }

    public function watch_ticker ($symbol, $params = array ()) {
        return $this->subscribe ('ticker', $symbol, $params);
    }

    public function handle_trade ($client, $message) {
        //
        //     {
        //         $table => 'spot/trade',
        //         $data => array(
        //             {
        //                 side => 'buy',
        //                 trade_id => '30770973',
        //                 price => '4665.4',
        //                 size => '0.019',
        //                 instrument_id => 'BTC-USDT',
        //                 timestamp => '2020-03-16T13:41:46.526Z'
        //             }
        //         )
        //     }
        //
        $table = $this->safe_string($message, 'table');
        $data = $this->safe_value($message, 'data', array());
        $tradesLimit = $this->safe_integer($this->options, 'tradesLimit', 1000);
        for ($i = 0; $i < count($data); $i++) {
            $trade = $this->parse_trade($data[$i]);
            $symbol = $trade['symbol'];
            $marketId = $this->safe_string($trade['info'], 'instrument_id');
            $messageHash = $table . ':' . $marketId;
            $stored = $this->safe_value($this->trades, $symbol, array());
            $stored[] = $trade;
            $length = is_array($stored) ? count($stored) : 0;
            if ($length > $tradesLimit) {
                array_shift($stored);
            }
            $this->trades[$symbol] = $stored;
            $client->resolve ($stored, $messageHash);
        }
        return $message;
    }

    public function handle_ticker ($client, $message) {
        //
        //     {
        //         $table => 'spot/ticker',
        //         $data => array(
        //             {
        //                 last => '4634.1',
        //                 open_24h => '5305.6',
        //                 best_bid => '4631.6',
        //                 high_24h => '5950',
        //                 low_24h => '4448.8',
        //                 base_volume_24h => '147913.11435388',
        //                 quote_volume_24h => '756850119.99108082',
        //                 best_ask => '4631.7',
        //                 instrument_id => 'BTC-USDT',
        //                 timestamp => '2020-03-16T13:16:25.677Z',
        //                 best_bid_size => '0.12348942',
        //                 best_ask_size => '0.00100014',
        //                 last_qty => '0.00331822'
        //             }
        //         )
        //     }
        //
        $table = $this->safe_string($message, 'table');
        $data = $this->safe_value($message, 'data', array());
        for ($i = 0; $i < count($data); $i++) {
            $ticker = $this->parse_ticker($data[$i]);
            $symbol = $ticker['symbol'];
            $marketId = $this->safe_string($ticker['info'], 'instrument_id');
            $messageHash = $table . ':' . $marketId;
            $this->tickers[$symbol] = $ticker;
            $client->resolve ($ticker, $messageHash);
        }
        return $message;
    }

    public function watch_ohlcv ($symbol, $timeframe = '1m', $since = null, $limit = null, $params = array ()) {
        $interval = $this->timeframes[$timeframe];
        $name = 'candle' . $interval . 's';
        $future = $this->subscribe ($name, $symbol, $params);
        return $this->after ($future, array($this, 'filter_array_by_since_limit'), $since, $limit, 0, true);
    }

    public function find_timeframe ($timeframe) {
        // redo to use reverse lookups in a static map instead
        $keys = is_array($this->timeframes) ? array_keys($this->timeframes) : array();
        for ($i = 0; $i < count($keys); $i++) {
            $key = $keys[$i];
            if ($this->timeframes[$key] === $timeframe) {
                return $key;
            }
        }
        return null;
    }

    public function handle_ohlcv ($client, $message) {
        //
        //     {
        //         $table => "spot/candle60s",
        //         $data => array(
        //             {
        //                 $candle => array(
        //                     "2020-03-16T14:29:00.000Z",
        //                     "4948.3",
        //                     "4966.7",
        //                     "4939.1",
        //                     "4945.3",
        //                     "238.36021657"
        //                 ),
        //                 instrument_id => "BTC-USDT"
        //             }
        //         )
        //     }
        //
        $table = $this->safe_string($message, 'table');
        $data = $this->safe_value($message, 'data', array());
        $parts = explode('/', $table);
        $part1 = $this->safe_string($parts, 1);
        $interval = str_replace('candle', '', $part1);
        $interval = str_replace('s', '', $interval);
        // use a reverse lookup in a static map instead
        $timeframe = $this->find_timeframe ($interval);
        for ($i = 0; $i < count($data); $i++) {
            $marketId = $this->safe_string($data[$i], 'instrument_id');
            if (is_array($this->markets_by_id) && array_key_exists($marketId, $this->markets_by_id)) {
                $candle = $this->safe_value($data[$i], 'candle');
                $market = $this->markets_by_id[$marketId];
                $symbol = $market['symbol'];
                $parsed = $this->parse_ohlcv($candle, $market, $timeframe);
                $this->ohlcvs[$symbol] = $this->safe_value($this->ohlcvs, $symbol, array());
                $stored = $this->safe_value($this->ohlcvs[$symbol], $timeframe, array());
                $length = is_array($stored) ? count($stored) : 0;
                if ($length && $parsed[0] === $stored[$length - 1][0]) {
                    $stored[$length - 1] = $parsed;
                } else {
                    $stored[] = $parsed;
                    $limit = $this->safe_integer($this->options, 'OHLCVLimit', 1000);
                    if ($length >= $limit) {
                        array_shift($stored);
                    }
                }
                $this->ohlcvs[$symbol][$timeframe] = $stored;
                $messageHash = $table . ':' . $marketId;
                $client->resolve ($stored, $messageHash);
            }
        }
    }

    public function watch_order_book ($symbol, $limit = null, $params = array ()) {
        $future = $this->subscribe ('depth', $symbol, $params);
        return $this->after ($future, array($this, 'limit_order_book'), $symbol, $limit, $params);
    }

    public function limit_order_book ($orderbook, $symbol, $limit = null, $params = array ()) {
        return $orderbook->limit ($limit);
    }

    public function handle_delta ($bookside, $delta) {
        $price = $this->safe_float($delta, 0);
        $amount = $this->safe_float($delta, 1);
        $bookside->store ($price, $amount);
    }

    public function handle_deltas ($bookside, $deltas) {
        for ($i = 0; $i < count($deltas); $i++) {
            $this->handle_delta ($bookside, $deltas[$i]);
        }
    }

    public function handle_order_book_message ($client, $message, $orderbook) {
        //
        //     {
        //         instrument_id => "BTC-USDT",
        //         $asks => [
        //             ["4568.5", "0.49723138", "2"],
        //             ["4568.7", "0.5013", "1"],
        //             ["4569.1", "0.4398", "1"],
        //         ],
        //         $bids => [
        //             ["4568.4", "0.84187666", "5"],
        //             ["4568.3", "0.75661506", "6"],
        //             ["4567.8", "2.01", "2"],
        //         ],
        //         $timestamp => "2020-03-16T11:11:43.388Z",
        //         checksum => 473370408
        //     }
        //
        $asks = $this->safe_value($message, 'asks', array());
        $bids = $this->safe_value($message, 'bids', array());
        $this->handle_deltas ($orderbook['asks'], $asks);
        $this->handle_deltas ($orderbook['bids'], $bids);
        $timestamp = $this->parse8601 ($this->safe_string($message, 'timestamp'));
        $orderbook['timestamp'] = $timestamp;
        $orderbook['datetime'] = $this->iso8601 ($timestamp);
        return $orderbook;
    }

    public function handle_order_book ($client, $message) {
        //
        // first $message (snapshot)
        //
        //     {
        //         $table => "spot/depth",
        //         $action => "partial",
        //         $data => [
        //             {
        //                 instrument_id => "BTC-USDT",
        //                 asks => [
        //                     ["4568.5", "0.49723138", "2"],
        //                     ["4568.7", "0.5013", "1"],
        //                     ["4569.1", "0.4398", "1"],
        //                 ],
        //                 bids => [
        //                     ["4568.4", "0.84187666", "5"],
        //                     ["4568.3", "0.75661506", "6"],
        //                     ["4567.8", "2.01", "2"],
        //                 ],
        //                 timestamp => "2020-03-16T11:11:43.388Z",
        //                 checksum => 473370408
        //             }
        //         ]
        //     }
        //
        // subsequent updates
        //
        //     {
        //         $table => "spot/depth",
        //         $action => "$update",
        //         $data => [
        //             {
        //                 instrument_id =>   "BTC-USDT",
        //                 asks => [
        //                     ["4598.8", "0", "0"],
        //                     ["4599.1", "0", "0"],
        //                     ["4600.3", "0", "0"],
        //                 ],
        //                 bids => [
        //                     ["4598.5", "0.08", "1"],
        //                     ["4598.2", "0.0337323", "1"],
        //                     ["4598.1", "0.12681801", "3"],
        //                 ],
        //                 timestamp => "2020-03-16T11:20:35.139Z",
        //                 checksum => 740786981
        //             }
        //         ]
        //     }
        //
        $action = $this->safe_string($message, 'action');
        $data = $this->safe_value($message, 'data', array());
        $table = $this->safe_string($message, 'table');
        if ($action === 'partial') {
            for ($i = 0; $i < count($data); $i++) {
                $update = $data[$i];
                $marketId = $this->safe_string($update, 'instrument_id');
                if (is_array($this->markets_by_id) && array_key_exists($marketId, $this->markets_by_id)) {
                    $market = $this->markets_by_id[$marketId];
                    $symbol = $market['symbol'];
                    $options = $this->safe_value($this->options, 'watchOrderBook', array());
                    // default $limit is 400 bidasks
                    $limit = $this->safe_integer($options, 'limit', 400);
                    $orderbook = $this->order_book (array(), $limit);
                    $this->orderbooks[$symbol] = $orderbook;
                    $this->handle_order_book_message ($client, $update, $orderbook);
                    $messageHash = $table . ':' . $marketId;
                    $client->resolve ($orderbook, $messageHash);
                }
            }
        } else {
            for ($i = 0; $i < count($data); $i++) {
                $update = $data[$i];
                $marketId = $this->safe_string($update, 'instrument_id');
                if (is_array($this->markets_by_id) && array_key_exists($marketId, $this->markets_by_id)) {
                    $market = $this->markets_by_id[$marketId];
                    $symbol = $market['symbol'];
                    if (is_array($this->orderbooks) && array_key_exists($symbol, $this->orderbooks)) {
                        $orderbook = $this->orderbooks[$symbol];
                        $this->handle_order_book_message ($client, $update, $orderbook);
                        $messageHash = $table . ':' . $marketId;
                        $client->resolve ($orderbook, $messageHash);
                    }
                }
            }
        }
        return $message;
    }

    public function authenticate ($params = array ()) {
        $this->check_required_credentials();
        $url = $this->urls['api']['ws'];
        $messageHash = 'login';
        $client = $this->client ($url);
        $future = $this->safe_value($client->subscriptions, $messageHash);
        if ($future === null) {
            $future = $client->future ('authenticated');
            $timestamp = (string) $this->seconds ();
            $method = 'GET';
            $path = '/users/self/verify';
            $auth = $timestamp . $method . $path;
            $signature = $this->hmac ($this->encode ($auth), $this->encode ($this->secret), 'sha256', 'base64');
            $request = array(
                'op' => $messageHash,
                'args' => array(
                    $this->apiKey,
                    $this->password,
                    $timestamp,
                    $this->decode ($signature),
                ),
            );
            $this->spawn (array($this, 'watch'), $url, $messageHash, $request, $messageHash, $future);
        }
        return $future;
    }

    public function watch_balance ($params = array ()) {
        $defaultType = $this->safe_string_2($this->options, 'watchBalance', 'defaultType');
        $type = $this->safe_string($params, 'type', $defaultType);
        if ($type === null) {
            throw new ArgumentsRequired($this->id . " watchBalance requires a $type parameter (one of 'spot', 'margin', 'futures', 'swap')");
        }
        // $query = $this->omit ($params, 'type');
        $future = $this->authenticate ();
        return $this->after_async ($future, array($this, 'subscribe_to_user_account'), $params);
    }

    public function subscribe_to_user_account ($negotiation, $params = array ()) {
        $defaultType = $this->safe_string_2($this->options, 'watchBalance', 'defaultType');
        $type = $this->safe_string($params, 'type', $defaultType);
        if ($type === null) {
            throw new ArgumentsRequired($this->id . " watchBalance requires a $type parameter (one of 'spot', 'margin', 'futures', 'swap')");
        }
        $this->load_markets();
        $currencyId = $this->safe_string($params, 'currency');
        $code = $this->safe_string($params, 'code', $this->safe_currency_code($currencyId));
        $currency = null;
        if ($code !== null) {
            $currency = $this->currency ($code);
        }
        $marketId = $this->safe_string($params, 'instrument_id');
        $symbol = $this->safe_string($params, 'symbol');
        $market = null;
        if ($symbol !== null) {
            $market = $this->market ($symbol);
        } else if ($marketId !== null) {
            if (is_array($this->markets_by_id) && array_key_exists($marketId, $this->markets_by_id)) {
                $market = $this->markets_by_id[$marketId];
            }
        }
        $marketUndefined = ($market === null);
        $currencyUndefined = ($currency === null);
        if ($type === 'spot') {
            if ($currencyUndefined) {
                throw new ArgumentsRequired($this->id . " watchBalance requires a 'currency' (id) or a unified 'code' parameter for " . $type . ' accounts');
            }
        } else if (($type === 'margin') || ($type === 'swap') || ($type === 'option')) {
            if ($marketUndefined) {
                throw new ArgumentsRequired($this->id . " watchBalance requires a 'instrument_id' (id) or a unified 'symbol' parameter for " . $type . ' accounts');
            }
        } else if ($type === 'futures') {
            if ($currencyUndefined && $marketUndefined) {
                throw new ArgumentsRequired($this->id . " watchBalance requires a 'currency' (id), or unified 'code', or 'instrument_id' (id), or unified 'symbol' parameter for " . $type . ' accounts');
            }
        }
        $suffix = null;
        if (!$currencyUndefined) {
            $suffix = $currency['id'];
        } else if (!$marketUndefined) {
            $suffix = $market['id'];
        }
        $accountType = ($type === 'margin') ? 'spot' : $type;
        $account = ($type === 'margin') ? 'margin_account' : 'account';
        $messageHash = $accountType . '/' . $account;
        $subscriptionHash = $messageHash . ':' . $suffix;
        $url = $this->urls['api']['ws'];
        $request = array(
            'op' => 'subscribe',
            'args' => array( $subscriptionHash ),
        );
        $query = $this->omit ($params, array( 'currency', 'code', 'instrument_id', 'symbol', 'type' ));
        return $this->watch ($url, $messageHash, array_replace_recursive($request, $query), $subscriptionHash);
    }

    public function handle_balance ($client, $message) {
        //
        // spot
        //
        //     {
        //         $table => 'spot/account',
        //         $data => array(
        //             {
        //                 available => '11.044827320825',
        //                 currency => 'USDT',
        //                 id => '',
        //                 $balance => '11.044827320825',
        //                 hold => '0'
        //             }
        //         )
        //     }
        //
        // margin
        //
        //     {
        //         $table => "spot/margin_account",
        //         $data => array(
        //             {
        //                 maint_margin_ratio => "0.08",
        //                 liquidation_price => "0",
        //                 'currency:USDT' => array( available => "0", $balance => "0", borrowed => "0", hold => "0", lending_fee => "0" ),
        //                 tiers => "1",
        //                 instrument_id =>   "ETH-USDT",
        //                 'currency:ETH' => array( available => "0", $balance => "0", borrowed => "0", hold => "0", lending_fee => "0" )
        //             }
        //         )
        //     }
        //
        $table = $this->safe_string($message, 'table');
        $parts = explode('/', $table);
        $type = $this->safe_string($parts, 0);
        if ($type === 'spot') {
            $part1 = $this->safe_string($parts, 1);
            if ($part1 === 'margin_account') {
                $type = 'margin';
            }
        }
        $data = $this->safe_value($message, 'data', array());
        for ($i = 0; $i < count($data); $i++) {
            $balance = $this->parseBalanceByType ($type, $data);
            $oldBalance = $this->safe_value($this->balance, $type, array());
            $newBalance = array_replace_recursive($oldBalance, $balance);
            $this->balance[$type] = $this->parse_balance($newBalance);
            $client->resolve ($this->balance[$type], $table);
        }
    }

    public function handle_subscription_status ($client, $message) {
        //
        //     array("event":"subscribe","$channel":"spot/depth:BTC-USDT")
        //
        // $channel = $this->safe_string($message, 'channel');
        // $client->subscriptions[$channel] = $message;
        return $message;
    }

    public function handle_authenticate ($client, $message) {
        //
        //     array( event => 'login', success => true )
        //
        $client->resolve ($message, 'authenticated');
        return $message;
    }

    public function sign_message ($client, $messageHash, $message, $params = array ()) {
        // okex uses login requests instead of $message signing
        return $message;
    }

    public function ping ($client) {
        // okex does not support built-in ws protocol-level ping-pong
        // instead it requires custom text-based ping-pong
        return 'ping';
    }

    public function handle_pong ($client, $message) {
        $client->lastPong = $this->milliseconds ();
        return $message;
    }

    public function handle_error_message ($client, $message) {
        //
        //     array( event => 'error', $message => 'Invalid sign', $errorCode => 30013 )
        //     array("event":"error","$message":"Unrecognized request => array(\"event\":\"subscribe\",\"channel\":\"spot/depth:BTC-USDT\")","$errorCode":30039)
        //
        $errorCode = $this->safe_string($message, 'errorCode');
        try {
            if ($errorCode !== null) {
                $feedback = $this->id . ' ' . $this->json ($message);
                $this->throw_exactly_matched_exception($this->exceptions['exact'], $errorCode, $feedback);
                $messageString = $this->safe_value($message, 'message');
                if ($messageString !== null) {
                    $this->throw_broadly_matched_exception($this->exceptions['broad'], $messageString, $feedback);
                }
            }
        } catch (Exception $e) {
            if ($e instanceof AuthenticationError) {
                $client->reject ($e, 'authenticated');
                $method = 'login';
                if (is_array($client->subscriptions) && array_key_exists($method, $client->subscriptions)) {
                    unset($client->subscriptions[$method]);
                }
                return false;
            }
        }
        return $message;
    }

    public function handle_message ($client, $message) {
        if (!$this->handle_error_message ($client, $message)) {
            return;
        }
        //
        //     array("$event":"error","$message":"Unrecognized request => array(\"$event\":\"subscribe\",\"channel\":\"spot/depth:BTC-USDT\")","errorCode":30039)
        //     array("$event":"subscribe","channel":"spot/depth:BTC-USDT")
        //     {
        //         $table => "spot/depth",
        //         action => "partial",
        //         data => [
        //             {
        //                 instrument_id =>   "BTC-USDT",
        //                 asks => [
        //                     ["5301.8", "0.03763319", "1"],
        //                     ["5302.4", "0.00305", "2"],
        //                 ],
        //                 bids => [
        //                     ["5301.7", "0.58911427", "6"],
        //                     ["5301.6", "0.01222922", "4"],
        //                 ],
        //                 timestamp => "2020-03-16T03:25:00.440Z",
        //                 checksum => -2088736623
        //             }
        //         ]
        //     }
        //
        if ($message === 'pong') {
            return $this->handle_pong ($client, $message);
        }
        $table = $this->safe_string($message, 'table');
        if ($table === null) {
            $event = $this->safe_string($message, 'event');
            if ($event !== null) {
                $methods = array(
                    // 'info' => $this->handleSystemStatus,
                    // 'book' => 'handleOrderBook',
                    'login' => array($this, 'handle_authenticate'),
                    'subscribe' => array($this, 'handle_subscription_status'),
                );
                $method = $this->safe_value($methods, $event);
                if ($method === null) {
                    return $message;
                } else {
                    return $method($client, $message);
                }
            }
        } else {
            $parts = explode('/', $table);
            $name = $this->safe_string($parts, 1);
            $methods = array(
                'depth' => array($this, 'handle_order_book'),
                'ticker' => array($this, 'handle_ticker'),
                'trade' => array($this, 'handle_trade'),
                'account' => array($this, 'handle_balance'),
                'margin_account' => array($this, 'handle_balance'),
                // ...
            );
            $method = $this->safe_value($methods, $name);
            if (mb_strpos($name, 'candle') !== false) {
                $method = array($this, 'handle_ohlcv');
            }
            if ($method === null) {
                return $message;
            } else {
                return $method($client, $message);
            }
        }
    }
}
