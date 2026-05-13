DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS inspections;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS stops;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS containers;
DROP TABLE IF EXISTS trucks;
DROP TABLE IF EXISTS drivers; 
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- ============================================================
--  TABLE: roles
-- ============================================================

CREATE TABLE roles (
    role_id     INT             AUTO_INCREMENT PRIMARY KEY,
    role_name   VARCHAR(50)     NOT NULL UNIQUE,
    description VARCHAR(255)
);

INSERT INTO roles (role_name, description) VALUES
    ('Admin',       'Full access to all system modules and user management'),
    ('Dispatcher',  'Creates jobs and assigns resources'),
    ('Driver',      'Views assigned jobs, updates status, uploads POD'),
    ('Yard Staff',  'Manages container check-in/out and inspections'),
    ('Accountant',  'Handles invoicing, payments, and reports'),
    ('Customer',    'Requests deliveries and tracks job status');

-- ============================================================
--  TABLE: users
-- ============================================================

CREATE TABLE users (
    user_id         INT             AUTO_INCREMENT PRIMARY KEY,
    role_id         INT             NOT NULL,
    full_name       VARCHAR(100)    NOT NULL,
    email           VARCHAR(150)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    phone           VARCHAR(20),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- ============================================================
--  TABLE: customers
-- ============================================================

CREATE TABLE customers (
    customer_id     INT             AUTO_INCREMENT PRIMARY KEY,
    company_name    VARCHAR(150)    NOT NULL,
    contact_name    VARCHAR(100),
    email           VARCHAR(150),
    phone           VARCHAR(20),
    billing_address TEXT,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
--  TABLE: drivers
-- ============================================================

CREATE TABLE drivers (
    driver_id       INT             AUTO_INCREMENT PRIMARY KEY,
    user_id         INT             UNIQUE,
    full_name       VARCHAR(100)    NOT NULL,
    license_number  VARCHAR(50)     NOT NULL UNIQUE,
    license_expiry  DATE            NOT NULL,
    phone           VARCHAR(20),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_drivers_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- ============================================================
--  TABLE: trucks
-- ============================================================

CREATE TABLE trucks (
    truck_id        INT             AUTO_INCREMENT PRIMARY KEY,
    plate_number    VARCHAR(20)     NOT NULL UNIQUE,
    model           VARCHAR(100),
    capacity_tons   DECIMAL(6,2),
    status          ENUM('Available','In Use','Maintenance') NOT NULL DEFAULT 'Available',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  TABLE: containers
-- ============================================================

CREATE TABLE containers (
    container_id    INT             AUTO_INCREMENT PRIMARY KEY,
    container_code  VARCHAR(30)     NOT NULL UNIQUE,
    type            ENUM('20ft','40ft','40ft HC','Reefer','Open Top','Flat Rack') NOT NULL,
    condition_state ENUM('Good','Damaged','Under Inspection') NOT NULL DEFAULT 'Good',
    status          ENUM('Available','Reserved','In Use')     NOT NULL DEFAULT 'Available',
    current_location VARCHAR(200),
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
--  TABLE: jobs
-- ============================================================

CREATE TABLE jobs (
    job_id          INT             AUTO_INCREMENT PRIMARY KEY,
    customer_id     INT             NOT NULL,
    created_by      INT             NOT NULL,
    job_status      ENUM(
                        'Draft',
                        'Confirmed',
                        'Assigned',
                        'In Transit',
                        'Delivered',
                        'Closed',
                        'Invoiced'
                    ) NOT NULL DEFAULT 'Draft',
    container_type  ENUM('20ft','40ft','40ft HC','Reefer','Open Top','Flat Rack') NOT NULL,
    quantity        INT             NOT NULL DEFAULT 1,
    scheduled_date  DATE            NOT NULL,
    notes           TEXT,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_jobs_customer    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    CONSTRAINT fk_jobs_created_by  FOREIGN KEY (created_by)  REFERENCES users(user_id)
);

-- ============================================================
--  TABLE: stops
--  Each job has at least one pickup and one drop-off stop.
-- ============================================================

CREATE TABLE stops (
    stop_id         INT             AUTO_INCREMENT PRIMARY KEY,
    job_id          INT             NOT NULL,
    stop_type       ENUM('Pickup','Drop-off') NOT NULL,
    location        VARCHAR(255)    NOT NULL,
    scheduled_date  DATE            NOT NULL,
    completed_at    DATETIME,
    notes           TEXT,

    CONSTRAINT fk_stops_job FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE
);

-- ============================================================
--  TABLE: assignments
--  Links a job to a specific container, truck, and driver.
-- ============================================================

CREATE TABLE assignments (
    assignment_id   INT             AUTO_INCREMENT PRIMARY KEY,
    job_id          INT             NOT NULL UNIQUE,
    container_id    INT             NOT NULL,
    truck_id        INT             NOT NULL,
    driver_id       INT             NOT NULL,
    assigned_by     INT             NOT NULL,
    assigned_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_assignments_job       FOREIGN KEY (job_id)       REFERENCES jobs(job_id),
    CONSTRAINT fk_assignments_container FOREIGN KEY (container_id) REFERENCES containers(container_id),
    CONSTRAINT fk_assignments_truck     FOREIGN KEY (truck_id)     REFERENCES trucks(truck_id),
    CONSTRAINT fk_assignments_driver    FOREIGN KEY (driver_id)    REFERENCES drivers(driver_id),
    CONSTRAINT fk_assignments_assigned  FOREIGN KEY (assigned_by)  REFERENCES users(user_id)
);

-- ============================================================
--  TABLE: documents
--  Stores all job-related documents (POD, waybill, etc.)
-- ============================================================

CREATE TABLE documents (
    document_id     INT             AUTO_INCREMENT PRIMARY KEY,
    job_id          INT             NOT NULL,
    uploaded_by     INT             NOT NULL,
    doc_type        ENUM(
                        'Proof of Delivery',
                        'Delivery Note',
                        'Waybill',
                        'Handover Form',
                        'Damage Checklist',
                        'Other'
                    ) NOT NULL,
    file_path       VARCHAR(500)    NOT NULL,
    uploaded_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_documents_job      FOREIGN KEY (job_id)      REFERENCES jobs(job_id),
    CONSTRAINT fk_documents_uploaded FOREIGN KEY (uploaded_by) REFERENCES users(user_id)
);

-- ============================================================
--  TABLE: inspections
--  Container inspection and damage reports by yard staff.
-- ============================================================

CREATE TABLE inspections (
    inspection_id   INT             AUTO_INCREMENT PRIMARY KEY,
    container_id    INT             NOT NULL,
    inspected_by    INT             NOT NULL,
    inspection_date DATE            NOT NULL,
    condition_found ENUM('Good','Damaged','Needs Repair') NOT NULL,
    notes           TEXT,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_inspections_container  FOREIGN KEY (container_id) REFERENCES containers(container_id),
    CONSTRAINT fk_inspections_inspected  FOREIGN KEY (inspected_by) REFERENCES users(user_id)
);

-- ============================================================
--  TABLE: invoices
-- ============================================================

CREATE TABLE invoices (
    invoice_id      INT             AUTO_INCREMENT PRIMARY KEY,
    job_id          INT             NOT NULL UNIQUE,
    customer_id     INT             NOT NULL,
    created_by      INT             NOT NULL,
    issue_date      DATE            NOT NULL,
    due_date        DATE,
    subtotal        DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    extra_charges   DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    total_amount    DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    status          ENUM('Unpaid','Partially Paid','Paid') NOT NULL DEFAULT 'Unpaid',
    notes           TEXT,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_invoices_job      FOREIGN KEY (job_id)      REFERENCES jobs(job_id),
    CONSTRAINT fk_invoices_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    CONSTRAINT fk_invoices_created  FOREIGN KEY (created_by)  REFERENCES users(user_id)
);

-- ============================================================
--  TABLE: payments
-- ============================================================

CREATE TABLE payments (
    payment_id      INT             AUTO_INCREMENT PRIMARY KEY,
    invoice_id      INT             NOT NULL,
    recorded_by     INT             NOT NULL,
    amount          DECIMAL(10,2)   NOT NULL,
    payment_date    DATE            NOT NULL,
    payment_method  ENUM('Bank Transfer','Cash','Cheque','Card','Other') NOT NULL,
    notes           TEXT,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payments_invoice  FOREIGN KEY (invoice_id)  REFERENCES invoices(invoice_id),
    CONSTRAINT fk_payments_recorded FOREIGN KEY (recorded_by) REFERENCES users(user_id)
);

-- ============================================================
--  SAMPLE DATA
-- ============================================================

-- Sample users
INSERT INTO users (role_id, full_name, email, password_hash, phone) VALUES
    (1, 'Brian Doci',     'brian@cdms.com',     'hashed_pw_1', '+355 69 111 1111'),
    (2, 'Irda Elezi',     'irda@cdms.com',       'hashed_pw_2', '+355 69 222 2222'),
    (3, 'Arjon Beka',     'arjon@cdms.com',      'hashed_pw_3', '+355 69 333 3333'),
    (4, 'Mira Leka',      'mira@cdms.com',       'hashed_pw_4', '+355 69 444 4444'),
    (5, 'Antigoni Dinko', 'antigoni@cdms.com',   'hashed_pw_5', '+355 69 555 5555'),
    (6, 'Altin Hoxha',    'altin@customer.com',  'hashed_pw_6', '+355 69 666 6666');

-- Sample customers
INSERT INTO customers (company_name, contact_name, email, phone, billing_address) VALUES
    ('Hoxha Logistics SH.P.K',   'Altin Hoxha',  'altin@hoxhalogistics.al',  '+355 4 111 2222', 'Rruga e Kavajës, Tiranë'),
    ('Adriatik Cargo S.A',        'Suela Marku',  'suela@adriatikcargo.al',   '+355 4 333 4444', 'Rruga Durrësit, Durrës'),
    ('Besa Import Export',        'Genti Basha',  'genti@besaimpex.al',       '+355 4 555 6666', 'Lagjia 1, Shkodër');

-- Sample trucks
INSERT INTO trucks (plate_number, model, capacity_tons, status) VALUES
    ('AA 001 BB', 'Mercedes Actros', 25.00, 'Available'),
    ('AA 002 CC', 'Volvo FH',        28.00, 'Available'),
    ('AA 003 DD', 'MAN TGX',         22.00, 'Maintenance');

-- Sample containers
INSERT INTO containers (container_code, type, condition_state, status, current_location) VALUES
    ('CDMS-001', '20ft',    'Good',    'Available', 'Main Yard - Tiranë'),
    ('CDMS-002', '40ft',    'Good',    'Available', 'Main Yard - Tiranë'),
    ('CDMS-003', '40ft HC', 'Damaged', 'Available', 'Main Yard - Tiranë'),
    ('CDMS-004', 'Reefer',  'Good',    'Available', 'Main Yard - Tiranë');

-- Sample driver
INSERT INTO drivers (user_id, full_name, license_number, license_expiry, phone) VALUES
    (3, 'Arjon Beka', 'AL-DRV-20341', '2027-06-30', '+355 69 333 3333');

-- Sample job
INSERT INTO jobs (customer_id, created_by, job_status, container_type, quantity, scheduled_date, notes) VALUES
    (1, 2, 'Assigned', '20ft', 1, '2026-05-10', 'Handle with care — fragile goods.');

-- Sample stops for job 1
INSERT INTO stops (job_id, stop_type, location, scheduled_date) VALUES
    (1, 'Pickup',   'Main Yard - Tiranë',          '2026-05-10'),
    (1, 'Drop-off', 'Hoxha Logistics, Rruga e Kavajës', '2026-05-10');

-- Sample assignment for job 1
INSERT INTO assignments (job_id, container_id, truck_id, driver_id, assigned_by) VALUES
    (1, 1, 1, 1, 2);

-- ============================================================
--  USEFUL QUERIES
-- ============================================================


SELECT
    j.job_id,
    c.company_name      AS customer,
    j.job_status,
    j.scheduled_date,
    d.full_name         AS driver,
    t.plate_number      AS truck,
    cn.container_code   AS container
FROM jobs j
JOIN customers   c   ON j.customer_id    = c.customer_id
LEFT JOIN assignments a   ON j.job_id    = a.job_id
LEFT JOIN drivers     d   ON a.driver_id = d.driver_id
LEFT JOIN trucks      t   ON a.truck_id  = t.truck_id
LEFT JOIN containers  cn  ON a.container_id = cn.container_id
ORDER BY j.scheduled_date DESC;


SELECT
    i.invoice_id,
    c.company_name  AS customer,
    i.issue_date,
    i.due_date,
    i.total_amount,
    i.status
FROM invoices i
JOIN customers c ON i.customer_id = c.customer_id
WHERE i.status != 'Paid'
ORDER BY i.due_date ASC;


SELECT
    container_id,
    container_code,
    type,
    condition_state,
    current_location
FROM containers
WHERE status = 'Available'
  AND condition_state = 'Good';

SELECT
    j.job_id,
    c.company_name  AS customer,
    j.scheduled_date,
    j.job_status
FROM jobs j
JOIN customers c ON j.customer_id = c.customer_id
WHERE j.job_status = 'Delivered'
  AND MONTH(j.scheduled_date) = MONTH(CURRENT_DATE())
  AND YEAR(j.scheduled_date)  = YEAR(CURRENT_DATE());


SELECT
    c.company_name,
    COUNT(i.invoice_id)     AS total_invoices,
    SUM(i.total_amount)     AS total_revenue
FROM invoices i
JOIN customers c ON i.customer_id = c.customer_id
WHERE i.status = 'Paid'
GROUP BY c.customer_id, c.company_name
ORDER BY total_revenue DESC;


SELECT
    full_name,
    license_number,
    license_expiry,
    DATEDIFF(license_expiry, CURRENT_DATE()) AS days_remaining
FROM drivers
WHERE license_expiry <= DATE_ADD(CURRENT_DATE(), INTERVAL 60 DAY)
  AND is_active = TRUE
ORDER BY license_expiry ASC;
