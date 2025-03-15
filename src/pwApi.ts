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


class pwApi {
    // PUBLIC METHODS
    // --------------

     /**
     * Fetches data from the API and and logs the request and response data on the Playwright UI.
     * 
     * @param {Object} params - The parameters for the fetch function.
     * @param {APIRequestContext} params.request - The API request context.
     * @param {Page} params.page - The page object.
     * @param {string | Request} urlOrRequest - The URL or request object to fetch.
     * @param {any} [options] - Optional fetch options.
     * @returns {Promise<APIResponse>} - A promise that resolves to the API response.
     */
    static fetch = async ({ request, page }: { request: APIRequestContext; page: Page }, urlOrRequest: string | Request, options?: any): Promise<APIResponse> => {
        return await test.step(`Api request - FETCH - ${urlOrRequest}`, async () => {
            const start = Date.now();
            const response: APIResponse = await request.fetch(urlOrRequest, options);
            const { requestData, responseData } = await this.#obtainApiCallInfo({ urlOrRequest, options, fromCall: "FETCH" }, { response, duration: Date.now() - start });

            await addApiCardToUI(page, requestData, responseData)
            return response;
        });
    }

    /**
     * Sends a GET request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the request.
     * @param {APIRequestContext} params.request - The API request context.
     * @param {Page} params.page - The Playwright page object.
     * @param {string} url - The URL to send the GET request to.
     * @param {object} [options] - Optional settings for the request.
     * @returns {Promise<APIResponse>} - A promise that resolves to the API response.
     */
    static get = async ({ request, page }: { request: APIRequestContext; page: Page }, url: string, options?: object): Promise<APIResponse> => {
        return await test.step(`Api request - GET - ${url}`, async () => {
            const start = Date.now()
            const response: APIResponse = await request.get(url, options)
            const { requestData, responseData } = await this.#obtainApiCallInfo({ urlOrRequest: url, options, method: 'GET'}, { response, duration: Date.now() - start })

            await addApiCardToUI(page, requestData, responseData)
            return response;
        })
    };

    /**
     * Sends a POST request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the request.
     * @param {APIRequestContext} params.request - The API request context.
     * @param {Page} params.page - The Playwright page object.
     * @param {string} url - The URL to send the GET request to.
     * @param {object} [options] - Optional settings for the request.
     * @returns {Promise<APIResponse>} - A promise that resolves to the API response.
     */    
    static post = async ({ request, page }: { request: APIRequestContext; page: Page }, url: string, options?: object): Promise<APIResponse> => {
        return await test.step(`Api request - POST - ${url}`, async () => {
            const start = Date.now();
            const response: APIResponse = await request.post(url, options);
            const { requestData, responseData } = await this.#obtainApiCallInfo({ urlOrRequest: url, options, method: 'POST'}, { response, duration: Date.now() - start })

            await addApiCardToUI(page, requestData, responseData)
            return response;
        })
    };

    /**
     * Sends a PUT request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the request.
     * @param {APIRequestContext} params.request - The API request context.
     * @param {Page} params.page - The Playwright page object.
     * @param {string} url - The URL to send the GET request to.
     * @param {object} [options] - Optional settings for the request.
     * @returns {Promise<APIResponse>} - A promise that resolves to the API response.
     */
    static put = async ({ request, page }: { request: APIRequestContext; page: Page }, url: string, options?: object): Promise<APIResponse> => {
        return await test.step(`Api request - PUT - ${url}`, async () => {
            const start = Date.now();
            const response: APIResponse = await request.put(url, options);
            const { requestData, responseData } = await this.#obtainApiCallInfo({ urlOrRequest: url, options, method: 'PUT'}, { response, duration: Date.now() - start })

            await addApiCardToUI(page, requestData, responseData)
            return response;
        })
    };

    /**
     * Sends a DELETE request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the request.
     * @param {APIRequestContext} params.request - The API request context.
     * @param {Page} params.page - The Playwright page object.
     * @param {string} url - The URL to send the GET request to.
     * @param {object} [options] - Optional settings for the request.
     * @returns {Promise<APIResponse>} - A promise that resolves to the API response.
     */
    static delete = async ({ request, page }: { request: APIRequestContext; page: Page }, url: string, options?: object): Promise<APIResponse> => {
        return await test.step(`Api request - DELETE - ${url}`, async () => {
            const start = Date.now();
            const response: APIResponse = await request.delete(url, options);
            const { requestData, responseData } = await this.#obtainApiCallInfo({ urlOrRequest: url, options, method: 'DELETE'}, { response, duration: Date.now() - start })

            await addApiCardToUI(page, requestData, responseData)
            return response;
        })
    };

    /**
     * Sends a PATCH request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the request.
     * @param {APIRequestContext} params.request - The API request context.
     * @param {Page} params.page - The Playwright page object.
     * @param {string} url - The URL to send the GET request to.
     * @param {object} [options] - Optional settings for the request.
     * @returns {Promise<APIResponse>} - A promise that resolves to the API response.
     */
    static patch = async ({ request, page }: { request: APIRequestContext; page: Page }, url: string, options?: object): Promise<APIResponse> => {
        return await test.step(`Api request - PATCH - ${url}`, async () => {
            const start = Date.now();
            const response: APIResponse = await request.patch(url, options);
            const { requestData, responseData } = await this.#obtainApiCallInfo({ urlOrRequest: url, options, method: 'PATCH'}, { response, duration: Date.now() - start })

            await addApiCardToUI(page, requestData, responseData)
            return response;
        })
    };

    /**
     * Sends a HEAD request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the request.
     * @param {APIRequestContext} params.request - The API request context.
     * @param {Page} params.page - The Playwright page object.
     * @param {string} url - The URL to send the GET request to.
     * @param {object} [options] - Optional settings for the request.
     * @returns {Promise<APIResponse>} - A promise that resolves to the API response.
     */
    static head = async ({ request, page }: { request: APIRequestContext; page: Page }, url: string, options?: object): Promise<APIResponse> => {
        return await test.step(`Api request - HEAD - ${url}`, async () => {
            const start = Date.now();
            const response: APIResponse = await request.head(url, options);
            const { requestData, responseData } = await this.#obtainApiCallInfo({ urlOrRequest: url, options, method: 'HEAD'}, { response, duration: Date.now() - start })

            await addApiCardToUI(page, requestData, responseData)
            return response;
        })
    };

    
    // PRIVATE METHODS
    // ---------------

    /**
     * Asynchronously obtains and processes API call information.
     *
     * @param {PlaywrightRequestInterface} request - The request details.
     * @param {string | Request} request.urlOrRequest - The URL or request object.
     * @param {object} request.options - The request options.
     * @param {string} request.method - The HTTP method used for the request.
     * @param {string} request.fromCall - The origin of the call.
     * 
     * @param {PlaywrightResponseInterface} response - The response details.
     * @param {APIResponse} response.response - The response object.
     * @param {number} response.duration - The duration of the request in milliseconds.
     *
     * @returns {Promise<{ requestData: RequestDataInterface, responseData: ResponseDataInterface }>} 
     * An object containing the processed request and response data.
     */
    static #obtainApiCallInfo = async (
        { urlOrRequest, options, method, fromCall }: PlaywrightRequestInterface,
        { response, duration }:PlaywrightResponseInterface
    ): Promise<{ requestData: RequestDataInterface, responseData: ResponseDataInterface}> => {

        // Form the request data object for representation on the UI
        let requestData: RequestDataInterface = {
            url: typeof urlOrRequest === 'string' ? urlOrRequest : urlOrRequest.url(),
            method: method ? method.toUpperCase() : (options && options.method ? options.method.toUpperCase() : 'GET'),
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
        return { requestData, responseData };
    }

}

export default pwApi;


// interface PlaywrightApiCallInterface {
//     apiFunc: Function,
//     urlOrRequest: string | Request,
//     options?: any,
//     fromCall?: string,
//     method?: string
// }

//      /**
//      * Fetches data from the API and and logs the request and response data on the Playwright UI.
//      * 
//      * @param {Object} params - The parameters for the fetch function.
//      * @param {APIRequestContext} params.request - The API request context.
//      * @param {Page} params.page - The page object.
//      * @param {string | Request} urlOrRequest - The URL or request object to fetch.
//      * @param {any} [options] - Optional fetch options.
//      * @returns {Promise<APIResponse>} - A promise that resolves to the API response.
//      */
//     static fetch = async ({ request, page }: { request: APIRequestContext; page: Page }, urlOrRequest: string | Request, options?: any): Promise<APIResponse> => {
//         return await test.step(`Api request - FETCH - ${urlOrRequest}`, async () => {
//             return await this.#apiCall(page, { apiFunc: request.fetch, urlOrRequest, options, fromCall: 'FETCH' })
//         });
//     }

//     static #apiCall = async (page: Page, { apiFunc, urlOrRequest, options, fromCall, method }: PlaywrightApiCallInterface): Promise<APIResponse> => {
//         const start = Date.now();
//         const response: APIResponse = await apiFunc(urlOrRequest, options);
//         const { requestData, responseData } = await this.#obtainApiCallInfo({ urlOrRequest, options, fromCall, method }, { response, duration: Date.now() - start });
//         // await addApiCardToUI(page, requestData, responseData)

//         console.log('requestData:', JSON.stringify(requestData))
//         console.log('responseData:', JSON.stringify(responseData))

//         return response;
//     }