import type { RequestDataInterface, ResponseDataInterface } from './types.js';


import hljs from 'highlight.js/lib/common';
import * as packageJSON from '../package.json'
import { Page, test } from '@playwright/test';

// Obtain the version of highlight.js from package.json
const hljsVersion: string = packageJSON['dependencies']['highlight.js'].replace(/[\^~]/g, '');


/**
 * Adds an API card to the UI by updating the page content with the provided request and response data.
 *
 * @param page - The Playwlright Page fixture representing the browser page.
 * @param {RequestDataInterface} requestData - The request data object containing details of the API request.
 * @param {ResponseDataInterface} responseData - The response data object containing details of the API response.
 * @returns A `Promise` that resolves to `void` when the page content has been updated.
 */
const addApiCardToUI = async (page: Page, requestData: RequestDataInterface, responseData: ResponseDataInterface): Promise<void> => {

    const emptyPageHtml = '<html><head></head><body></body></html>';
    let html: string;

    const apiCallHtml = await createApiCallHtml(requestData, responseData);

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
 * @param {RequestDataInterface} requestData - The request data object containing details of the API request.
 * @param {ResponseDataInterface} responseData - The response data object containing details of the API response.
 * @returns {Promise<string>} A promise that resolves to a string containing the HTML representation of the API call.
 */
const createApiCallHtml = async (requestData: RequestDataInterface, responseData: ResponseDataInterface): Promise<string> => {
    const callId = Math.floor(10000000 + Math.random() * 90000000);

    // Build the API Call Card HTML
    const apiCallHtml = `<div class="pw-api-call pw-card">
        ${await createApiCallHtmlRequest(requestData, callId)}
        <hr>
        ${await createApiCallHtmlResponse(responseData, callId)}
    </div>`


    // Attach the API call report as an attachment to the test
    const url = requestData.url;
    const method = requestData.method.toUpperCase();
    const fromCall = requestData.fromCall ? ` [From a ${requestData.fromCall}]` : '';

    test.info().attach(`Api request - ${method}${fromCall} - ${url}`, {
        body: await createApiCallReportAttachment(apiCallHtml),
        contentType: 'text/html'
    })

    return apiCallHtml;
}

const createApiCallHtmlRequest = async (requestData: RequestDataInterface, callId: number): Promise<string> => {
    // Request data
    const url = requestData.url;
    const method = requestData.method.toUpperCase();
    const requestHeaders = requestData.headers ? formatJson(requestData.headers) : undefined;
    const requestBody = requestData.data ? formatJson(requestData.data) : undefined;
    const requestParams = requestData.params ? formatJson(requestData.params) : undefined;
    const requestOtherOptions = requestData.otherOptions ? formatJson(requestData.otherOptions) : undefined;

    const fromCall = requestData.fromCall ? ` [From a ${requestData.fromCall}]` : '';

    return `<div class="pw-api-request">
        <label class="title">REQUEST - </label>
        <label class="title-property">(METHOD: ${method}${fromCall})</label>
        </br>

        <label class="property">URL</label>
        <pre class="hljs pw-api-hljs">${url}</b></pre>
        <div class="pw-req-data-tabs-${callId} pw-data-tabs">
            ${await createRequestTab(requestBody, 'BODY', callId, true)}
            ${await createRequestTab(requestHeaders, 'HEADERS', callId)}
            ${await createRequestTab(requestParams, 'PARAMS', callId)}
            ${await createRequestTab(requestOtherOptions, 'OTHER OPTIONS', callId)}
        </div>
    </div>`
}

const createRequestTab = async (data: any, tabLabel: string, callId: number, checked?: boolean): Promise<string> => {
    const tabLabelForId = tabLabel.toLowerCase().replace(' ', '-');
    return ` ${(data !== undefined) ?
        `<input type="radio" name="pw-req-data-tabs-${callId}" id="pw-req-${tabLabelForId}-${callId}" ${checked ? 'checked="checked"' : ''}>
        <label for="pw-req-${tabLabelForId}-${callId}" class="property pw-tab-label">${tabLabel.toUpperCase()}</label>
        <div class="pw-tab-content">
            <pre class="hljs" id="req-body-${callId}">${data}</pre>
        </div>` : ''}`
}

const createApiCallHtmlResponse = async (responseData: ResponseDataInterface, callId: number): Promise<string> => {
    // Response data
    const status = responseData.status;
    const statusClass = responseData.statusClass;
    const statusText = responseData.statusText;
    const responseHeaders = responseData.headers ? formatJson(responseData.headers) : undefined;
    const responseBody = responseData.body ? formatJson(responseData.body) : undefined;
    const responseDuration = responseData.duration;
    const durationMsg = responseDuration ? 'Duration aprox. ' + (responseDuration < 1000 ? `${responseDuration}ms` : `${(responseDuration / 1000).toFixed(2)}s`) : ''

    return `<div class="pw-api-response">
        <label class="title">RESPONSE - </label>
        <label class="title-property pw-api-${statusClass}">(STATUS: ${status})</label><label class="title-property"> - ${durationMsg}</label>
        <br>
        <div class="pw-res-data-tabs-${callId} pw-data-tabs">
            ${await createResponseTab(responseBody, 'BODY', callId, true)}
            ${await createResponseTab(responseHeaders, 'HEADERS', callId)}
         </div>
    </div>`
}

const createResponseTab = async (data: any, tabLabel: string, callId: number, checked?: boolean): Promise<string> => {
    const tabLabelForId = tabLabel.toLowerCase().replace(' ', '-');
    return ` ${(data !== undefined) ?
        `<input type="radio" name="pw-res-data-tabs-${callId}" id="pw-res-${tabLabelForId}-${callId}" ${checked ? 'checked="checked"' : ''}>
        <label for="pw-res-${tabLabelForId}-${callId}" class="property pw-tab-label">${tabLabel.toUpperCase()}</label>
        <div class="pw-tab-content">
            <pre class="hljs" id="res-body-${callId}">${data}</pre>
        </div>` : ''}`
}

const createApiCallReportAttachment = async (apiCallHtml: string): Promise<string> => {
    return `<html>
        <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${hljsVersion}/styles/vs.min.css"/>
            ${inLineStyles}
        </head>
        <body>
            ${apiCallHtml}
        </body>
    </html>`
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
    .property { padding: 10px 0px; cursor: pointer;display: flex; color: rgb(70, 70, 70); font-weight: 800; font-size: 1.2em; margin: 10px 0 0 10px; border-radius: 6px 6px 0 0; }
    .pw-api-hljs { font-size: 1.1em;}
    .pw-api-1xx { color: rgb(3, 152, 158)!important; }
    .pw-api-2xx { color: rgb(0, 128, 54)!important; }
    .pw-api-3xx { color: rgb(217, 98, 32)!important; }
    .pw-api-4xx { color: rgb(200, 0, 0)!important; }
    .pw-api-5xx { color: rgb(160, 20, 28)!important; }
    .hljs { background: rgb(238, 251, 255); text-wrap: wrap; overflow-wrap: break-word; padding: 6px; margin: 1px 0 15px 10px; border-radius: 6px 6px 6px 6px; line-height: 1.5em; }

    .pw-always-selected { flex-wrap: wrap; background: rgb(238, 251, 255); }
    .pw-data-tabs { display: flex; flex-wrap: wrap; }
    .pw-data-tabs [type="radio"] { display: none; }
    .pw-tab-label { padding: 10px 16px; cursor: pointer; border-width: 2px 1px 0 1px; border-radius: 6px 6px 0 0; border-color: rgb(238, 251, 255); border-style: solid;}
    .pw-tab-content { width: 100%; order: 1; display: none; }
    .pw-data-tabs [type="radio"]:checked + label + .pw-tab-content { display: block; }
    .pw-data-tabs [type="radio"]:checked + label { background: rgb(238, 251, 255); border: 0px;}
</style>`

export { addApiCardToUI }