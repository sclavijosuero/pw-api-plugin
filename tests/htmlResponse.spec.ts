import http from 'http';
import { AddressInfo } from 'net';
import { expect } from '@playwright/test';

import { pwApi, axiosApi, test } from '../src/index';


test.describe('Non-JSON (HTML) response handling', () => {

    let server: http.Server;
    let baseUrl: string;

    const htmlBody = `<!DOCTYPE html>
<html>
<head><title>405 Not Allowed</title></head>
<body>
    <h1>405 Method Not Allowed</h1>
    <script>window.__pwnedByScript = true;</script>
    <img src="x" onerror="window.__pwnedByHandler = true">
    <p onclick="window.__pwnedByHandler = true">click me</p>
</body>
</html>`;

    test.beforeAll(async () => {
        server = http.createServer((req, res) => {
            res.writeHead(405, { 'Content-Type': 'text/html' });
            res.end(htmlBody);
        });
        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        const { port } = server.address() as AddressInfo;
        baseUrl = `http://127.0.0.1:${port}`;
    });

    test.afterAll(async () => {
        await new Promise<void>((resolve) => server.close(() => resolve()));
    });

    const assertRenderedSafely = async (page: import('@playwright/test').Page) => {
        // No iframes anywhere on the card.
        expect(await page.locator('iframe').count()).toBe(0);

        const host = page.locator('.pw-html-render-host').first();
        await expect(host).toBeVisible();

        const shadowInspection = await host.evaluate((el) => {
            const shadow = (el as HTMLElement).shadowRoot;
            return {
                hasShadowRoot: !!shadow,
                hasScriptTag: !!shadow?.querySelector('script'),
                hasEventHandlerMarkup: (shadow?.innerHTML || '').includes('onerror') || (shadow?.innerHTML || '').includes('onclick'),
                text: shadow?.textContent || '',
            };
        });

        expect(shadowInspection.hasShadowRoot).toBe(true);
        expect(shadowInspection.hasScriptTag).toBe(false);
        expect(shadowInspection.hasEventHandlerMarkup).toBe(false);
        expect(shadowInspection.text).toContain('405 Method Not Allowed');
    };

    test('pwApi does not crash and safely renders an HTML error response', async ({ request, page }) => {
        const response = await pwApi.get({ request, page }, `${baseUrl}/method-not-allowed`);
        expect(response.status()).toBe(405);

        await assertRenderedSafely(page);
    });

    test('axiosApi does not crash and safely renders an HTML error response', async ({ page }) => {
        const response = await axiosApi.get({ page }, `${baseUrl}/method-not-allowed`, {
            validateStatus: (status: number) => status === 405,
        });
        expect(response.status).toBe(405);

        await assertRenderedSafely(page);
    });

    test('sanitization actually prevents the response HTML from executing script/handlers', async ({ request, page }) => {
        // This exercises the shared sanitizer in displayUi.ts (used by both pwApi and axiosApi),
        // so it only needs to run once rather than once per API surface.
        const response = await pwApi.get({ request, page }, `${baseUrl}/method-not-allowed`);
        expect(response.status()).toBe(405);

        const pwned = await page.evaluate(() => ({
            byScript: (window as any).__pwnedByScript,
            byHandler: (window as any).__pwnedByHandler,
        }));
        expect(pwned.byScript).toBeUndefined();
        expect(pwned.byHandler).toBeUndefined();
    });
});
