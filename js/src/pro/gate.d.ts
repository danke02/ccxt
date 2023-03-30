import gateRest from '../gate.js';
export default class gate extends gateRest {
    describe(): any;
    watchOrderBook(symbol: any, limit?: any, params?: {}): Promise<any>;
    handleOrderBookSubscription(client: any, message: any, subscription: any): void;
    handleOrderBook(client: any, message: any): void;
    getCacheIndex(orderBook: any, cache: any): any;
    handleBidAsks(bookSide: any, bidAsks: any): void;
    handleDelta(orderbook: any, delta: any): void;
    watchTicker(symbol: any, params?: {}): Promise<any>;
    watchTickers(symbols?: any, params?: {}): Promise<any>;
    handleTicker(client: any, message: any): void;
    watchTrades(symbol: any, since?: any, limit?: any, params?: {}): Promise<any>;
    handleTrades(client: any, message: any): void;
    watchOHLCV(symbol: any, timeframe?: string, since?: any, limit?: any, params?: {}): Promise<any>;
    handleOHLCV(client: any, message: any): void;
    watchMyTrades(symbol?: any, since?: any, limit?: any, params?: {}): Promise<any>;
    handleMyTrades(client: any, message: any): void;
    watchBalance(params?: {}): Promise<any>;
    handleBalance(client: any, message: any): void;
    watchOrders(symbol?: any, since?: any, limit?: any, params?: {}): Promise<any>;
    handleOrder(client: any, message: any): void;
    handleErrorMessage(client: any, message: any): void;
    handleBalanceSubscription(client: any, message: any, subscription?: any): void;
    handleSubscriptionStatus(client: any, message: any): void;
    handleMessage(client: any, message: any): void;
    getUrlByMarket(market: any): any;
    getTypeByMarket(market: any): "spot" | "futures" | "options";
    getUrlByMarketType(type: any, isInverse?: boolean): any;
    requestId(): any;
    subscribePublic(url: any, messageHash: any, payload: any, subscriptionHash: any, subscription: any, params?: {}): Promise<any>;
    subscribePrivate(url: any, messageHash: any, payload: any, subscriptionHash: any, params: any, requiresUid?: boolean): Promise<any>;
}
