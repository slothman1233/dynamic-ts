export interface paramets {
    hubjs?: string;
    hubConnection: string;
    connHunProxyOn: string;
    createHubProxy: string;
    transports?: Array<string>;
    invokes?: string;
    qs?: any;
    jsonp?: boolean;
    connectionSuccessCallback?: (json: any, singlar?: any) => void;
    afterConnectionCallback?: (that: any) => void;
    stateChangedCallback?: (change: number) => void;
    disconnected?: () => void;
    noNetworkCallback?: () => void;
}
