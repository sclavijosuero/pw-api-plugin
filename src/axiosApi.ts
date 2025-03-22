import { Page, test } from '@playwright/test';
import axios, { AxiosResponse } from 'axios';
import { RequestDataInterface, ResponseDataInterface } from './types';
import { addApiCardToUI } from './displayUi';


interface AxiosRequestInterface {
    url?: string,
    data?: any,
    config?: any,
    method?: string,
    fromCall?: string
}

interface AxiosResponseInterface {
    response: AxiosResponse,
    duration: number
}

class axiosApi {

    // PUBLIC METHODS
    // --------------

    /**
     * Makes an Axios API call and logs the request and response details.
     *
     * @param {Object} params - The parameters for the API call.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string | any} arg1 - The URL of the API call or an object containing the Axios request configuration object.
     * @param {any} [arg2] - The optional Axios request configuration object if `arg1` is a string.
     * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response.
     */
    static axios = async ({ page }: { page?: Page }, arg1: string | any, arg2?: any): Promise<AxiosResponse> => {
        let url: string
        let config: any
        if (typeof arg1 === 'string') {
            url = arg1;
            config = arg2;
        } else {
            ({ url, ...config } = arg1);
        }

        return await test.step(`Axios Api Call - REQUEST - ${url}`, async () => {
            const start = Date.now();
            const response: AxiosResponse = await axios(arg1, arg2);
            await this.#displayApiCallInfo({ url, config, fromCall: "AXIOS" }, { response, duration: Date.now() - start }, page);
            return response;
        });
    }

    /**
     * Makes an Axios API request and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the request.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {any} config - The Axios request configuration object.
     * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response.
     */
    static request = async ({ page }: { page?: Page }, config: any): Promise<AxiosResponse> => {
        return await test.step(`Axios Api Call - REQUEST - ${config.url}`, async () => {
            const start = Date.now();
            const response: AxiosResponse = await axios.request(config);
            await this.#displayApiCallInfo({ config, fromCall: "REQUEST" }, { response, duration: Date.now() - start }, page);
            return response;
        });
    }

    /**
     * Makes an Axios GET request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the GET request.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to send the GET request to.
     * @param {any} [config] - Optional Axios request configuration object.
     * @returns {Promise<AxiosResponse>} - The response from the Axios GET request.
     */
    static get = async ({ page }: { page?: Page }, url: string, config?: object): Promise<AxiosResponse> => {
        return await test.step(`Axios Api Call - GET - ${url}`, async () => {
            const start = Date.now()
            const response: AxiosResponse = await axios.get(url, config)
            await this.#displayApiCallInfo({ url, config, method: 'GET' }, { response, duration: Date.now() - start }, page)
            return response;
        })
    };

    /**
     * Makes an Axios DELETE request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the DELETE request.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to send the DELETE request to.
     * @param {any} [config] - Optional Axios request configuration object.
     * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response.
     */
    static delete = async ({ page }: { page?: Page }, url: string, config?: object): Promise<AxiosResponse> => {
        return await test.step(`Axios Api Call - DELETE - ${url}`, async () => {
            const start = Date.now()
            const response: AxiosResponse = await axios.delete(url, config)
            await this.#displayApiCallInfo({ url, config, method: 'DELETE' }, { response, duration: Date.now() - start }, page)
            return response;
        })
    };

    /**
     * Makes an Axios HTTP HEAD request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the request.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to send the HEAD request to.
     * @param {any} [config] - Optional Axios request configuration object.
     * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response.
     */
    static head = async ({ page }: { page?: Page }, url: string, config?: object): Promise<AxiosResponse> => {
        return await test.step(`Axios Api Call - HEAD - ${url}`, async () => {
            const start = Date.now()
            const response: AxiosResponse = await axios.head(url, config)
            await this.#displayApiCallInfo({ url, config, method: 'HEAD' }, { response, duration: Date.now() - start }, page)
            return response;
        })
    };

    /**
     * Makes an Axios OPTIONS request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} param0 - An object containing the page instance.
     * @param {Page} param0.page - The Playwright page instance.
     * @param {string} url - The URL to which the OPTIONS request is made.
     * @param {any} [config] - Optional Axios request configuration object.
     * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response.
     */
    static options = async ({ page }: { page?: Page }, url: string, config?: object): Promise<AxiosResponse> => {
        return await test.step(`Axios Api Call - OPTIONS - ${url}`, async () => {
            const start = Date.now()
            const response: AxiosResponse = await axios.options(url, config)
            await this.#displayApiCallInfo({ url, config, method: 'OPTIONS' }, { response, duration: Date.now() - start }, page)
            return response;
        })
    };

    /**
     * Makes an Axios POST request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the POST request.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to which the POST request is sent.
     * @param {any} [data] - Optional the data to be sent in the body of the POST request.
     * @param {any} [config] - The Axios request configuration options.
     * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response.
     */
    static post = async ({ page }: { page?: Page }, url: string, data?: any, config?: object): Promise<AxiosResponse> => {
        return await test.step(`Axios Api Call - POST - ${url}`, async () => {
            const start = Date.now()
            const response: AxiosResponse = await axios.post(url, data, config)
            await this.#displayApiCallInfo({ url, data, config, method: 'POST' }, { response, duration: Date.now() - start }, page)
            return response;
        })
    };

    /**
     * Makes an Axios PUT request to the specified URL and logs the request and response data on the Playwright UI.
     * Logs the API call information and its duration.
     *
     * @param {Object} params - The parameters for the PUT request.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to send the PUT request to.
     * @param {any} [data] - Optional the data to be sent in the PUT request body.
     * @param {any} [config] - The Axios request configuration.
     * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response.
     */
    static put = async ({ page }: { page?: Page }, url: string, data?: any, config?: object): Promise<AxiosResponse> => {
        return await test.step(`Axios Api Call - PUT - ${url}`, async () => {
            const start = Date.now()
            const response: AxiosResponse = await axios.put(url, data, config)
            await this.#displayApiCallInfo({ url, data, config, method: 'PUT' }, { response, duration: Date.now() - start }, page)
            return response;
        })
    };

    /**
     * Makes an Axios PATCH request to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the PATCH request.
     * @param {Page} params.page - The Playwright Page object.
     * @param {string} url - The URL to send the PATCH request to.
     * @param {any} [data] - Optional the data to be sent in the PATCH request body.
     * @param {any} [config] - Optional Axios request configuration.
     * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response.
     */
    static patch = async ({ page }: { page?: Page }, url: string, data?: any, config?: object): Promise<AxiosResponse> => {
        return await test.step(`Axios Api Call - PATCH - ${url}`, async () => {
            const start = Date.now()
            const response: AxiosResponse = await axios.patch(url, data, config)
            await this.#displayApiCallInfo({ url, data, config, method: 'PATCH' }, { response, duration: Date.now() - start }, page)
            return response;
        })
    };

    /**
     * Makes an Axios POST request with 'FormData' to the specified URL and logs the request and response data on the Playwright UI.
     * 
     * @param {Object} params - The parameters for the API call.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to which the request is sent.
     * @param {any} [data] - Optional the 'FormData' instance to be sent as the form body.
     * @param {any} [config] - Optional Axios request configuration.
     * @returns {Promise<AxiosResponse>} - The Axios response object.
     */
    static postForm = async ({ page }: { page?: Page }, url: string, data?: any, config?: object): Promise<AxiosResponse> => {
        return await test.step(`Axios Api Call - POSTFORM - ${url}`, async () => {
            const start = Date.now()
            const response: AxiosResponse = await axios.postForm(url, data, config)
            await this.#displayApiCallInfo({ url, data, config, method: 'POSTFORM' }, { response, duration: Date.now() - start }, page)
            return response;
        })
    };

    /**
     * Makes an Axios PUT request with 'FormData' to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the request.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to send the PUT request to.
     * @param {any} [data] - Optional the 'FormData' instance to be sent with the request.
     * @param {any} [config] - Optional Axios configuration for the request.
     * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response.
     */
    static putForm = async ({ page }: { page?: Page }, url: string, data?: any, config?: object): Promise<AxiosResponse> => {
        return await test.step(`Axios Api Call - PUTFORM - ${url}`, async () => {
            const start = Date.now()
            const response: AxiosResponse = await axios.putForm(url, data, config)
            await this.#displayApiCallInfo({ url, data, config, method: 'PUTFORM' }, { response, duration: Date.now() - start }, page)
            return response;
        })
    };

    /**
     * Makes an Axios PATCH request with 'FormData' to the specified URL and logs the request and response data on the Playwright UI.
     *
     * @param {Object} params - The parameters for the function.
     * @param {Page} [params.page] - Optional the Playwright page object.
     * @param {string} url - The URL to send the PATCH request to.
     * @param {any} [data] - Optional the 'FormData' instance to be sent with the PATCH request.
     * @param {any} [config] - Optional Axios request configuration.
     * @returns {Promise<AxiosResponse>} - The Axios response object.
     */
    static patchForm = async ({ page }: { page?: Page }, url: string, data?: any, config?: object): Promise<AxiosResponse> => {
        return await test.step(`Axios Api Call - PATCHFORM - ${url}`, async () => {
            const start = Date.now()
            const response: AxiosResponse = await axios.patchForm(url, data, config)
            await this.#displayApiCallInfo({ url, data, config, method: 'PATCHFORM' }, { response, duration: Date.now() - start }, page)
            return response;
        })
    };

    
    // PRIVATE METHODS
    // ---------------

    /**
     * Obtains and displays API call information on the Playwright UI and HTML Report.
     *
     * @param {string} request.url - The URL of the API call.
     * @param {any} request.data - The data sent with the API call.
     * @param {any} request.config - The Axios configuration object for the API call.
     * @param {string} request.method - The HTTP method used for the API call.
     * @param {string} request.fromCall - The source of the API call.
     * @param {AxiosResponseInterface} responseDetails - The response details including response object and duration.
     * @param {AxiosResponse} responseDetails.response - The Axios response object.
     * @param {number} responseDetails.duration - The duration of the API call.
     * @param {Page} [page] - Optional the page object where the API call information will be displayed.
     * @param {AxiosRequestInterface} request - The request details including URL, data, config, method, and the source of the call.
     * @returns {Promise<{ requestData: RequestDataInterface, responseData: ResponseDataInterface }>} A promise that resolves to an object containing the request data and response data.
     */
    static #displayApiCallInfo = async (
        { url, data, config, method, fromCall }: AxiosRequestInterface,
        { response, duration }: AxiosResponseInterface,
        page?: Page
    ): Promise<{ requestData: RequestDataInterface, responseData: ResponseDataInterface }> => {

        // Form the request data object for representation on the UI
        let requestData: RequestDataInterface = {
            url: url || config?.url || '',
            method: method?.toUpperCase() || config?.method?.toUpperCase() || 'GET',
            data: data || config?.data,  // In case od an axios.request() data will be provided in config
            fromCall,
        }

        if (config) {
            const { transformRequest, transformResponse, paramsSerializer, adapter,
                onUploadProgress, onDownloadProgress, cancelToken, validateStatus, ...configWithoutFuncs } = config;

            let { url, method, headers, data, params, auth, proxy, ...otherOptions } = structuredClone(configWithoutFuncs);
            if (Object.keys(otherOptions).length === 0) otherOptions = undefined;

            requestData = {
                ...requestData, headers, params, auth, proxy, otherOptions,
                funcs: {
                    transformRequest, transformResponse, paramsSerializer, adapter,
                    onUploadProgress, onDownloadProgress, cancelToken, validateStatus
                }
            }
        }

        // Form the request data object for representation on the UI
        const status = response.status;

        const responseData: ResponseDataInterface = {
            status,
            statusClass: status.toString().charAt(0) + 'xx', // Used for give color style to status code. (Eg: '2xx', '4xx', '5xx')
            statusText: response.statusText,
            headers: response.headers,
            body: response.data,
            duration
        };

        await addApiCardToUI(requestData, responseData, page)

        return { requestData, responseData };
    }

}

export default axiosApi;