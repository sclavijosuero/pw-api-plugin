import { APIRequestContext, Page, APIResponse, Request, test } from '@playwright/test';
import { RequestDataInterface, ResponseDataInterface } from './types';
import { addApiCardToUI } from './displayUi';


interface PlaywrightRequestInterface {
    urlOrRequest: string | Request,
    options?: any,
    method?: string,
    fromCall?: string
}

interface PlaywrightResponseInterface {
    response: APIResponse,
    duration: number
}


/**
 * Class providing methods to make HTTP requests using Playwright native API and log the request and response data on the Playwright UI.
 */
class pwApi {

    // PUBLIC METHODS
    // --------------

    /**
    * Class function that makes a Playwright FETCH REQUEST to the specified URL and logs the request and response data on the Playwright UI.
    * 
    * @param {Object} params - The parameters for the fetch function.
    * @param {APIRequestContext} params.request - The API Playwright request context.
    * @param {Page} [params.page] - Optional the Playwright page object.
    * @param {string | Request} urlOrRequest - The URL or request object to fetch.
    * @param {any} [options] - Optional fetch options.
    * @returns {Promise<APIResponse>} - A promise that resolves to the API response.
    */
    static fetch = async ({ request, page }: { request: APIRequestContext; page?: Page }, urlOrRequest: string | Request, options?: any): Promise<APIResponse> => {
        return await test.step(`PW Api Call - FETCH - ${urlOrRequest}`, async () => {
            const start = Date.now();
            const response: APIResponse = await request.fetch(urlOrRequest, options);
            await this.#displayApiCallInfo({ urlOrRequest, options, fromCall: "FETCH" }, { response, duration: Date.now() - start }, page);
            return response;
        });
    }

    /**
     * Class function that makes a Playwright GET request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the request.
     * @param {APIRequestContext} params.request - The API Playwright request context.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to send the GET request to.
     * @param {any} [options] - Optional settings for the request.
     * @returns {Promise<APIResponse>} - A promise that resolves to the API response.
     */
    static get = async ({ request, page }: { request: APIRequestContext; page?: Page }, url: string, options?: object): Promise<APIResponse> => {
        return await test.step(`PW Api Call - GET - ${url}`, async () => {
            const start = Date.now()
            const response: APIResponse = await request.get(url, options)
            await this.#displayApiCallInfo({ urlOrRequest: url, options, method: 'GET' }, { response, duration: Date.now() - start }, page)
            return response;
        })
    };

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
    static delete = async ({ request, page }: { request: APIRequestContext; page?: Page }, url: string, options?: object): Promise<APIResponse> => {
        return await test.step(`PW Api Call - DELETE - ${url}`, async () => {
            const start = Date.now();
            const response: APIResponse = await request.delete(url, options);
            await this.#displayApiCallInfo({ urlOrRequest: url, options, method: 'DELETE' }, { response, duration: Date.now() - start }, page)
            return response;
        })
    };

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
    static head = async ({ request, page }: { request: APIRequestContext; page?: Page }, url: string, options?: object): Promise<APIResponse> => {
        return await test.step(`PW Api Call - HEAD - ${url}`, async () => {
            const start = Date.now();
            const response: APIResponse = await request.head(url, options);
            await this.#displayApiCallInfo({ urlOrRequest: url, options, method: 'HEAD' }, { response, duration: Date.now() - start }, page)
            return response;
        })
    };

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
    static post = async ({ request, page }: { request: APIRequestContext; page?: Page }, url: string, options?: object): Promise<APIResponse> => {
        return await test.step(`PW Api Call - POST - ${url}`, async () => {
            const start = Date.now();
            const response: APIResponse = await request.post(url, options);
            await this.#displayApiCallInfo({ urlOrRequest: url, options, method: 'POST' }, { response, duration: Date.now() - start }, page)
            return response;
        })
    };

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
    static put = async ({ request, page }: { request: APIRequestContext; page?: Page }, url: string, options?: object): Promise<APIResponse> => {
        return await test.step(`PW Api Call - PUT - ${url}`, async () => {
            const start = Date.now();
            const response: APIResponse = await request.put(url, options);
            await this.#displayApiCallInfo({ urlOrRequest: url, options, method: 'PUT' }, { response, duration: Date.now() - start }, page)
            return response;
        })
    };

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
    static patch = async ({ request, page }: { request: APIRequestContext; page?: Page }, url: string, options?: object): Promise<APIResponse> => {
        return await test.step(`PW Api Call - PATCH - ${url}`, async () => {
            const start = Date.now();
            const response: APIResponse = await request.patch(url, options);
            await this.#displayApiCallInfo({ urlOrRequest: url, options, method: 'PATCH' }, { response, duration: Date.now() - start }, page)
            return response;
        })
    };


    // PRIVATE METHODS
    // ---------------

    /**
     * Obtains and displays API call information on the Playwright UI and HTML Report.
     *
     * @param {PlaywrightRequestInterface} request - The request details.
     * @param {string | Request} request.urlOrRequest - The URL or request object.
     * @param {any} request.options - The request options.
     * @param {string} request.method - The HTTP method used for the request.
     * @param {string} request.fromCall - The origin of the call.
     * 
     * @param {PlaywrightResponseInterface} response - The response details.
     * @param {APIResponse} response.response - The response object.
     * @param {number} response.duration - The duration of the request in milliseconds.
     * 
     * @param {Page} [page] - Optional the page object where the API call information will be displayed.
     * 
     * @returns {Promise<{ requestData: RequestDataInterface, responseData: ResponseDataInterface }>} 
     * An object containing the processed request and response data.
     */
    static #displayApiCallInfo = async (
        { urlOrRequest, options, method, fromCall }: PlaywrightRequestInterface,
        { response, duration }: PlaywrightResponseInterface,
        page?: Page
    ): Promise<{ requestData: RequestDataInterface; responseData: ResponseDataInterface; } | null> => {

        if (process.env.LOG_API_UI !== 'false' || process.env.LOG_API_REPORT === 'true') {

            // Form the request data object for representation on the UI
            let requestData: RequestDataInterface = {
                url: typeof urlOrRequest === 'string' ? urlOrRequest : urlOrRequest.url(),
                method: method?.toUpperCase() || options?.method?.toUpperCase() || 'GET',
                fromCall,
            }

            if (options) {
                let { method, headers, data, params, ...otherOptions } = structuredClone(options);
                if (Object.keys(otherOptions).length === 0) otherOptions = undefined;

                requestData = { ...requestData, headers, data, params, otherOptions }
            }

            // Form the request data object for representation on the UI
            const status = response.status();
            let body
            if ((await response.text()) !== "") {
                body = await response.json();
            }

            const responseData: ResponseDataInterface = {
                status,
                statusClass: status.toString().charAt(0) + 'xx', // Used for give color style to status code. (Eg: '2xx', '4xx', '5xx')
                statusText: response.statusText(),
                headers: response.headers(),
                body,
                duration
            };

            await addApiCardToUI(requestData, responseData, page)

            return { requestData, responseData };
        } else {
            return null;
        }

        
    }

}

export default pwApi;
