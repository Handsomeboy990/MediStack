# Testing strategy, Backend

## Test levels

- Unit tests: isolated business services with mocked Prisma dependencies.
  Target: computation rules (invoice total, remaining balance), status
  transitions, validations.
- Integration tests: controllers with the Nest module loaded and a dedicated
  test PostgreSQL database. Target: API contract (HTTP codes, `{ data, meta }`
  and `{ error }` formats, pagination).
- End to end tests (e2e): critical journeys (invoice creation, payment
  collection, cancellation, stock movement).

## Tools

- Jest as the test runner.
- `@nestjs/testing` for the test module.
- An isolated test PostgreSQL database, reset between suites.

## Priorities for the hackathon

1. Unit tests on billing computation and remaining balance.
2. Integration tests on pagination and response format.
3. One e2e test on the cash desk journey (invoice creation then payment).

## Conventions

- `*.spec.ts` files colocated with the code under test.
- Test data created through explicit factories, no dependency on execution
  order.
- No real external network call in tests.

## Current state

The Jest tooling is configured. The test suites remain to be written as the
modules are implemented.
