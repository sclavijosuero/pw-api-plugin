import type { RequestDataInterface, ResponseDataInterface } from './types.js';


import hljs from 'highlight.js/lib/common';
// @ts-ignore - js-beautify doesn't have type definitions
import * as jsBeautify from 'js-beautify';
// @ts-ignore - isomorphic-dompurify doesn't ship type definitions
import DOMPurify from 'isomorphic-dompurify';
import * as packageJSON from '../package.json'
import { Page, test } from '@playwright/test';

// Load the color scheme dynamically
const supportedThemes = ['light', 'dark', 'accessible'];
const envColorScheme = process.env.COLOR_SCHEME;

const theme = supportedThemes.includes((envColorScheme || '').toLowerCase())
    ? (envColorScheme || '').toLowerCase()
    : 'light';

const colorScheme = require(`./color-scheme/${theme}.json`);

// Obtain the version of highlight.js from package.json
const hljsVersion: string = packageJSON['dependencies']['highlight.js'].replace(/[\^~]/g, '');


/**
 * Adds an API card to the UI by updating the page content with the provided request and response data.
 *
 * @param {RequestDataInterface} requestData - The request data object containing details of the API request.
 * @param {ResponseDataInterface} responseData - The response data object containing details of the API response.
 * @param {Page} page - Optional the Playwlright Page fixture representing the browser page.
 * @returns A `Promise` that resolves to `void` when the page content has been updated.
 */
const addApiCardToUI = async (requestData: RequestDataInterface, responseData: ResponseDataInterface, page?: Page): Promise<void> => {

    // const emptyPageHtml = '<html><head></head><body></body></html>';
    // let html: string;

    const apiCallHtml = await createApiCallHtml(requestData, responseData);

    if (page && process.env.LOG_API_UI !== 'false') {
        const html = await createPageHtml(apiCallHtml);
        await page.setContent(html, { waitUntil: 'domcontentloaded' });
    }

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


    if (process.env.LOG_API_REPORT === 'true') {
        // Attach the API call report as an attachment to the test
        const url = requestData.url;
        const method = requestData.method.toUpperCase();
        const fromCall = requestData.fromCall ? ` [From a ${requestData.fromCall}]` : '';

        test.info().attach(`Api request - ${method}${fromCall} - ${url}`, {
            body: await createApiCallReportAttachment(apiCallHtml),
            contentType: 'text/html'
        })
    }

    return apiCallHtml;
}

/**
 * Generates an HTML string representing an API call request.
 *
 * @param requestData - The data for the API request, including URL, method, headers, body, params, and other options.
 * @param callId - A unique identifier for the API call, used for generating unique element IDs.
 * @returns A promise that resolves to a string containing the HTML representation of the API call request.
 */
const createApiCallHtmlRequest = async (requestData: RequestDataInterface, callId: number): Promise<string> => {
    // Request data
    const url = requestData.url;
    const method = requestData.method.toUpperCase();
    const requestHeaders = requestData.headers ? formatJson(requestData.headers) : undefined;
    const requestBody = requestData.data ? formatJson(requestData.data) : undefined;
    const requestParams = requestData.params ? formatJson(requestData.params) : undefined;

    const requestAuth = requestData.auth ? formatJson(requestData.auth) : undefined;
    const requestProxy = requestData.proxy ? formatJson(requestData.proxy) : undefined;

    const definedFuncs = requestData.funcs ? Object.fromEntries(Object.entries(requestData.funcs).filter(([f, v]) => v !== undefined)) : undefined;
    const requestFuncs = definedFuncs && Object.keys(definedFuncs).length > 0
        ? formatJson(Object.fromEntries(Object.entries(definedFuncs).map(([key, value]) => [key, value.toString()])))
        : undefined;

    const requestOtherOptions = requestData.otherOptions ? formatJson(requestData.otherOptions) : undefined;

    const fromCall = requestData.fromCall ? ` [From a ${requestData.fromCall}]` : '';

    return `<div class="pw-api-request">
        <label class="title">REQUEST - </label>
        <label class="title-property">(METHOD: ${method}${fromCall})</label>
        </br>

        <label class="property">URL</label>
        <pre class="hljs pw-api-hljs">${url}</b></pre>
        <div class="pw-req-data-tabs-${callId} pw-data-tabs">
            ${await createRequestTab(requestBody, 'BODY', callId, true) /* Open BODY tab by default */}
            ${await createRequestTab(requestHeaders, 'HEADERS', callId)}
            ${await createRequestTab(requestParams, 'PARAMS', callId)}
            ${await createRequestTab(requestAuth, 'HTTP BASIC AUTH', callId)}
            ${await createRequestTab(requestProxy, 'PROXY', callId)}
            ${await createRequestTab(requestFuncs, 'FUNCTIONS', callId)}
            ${await createRequestTab(requestOtherOptions, 'OTHER OPTIONS/CONFIG', callId)}
        </div>
    </div>`
}

/**
 * Creates an HTML string for a request tab with the provided data.
 *
 * @param data - The data to be displayed in the tab content. If undefined, an empty string is returned.
 * @param tabLabel - The label for the tab.
 * @param callId - A unique identifier for the call, used to ensure unique IDs for the tab elements.
 * @param checked - Optional boolean indicating if the tab should be pre-selected (checked). Defaults to false.
 * @returns A promise that resolves to a string containing the HTML for the request tab.
 */
const createRequestTab = async (data: any, tabLabel: string, callId: number, checked?: boolean): Promise<string> => {
    const tabLabelForId = tabLabel.toLowerCase().replace(' ', '-').replace('/', '-');
    return ` ${(data !== undefined) ?
        `<input type="radio" name="pw-req-data-tabs-${callId}" id="pw-req-${tabLabelForId}-${callId}" ${checked ? 'checked="checked"' : ''}>
        <label for="pw-req-${tabLabelForId}-${callId}" class="property pw-tab-label">${tabLabel.toUpperCase()}</label>
        <div class="pw-tab-content">
           <pre class="hljs" id="req-${tabLabelForId}-${callId}" data-tab-type="req-${tabLabelForId}">${data}</pre>
        </div>` : ''}`
}

/**
 * Generates an HTML string representing the API call response.
 *
 * @param responseData - The response data from the API call.
 * @param callId - The unique identifier for the API call.
 * @returns A promise that resolves to an HTML string representing the API call response.
 */
const createApiCallHtmlResponse = async (responseData: ResponseDataInterface, callId: number): Promise<string> => {
    // Response data
    const status = responseData.status;
    const statusClass = responseData.statusClass;
    const statusText = responseData.statusText;
    const responseHeaders = responseData.headers ? formatJson(responseData.headers) : undefined;

    // The BODY tab should show any type of response: rendered HTML content
    // or formatted/highlighted text (JSON, XML, plain text, etc).
    let responseBody: string | undefined;
    let isHtmlResponse = false;
    if (responseData.body) {
        if ((responseData.body as any)._rawText !== undefined && (responseData.body as any)._contentType !== undefined) {
            // This is HTML/text content
            const contentType = (responseData.body as any)._contentType;
            const rawText = (responseData.body as any)._rawText;
            const trimmedText = rawText.trim();

            isHtmlResponse = contentType.includes('html') ||
                trimmedText.startsWith('<!DOCTYPE') ||
                trimmedText.startsWith('<html');

            if (isHtmlResponse) {
                responseBody = createRenderedHtmlContent(rawText);
            } else {
                // Determine language for syntax highlighting
                let language = 'plaintext';
                if (contentType.includes('xml') || trimmedText.startsWith('<?xml')) {
                    language = 'xml';
                } else if (contentType.includes('css')) {
                    language = 'css';
                } else if (contentType.includes('javascript')) {
                    language = 'javascript';
                }
                responseBody = formatText(rawText, language);
            }
        } else {
            // This is regular JSON
            responseBody = formatJson(responseData.body);
        }
    }

    const responseDuration = responseData.duration;
    const durationMsg = responseDuration ? 'Duration aprox. ' + (responseDuration < 1000 ? `${responseDuration}ms` : `${(responseDuration / 1000).toFixed(2)}s`) : '';

    let tabsHtml = '';
    tabsHtml += await createResponseTab(responseBody, 'BODY', callId, true, isHtmlResponse) /* Open BODY tab by default */;
    tabsHtml += await createResponseTab(responseHeaders, 'HEADERS', callId);

    return `<div class="pw-api-response">
        <label class="title">RESPONSE - </label>
        <label class="title-property pw-api-${statusClass}">(STATUS: ${status} - ${statusText})</label><label class="title-property"> - ${durationMsg}</label>
        <br>
        <div class="pw-res-data-tabs-${callId} pw-data-tabs">
            ${tabsHtml}
         </div>
    </div>`
}

/**
 * Creates an HTML string for a response tab with the given data, tab label, and call ID.
 *
 * @param data - The data to be displayed in the tab content. If undefined, an empty string is returned.
 * @param tabLabel - The label for the tab.
 * @param callId - The unique identifier for the call.
 * @param checked - Optional. If `true`, the tab will be marked as checked. Defaults to `false`.
 * @param isRenderedHtml - Optional. If `true`, `data` is already-safe markup to render as-is. Defaults to `false`.
 * @returns A promise that resolves to an HTML string representing the response tab.
 */
const createResponseTab = async (data: any, tabLabel: string, callId: number, checked?: boolean, isRenderedHtml?: boolean): Promise<string> => {
    const tabLabelForId = tabLabel.toLowerCase().replace(' ', '-');
    const content = isRenderedHtml
        ? `<div class="pw-html-render" id="res-${tabLabelForId}-${callId}" data-tab-type="res-${tabLabelForId}">${data}</div>`
        : `<pre class="hljs" id="res-${tabLabelForId}-${callId}" data-tab-type="res-${tabLabelForId}">${data}</pre>`;
    return ` ${(data !== undefined) ?
        `<input type="radio" name="pw-res-data-tabs-${callId}" id="pw-res-${tabLabelForId}-${callId}" ${checked ? 'checked="checked"' : ''}>
        <label for="pw-res-${tabLabelForId}-${callId}" class="property pw-tab-label">${tabLabel.toUpperCase()}</label>
        <div class="pw-tab-content">
            ${content}
        </div>` : ''}`
}

/**
 * Generates an new HTML page as string for an API call report attachment.
 *
 * @param apiCallHtml - The HTML content of the API call.
 * @returns A promise that resolves to a string containing the complete HTML document.
 */
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
 * Formats text content (HTML, XML, plain text) into a highlighted string.
 * Uses js-beautify to beautify the code first, then applies syntax highlighting.
 *
 * @param text - The text content to format.
 * @param language - The language for syntax highlighting (e.g., 'html', 'xml', 'plaintext').
 * @returns The formatted text string with syntax highlighting.
 */
const formatText = (text: string, language: string = 'plaintext'): string => {
    let beautifiedText = text;

    // Use js-beautify to beautify the code based on language
    try {
        if (language === 'html' || language === 'xml') {
            beautifiedText = jsBeautify.html(text, {
                indent_size: 2,
                indent_char: ' ',
                max_preserve_newlines: 2,
                preserve_newlines: true,
                keep_array_indentation: false,
                break_chained_methods: false,
                indent_scripts: 'separate',
                brace_style: 'collapse',
                space_before_conditional: true,
                unescape_strings: false,
                wrap_line_length: 120,
                end_with_newline: false,
                indent_inner_html: true,
                indent_body_inner_html: true,
                indent_head_inner_html: true,
                extra_liners: ['head', 'body', '/html']
            });
        } else if (language === 'css') {
            beautifiedText = jsBeautify.css(text, {
                indent_size: 2,
                indent_char: ' ',
                max_preserve_newlines: 2,
                preserve_newlines: true,
                wrap_line_length: 120,
                end_with_newline: false
            });
        } else if (language === 'javascript') {
            beautifiedText = jsBeautify.js(text, {
                indent_size: 2,
                indent_char: ' ',
                max_preserve_newlines: 2,
                preserve_newlines: true,
                keep_array_indentation: false,
                break_chained_methods: false,
                brace_style: 'collapse',
                space_before_conditional: true,
                unescape_strings: false,
                wrap_line_length: 120,
                end_with_newline: false
            });
        }
    } catch (e) {
        // If beautification fails, use original text
        beautifiedText = text;
    }

    // Apply syntax highlighting
    return hljs.highlight(beautifiedText, {
        language: language,
    }).value;
}

/**
 * Sanitizes untrusted response HTML with DOMPurify before it is rendered, stripping `<script>`
 * tags, inline event handler attributes, `javascript:` URIs, and other constructs that could
 * execute code or navigate the page. `<iframe>`/`<object>`/`<embed>`/`<base>`/`<meta>` are
 * additionally forbidden outright, since this plugin never needs them to display a response body.
 *
 * @param html - The raw HTML content to sanitize.
 * @returns The sanitized HTML string.
 */
const sanitizeHtmlForRender = (html: string): string => {
    return DOMPurify.sanitize(html, {
        FORBID_TAGS: ['iframe', 'object', 'embed', 'base', 'meta'],
        FORBID_ATTR: ['srcdoc'],
    });
}

/**
 * Wraps sanitized HTML content in a declarative Shadow DOM fragment so it renders visually as a
 * real (mini) page - preserving its own layout/styles - without leaking those styles onto the
 * surrounding report. 
 * Being pure markup (no JS needed to attach the shadow root), it renders identically in the
 * live Playwright UI, inside HTML Report, attachments, and Trace Viewer DOM snapshots.
 *
 * @param htmlContent - The raw HTML content to render.
 * @returns An HTML string containing the shadow-DOM-wrapped content, or an empty string if there is nothing to render.
 */
const createRenderedHtmlContent = (htmlContent: string): string => {
    if (!htmlContent) {
        return '';
    }

    const sanitizedHtml = sanitizeHtmlForRender(htmlContent);

    // DOMPurify drops <html>/<head>/<body> wrapper tags (and any attributes on them), keeping only inner content.
    // So the color/background reset must live on `:host` - the one element guaranteed to exist.
    // `html, body` is kept only as a no-op-safe pass-through for the rare case those tags do survive.
    return `<div class="pw-html-render-host">
        <template shadowrootmode="open">
            <style>
                :host { all: initial; display: block; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; color: ${colorScheme.cardDataColor}; background: ${colorScheme.cardDataBackground}; padding: 8px; }
                html, body { margin: 0; color: inherit; background: inherit; }
            </style>
            ${sanitizedHtml}
        </template>
    </div>`;
}


/**
 * Inline styles for the application.
 */
const inLineStyles = `<style>
    .pw-card { box-shadow: 0 4px 8px 0 ${colorScheme.cardShadow}; transition: 0.3s; }
    .pw-card:hover { box-shadow: 0 8px 16px 0 ${colorScheme.cardShadowHover}; background-color: ${colorScheme.cardBackgroundHover};}
    .pw-api-container { color: ${colorScheme.cardColor}; }
    .pw-api-call { background-color: ${colorScheme.cardBackground}; border-radius: 8px; margin: 35px 12px; padding: 10px 15px; text-align: left; font-family: monospace; }
    .pw-api-request { text-align: left; padding-bottom: 1em; }
    .pw-api-response { text-align: left; margin-top: 1em; }
    .pw-api-request .title, .pw-api-response .title { color: ${colorScheme.cardColor}; font-weight: 800; font-size: 1.8em; line-height: 2em; padding-bottom: 18px; }
    .pw-api-request .title-property, .pw-api-response .title-property { color: ${colorScheme.cardSecondaryColor}; font-weight: 800; font-size: 1.3em; }
    .property { padding: 10px 0px; cursor: pointer;display: flex; color: ${colorScheme.tabLabelColor}; font-weight: 800; font-size: 1.2em; margin: 10px 0 0 10px; border-radius: 6px 6px 0 0; }
    .pw-api-hljs { font-size: 1.1em;}

    .pw-api-1xx { color: ${colorScheme.status1xxColor}!important; }
    .pw-api-2xx { color: ${colorScheme.status2xxColor}!important; }
    .pw-api-3xx { color: ${colorScheme.status3xxColor}!important; }
    .pw-api-4xx { color: ${colorScheme.status4xxColor}!important; }
    .pw-api-5xx { color: ${colorScheme.status5xxColor}!important; }

    .pw-always-selected { flex-wrap: wrap; background: ${colorScheme.cardDataBackground}; }
    .pw-data-tabs { display: flex; flex-wrap: wrap; }
    .pw-data-tabs [type="radio"] { display: none; }
    .pw-tab-label { padding: 10px 16px; cursor: pointer; border-width: 4px 3px 0 3px; border-radius: 6px 6px 0 0; border-color: ${colorScheme.cardDataBackground}; border-style: solid; }
    .pw-tab-label:hover { color: ${colorScheme.tabLabelColorHover}; }
    .pw-tab-content { width: 100%; order: 1; display: none; }
    .pw-data-tabs [type="radio"]:checked + label + .pw-tab-content { display: block; }
    .pw-data-tabs [type="radio"]:checked + label { background: ${colorScheme.tabBackground}; border: 0px;}

    .hljs { color: ${colorScheme.cardDataColor}; background: ${colorScheme.cardDataBackground}; text-wrap: wrap; overflow-wrap: break-word; padding: 6px; margin: 1px 0 15px 10px; border-radius: 6px 6px 6px 6px; line-height: 1.5em; }
    .hljs-attr { color: ${colorScheme.cardDataAttrColor}; }
    .hljs-addition, .hljs-attribute, .hljs-literal, .hljs-section, .hljs-string, .hljs-template-tag, .hljs-template-variable, .hljs-title, .hljs-type { color: ${colorScheme.cardDataStrColor}; }
    .hljs-built_in, .hljs-keyword, .hljs-name, .hljs-selector-tag, .hljs-tag { color: ${colorScheme.cardDataBoolean}; }
    
    .pw-html-render { margin: 1px 0 15px 10px; }
    .pw-html-render-host { display: block; width: 100%; max-height: 800px; overflow: auto; border: 1px solid ${colorScheme.cardDataBackground}; border-radius: 6px; background: ${colorScheme.cardDataBackground}; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
</style>`

export { addApiCardToUI }
