import { APIRequestContext, Page, APIResponse, Request, TestType } from '@playwright/test';
import { PlaywrightTestArgs, PlaywrightTestOptions, PlaywrightWorkerArgs, PlaywrightWorkerOptions } from '@playwright/test';

import { AxiosResponse } from 'axios';

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

/**
 * Class providing methods to make HTTP requests using Playwright native API and log the request and response data on the Playwright UI.
 */
declare class pwApi {

    /**
    * Class function that fetches data from the API and and logs the request and response data on the Playwright UI.
    * 
    * @param {Object} params - The parameters for the fetch function.
    * @param {APIRequestContext} params.request - The API Playwright request context.
    * @param {Page} [params.page] - Optional the Playwright page object.
    * @param {string | Request} urlOrRequest - The URL or request object to fetch.
    * @param {any} [options] - Optional fetch options.
    * @returns {Promise<APIResponse>} - A promise that resolves to the API response.
    */
    static fetch({ request, page }: { request: APIRequestContext; page?: Page }, urlOrRequest: string | Request, options?: any): Promise<APIResponse>;

    /**
     * Class function that makes a GET request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the request.
     * @param {APIRequestContext} params.request - The API Playwright request context.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to send the GET request to.
     * @param {any} [options] - Optional settings for the request.
     * @returns {Promise<APIResponse>} - A promise that resolves to the API response.
     */
    static get({ request, page }: { request: APIRequestContext; page?: Page }, url: string, options?: object): Promise<APIResponse>

    /**
     * Class function that makes a DELETE request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the request.
     * @param {APIRequestContext} params.request - The API Playwright request context.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to send the GET request to.
     * @param {any} [options] - Optional settings for the request.
     * @returns {Promise<APIResponse>} - A promise that resolves to the API response.
     */
    static delete ({ request, page }: { request: APIRequestContext; page?: Page }, url: string, options?: object): Promise<APIResponse>

    /**
     * Class function that makes a HEAD request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the request.
     * @param {APIRequestContext} params.request - The API Playwright request context.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to send the GET request to.
     * @param {any} [options] - Optional settings for the request.
     * @returns {Promise<APIResponse>} - A promise that resolves to the API response.
     */
    static head ({ request, page }: { request: APIRequestContext; page?: Page }, url: string, options?: object): Promise<APIResponse>

    /**
     * Class function that makes a POST request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the request.
     * @param {APIRequestContext} params.request - The API Playwright request context.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to send the GET request to.
     * @param {any} [options] - Optional settings for the request.
     * @returns {Promise<APIResponse>} - A promise that resolves to the API response.
     */
    static post({ request, page }: { request: APIRequestContext; page?: Page }, url: string, options?: object): Promise<APIResponse>

    /**
     * Class function that makes a PUT request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the request.
     * @param {APIRequestContext} params.request - The API Playwright request context.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to send the GET request to.
     * @param {any} [options] - Optional settings for the request.
     * @returns {Promise<APIResponse>} - A promise that resolves to the API response.
     */
    static put ({ request, page }: { request: APIRequestContext; page?: Page }, url: string, options?: object): Promise<APIResponse>

    /**
     * Class function that makes a PATCH request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the request.
     * @param {APIRequestContext} params.request - The API Playwright request context.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to send the GET request to.
     * @param {any} [options] - Optional settings for the request.
     * @returns {Promise<APIResponse>} - A promise that resolves to the API response.
     */
    static patch ({ request, page }: { request: APIRequestContext; page?: Page }, url: string, options?: object): Promise<APIResponse>

}


/**
 * Class providing methods to make HTTP requests using Axios API and log the request and response data on the Playwright UI.
 */
declare class axiosApi {

    /**
     * Class function that makes an AXIOS API call and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the API call.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string | any} arg1 - The URL of the API call or an object containing the Axios request configuration object.
     * @param {any} [arg2] - The optional Axios request configuration object if `arg1` is a string.
     * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response.
     */
    static axios({ page }: { page?: Page }, arg1: string | any, arg2?: any): Promise<AxiosResponse>
    

    /**
     * Class function that makes an Axios REQUEST and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the request.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {any} config - The Axios request configuration object.
     * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response.
     */
    static request({ page }: { page?: Page }, config: any): Promise<AxiosResponse>

    /**
     * Class function that makes an Axios GET request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the GET request.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to send the GET request to.
     * @param {any} [config] - Optional Axios request configuration object.
     * @returns {Promise<AxiosResponse>} - The response from the Axios GET request.
     */
    static get({ page }: { page?: Page }, url: string, config?: object): Promise<AxiosResponse>

    /**
     * Class function that makes an Axios DELETE request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the DELETE request.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to send the DELETE request to.
     * @param {any} [config] - Optional Axios request configuration object.
     * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response.
     */
    static delete({ page }: { page?: Page }, url: string, config?: object): Promise<AxiosResponse>

    /**
     * Class function that makes an Axios HEAD request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the request.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to send the HEAD request to.
     * @param {any} [config] - Optional Axios request configuration object.
     * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response.
     */
    static head({ page }: { page?: Page }, url: string, config?: object): Promise<AxiosResponse>

    /**
     * Class function that makes an Axios OPTIONS request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} param0 - An object containing the page instance.
     * @param {Page} param0.page - The Playwright page instance.
     * @param {string} url - The URL to which the OPTIONS request is made.
     * @param {any} [config] - Optional Axios request configuration object.
     * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response.
     */
    static options({ page }: { page?: Page }, url: string, config?: object): Promise<AxiosResponse>

    /**
     * Class function that makes an Axios POST request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the POST request.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to which the POST request is sent.
     * @param {any} [data] - Optional the data to be sent in the body of the POST request.
     * @param {any} [config] - The Axios request configuration options.
     * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response.
     */
    static post({ page }: { page?: Page }, url: string, data?: any, config?: object): Promise<AxiosResponse>

    /**
     * Class function that makes an Axios PUT request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the PUT request.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to send the PUT request to.
     * @param {any} [data] - Optional the data to be sent in the PUT request body.
     * @param {any} [config] - The Axios request configuration.
     * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response.
     */
    static put({ page }: { page?: Page }, url: string, data?: any, config?: object): Promise<AxiosResponse>

    /**
     * Class function that makes an Axios PATCH request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the PATCH request.
     * @param {Page} params.page - The Playwright Page object.
     * @param {string} url - The URL to send the PATCH request to.
     * @param {any} [data] - Optional the data to be sent in the PATCH request body.
     * @param {any} [config] - Optional Axios request configuration.
     * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response.
     */
    static patch({ page }: { page?: Page }, url: string, data?: any, config?: object): Promise<AxiosResponse>

    /**
     * Class function that makes an Axios POSTFORM request with 'FormData' to the specified URL and logs the request and response data on the Playwright UI.
     * 
     * @param {Object} params - The parameters for the API call.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to which the request is sent.
     * @param {any} [data] - Optional the 'FormData' instance to be sent as the form body.
     * @param {any} [config] - Optional Axios request configuration.
     * @returns {Promise<AxiosResponse>} - The Axios response object.
     */
    static postForm({ page }: { page?: Page }, url: string, data?: any, config?: object): Promise<AxiosResponse>

    /**
     * Class function that makes an Axios PUTFORM request with 'FormData' to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the request.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to send the PUT request to.
     * @param {any} [data] - Optional the 'FormData' instance to be sent with the request.
     * @param {any} [config] - Optional Axios configuration for the request.
     * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response.
     */
    static putForm({ page }: { page?: Page }, url: string, data?: any, config?: object): Promise<AxiosResponse>

    /**
     * Class function that makes an Axios PATCHFORM request with 'FormData' to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the function.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to send the PATCH request to.
     * @param {any} [data] - Optional the 'FormData' instance to be sent with the PATCH request.
     * @param {any} [config] - Optional Axios request configuration.
     * @returns {Promise<AxiosResponse>} - The Axios response object.
     */
    static patchForm({ page }: { page?: Page }, url: string, data?: any, config?: object): Promise<AxiosResponse>

}

/**
 * A conditional Playwright test extension based on the `LOG_API_UI` environment variable.
 * If `LOG_API_UI` is not set to 'false', the base API is used as-is.
 * Otherwise, the base API is extended with the `page` fixture disabled.
 */
export const test: TestType<PlaywrightTestArgs & PlaywrightTestOptions, PlaywrightWorkerArgs & PlaywrightWorkerOptions>;