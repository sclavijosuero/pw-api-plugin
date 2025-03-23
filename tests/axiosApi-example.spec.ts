import { expect } from '@playwright/test';

import { axiosApi, test } from '../src/index';


test.describe('AXIOS API Tests for https://jsonplaceholder.typicode.com', () => {

    const baseUrl = 'https://jsonplaceholder.typicode.com';

    test('Verify axiosApi GET, HEAD, POST, PUT, PATCH, DELETE in single test', async ({ page }) => {

        // ✔️ Example of get
        const responseGet = await axiosApi.get({ page }, `${baseUrl}/posts/1`)
        expect(responseGet.status).toBe(200)
        const responseBodyGet = await responseGet.data
        expect(responseBodyGet).toHaveProperty('id', 1)


        // ✔️ Example of head
        const responseHead = await axiosApi.head({ page }, `${baseUrl}/posts/1`)
        expect(responseHead.status).toBe(200)


        // ✔️ Example of post (with request: body, headers, params)
        const responsePost = await axiosApi.post({ page }, `${baseUrl}/posts`,
            {
                title: 'foo',
                body: 'bar',
                userId: 1,
            },
            {
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            }
        )
        expect(responsePost.status).toBe(201)
        const responseBodyPost = await responsePost.data
        expect(responseBodyPost).toHaveProperty('id', 101)


        // ✔️ Example of put (with request body and request headers)
        const responsePut = await axiosApi.put({ page }, 'https://jsonplaceholder.typicode.com/posts/1',
            {
                id: 1,
                title: 'foo',
                body: 'bar',
                userId: 1,
            },
            {
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                params: { _limit: 1000, _details: true },
                timeout: 2000,
                maxRetries: 1
            }
        )
        expect(responsePut.status).toBe(200)
        const responseBodyPut = await responsePut.data
        expect(responseBodyPut).toHaveProperty('id', 1)


        // ✔️ Example of patch (with request body and request headers)
        const responsePatch = await axiosApi.patch({ page }, 'https://jsonplaceholder.typicode.com/posts/1',
            {
                title: 'hello',
            },
            {
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            }
        )
        expect(responsePatch.status).toBe(200)


        // ✔️ Example for delete
        const responseDelete = await axiosApi.delete({ page }, 'https://jsonplaceholder.typicode.com/posts/1')
        expect(responsePatch.status).toBe(200)

    })


    test('Verify axiosApi REQUEST (using default GET)', async ({ page }) => {

        // ✔️ Example fetch (default GET)
        const responseRequest = await axiosApi.request({ page }, { url: `${baseUrl}/posts`, params: { _limit: 20000, _details: true }})
        expect(responseRequest.status).toBe(200)
        const responseBodyRequest = await responseRequest.data
        expect(responseBodyRequest.length).toBeGreaterThan(4)

    })


    test('Verify axiosApi POST with Multiple Request Tabs', async ({ page }) => {

        // ✔️ Example of post (with request: body, headers, params, timeout, maxRetries)
        const responsePost = await axiosApi.post({ page }, `${baseUrl}/posts`,
            {
                id: 1,
                title: 'foo',
                body: 'bar',
                userId: 1,
            },
            {
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                params: { _limit: 1000, _details: true },
                timeout: 2000,
                maxRetries: 1,
                responseType: 'json',
                auth: {
                    username: 'john.wick',
                    password: 'babayaga'
                },
            }
        )
        expect(responsePost.status).toBe(201)
        const responseBodyPost = await responsePost.data
        expect(responseBodyPost).toHaveProperty('id', 101)

    })


    test('Verify axiosApi for methods axios(config) and axios(url, config)', async ({ page }) => {

        // ✔️ Example of axios(config)
        const responseAxios1 = await axiosApi.axios({ page }, { url: `${baseUrl}/posts/1`, params: { _details: true },
            validateStatus: (status: number) => status === 200
        })
        expect(responseAxios1.status).toBe(200)
        const responseBodyAxios1 = await responseAxios1.data
        expect(responseBodyAxios1).toHaveProperty('id', 1)

        // ✔️ Example of axios(url, config)
        const responseAxios2 = await axiosApi.axios({ page }, `${baseUrl}/posts/1`, { params: { _getid: true }})
        expect(responseAxios2.status).toBe(200)
        const responseBodyAxios2 = await responseAxios2.data
        expect(responseBodyAxios2).toHaveProperty('id', 1)

    })


    test('Verify axiosApi for Failing GET Method (404)', async ({ page }) => {

        // ❌ Example for get with wrong URL
        const responseFetch = await axiosApi.get({ page }, `${baseUrl}/this-is-a-non-sense-endpoint`,
            { validateStatus: (status: number) => status === 404 }
        )
        expect(responseFetch.status).toBe(404)

    })
})
