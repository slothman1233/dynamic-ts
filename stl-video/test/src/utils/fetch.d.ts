import "fetch-polyfill2";
declare const get: (url: any, params?: any) => Promise<Response>;
declare const post: (url: any, paramsObj: any) => Promise<Response>;
export { get, post };
