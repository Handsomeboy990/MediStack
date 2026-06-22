# Testing strategy, Frontend

## Test levels

- Component tests: rendering and interactions of isolated components (role
  cards, screen templates, forms).
- UI integration tests: full screens with the HTTP client mocked (mock of
  `apiClient`), checking the loading, success and error states.
- End to end tests (e2e): user journeys in a browser (login, role navigation,
  form submission).

## Tools under consideration

- Testing Library for component tests.
- A mock of the centralized HTTP client to isolate the frontend from the backend.
- Playwright for e2e tests.

## Priorities for the hackathon

1. Check that `apiClient` correctly handles `{ data, meta }` responses and
   `{ error }` errors.
2. Check the translation of error codes into user messages.
3. One e2e test on the login journey and role navigation.

## Conventions

- No real network call in tests: the HTTP client is mocked.
- Explicit test data, independent of execution order.
- Check that no raw technical message is displayed to the user.

## Current state

No test suite has been written yet. The tooling will be added with the first
screens connected to the API.
