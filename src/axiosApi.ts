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

    static request = async ({ page }: { page: Page }, config: any): Promise<AxiosResponse> => {
        return await test.step(`Axios Api Call - REQUEST - ${config.url}`, async () => {
            const start = Date.now();
            const response: AxiosResponse = await axios.request(config);
            await this.#displayApiCallInfo(page, { config, fromCall: "REQUEST" }, { response, duration: Date.now() - start });
            return response;
        });
    }

    static get = async ({ page }: { page: Page }, url: string, config?: object): Promise<AxiosResponse> => {
        return await test.step(`Axios Api Call - GET - ${url}`, async () => {
            const start = Date.now()
            const response: AxiosResponse = await axios.get(url, config)
            await this.#displayApiCallInfo(page, { url, config, method: 'GET' }, { response, duration: Date.now() - start })
            return response;
        })
    };

    static delete = async ({ page }: { page: Page }, url: string, config?: object): Promise<AxiosResponse> => {
        return await test.step(`Axios Api Call - DELETE - ${url}`, async () => {
            const start = Date.now()
            const response: AxiosResponse = await axios.delete(url, config)
            await this.#displayApiCallInfo(page, { url, config, method: 'DELETE' }, { response, duration: Date.now() - start })
            return response;
        })
    };

    static head = async ({ page }: { page: Page }, url: string, config?: object): Promise<AxiosResponse> => {
        return await test.step(`Axios Api Call - HEAD - ${url}`, async () => {
            const start = Date.now()
            const response: AxiosResponse = await axios.head(url, config)
            await this.#displayApiCallInfo(page, { url, config, method: 'HEAD' }, { response, duration: Date.now() - start })
            return response;
        })
    };

    static options = async ({ page }: { page: Page }, url: string, config?: object): Promise<AxiosResponse> => {
        return await test.step(`Axios Api Call - OPTIONS - ${url}`, async () => {
            const start = Date.now()
            const response: AxiosResponse = await axios.options(url, config)
            await this.#displayApiCallInfo(page, { url, config, method: 'OPTIONS' }, { response, duration: Date.now() - start })
            return response;
        })
    };

    static post = async ({ page }: { page: Page }, url: string, data?: any, config?: object): Promise<AxiosResponse> => {
        return await test.step(`Axios Api Call - POST - ${url}`, async () => {
            const start = Date.now()
            const response: AxiosResponse = await axios.post(url, data, config)
            await this.#displayApiCallInfo(page, { url, data, config, method: 'POST' }, { response, duration: Date.now() - start })
            return response;
        })
    };

    static put = async ({ page }: { page: Page }, url: string, data?: any, config?: object): Promise<AxiosResponse> => {
        return await test.step(`Axios Api Call - PUT - ${url}`, async () => {
            const start = Date.now()
            const response: AxiosResponse = await axios.put(url, data, config)
            await this.#displayApiCallInfo(page, { url, data, config, method: 'PUT' }, { response, duration: Date.now() - start })
            return response;
        })
    };

    static patch = async ({ page }: { page: Page }, url: string, data?: any, config?: object): Promise<AxiosResponse> => {
        return await test.step(`Axios Api Call - PATCH - ${url}`, async () => {
            const start = Date.now()
            const response: AxiosResponse = await axios.patch(url, data, config)
            await this.#displayApiCallInfo(page, { url, data, config, method: 'PATCH' }, { response, duration: Date.now() - start })
            return response;
        })
    };

    static postForm = async ({ page }: { page: Page }, url: string, data?: any, config?: object): Promise<AxiosResponse> => {
        return await test.step(`Axios Api Call - POSTFORM - ${url}`, async () => {
            const start = Date.now()
            const response: AxiosResponse = await axios.postForm(url, data, config)
            await this.#displayApiCallInfo(page, { url, data, config, method: 'POSTFORM' }, { response, duration: Date.now() - start })
            return response;
        })
    };

    static putForm = async ({ page }: { page: Page }, url: string, data?: any, config?: object): Promise<AxiosResponse> => {
        return await test.step(`Axios Api Call - PUTFORM - ${url}`, async () => {
            const start = Date.now()
            const response: AxiosResponse = await axios.putForm(url, data, config)
            await this.#displayApiCallInfo(page, { url, data, config, method: 'PUTFORM' }, { response, duration: Date.now() - start })
            return response;
        })
    };

    static patchForm = async ({ page }: { page: Page }, url: string, data?: any, config?: object): Promise<AxiosResponse> => {
        return await test.step(`Axios Api Call - PATCHFORM - ${url}`, async () => {
            const start = Date.now()
            const response: AxiosResponse = await axios.patchForm(url, data, config)
            await this.#displayApiCallInfo(page, { url, data, config, method: 'PATCHFORM' }, { response, duration: Date.now() - start })
            return response;
        })
    };
    

    static #displayApiCallInfo = async (
        page: Page,
        { url, data, config, method, fromCall }: AxiosRequestInterface,
        { response, duration }: AxiosResponseInterface
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

        await addApiCardToUI(page, requestData, responseData)

        return { requestData, responseData };
    }


}

export default axiosApi;