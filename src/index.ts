import hljs from 'highlight.js/lib/common';
import packageJSON from '../package.json';
import { APIRequestContext, Page, APIResponse, Request } from '@playwright/test';

// Obtain the version of highlight.js from package.json
const hljsVersion: string = packageJSON['dependencies']['highlight.js'].replace(/[\^~]/g, '');


// **********************************************************************
// PUBLIC API
// **********************************************************************

/**
 * Fetches data from the API and adds the API response to the UI.
 *
 * @param {Object} params - The parameters for the function.
 * @param {APIRequestContext} params.request - The APIRequestContext fixture.
 * @param {Page} params.page - The Page fixture.
 * @param {string | Request} urlOrRequest - The URL or Request object to fetch.
 * @param {object} [options] - Optional parameters for the FETCH request.
 * @returns {Promise<APIResponse>} - A promise that resolves to the APIResponse.
 */
export const apiFetch = async ({ request, page }: { request: APIRequestContext; page: Page }, urlOrRequest: string | Request, options?: object): Promise<APIResponse> => {
    const response: APIResponse = await request.fetch(urlOrRequest, options);
    await addApiCardToUI(page, response, options);

    return response;
};

/**
 * Makes a GET request to the specified URL and adds the API response to the UI.
 *
 * @param {Object} params - The parameters for the function.
 * @param {APIRequestContext} params.request - The APIRequestContext fixture.
 * @param {Page} params.page - The Page fixture.
 * @param {string} url - The URL to send the GET request to.
 * @param {object} [options] - Optional parameters for the GET request.
 * @returns {Promise<APIResponse>} - A promise that resolves to the APIResponse.
 */
export const apiGet = async ({ request, page }: { request: APIRequestContext; page: Page }, url: string, options?: object): Promise<APIResponse> => {
    const response: APIResponse = await request.get(url, options);
    await addApiCardToUI(page, response, { method: 'GET', ...options });

    return response;
};

/**
 * Sends a POST request to the specified URL and adds the API response to the UI.
 *
 * @param {Object} params - The parameters for the function.
 * @param {APIRequestContext} params.request - The APIRequestContext fixture.
 * @param {Page} params.page - The Page fixture.
 * @param {string} url - The URL to send the POST request to.
 * @param {object} [options] - Optional settings for the POST request.
 * @returns {Promise<APIResponse>} - A promise that resolves to the APIResponse.
 */
export const apiPost = async ({ request, page }: { request: APIRequestContext; page: Page }, url: string, options?: object): Promise<APIResponse> => {
    const response: APIResponse = await request.post(url, options);
    await addApiCardToUI(page, response, { method: 'POST', ...options });

    return response;
};

/**
 * Sends a PUT request to the specified URL and adds the API response to the UI.
 *
 * @param {Object} params - The parameters for the function.
 * @param {APIRequestContext} params.request - The APIRequestContext fixture.
 * @param {Page} params.page - The Page fixture.
 * @param {string} url - The URL to send the PUT request to.
 * @param {object} [options] - Optional settings for the PUT request.
 * @returns {Promise<APIResponse>} - A promise that resolves to the APIResponse.
 */
export const apiPut = async ({ request, page }: { request: APIRequestContext; page: Page }, url: string, options?: object): Promise<APIResponse> => {
    const response: APIResponse = await request.put(url, options);
    await addApiCardToUI(page, response, { method: 'PUT', ...options });

    return response;
};

/**
 * Sends a DELETE request to the specified URL and adds the API response to the UI.
 *
 * @param {Object} params - The parameters for the function.
 * @param {APIRequestContext} params.request - The APIRequestContext fixture.
 * @param {Page} params.page - The Page fixture.
 * @param {string} url - The URL to send the DELETE request to.
 * @param {object} [options] - Optional settings for the DELETE request.
 * @returns {Promise<APIResponse>} - A promise that resolves to the APIResponse.
 */
export const apiDelete = async ({ request, page }: { request: APIRequestContext; page: Page }, url: string, options?: object): Promise<APIResponse> => {
    const response: APIResponse = await request.delete(url, options);
    await addApiCardToUI(page, response, { method: 'DELETE', ...options });

    return response;
};

/**
 * Sends a PATCH request to the specified URL and updates the UI with the response.
 *
 * @param {Object} params - The parameters for the function.
 * @param {APIRequestContext} params.request - The APIRequestContext fixture.
 * @param {Page} params.page - The Page fixture.
 * @param {string} url - The URL to send the PATCH request to.
 * @param {object} [options] - Optional settings for the PATCH request.
 * @returns {Promise<APIResponse>} - A promise that resolves to the API response.
 */
export const apiPatch = async ({ request, page }: { request: APIRequestContext; page: Page }, url: string, options?: object): Promise<APIResponse> => {
    const response: APIResponse = await request.patch(url, options);
    await addApiCardToUI(page, response, { method: 'PATCH', ...options });

    return response;
};

/**
 * Sends a HEAD request to the specified URL and adds the API response to the UI.
 *
 * @param {Object} params - The parameters for the function.
 * @param {APIRequestContext} params.request - The APIRequestContext fixture.
 * @param {Page} params.page - The Page fixture.
 * @param {string} url - The URL to send the HEAD request to.
 * @param {object} [options] - Optional parameters for the HEAD request.
 * @returns {Promise<APIResponse>} - A promise that resolves to the API response.
 */
export const apiHead = async ({ request, page }: { request: APIRequestContext; page: Page }, url: string, options?: object): Promise<APIResponse> => {
    const response: APIResponse = await request.head(url, options);
    await addApiCardToUI(page, response, { method: 'HEAD', ...options });

    return response;
};


// **********************************************************************
// PRIVATE FUNCTIONS
// **********************************************************************

/**
 * Adds an API card to the UI by updating the page content with the API response.
 *
 * @param {Page} page - The Page fixture.
 * @param {APIResponse} response - The APIResponse object containing the API response data.
 * @param {object} [options] - Optional fetch options.
 * @returns A `Promise` that resolves to `void` when the page content has been updated.
 */
const addApiCardToUI = async (page: Page, response: APIResponse, options?: object): Promise<void> => {
    const emptyPageHtml = '<html><head></head><body></body></html>';
    let html: string;

    const apiCallHtml = await createApiCallHtml(response, options);

    const currentHtml = await page.content();
    if (currentHtml === emptyPageHtml) {
        html = await createPageHtml(apiCallHtml);
    } else {
        html = await addApiCallHtml(currentHtml, apiCallHtml);
    }

    await page.setContent(html);
}

/**
 * Adds API call HTML content at the end of the current HTML string.
 *
 * This function searches for the closing `</div>`, `</body>`, and `</html>` tags
 * in the `currentHtml` string and inserts the last `apiCallHtml` content before these tags.
 *
 * @param currentHtml - The original HTML string to which the API call HTML will be added.
 * @param apiCallHtml - The HTML string representing the API call content to be added.
 * @returns A promise that resolves to the updated HTML string with the API call content inserted.
 */
const addApiCallHtml = async (currentHtml: string, apiCallHtml: string): Promise<string> => {
    return currentHtml.replace(/<\/div>\s*<\/body>\s*<\/html>/, `${apiCallHtml}</div></body></html>`);
}

/**
 * Generates an HTML representation of an API call, including the request and response details.
 *
 * @param {APIResponse} response - The APIResponse object from the API call.
 * @param {object} [options] - Optional parameters for the API request.
 * @param {string} [options.method] - The HTTP method used for the request (default is 'GET').
 * @param {object} [options.headers] - The headers sent with the request.
 * @param {object} [options.body] - The body sent with the request.
 * @returns {Promise<string>} A promise that resolves to a string containing the HTML representation of the API call.
 */
const createApiCallHtml = async (response: APIResponse, options?: object): Promise<string> => {
    const requestMethod = (options && options['method'] ? options['method'] : 'GET').toUpperCase();
    const requestHeadersJson = options && options['headers'] ? formatJson(options['headers']) : undefined;
    const requestBodyJson = options && options['body'] ? formatJson(options['body']) : undefined;

    const responseStatus = response.status();
    const statusClass = responseStatus.toString().charAt(0) + 'xx';

    let responseBody;
    if (requestMethod !== 'HEAD') {
        responseBody = await response.json();
    }

    const responseBodyJson = responseBody ? formatJson(responseBody) : undefined;

    const url = response.url();

    // If decided to add response header to the API call card
    // const responseHeaders = response.headers();
    // const responseHeadersJson = responseHeaders ? formatJson(responseHeaders) : undefined;

    // Add to the returned html string after <br>
    // ${responseHeadersJson ? `<label class="property">HEADERS:</label>
    //     <pre class="hljs">${responseHeadersJson}</pre>` : ''}

    return `<div class="pw-api-call pw-card">
        <div class="pw-api-request">
            <label class="title">REQUEST - </label>
            <label class="title-property">(METHOD: ${requestMethod})</label>
            </br>
            <label class="property">URL:</label>
            <pre class="hljs pw-api-hljs">${url}</b></pre>
            ${requestHeadersJson ? `<label class="property">HEADERS:</label>
            <pre class="hljs">${requestHeadersJson}</pre>` : ''}
            ${requestBodyJson ? `<label class="property">BODY:</label>
            <pre class="hljs">${requestBodyJson}</pre>` : ''}
        </div>
        <hr>
        <div class="pw-api-response">
            <label class="title">RESPONSE - </label>
            <label class="title-property pw-api-${statusClass}">(STATUS: ${responseStatus})</label>
            <br>
            ${responseBodyJson ? `<label class="property">BODY:</label>
            <pre class="hljs">${responseBodyJson}</pre>` : ''}
        </div>
    </div>`
}

/**
 * Generates a simple HTML page as a string.
 *
 * @param apiCallHtml - The HTML content to be inserted into the page.
 * @returns A promise that resolves to a string containing the complete HTML page.
 */
const createPageHtml = async (apiCallHtml: string): Promise<string> => {
    return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Simple HTML Page</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${hljsVersion}/styles/vs.min.css"/>
            ${inLineStyles}
        </head>
        <body>
            <div class="pw-api-container">${apiCallHtml}</div>
        </body>
    </html>`
}

/**
 * Formats a JSON object into a highlighted JSON string.
 *
 * @param jsonObject - The JSON object to format.
 * @returns The formatted JSON string with syntax highlighting.
 */
const formatJson = (jsonObject: object): string => {
    return hljs.highlight(JSON.stringify(jsonObject, null, 4), {
        language: 'json',
    }).value;
}

/**
 * Inline styles for the application.
 */
const inLineStyles = `<style>
    .pw-card { box-shadow: 0 4px 8px 0 rgba(0,0,0,0.3); transition: 0.3s; }
    .pw-card:hover { box-shadow: 0 8px 16px 0 rgba(0,0,0,0.5); background-color: rgb(173, 216, 230);}
    .pw-api-container { color: rgb(40, 40, 40); }
    .pw-api-call { background-color: rgb(200, 230, 240); border-radius: 8px; margin: 35px 12px; padding: 10px 15px; text-align: left; font-family: monospace; }
    .pw-api-request { text-align: left; padding-bottom: 1em; }
    .pw-api-response { text-align: left; margin-top: 1em; }
    .pw-api-request .title, .pw-api-response .title { font-weight: 800; font-size: 1.8em; line-height: 2em; padding-bottom: 18px; }
    .pw-api-request .title-property, .pw-api-response .title-property { color: rgb(60, 60, 60); font-weight: 800; font-size: 1.3em; }
    .pw-api-request .property, .pw-api-response .property { color: rgb(70, 70, 70); font-weight: 800; font-size: 1.2em;}
    .pw-api-hljs { font-size: 1.1em;}
    .pw-api-1xx { color: rgb(3, 152, 158)!important; }
    .pw-api-2xx { color: rgb(0, 128, 54)!important; }
    .pw-api-3xx { color: rgb(217, 98, 32)!important; }
    .pw-api-4xx { color: rgb(200, 0, 0)!important; }
    .pw-api-5xx { color: rgb(160, 20, 28)!important; }
    .hljs { background: rgb(238, 251, 255); text-wrap: wrap; padding: 6px; margin: 8px 0 15px 10px; border-radius: 6px; line-height: 1.5em; }
</style>`
