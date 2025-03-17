import { test, expect } from '@playwright/test';

import pwApi from '../src/pwApi';


test.describe('API Tests BRUTAL', () => {

    const baseUrl = 'https://jsonplaceholder.typicode.com';

    test('Testing API Endpoints BRUTAL', async ({ request, page }) => {

        for (let i = 0; i < 5; i++) {

            // ✔️ Example of get
            const responseGet = await pwApi.get({ request, page }, `${baseUrl}/posts/1`);
            expect(responseGet.status()).toBe(200);
            const responseBodyGet = await responseGet.json();
            expect(responseBodyGet).toHaveProperty('id', 1);


            // ✔️ Example of head
            const responseHead = await pwApi.head({ request, page }, `${baseUrl}/posts/1`);
            expect(responseHead.status()).toBe(200);


            // ✔️ Example of post (with request body and request headers)
            const responsePost = await pwApi.post({ request, page }, `${baseUrl}/posts`, {
                data: {
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


            // ✔️ Example of put (with request: body, headers, params, timeout, maxRetries)
            const responsePut = await pwApi.put({ request, page }, 'https://jsonplaceholder.typicode.com/posts/1', {
                data: {
                    id: 1,
                    title: 'foo',
                    body: 'bar',
                    userId: 1,
                },
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                params: { _limit: 1000, _details: true },
                timeout: 2000,
                maxRetries: 1
            });
            expect(responsePut.ok()).toBeTruthy();
            const responseBodyPut = await responsePut.json();
            expect(responseBodyPut).toHaveProperty('id', 1);


            // ✔️ Example of patch (with request body and request headers)
            const responsePatch = await pwApi.patch({ request, page }, 'https://jsonplaceholder.typicode.com/posts/1', {
                data: {
                    title: 'hello',
                },
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            expect(responsePatch.ok()).toBeTruthy();


            // ✔️ Example for delete
            const responseDelete = await pwApi.delete({ request, page }, 'https://jsonplaceholder.typicode.com/posts/1');
            expect(responseDelete.ok()).toBeTruthy();

            // ✔️ Example fetch (default GET)
            const responseFetch = await pwApi.fetch({ request, page }, `${baseUrl}/posts`);
            expect(responseFetch.status()).toBe(200);
            const responseBodyFetch = await responseFetch.json();
            expect(responseBodyFetch.length).toBeGreaterThan(4);

            // ❌ Example for get with wrong URL
            const responseError = await pwApi.get({ request, page }, `${baseUrl}/this-is-a-non-sense-endpoint`);
            expect(responseError.status()).toBe(404)
        }

    })
})
