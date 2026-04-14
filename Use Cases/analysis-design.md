# Container Delivery Management System
## Software Engineering Analysis & Design

---

## 1. Use Case Tables

---

### UC-01: Create Job

| Field | Description |
|---|---|
| **Use Case ID** | UC-01 |
| **Use Case Name** | Create Job |
| **Actor(s)** | Dispatcher |
| **Description** | The dispatcher creates a new delivery job by entering pickup/drop-off locations, date, container type, and quantity. |
| **Preconditions** | Dispatcher is logged in. Customer exists in the system. |
| **Main Flow** | 1. Dispatcher selects "Create New Job". <br> 2. System displays the job creation form. <br> 3. Dispatcher enters pickup location, drop-off location, date, container type, and quantity. <br> 4. Dispatcher selects an existing customer. <br> 5. Dispatcher submits the form. <br> 6. System validates the input. <br> 7. System saves the job with status **Draft**. <br> 8. System confirms job creation. |
| **Alternate Flow** | 6a. If required fields are missing, system displays validation errors and prompts dispatcher to correct them. |
| **Postconditions** | A new job is created with status "Draft" and is visible in the dispatch board. |

---

### UC-02: Assign Resources to Job

| Field | Description |
|---|---|
| **Use Case ID** | UC-02 |
| **Use Case Name** | Assign Resources to Job |
| **Actor(s)** | Dispatcher |
| **Description** | The dispatcher assigns a container, truck, and driver to a confirmed job. |
| **Preconditions** | Job exists with status "Confirmed". Available container, truck, and driver exist in the system. |
| **Main Flow** | 1. Dispatcher opens a confirmed job. <br> 2. System displays available containers, trucks, and drivers. <br> 3. Dispatcher selects a container, truck, and driver. <br> 4. System checks for scheduling conflicts. <br> 5. Dispatcher confirms the assignment. <br> 6. System updates job status to **Assigned**. <br> 7. System notifies the assigned driver. |
| **Alternate Flow** | 4a. If a conflict is detected (same truck/driver already booked), system alerts the dispatcher and requests a different selection. |
| **Postconditions** | Job status is "Assigned". Driver, truck, and container are linked to the job. |

---

### UC-03: Update Job Status

| Field | Description |
|---|---|
| **Use Case ID** | UC-03 |
| **Use Case Name** | Update Job Status |
| **Actor(s)** | Driver |
| **Description** | The driver updates the delivery job status as it progresses through the delivery lifecycle. |
| **Preconditions** | Driver is logged in. A job is assigned to the driver. |
| **Main Flow** | 1. Driver opens the assigned job. <br> 2. Driver selects the new status (e.g., "In Transit" or "Delivered"). <br> 3. System validates the status transition. <br> 4. System saves the updated status. <br> 5. System notifies the dispatcher of the update. |
| **Alternate Flow** | 3a. If the status transition is invalid (e.g., jumping from "Assigned" to "Closed"), system rejects it and displays an error. |
| **Postconditions** | Job status is updated. Dispatcher and relevant staff can see the new status. |

---

### UC-04: Upload Proof of Delivery (POD)

| Field | Description |
|---|---|
| **Use Case ID** | UC-04 |
| **Use Case Name** | Upload Proof of Delivery |
| **Actor(s)** | Driver |
| **Description** | After completing a delivery, the driver uploads a proof of delivery document or photo. |
| **Preconditions** | Driver is logged in. Job status is "Delivered". |
| **Main Flow** | 1. Driver opens the delivered job. <br> 2. Driver selects "Upload POD". <br> 3. Driver attaches a file (photo or document). <br> 4. System validates the file format and size. <br> 5. System saves the POD and links it to the job. <br> 6. System confirms successful upload. |
| **Alternate Flow** | 4a. If the file format is unsupported or exceeds size limits, system displays an error and prompts re-upload. |
| **Postconditions** | POD is stored in the system and linked to the job. Job is ready for invoicing. |

---

### UC-05: Manage Container Inventory

| Field | Description |
|---|---|
| **Use Case ID** | UC-05 |
| **Use Case Name** | Manage Container Inventory |
| **Actor(s)** | Yard Staff |
| **Description** | Yard staff update container status, location, and condition as containers are checked in or out of the yard. |
| **Preconditions** | Yard staff is logged in. Containers exist in the system. |
| **Main Flow** | 1. Yard staff opens the container list. <br> 2. Yard staff selects a container. <br> 3. Yard staff updates the status (available / reserved / in use) and location. <br> 4. If damaged, yard staff logs a damage/inspection report. <br> 5. System saves the changes. <br> 6. System reflects updated availability. |
| **Alternate Flow** | 4a. If a damage report is filed, system flags the container as unavailable until cleared. |
| **Postconditions** | Container status and location are up to date. Dispatchers see accurate availability. |

---

### UC-06: Create Invoice

| Field | Description |
|---|---|
| **Use Case ID** | UC-06 |
| **Use Case Name** | Create Invoice |
| **Actor(s)** | Accountant |
| **Description** | After a job is delivered and POD is uploaded, the accountant generates an invoice for the customer. |
| **Preconditions** | Accountant is logged in. Job status is "Delivered" and POD is uploaded. |
| **Main Flow** | 1. Accountant opens the list of uninvoiced delivered jobs. <br> 2. Accountant selects a job and clicks "Create Invoice". <br> 3. System auto-populates job details, customer info, and applicable charges. <br> 4. Accountant reviews and adds any extra charges (waiting time, extra stops). <br> 5. Accountant confirms and submits the invoice. <br> 6. System generates the invoice and marks job as **Invoiced**. <br> 7. System sends the invoice to the customer. |
| **Alternate Flow** | 3a. If job details are incomplete, system alerts the accountant and prevents invoice creation. |
| **Postconditions** | Invoice is created and sent to the customer. Job status is updated to "Invoiced". |

---

### UC-07: Track Payment

| Field | Description |
|---|---|
| **Use Case ID** | UC-07 |
| **Use Case Name** | Track Payment |
| **Actor(s)** | Accountant |
| **Description** | The accountant records and tracks customer payments against outstanding invoices. |
| **Preconditions** | Invoice exists with status "Unpaid". |
| **Main Flow** | 1. Accountant opens the invoice list. <br> 2. Accountant selects an unpaid invoice. <br> 3. Accountant records the payment (amount, date, method). <br> 4. System updates the invoice status to **Paid**. <br> 5. System updates financial reports. |
| **Alternate Flow** | 3a. If partial payment is recorded, system marks invoice as **Partially Paid** and tracks the remaining balance. |
| **Postconditions** | Payment is recorded. Invoice status reflects the payment. Financial reports are updated. |

---

### UC-08: Manage Users

| Field | Description |
|---|---|
| **Use Case ID** | UC-08 |
| **Use Case Name** | Manage Users |
| **Actor(s)** | Admin |
| **Description** | The admin creates, edits, and deactivates user accounts, and assigns roles to system users. |
| **Preconditions** | Admin is logged in. |
| **Main Flow** | 1. Admin navigates to User Management. <br> 2. Admin selects "Add User" or selects an existing user. <br> 3. Admin enters or edits user details (name, email, role). <br> 4. System validates the information. <br> 5. System saves the user account and sends login credentials if new. |
| **Alternate Flow** | 4a. If the email already exists, system prompts the admin with a duplicate warning. |
| **Postconditions** | User account is created or updated. User can log in with their assigned role. |

---

### UC-09: View Reports

| Field | Description |
|---|---|
| **Use Case ID** | UC-09 |
| **Use Case Name** | View Reports |
| **Actor(s)** | Admin, Accountant |
| **Description** | Authorized users view operational and financial reports such as jobs per week, revenue per customer, and unpaid invoices. |
| **Preconditions** | User is logged in with Admin or Accountant role. |
| **Main Flow** | 1. User navigates to the Reports module. <br> 2. User selects the report type and date range. <br> 3. System retrieves and displays the relevant data. <br> 4. User can export the report as PDF or CSV. |
| **Alternate Flow** | 3a. If no data exists for the selected range, system displays a "No data available" message. |
| **Postconditions** | Report is displayed. User can download or print the report. |

---

### UC-10: Track Job (Customer)

| Field | Description |
|---|---|
| **Use Case ID** | UC-10 |
| **Use Case Name** | Track Job |
| **Actor(s)** | Customer |
| **Description** | The customer tracks the status of their delivery job through the customer portal. |
| **Preconditions** | Customer is logged in. A job has been created for the customer. |
| **Main Flow** | 1. Customer logs into the portal. <br> 2. Customer views their list of jobs. <br> 3. Customer selects a job. <br> 4. System displays the current job status and estimated delivery details. |
| **Alternate Flow** | 4a. If the job status has not been updated by the driver, system shows last known status with a timestamp. |
| **Postconditions** | Customer is informed of the current delivery status. |

---

## 2. Data Flow Diagram (DFD)

---

### Level 0 — Context Diagram

The system receives inputs from six external entities and produces outputs back to them.

| External Entity | Inputs to System | Outputs from System |
|---|---|---|
| **Dispatcher** | Job details, resource assignments | Job confirmations, dispatch board view |
| **Driver** | Status updates, POD uploads | Assigned job details, notifications |
| **Yard Staff** | Container status updates, inspection reports | Container availability data |
| **Accountant** | Invoice creation, payment records | Invoice documents, financial reports |
| **Admin** | User management, system configuration | User accounts, system settings |
| **Customer** | Job tracking requests | Job status, invoice copies |

---

### Level 1 — DFD (Main Processes)

```
[Dispatcher] ──job data──────────────▶ (1.0 Job Management) ──job record──▶ {Jobs DB}
                                              │
                                    resource assignment
                                              │
                                              ▼
[Dispatcher] ──assignment data──────▶ (2.0 Dispatch & Scheduling) ──assignment──▶ {Assignments DB}
                                              │
                                    job notification
                                              │
                                              ▼
[Driver] ◀──assigned job details───── (2.0 Dispatch & Scheduling)
[Driver] ──status update / POD──────▶ (3.0 Delivery Management) ──status──▶ {Jobs DB}
                                              │
                                        POD document
                                              │
                                              ▼
                                         {Documents DB}

[Yard Staff] ──container updates────▶ (4.0 Container Management) ──container record──▶ {Containers DB}
                                              │
                                    availability data
                                              │
                                              ▼
                                    (2.0 Dispatch & Scheduling)

[Accountant] ◀──delivered job data── (3.0 Delivery Management)
[Accountant] ──invoice request──────▶ (5.0 Invoicing & Payments) ──invoice──▶ {Invoices DB}
                                              │
                                      invoice document
                                              │
                                              ▼
                                          [Customer]

[Customer] ──tracking request───────▶ (1.0 Job Management) ──job status──▶ [Customer]

[Admin] ──user data─────────────────▶ (6.0 User Management) ──user record──▶ {Users DB}

[Admin / Accountant] ──report req───▶ (7.0 Reporting) ◀──data── {Jobs DB, Invoices DB}
                                              │
                                         report output
                                              │
                                              ▼
                                    [Admin / Accountant]
```

---

### DFD Process Descriptions

| Process ID | Process Name | Description |
|---|---|---|
| 1.0 | Job Management | Handles creation, editing, and status tracking of delivery jobs. |
| 2.0 | Dispatch & Scheduling | Assigns containers, trucks, and drivers to jobs. Checks for conflicts. |
| 3.0 | Delivery Management | Tracks driver status updates and manages POD uploads. |
| 4.0 | Container Management | Manages container inventory, location, and condition. |
| 5.0 | Invoicing & Payments | Creates invoices after delivery and records customer payments. |
| 6.0 | User Management | Admin-controlled creation and management of user accounts and roles. |
| 7.0 | Reporting | Generates operational and financial reports from system data. |

### Data Stores

| ID | Data Store | Description |
|---|---|---|
| D1 | Jobs DB | Stores all job records including status, stops, and notes. |
| D2 | Assignments DB | Stores resource assignments (driver, truck, container per job). |
| D3 | Containers DB | Stores container records including type, condition, and location. |
| D4 | Documents DB | Stores uploaded documents including PODs and delivery notes. |
| D5 | Invoices DB | Stores invoice and payment records. |
| D6 | Users DB | Stores user accounts and role assignments. |
