# K6 Browser Testing Lab

This lab provides hands-on experience with K6 browser testing capabilities, demonstrating various browser automation scenarios including navigation, form interactions, and screenshot capture.

## Prerequisites

- K6 installed on your system
- Basic knowledge of JavaScript and testing concepts

## Lab Structure

```
browser/
├── package.json              # Project configuration and scripts
├── tests/
│   ├── basic-browser-test.js         # Basic page navigation and checks
│   ├── form-interaction-test.js      # Form filling and submission
│   └── navigation-screenshot-test.js # Multi-page navigation with screenshots
├── screenshots/              # Directory for screenshot outputs
└── README.md                # This file
```

## Running the Tests

### Individual Tests

1. **Basic Browser Test**
   ```bash
   npm run test:basic
   ```
   - Navigates to test.k6.io
   - Verifies page title and content
   - Demonstrates basic page checks

2. **Form Interaction Test**
   ```bash
   npm run test:form
   ```
   - Logs into the test site
   - Fills and submits forms
   - Verifies successful interactions

3. **Navigation and Screenshot Test**
   ```bash
   npm run test:nav
   ```
   - Navigates through multiple pages
   - Takes screenshots at each step
   - Demonstrates browser navigation patterns

### Running in Headful Mode

To see the browser in action:
```bash
npm run test:headful
```

### Running All Tests

```bash
npm test
```

## Key Learning Points

### 1. Browser Test Configuration
- Use `shared-iterations` executor for browser tests
- Set browser type to 'chromium'
- Configure appropriate thresholds

### 2. Page Lifecycle Management
- Always use `try/finally` blocks
- Close pages to free resources
- Wait for network idle state

### 3. Element Interaction
- Use `page.locator()` for element selection
- Implement proper waits for dynamic content
- Verify element visibility before interaction

### 4. Performance Monitoring
- Monitor Web Vitals (LCP, FCP)
- Set appropriate thresholds
- Use built-in browser metrics

## Best Practices Demonstrated

1. **Resource Management**: Proper page closing in finally blocks
2. **Async/Await**: Consistent use of async patterns
3. **Error Handling**: Comprehensive checks and validations
4. **Screenshots**: Visual verification and debugging
5. **Performance**: Web Vitals monitoring and thresholds

## Common Issues and Solutions

- **Timeouts**: Increase wait times for slow-loading pages
- **Element Not Found**: Use proper locator strategies
- **Screenshots**: Ensure screenshots directory exists
- **Headless Mode**: Use `K6_BROWSER_HEADLESS=false` for debugging

## Next Steps

1. Modify tests to work with your own applications
2. Add more complex user journeys
3. Implement data-driven testing
4. Add custom metrics and thresholds
5. Integrate with CI/CD pipelines