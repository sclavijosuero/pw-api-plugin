/**
 * A conditional Playwright test extension based on the `LOG_API_UI` environment variable.
 * If `LOG_API_UI` is set to 'true', the base API is used as-is.
 * Otherwise, the base API is extended disabling the `page` fixture.
 */

import { test as base } from '@playwright/test';

export const testApi = (process.env.LOG_API_UI === 'true') ? base : base.extend({
    page: async ({}, use) => {
        await use(undefined);
    },
});