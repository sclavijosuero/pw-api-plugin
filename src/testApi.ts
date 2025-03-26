/**
 * A conditional Playwright test extension based on the `LOG_API_UI` environment variable.
 * If `LOG_API_UI` is not set to 'false', the base API is used as-is.
 * Otherwise, the base API is extended with the `page` fixture disabled.
 */

import { test as base, TestType, PlaywrightTestArgs, PlaywrightTestOptions, PlaywrightWorkerArgs, PlaywrightWorkerOptions } from '@playwright/test';

export const testApi: TestType<PlaywrightTestArgs & PlaywrightTestOptions, PlaywrightWorkerArgs & PlaywrightWorkerOptions> = (process.env.LOG_API_UI !== 'false') ? base : base.extend({
    page: async ({}, use) => {
        // @ts-ignore
        await use(undefined);
    },
});
