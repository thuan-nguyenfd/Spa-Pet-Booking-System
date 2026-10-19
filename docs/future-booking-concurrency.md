# Future booking concurrency work

Booking and staff availability are not implemented in this scaffold. Before implementing booking, design concurrency control so simultaneous requests cannot reserve the same staff member for overlapping time intervals. The business requirements mention Redis/concurrency control; evaluate the final deployment topology and database transaction strategy before selecting an implementation. Keep conflict validation on the backend.
