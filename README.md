# swe-analysis-design
# Container Delivery Management System

## What it is
An app for a container delivery company to manage jobs, containers, trucks, drivers, documents, and invoices in one place.

## Main flow
*Job request → Assign resources → Deliver → Invoice*
1. A job is created (pickup, drop-off, date, container type, quantity).
2. A dispatcher assigns container(s), a truck, and a driver.
3. The driver delivers and updates the job status.
4. Proof of delivery is saved.
5. An invoice is created and payment is tracked.

## Modules

### Customers
- Customer info
- Contracts/prices (optional)
- Billing details

### Jobs (Orders)
- Create and edit jobs
- Job status:
  - Draft → Confirmed → Assigned → In Transit → Delivered → Closed → Invoiced
- Notes and file uploads

### Containers
- List of containers (ID, type, condition)
- Where each container is (yard, customer site, on truck)
- Available / reserved / in use
- Damage and inspection reports

### Trucks & Drivers
- Truck list and basic info
- Driver list and license expiry
- Assign driver + truck to jobs

### Scheduling / Dispatch
- Dispatch board (calendar/list)
- Check conflicts (same truck/driver booked twice)

### Documents
- Delivery note / waybill
- Proof of delivery (POD)
- Container handover/return form
- Damage checklist

### Invoices & Payments
- Create invoice after delivery
- Track unpaid/paid
- Extra charges (waiting time, extra stop) (optional)

### Reports
- Jobs per week/month
- On-time deliveries
- Truck/container usage
- Revenue per customer
- Unpaid invoices

## Roles (users)
- *Admin*: manage users and system data
- *Dispatcher*: create jobs, assign containers/trucks/drivers
- *Driver*: see assigned jobs, update status, upload POD
- *Yard staff*: update container check-in/out and inspections
- *Accountant*: invoices, payments, reports
- *Customer (optional)*: request jobs and track status

## Main data (entities)
Customer, Job, Stop (pickup/drop-off), Container, Truck, Driver, Assignment, Document, Invoice, Payment, Inspection, Maintenance (optional).

## MVP features (minimum)
1. Add customers
2. Create jobs (pickup/drop-off/date/container type)
3. Assign container + truck + driver
4. Update job status
5. Upload proof of delivery
6. Create invoice and record payment
7. Basic weekly report
