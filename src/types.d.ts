/**
 * Interface representing the structure of request data that will be show in Playwright UI and HTM Report.
 * 
 * @property {string} url - The URL for the request.
 * @property {string} method - The HTTP method for the request.
 * @property {object} [headers] - Optional. Headers for the request.
 * @property {any} [data] - Optional. Data to be sent with the request.
 * @property {object} [params] - Optional. URL parameters for the request.
 * @property {object} [auth] - Optional. HTTP Basic auth details (for axios API)
 * @property {object} [proxy] - Optional. Proxy configuration (for Axios API)
 * @property {object} [funcs] - Optional. functions to apply to the response (for Axios API)
 * @property {object} [otherOptions] - Optional. Additional options/config for the request.
 * @property {string} [fromCall] - Optional. Identifier for the call origin (true when PW FETCH or Axios REQUEST).
 */
export interface RequestDataInterface {
    url: string,
    method: string,
    headers?: object,
    data?: any,
    params?: object,
    auth?: object,
    proxy?: object,
    funcs?: object,
    otherOptions?: object,
    fromCall?: string
}

/**
 * Interface representing the structure of response data that will be show in Playwright UI and HTM Report.
 * 
 * @property {number} status - The HTTP status code of the response.
 * @property {string} statusClass - The class of the status code (e.g., 'success', 'client-error', 'server-error').
 * @property {string} statusText - The status text of the response.
 * @property {object} [headers] - Optional. Headers of the response.
 * @property {any} [body] - Optional. Body of the response.
 * @property {number} [duration] - Optional. Duration of the request in milliseconds.
 */
export interface ResponseDataInterface {
    status: number,
    statusClass: string,
    statusText: string,
    headers?: object,
    body?: any,
    duration?: number
}