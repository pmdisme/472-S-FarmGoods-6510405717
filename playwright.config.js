import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './acceptance-test',

    testMatch: [
        "**/?(*.)+(spec).js?(x)"
    ],

    use: {
        // Record video for all tests
        video: 'on',
    },
    // Configure test projects for major browsers
    projects: [
        {
            name: 'chromium',
            use: {
                viewport: { width: 1280, height: 720 },
            },
        },
    ],
    // Configure recording options
    reporter: 'html',
    // Save videos in a specific directory
    outputDir: 'test-results/',
});