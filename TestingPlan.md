# Testing Plan

The testing plan for the coinbase web project is seperated to 4 sections, which corresponds to the 4 main scripts of the project: server.js, my_asset.js, all_product.js, and App.js

## Testing Plan for server.js 

The server should be tested to ensure it:

- Handles requests correctly across different endpoints.
- Validates and processes parameters correctly.
- Executes external scripts and handles their output appropriately.
- Integrates effectively with external APIs.
- Manages errors and unexpected situations robustly.


Testing Tools: 

- Jest: For running unit and integration tests.
- Supertest: To make HTTP requests to the server within tests.
- Mocking Libraries (e.g., jest.mock): To mock dependencies like axios and exec.
- dotenv: For managing environment variables during tests.


### Detailed Testing Steps

#### 1. Unit Testing

**Functions**

- **isValidDate**:
  - Test with valid and invalid ISO strings.
  - Check for proper boolean returns.
  - Tested manually, the locks on date works just as expected 


**Middleware**

- **Rate Limiting**:
  - Simulate multiple requests to test if the rate limiting kicks in as expected.
  - Ensure that after the limit is reached, the server responds with the correct HTTP status code.

- **CORS**:
  - Test with requests from allowed and not allowed origins to ensure CORS headers are set correctly.

#### 2. Integration Testing

**API Endpoints**

- **GET /api/prices**:
  - Mock axios to simulate API responses from the external service.
  - Test with both valid and invalid query parameters.
  - Check the response format and status codes.
  - Tested manually, the get call functions as expected when the server is on.

- **GET /api/sandbox-assets**:
  - Mock exec to simulate both successful and error scenarios.
  - Verify the parsing and handling of stdout.
  - Test error handling when stderr or execution errors occur.
  - Tested manually, the get call functions as expected when the server is on.


**External Script Execution**

- **runAllProductScript and related operations:**:
  - Mock exec to simulate the running of the script.
  - Test handling of stdout, stderr, and errors.


#### 3. End-to-End Testing

- **Use Supertest to simulate full request/response cycles.**

- **Combine tests for rate limiting, CORS, and API responses to simulate realistic server usage.**


#### 4. Error Handling

- **Test for unexpected exceptions and errors in routes and middleware.**

- **Ensure that all endpoints handle failures (like API downtime or invalid responses) gracefully.**


#### 5. Security Testing

- **Check that all sensitive endpoints are protected against common vulnerabilities like XSS, and CSRF.**

- **Verify that sensitive data is not logged or exposed in error messages or responses.**

- **With this being said, the Sandbox My Asset confirguration has to be moved to config file**


#### 6. Performance Testing

- **Assess the server's performance under load, particularly for the more data-intensive endpoints like /api/prices.**

### Continuous Integration Setup

- Integrate these tests into a CI pipeline using GitHub Actions.

- Configure tests to run on pushes and pull requests to ensure that new changes do not break existing functionality.

### Additional Considerations

- Environment Configuration: Ensure tests run in a controlled environment where variables like API keys and other configurations are securely managed.

- Test Coverage: Aim for high test coverage to catch as many issues as possible before deployment.


## Testing Plan for my_asset.js 


### Overview
The script should be tested to ensure it:
1. Correctly generates HMAC signatures and sets HTTP headers.
2. Properly handles API responses, including successful data fetches and various error scenarios.
3. Accurately processes and formats the fetched data.
4. Manages errors robustly and logs them appropriately.

### Testing Tools
- **Jest**: For running tests and asserting outcomes.
- **nock**: To mock HTTP requests and responses from the Coinbase API.
- **sinon** or **jest.spyOn()**: To spy on and assert calls to console methods and process methods.

### Detailed Testing Steps

#### 1. Unit Testing

##### Authentication and Request Setup

- **HMAC Signature Generation**:

  - Test that the HMAC signature is correctly generated using the provided API secret, timestamp, method, and request path.

  - Assert that the `axios` request is configured with the correct headers including the generated HMAC signature.

##### API Request Configuration

- Mock `axios.request` using nock to simulate API responses.

- Test the script with both successful and erroneous API responses to verify correct handling and logging.

#### 2. Integration Testing

##### Data Processing and Output

- **Successful API Response**:
  - Simulate a successful response from the API with a predefined set of account data.

  - Verify that the script processes this data correctly into the desired format.

  - Ensure that the processed data is outputted correctly using `process.stdout.write`.

- **Error Handling**:

  - Simulate various API errors (e.g., network issues, 401 Unauthorized, 500 Internal Server Errors).

  - Test how the script handles these errors, focusing on error logging and process exiting with an error code.

#### 3. Functional Testing

- Combine tests for HMAC generation, API communication, data processing, and error handling to ensure that the entire script functions as expected from start to finish.

#### 4. Security Testing

- **Sensitive Data Handling**:

  - Ensure that API keys and secrets are not exposed in any logs or error messages.

  - Test the secure storage and usage of credentials.

#### 5. Performance Testing

- Assess how the script handles large volumes of data from the API to ensure it processes data efficiently without performance degradation.

### Continuous Integration Setup

- Integrate these tests into your CI/CD pipeline to run automatically on code commits and before deployments.

- Use environment variables for API keys and secrets in the CI environment to ensure security.

### Additional Considerations

- **Robustness**: Since the script relies on external APIs, include tests for handling unexpected changes in the API's response format.

- **Documentation**: Ensure that changes in API handling are documented, and test cases are updated accordingly to maintain relevance.


## Testing Plan for all_product.js

### Overview
The script should be tested to ensure it:
1. Correctly makes HTTP requests to the Coinbase API with the appropriate headers.
2. Accurately processes the API response into the desired data format.
3. Correctly writes the processed data to a file.
4. Handles errors robustly across all operations.

### Testing Tools
- **Jest**: For running unit and integration tests.
- **nock**: To mock HTTP requests and responses.
- **mock-fs**: To mock file system operations.
- **sinon** or **jest.spyOn()**: To spy on and assert calls to console methods and process methods.

### Detailed Testing Steps

#### 1. Unit Testing

##### API Request Configuration

- **HTTP Request Setup**:
  - Test that the script sets up the HTTP request with correct headers and URL.
  - Use `nock` to mock the API endpoint and assert the request headers and method.

##### Data Processing

- **parseAndSaveData Function**:
  - Provide mock response data from the API and test the parsing logic.
  - Ensure the function correctly structures the data into dictionaries and arrays as expected.
  - Test sorting logic within the dictionary processing.

##### File Operations

- **saveToJson Function**:
  - Mock the file system using `mock-fs`.
  - Test the function's ability to write to a file correctly and handle file write errors.

#### 2. Integration Testing

##### End-to-End Script Execution

- Mock both the API response and file system to test the script from start to finish:
  - Use `nock` to provide a mocked successful API response.
  - Use `mock-fs` to handle file operations.
  - Verify that the script processes the API data and writes it to the correct file path and format.
  - Ensure error handling is triggered appropriately under failure scenarios, such as API failures or file writing errors.

#### 3. Error Handling Testing

- **API Error Responses**:
  - Simulate different error responses (e.g., 400 Bad Request, 500 Internal Server Error) and ensure they are handled correctly.
  - Check the robustness of the script in handling network issues or timeouts.

- **File Writing Errors**:
  - Test reaction to file system errors, ensuring errors are logged and the process does not exit silently or with incorrect status.

#### 4. Security Testing

- **Sensitive Data Handling**:
  - Ensure that no sensitive data from the API is logged or exposed in error messages.
  - Test that error handling does not inadvertently log sensitive information.

#### 5. Performance Testing

- **Data Volume Handling**:
  - Test the script's performance when processing large volumes of data to ensure it remains efficient and does not crash.

### Continuous Integration Setup

- Integrate these tests into your CI/CD pipeline to ensure they run with every commit.
- Securely manage API keys and endpoints within the CI environment using environment variables.

### Additional Considerations

- **Maintainability**: As the Coinbase API evolves, ensure that the script and tests are updated to handle new data structures or endpoints.
- **Documentation**: Keep documentation up-to-date with details on the script’s functionality and any dependencies on external APIs.


## Testing plan for App.js

### Overview

The `App` component should be tested to ensure it:
1. Renders correctly and initializes state as expected.
2. Handles user inputs and state changes properly.
3. Communicates correctly with backend APIs.
4. Displays data correctly and updates the UI in response to user actions and API responses.
5. Manages errors and displays appropriate messages or fallbacks.

### Testing Tools

- **Jest**: For running unit and integration tests.
- **React Testing Library**: For rendering components and interacting with them as a user would.
- **MSW (Mock Service Worker)**: To intercept and mock HTTP requests for testing API interactions.
- **Jest Mock Functions**: To spy on and test event handler functions.

### Detailed Testing Steps

#### 1. Unit Testing

##### Component Rendering and Initial State

- **Initial Render**:
  - Test that `App` renders without crashing.
  - Verify initial state setup for `currencyPairsState`, `sandboxAssets`, and `showSandboxAssets`.

##### Utility Functions

- **`granularityToString`**:
  - Test this function with each known granularity input to ensure it returns the correct string.
  - Include a test for unexpected granularity values to check the fallback scenario.

#### 2. Integration Testing

##### State Management and User Interactions

- **Adding and Removing Currency Pairs**:
  - Simulate user interactions for adding and removing currency pairs.
  - Assert that the state updates correctly after each interaction.

- **Date and Granularity Changes**:
  - Test changes to date and granularity inputs and verify that state updates correctly.
  - Check for proper handling of boundary conditions like end dates before start dates.

##### API Interactions

- **Fetch Sandbox Assets**:
  - Use MSW to mock the backend response for the sandbox assets API.
  - Simulate clicking the "My Sandbox Asset" button and verify that the API is called.
  - Check that the state updates correctly with the fetched data and that the data is displayed correctly.

#### 3. Component Testing

- **Rendering Based on State**:
  - Test conditional rendering logic, such as showing or hiding sandbox assets based on `showSandboxAssets`.
  - Verify that components like `AssetPriceGraph` receive the correct props based on the state.

#### 4. End-to-End Testing

- Use React Testing Library to simulate complete user flows:
  - Adding multiple currency pairs, changing their parameters, and verifying that corresponding components update correctly.
  - Interacting with the application to fetch and display sandbox assets, then hiding them.

#### 5. Error Handling and Edge Cases

- **API Error Handling**:
  - Mock an API failure using MSW and ensure the component handles it gracefully, displaying error messages or fallback UI components.
  - Test error scenarios where user inputs might lead to invalid API requests.

#### 6. Performance and Security Testing

- **Performance**: Ensure the component handles a large number of currency pairs efficiently without significant performance degradation.
- **Security**: Test for potential security vulnerabilities related to user input and data display.

### Continuous Integration Setup
- Configure your CI pipeline (e.g., GitHub Actions) to run these tests on every commit and pull request to ensure new changes do not introduce regressions.

### Additional Considerations

- **Accessibility Testing**: Use tools like axe-core to ensure that the component is accessible, checking for proper use of ARIA attributes and keyboard navigability.
- **Responsive Design Testing**: Verify that the application renders correctly on different screen sizes and orientations.

