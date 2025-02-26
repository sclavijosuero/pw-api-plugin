# pw-api-plugin

Playwright plugin for comprehensive API testing and presenting results in a user-friendly manner in the Playwright UI.

## Main Features

- Lightweight library introducing new functions: `apiGet`, `apiPost`, `apiPut`, `apiPatch`, `apiDelete`, `apiHead` and `apiFetch` for testing API requests in the Playwright test framework.
- These functions display each API request and response information in the **Playwright UI**.
- You can use multiple calls to these functions within the same test if you need to test multiple endpoints.

![Overview](videos/overview.gif)

## Installation

```sh
npm install -D pw-api-plugin
```

## Compatibility


## Configuration

- Add the following line to your test file:

  ```js
  import 'pw-api-plugin';
  ```


## API Reference

### ✔️ apiFetch

**Description:**  
Fetches data from the API and adds the API response to the UI.

- **Parameters:**
  - `params` *(Object)*: The parameters for the function.
    - `request` *(APIRequestContext)*: The APIRequestContext fixture.
    - `page` *(Page)*: The Page fixture.
  - `urlOrRequest` *(string | Request)*: The URL or Request object to fetch.
  - `options` *(object, optional)*: Optional parameters for the FETCH request.

- **Returns:**  
  - A `Promise<APIResponse>` that resolves to the APIResponse.

### ✔️ apiGet

**Description:**  
Makes a GET request to the specified URL and adds the API response to the UI.

- **Parameters:**
  - `params` *(Object)*: The parameters for the function.
    - `request` *(APIRequestContext)*: The APIRequestContext fixture.
    - `page` *(Page)*: The Page fixture.
  - `url` *(string)*: The URL to send the GET request to.
  - `options` *(object, optional)*: Optional parameters for the GET request.

- **Returns:**  
  - A `Promise<APIResponse>` that resolves to the APIResponse.

### ✔️ apiPost

**Description:**  
Sends a POST request to the specified URL and adds the API response to the UI.

- **Parameters:**
  - `params` *(Object)*: The parameters for the function.
    - `request` *(APIRequestContext)*: The APIRequestContext fixture.
    - `page` *(Page)*: The Page fixture.
  - `url` *(string)*: The URL to send the POST request to.
  - `options` *(object, optional)*: Optional settings for the POST request.

- **Returns:**  
  - A `Promise<APIResponse>` that resolves to the APIResponse.

### ✔️ apiPut

**Description:**  
Sends a PUT request to the specified URL and adds the API response to the UI.

- **Parameters:**
  - `params` *(Object)*: The parameters for the function.
    - `request` *(APIRequestContext)*: The APIRequestContext fixture.
    - `page` *(Page)*: The Page fixture.
  - `url` *(string)*: The URL to send the PUT request to.
  - `options` *(object, optional)*: Optional settings for the PUT request.

- **Returns:**  
  - A `Promise<APIResponse>` that resolves to the APIResponse.

### ✔️ apiDelete

**Description:**  
Sends a DELETE request to the specified URL and adds the API response to the UI.

- **Parameters:**
  - `params` *(Object)*: The parameters for the function.
    - `request` *(APIRequestContext)*: The APIRequestContext fixture.
    - `page` *(Page)*: The Page fixture.
  - `url` *(string)*: The URL to send the DELETE request to.
  - `options` *(object, optional)*: Optional settings for the DELETE request.

- **Returns:**  
  - A `Promise<APIResponse>` that resolves to the APIResponse.

### ✔️ apiPatch

**Description:**  
Sends a PATCH request to the specified URL and updates the UI with the response.

- **Parameters:**
  - `params` *(Object)*: The parameters for the function.
    - `request` *(APIRequestContext)*: The APIRequestContext fixture.
    - `page` *(Page)*: The Page fixture.
  - `url` *(string)*: The URL to send the PATCH request to.
  - `options` *(object, optional)*: Optional settings for the PATCH request.

- **Returns:**  
  - A `Promise<APIResponse>` that resolves to the API response.

### ✔️ apiHead

**Description:**  
Sends a HEAD request to the specified URL and adds the API response to the UI.

- **Parameters:**
  - `params` *(Object)*: The parameters for the function.
    - `request` *(APIRequestContext)*: The APIRequestContext fixture.
    - `page` *(Page)*: The Page fixture.
  - `url` *(string)*: The URL to send the HEAD request to.
  - `options` *(object, optional)*: Optional parameters for the HEAD request.

- **Returns:**  
  - A `Promise<APIResponse>` that resolves to the API response.


## Usage

### How to Use this Library

This library introduces new functions for the Playwright request methods: `get`, `post`, `put`, `patch`, `delete`, `head` and `fetch` within the `APIRequestContext` class. These methods display API request and response information in the **Playwright UI**.

To utilize these functions, include the following import statement at the top of your test file:

```js
import { apiFetch, apiGet, apiPost, apiPut, apiDelete, apiPatch, apiHead } from 'pw-api-plugin';
```

> Note: You do not need to import all seven functions—only those you will use in your tests.

Since API request and response information is displayed in the Playwright UI, these new API functions require an object containing the `request` and `page` fixtures as the first parameter. The remaining parameters will be the same as in the original Playwright request.

For example, if an API call using Playwright's standard `get` is:

```js
const responseGet = await request.get(`${baseUrl}/posts/1`);
```

Then, using the new `apiGet` function, the call will be:

```js
const responseGet = await apiGet({ request, page }, `${baseUrl}/posts/1`);
```


### Examples

```js
// tests/example.spec.ts

import { test, expect } from '@playwright/test';
import { apiFetch, apiGet, apiPost, apiPut, apiDelete, apiPatch, apiHead } from 'pw-api-plugin';


test.describe('API Tests for https://jsonplaceholder.typicode.com', () => {

    const baseUrl = 'https://jsonplaceholder.typicode.com';

    test('Testing API Endpoints - Perform Single Call for Each CRUD Operation (GET, HEAD, POST, PUT, PATCH, DELETE)', async ({ request, page }) => {

        // ✔️ Example of apiGet
        const responseGet = await apiGet({ request, page }, `${baseUrl}/posts/1`);
        expect(responseGet.status()).toBe(200);
        const responseBodyGet = await responseGet.json();
        expect(responseBodyGet).toHaveProperty('id', 1);


        // ✔️ Example of apiHead
        const responseHead = await apiHead({ request, page }, `${baseUrl}/posts/1`);
        expect(responseHead.status()).toBe(200);


        // ✔️ Example of apiPost (with request body and request headers)
        const responsePost = await apiPost({ request, page }, `${baseUrl}/posts`, {
            body: {
                title: 'foo',
                body: 'bar',
                userId: 1,
            },
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });
        expect(responsePost.status()).toBe(201);
        const responseBodyPost = await responsePost.json();
        expect(responseBodyPost).toHaveProperty('id', 101);


        // ✔️ Example of apiPut (with request body and request headers)
        const responsePut = await apiPut({ request, page }, 'https://jsonplaceholder.typicode.com/posts/1', {
            body: {
                id: 1,
                title: 'foo',
                body: 'bar',
                userId: 1,
            },
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        expect(responsePut.ok()).toBeTruthy();
        const responseBodyPut = await responsePut.json();
        expect(responseBodyPut).toHaveProperty('id', 1);


        // ✔️ Example of apiPatch (with request body and request headers)
        const responsePatch = await apiPatch({ request, page }, 'https://jsonplaceholder.typicode.com/posts/1', {
            body: {
                title: 'foo',
            },
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        expect(responsePatch.ok()).toBeTruthy();


        // ✔️ Example for apiDelete
        const responseDelete = await apiDelete({ request, page }, 'https://jsonplaceholder.typicode.com/posts/1');
        expect(responseDelete.ok()).toBeTruthy();

    })


    test('Verify Single API Call Using apiFetch with Default GET Method', async ({ request, page }) => {

        // ✔️ Example of apiFetch (default GET)
        const responseFetch = await apiFetch({ request, page }, `${baseUrl}/posts`);
        expect(responseFetch.status()).toBe(200);
        const responseBodyFetch = await responseFetch.json();
        expect(responseBodyFetch.length).toBeGreaterThan(4);

    })

})
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.


## Contributing

First off, thanks for taking the time to contribute!

To contribute, please follow the best practices promoted by GitHub on the [Contributing to a project](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project "Contributing to a project") page.

And if you like the project but just don't have the time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which we would also be very happy about:
- Star the project
- Promote it on social media
- Refer this project in your project's readme
- Mention the project at local meetups and tell your friends/colleagues
- Buying me a coffee or contributing to a training session, so I can keep learning and sharing cool stuff with all of you.

<a href="https://www.buymeacoffee.com/sclavijosuero" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 40px !important;width: 150px !important;" ></a>

Thank you for your support!


## Changelog

### [1.0.1]
- Fix depedencies with Playwright

### [1.0.0]
- Initial release.
