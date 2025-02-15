import { test, expect } from '@playwright/test';

test.describe('Product Search Functionality - UAT', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.waitForSelector('[data-testid="product-section"]');
    });

    test('UAT-001: Search Response Time', async ({ page }) => {
        // Arrange
        await page.waitForLoadState('networkidle');
        const searchInput = page.getByRole('textbox', { name: /search/i });
        await searchInput.waitFor({ state: 'visible' });

        // Act - Record start time after page and elements are fully loaded
        const startTime = Date.now();
        await searchInput.fill('ap');
        await searchInput.press('Enter');

        // Wait for search results to update
        await page.waitForSelector('[data-testid="product-section"]');

        // Calculate response time
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        // Assert: Response Time
        expect(responseTime).toBeLessThan(2000, 'Search took longer than 2 seconds');

        // Assert: Search Results
        const productSection = page.locator('[data-testid="product-section"]');
        await expect(productSection).toBeVisible();

        // Get and verify search results
        const productNames = await page.locator('[data-testid="product-name"]').allTextContents();
        console.log('Response Time:', responseTime + 'ms');
        console.log('Found products:', productNames);

        // Verify search results contain the search term
        const hasMatchingProduct = productNames.some(name =>
            name.toLowerCase().includes('ap')
        );

        // Multiple assertions to verify search functionality
        expect(hasMatchingProduct, 'No matching products found').toBeTruthy();
        expect(productNames.length).toBeGreaterThan(0, 'No products returned');
    });

    test('UAT-002: Search by full name using search button', async ({ page }) => {
        // Arrange
        await page.waitForLoadState('networkidle');

        // ค้นหา elements
        const searchInput = page.getByRole('textbox', { name: 'search' });
        const searchButton = page.getByTestId('search-button');

        // รอให้ elements พร้อมใช้งาน
        await searchInput.waitFor({ state: 'visible' });
        await searchButton.waitFor({ state: 'visible' });

        // Act
        await searchInput.fill('Asparagus');
        await searchButton.click();

        // รอให้ผลการค้นหาอัพเดท
        await page.waitForTimeout(1000);

        // Get results
        const productNames = await page.locator('[data-testid="product-name"]').allTextContents();
        console.log('Found products:', productNames);

        // Assert
        const hasPartialMatch = productNames.some(name =>
            name.toLowerCase().includes('asparagus')
        );
        expect(hasPartialMatch).toBeTruthy();
    });

    test('UAT-003: Search by partial name using search button', async ({ page }) => {
        // Arrange
        await page.waitForLoadState('networkidle');

        // ค้นหา elements
        const searchInput = page.getByRole('textbox', { name: 'search' });
        const searchButton = page.getByTestId('search-button');

        // รอให้ elements พร้อมใช้งาน
        await searchInput.waitFor({ state: 'visible' });
        await searchButton.waitFor({ state: 'visible' });

        // Act
        await searchInput.fill('Asp');
        await searchButton.click();

        // รอให้ผลการค้นหาอัพเดท
        await page.waitForTimeout(1000);

        // Get results
        const productNames = await page.locator('[data-testid="product-name"]').allTextContents();
        console.log('Found products:', productNames);

        // Assert
        const hasPartialMatch = productNames.some(name =>
            name.toLowerCase().includes('asp')
        );
        expect(hasPartialMatch).toBeTruthy();
    });
});