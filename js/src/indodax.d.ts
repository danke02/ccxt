import Exchange from './abstract/indodax.js';
export default class indodax extends Exchange {
    describe(): any;
    nonce(): number;
    fetchTime(params?: {}): Promise<number>;
    fetchMarkets(params?: {}): Promise<any[]>;
    parseBalance(response: any): import("./base/types.js").Balances;
    fetchBalance(params?: {}): Promise<import("./base/types.js").Balances>;
    fetchOrderBook(symbol: any, limit?: any, params?: {}): Promise<import("./base/types.js").OrderBook>;
    parseTicker(ticker: any, market?: any): import("./base/types.js").Ticker;
    fetchTicker(symbol: any, params?: {}): Promise<import("./base/types.js").Ticker>;
    fetchTickers(symbols?: any, params?: {}): Promise<any>;
    parseTrade(trade: any, market?: any): import("./base/types.js").Trade;
    fetchTrades(symbol: any, since?: any, limit?: any, params?: {}): Promise<import("./base/types.js").Trade[]>;
    parseOrderStatus(status: any): string;
    parseOrder(order: any, market?: any): any;
    fetchOrder(id: any, symbol?: any, params?: {}): Promise<any>;
    fetchOpenOrders(symbol?: any, since?: any, limit?: any, params?: {}): Promise<any[]>;
    fetchClosedOrders(symbol?: any, since?: any, limit?: any, params?: {}): Promise<any>;
    createOrder(symbol: any, type: any, side: any, amount: any, price?: any, params?: {}): Promise<any>;
    cancelOrder(id: any, symbol?: any, params?: {}): Promise<any>;
    fetchTransactionFee(code: any, params?: {}): Promise<{
        info: any;
        rate: number;
        currency: any;
    }>;
    fetchTransactions(code?: any, since?: any, limit?: any, params?: {}): Promise<any>;
    withdraw(code: any, amount: any, address: any, tag?: any, params?: {}): Promise<{
        id: string;
        txid: string;
        timestamp: number;
        datetime: string;
        network: any;
        addressFrom: any;
        address: string;
        addressTo: any;
        amount: number;
        type: string;
        currency: any;
        status: string;
        updated: any;
        tagFrom: any;
        tag: any;
        tagTo: any;
        comment: string;
        fee: any;
        info: any;
    }>;
    parseTransaction(transaction: any, currency?: any): {
        id: string;
        txid: string;
        timestamp: number;
        datetime: string;
        network: any;
        addressFrom: any;
        address: string;
        addressTo: any;
        amount: number;
        type: string;
        currency: any;
        status: string;
        updated: any;
        tagFrom: any;
        tag: any;
        tagTo: any;
        comment: string;
        fee: any;
        info: any;
    };
    parseTransactionStatus(status: any): string;
    sign(path: any, api?: string, method?: string, params?: {}, headers?: any, body?: any): {
        url: any;
        method: string;
        body: any;
        headers: any;
    };
    handleErrors(code: any, reason: any, url: any, method: any, headers: any, body: any, response: any, requestHeaders: any, requestBody: any): void;
}
