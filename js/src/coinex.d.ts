import Exchange from './abstract/coinex.js';
export default class coinex extends Exchange {
    describe(): any;
    fetchCurrencies(params?: {}): Promise<{}>;
    fetchMarkets(params?: {}): Promise<any>;
    fetchSpotMarkets(params: any): Promise<any[]>;
    fetchContractMarkets(params: any): Promise<any[]>;
    parseTicker(ticker: any, market?: any): import("./base/types.js").Ticker;
    fetchTicker(symbol: any, params?: {}): Promise<import("./base/types.js").Ticker>;
    fetchTickers(symbols?: any, params?: {}): Promise<any>;
    fetchTime(params?: {}): Promise<number>;
    fetchOrderBook(symbol: any, limit?: number, params?: {}): Promise<import("./base/types.js").OrderBook>;
    parseTrade(trade: any, market?: any): import("./base/types.js").Trade;
    fetchTrades(symbol: any, since?: any, limit?: any, params?: {}): Promise<import("./base/types.js").Trade[]>;
    fetchTradingFee(symbol: any, params?: {}): Promise<{
        info: any;
        symbol: any;
        maker: number;
        taker: number;
        percentage: boolean;
        tierBased: boolean;
    }>;
    fetchTradingFees(params?: {}): Promise<{}>;
    parseTradingFee(fee: any, market?: any): {
        info: any;
        symbol: any;
        maker: number;
        taker: number;
        percentage: boolean;
        tierBased: boolean;
    };
    parseOHLCV(ohlcv: any, market?: any): number[];
    fetchOHLCV(symbol: any, timeframe?: string, since?: any, limit?: any, params?: {}): Promise<import("./base/types.js").OHLCV[]>;
    fetchMarginBalance(params?: {}): Promise<import("./base/types.js").Balances>;
    fetchSpotBalance(params?: {}): Promise<import("./base/types.js").Balances>;
    fetchSwapBalance(params?: {}): Promise<import("./base/types.js").Balances>;
    fetchBalance(params?: {}): Promise<import("./base/types.js").Balances>;
    parseOrderStatus(status: any): string;
    parseOrder(order: any, market?: any): any;
    createOrder(symbol: any, type: any, side: any, amount: any, price?: any, params?: {}): Promise<any>;
    cancelOrder(id: any, symbol?: any, params?: {}): Promise<any>;
    cancelAllOrders(symbol?: any, params?: {}): Promise<any>;
    fetchOrder(id: any, symbol?: any, params?: {}): Promise<any>;
    fetchOrdersByStatus(status: any, symbol?: any, since?: any, limit?: any, params?: {}): Promise<import("./base/types.js").Order[]>;
    fetchOpenOrders(symbol?: any, since?: any, limit?: any, params?: {}): Promise<import("./base/types.js").Order[]>;
    fetchClosedOrders(symbol?: any, since?: any, limit?: any, params?: {}): Promise<import("./base/types.js").Order[]>;
    createDepositAddress(code: any, params?: {}): Promise<{
        info: any;
        currency: any;
        address: any;
        tag: any;
        network: any;
    }>;
    fetchDepositAddress(code: any, params?: {}): Promise<{
        info: any;
        currency: any;
        address: any;
        tag: any;
        network: any;
    }>;
    safeNetwork(networkId: any, currency?: any): any;
    safeNetworkCode(networkId: any, currency?: any): any;
    parseDepositAddress(depositAddress: any, currency?: any): {
        info: any;
        currency: any;
        address: any;
        tag: any;
        network: any;
    };
    fetchMyTrades(symbol?: any, since?: any, limit?: any, params?: {}): Promise<import("./base/types.js").Trade[]>;
    fetchPositions(symbols?: any, params?: {}): Promise<any>;
    fetchPosition(symbol: any, params?: {}): Promise<{
        info: any;
        id: number;
        symbol: any;
        notional: any;
        marginMode: string;
        liquidationPrice: string;
        entryPrice: string;
        unrealizedPnl: string;
        percentage: any;
        contracts: any;
        contractSize: string;
        markPrice: any;
        side: string;
        hedged: any;
        timestamp: number;
        datetime: string;
        maintenanceMargin: string;
        maintenanceMarginPercentage: string;
        collateral: string;
        initialMargin: any;
        initialMarginPercentage: any;
        leverage: number;
        marginRatio: any;
    }>;
    parsePosition(position: any, market?: any): {
        info: any;
        id: number;
        symbol: any;
        notional: any;
        marginMode: string;
        liquidationPrice: string;
        entryPrice: string;
        unrealizedPnl: string;
        percentage: any;
        contracts: any;
        contractSize: string;
        markPrice: any;
        side: string;
        hedged: any;
        timestamp: number;
        datetime: string;
        maintenanceMargin: string;
        maintenanceMarginPercentage: string;
        collateral: string;
        initialMargin: any;
        initialMarginPercentage: any;
        leverage: number;
        marginRatio: any;
    };
    setMarginMode(marginMode: any, symbol?: any, params?: {}): Promise<any>;
    setLeverage(leverage: any, symbol?: any, params?: {}): Promise<any>;
    fetchLeverageTiers(symbols?: any, params?: {}): Promise<{}>;
    parseLeverageTiers(response: any, symbols?: any, marketIdKey?: any): {};
    parseMarketLeverageTiers(item: any, market?: any): any[];
    modifyMarginHelper(symbol: any, amount: any, addOrReduce: any, params?: {}): Promise<any>;
    parseMarginModification(data: any, market?: any): {
        info: any;
        type: any;
        amount: any;
        code: any;
        symbol: any;
        status: any;
    };
    addMargin(symbol: any, amount: any, params?: {}): Promise<any>;
    reduceMargin(symbol: any, amount: any, params?: {}): Promise<any>;
    fetchFundingHistory(symbol?: any, since?: any, limit?: any, params?: {}): Promise<any[]>;
    fetchFundingRate(symbol: any, params?: {}): Promise<{
        info: any;
        symbol: any;
        markPrice: number;
        indexPrice: number;
        interestRate: any;
        estimatedSettlePrice: any;
        timestamp: number;
        datetime: string;
        fundingRate: number;
        fundingTimestamp: number;
        fundingDatetime: string;
        nextFundingRate: number;
        nextFundingTimestamp: any;
        nextFundingDatetime: any;
        previousFundingRate: number;
        previousFundingTimestamp: any;
        previousFundingDatetime: any;
    }>;
    parseFundingRate(contract: any, market?: any): {
        info: any;
        symbol: any;
        markPrice: number;
        indexPrice: number;
        interestRate: any;
        estimatedSettlePrice: any;
        timestamp: number;
        datetime: string;
        fundingRate: number;
        fundingTimestamp: number;
        fundingDatetime: string;
        nextFundingRate: number;
        nextFundingTimestamp: any;
        nextFundingDatetime: any;
        previousFundingRate: number;
        previousFundingTimestamp: any;
        previousFundingDatetime: any;
    };
    fetchFundingRates(symbols?: any, params?: {}): Promise<any>;
    withdraw(code: any, amount: any, address: any, tag?: any, params?: {}): Promise<{
        info: any;
        id: string;
        txid: any;
        timestamp: number;
        datetime: string;
        network: string;
        address: string;
        addressTo: any;
        addressFrom: any;
        tag: string;
        tagTo: any;
        tagFrom: any;
        type: string;
        amount: number;
        currency: any;
        status: string;
        updated: any;
        fee: {
            cost: number;
            currency: any;
        };
    }>;
    parseTransactionStatus(status: any): string;
    fetchFundingRateHistory(symbol?: any, since?: any, limit?: number, params?: {}): Promise<any>;
    parseTransaction(transaction: any, currency?: any): {
        info: any;
        id: string;
        txid: any;
        timestamp: number;
        datetime: string;
        network: string;
        address: string;
        addressTo: any;
        addressFrom: any;
        tag: string;
        tagTo: any;
        tagFrom: any;
        type: string;
        amount: number;
        currency: any;
        status: string;
        updated: any;
        fee: {
            cost: number;
            currency: any;
        };
    };
    transfer(code: any, amount: any, fromAccount: any, toAccount: any, params?: {}): Promise<any>;
    parseTransferStatus(status: any): string;
    parseTransfer(transfer: any, currency?: any): {
        id: number;
        timestamp: number;
        datetime: string;
        currency: any;
        amount: number;
        fromAccount: any;
        toAccount: any;
        status: string;
    };
    fetchTransfers(code?: any, since?: any, limit?: any, params?: {}): Promise<any>;
    fetchWithdrawals(code?: any, since?: any, limit?: any, params?: {}): Promise<any>;
    fetchDeposits(code?: any, since?: any, limit?: any, params?: {}): Promise<any>;
    parseBorrowRate(info: any, currency?: any): {
        currency: any;
        rate: number;
        period: number;
        timestamp: number;
        datetime: string;
        info: any;
    };
    fetchBorrowRate(code: any, params?: {}): Promise<{
        currency: any;
        rate: number;
        period: number;
        timestamp: number;
        datetime: string;
        info: any;
    }>;
    fetchBorrowRates(params?: {}): Promise<any[]>;
    fetchBorrowInterest(code?: any, symbol?: any, since?: any, limit?: any, params?: {}): Promise<any>;
    parseBorrowInterest(info: any, market?: any): {
        account: any;
        symbol: string;
        marginMode: string;
        marginType: any;
        currency: any;
        interest: number;
        interestRate: number;
        amountBorrowed: number;
        timestamp: number;
        datetime: string;
        info: any;
    };
    borrowMargin(code: any, amount: any, symbol?: any, params?: {}): Promise<any>;
    repayMargin(code: any, amount: any, symbol?: any, params?: {}): Promise<any>;
    parseMarginLoan(info: any, currency?: any): {
        id: number;
        currency: any;
        amount: any;
        symbol: any;
        timestamp: any;
        datetime: any;
        info: any;
    };
    fetchDepositWithdrawFees(codes?: any, params?: {}): Promise<{}>;
    parseDepositWithdrawFees(response: any, codes?: any, currencyIdKey?: any): {};
    nonce(): number;
    sign(path: any, api?: string, method?: string, params?: {}, headers?: any, body?: any): {
        url: string;
        method: string;
        body: any;
        headers: any;
    };
    handleErrors(httpCode: any, reason: any, url: any, method: any, headers: any, body: any, response: any, requestHeaders: any, requestBody: any): void;
}
