## Prerequisites

Ensure you have the following installed:
1. Node.js (v18+)
2. PostgreSQL Database

## Installation and Configuration

### 1. Clone Repository
Clone this repository or download the source code.
```bash
git clone https://github.com/alvanhan/TestApp.git
cd TestApp
```

### 2. Install Dependencies
Run the following command in your terminal:
```bash
npm install
```

### 3. Setup Database
1. Create a new database in PostgreSQL named "skilltest".
2. Execute the SQL script from the "schema.sql" file into that database to create the necessary tables.

### 4. Configure Environment
Create or adjust the .env file with your database configuration:

```env
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=skilltest
DB_PORT=5432
JWT_SECRET=supersecretkey123
```

### 5. Run Application
To start the server:
```bash
npx ts-node src/app.ts
```
The server will be active at http://localhost:3000.

## API Documentation

Note: The header "Authorization: Bearer <token>" is required for protected endpoints.

### 1. Authentication
a. Register User
- Method: POST
- URL: /auth/register
- Body: { "email": "...", "phone": "...", "password": "...", "name": "..." }

b. Login Email
- Method: POST
- URL: /auth/login-email
- Body: { "email": "...", "password": "..." }

c. Login Phone
- Method: POST
- URL: /auth/login-phone
- Body: { "phone": "...", "password": "..." }

### 2. Orders (Transactions)
This endpoint is protected (requires Token). It handles order creation with anti-race condition mechanisms.

- Method: POST
- URL: /orders
- Body: { "items_total": 150000 }

### 3. Reports
This endpoint is protected (requires Token).

- Method: GET
- URL: /reports/top-customers

### 4. External
- Method: GET
- URL: /external/posts

## Race Condition Handling

To prevent transaction number duplication during high traffic, this system applies Database Transactions with Locking.

Process Flow:
1. Start Transaction (BEGIN).
2. Lock the sequence row in the database (SELECT FOR UPDATE).
3. Update to the latest sequence value (+1).
4. Insert order data with the new sequence number.
5. Commit Transaction (COMMIT).

This method ensures data remains consistent and sequential.

---
Author: Alvanhan
