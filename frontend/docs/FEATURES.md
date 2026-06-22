# Features, Frontend

## Available screens (skeleton)

| Route | Screen | Status |
| --- | --- | --- |
| / | Role selection | Working |
| /login | Login | Placeholder (disabled form) |
| /director | Director space | Placeholder |
| /cashier-manager | Cash manager space | Placeholder |
| /cashier | Cashier space | Placeholder |
| /storekeeper | Storekeeper space | Placeholder |
| /hr | HR space | Placeholder |

## Functions per role (target)

### Director
- Activity dashboard, statistics, revenue, cash desk monitoring.

### Cash manager
- Payment monitoring, handling of cancellation requests, cash desk closing.

### Cashier
- Patient registration, one or two emergency contacts, invoice creation,
  payment collection, cancellation request.

### Storekeeper
- Stock state, inbound, outbound, threshold alerts.

### HR
- Staff management, account creation, role assignment.

## To implement

- Real authentication and session handling.
- Forms connected to the API through `apiClient`.
- Paginated lists (patients, invoices, payments, stock).
- Statistics display.
- Role based access guards on the interface side.
