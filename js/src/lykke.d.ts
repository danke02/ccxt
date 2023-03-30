import Exchange from './abstract/lykke.js';
export default class lykke extends Exchange {
    describe(): any;
    fetchCurrencies(params?: {}): Promise<{}>;
    fetchMarkets(params?: {}): Promise<any[]>;
    parseTicker(ticker: any, market?: any): import("./base/types.js").Ticker;
    fetchTicker(symbol: any, params?: {}): Promise<import("./base/types.js").Ticker>;
    fetchTickers(symbols?: any, params?: {}): Promise<any>;
    fetchOrderBook(symbol: any, limit?: any, params?: {}): Promise<import("./base/types.js").OrderBook>;
    parseTrade(trade: any, market?: any): import("./base/types.js").Trade;
    fetchTrades(symbol: any, since?: any, limit?: any, params?: {}): Promise<import("./base/types.js").Trade[]>;
    parseBalance(response: any): import("./base/types.js").Balances;
    fetchBalance(params?: {}): Promise<import("./base/types.js").Balances>;
    parseOrderStatus(status: any): string;
    parseOrder(order: any, market?: any): any;
    createOrder(symbol: any, type: any, side: any, amount: any, price?: any, params?: {}): Promise<{
        id: string;
        info: any;
        clientOrderId: any;
        timestamp: any;
        datetime: any;
        lastTradeTimestamp: any;
        symbol: any;
        type: any;
        side: any;
        price: any;
        amount: any;
        cost: any;
        average: any;
        filled: any;
        remaining: any;
        status: any;
        fee: any;
        trades: any;
    }>;
    cancelOrder(id: any, symbol?: any, params?: {}): Promise<any>;
    cancelAllOrders(symbol?: any, params?: {}): Promise<any>;
    fetchOrder(id: any, symbol?: any, params?: {}): Promise<any>;
    fetchOpenOrders(symbol?: any, since?: any, limit?: any, params?: {}): Promise<import("./base/types.js").Order[]>;
    fetchClosedOrders(symbol?: any, since?: any, limit?: any, params?: {}): Promise<import("./base/types.js").Order[]>;
    fetchMyTrades(symbol?: any, since?: any, limit?: any, params?: {}): Promise<import("./base/types.js").Trade[]>;
    parseBidAsk(bidask: any, priceKey?: number, amountKey?: number): number[];
    fetchDepositAddress(code: any, params?: {}): Promise<{
        currency: any;
        address: string;
        tag: string;
        network: any;
        info: any;
    }>;
    parseTransaction(transaction: any, currency?: any): {
        info: any;
        id: any;
        txid: any;
        timestamp: any;
        datetime: string;
        network: any;
        addressFrom: any;
        address: any;
        addressTo: any;
        tagFrom: any;
        tag: any;
        tagTo: any;
        type: any;
        amount: any;
        currency: any;
        status: any;
        updated: any;
        fee: any;
    };
    fetchTransactions(code?: any, since?: any, limit?: any, params?: {}): Promise<any>;
    withdraw(code: any, amount: any, address: any, tag?: any, params?: {}): Promise<{
        info: any;
        id: any;
        txid: any;
        timestamp: any;
        datetime: string;
        network: any;
        addressFrom: any;
        address: any;
        addressTo: any;
        tagFrom: any;
        tag: any;
        tagTo: any;
        type: any;
        amount: any;
        currency: any;
        status: any;
        updated: any;
        fee: any;
    }>;
    sign(path: any, api?: string, method?: string, params?: {}, headers?: any, body?: any): {
        url: string;
        method: string;
        body: any;
        headers: any;
    };
    handleErrors(code: any, reason: any, url: any, method: any, headers: any, body: any, response: any, requestHeaders: any, requestBody: any): void;
}
