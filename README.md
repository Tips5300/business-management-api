# Business Management API

A fully functional backend API for a Business Management application built with TypeScript, Express.js, TypeORM, and SQLite. This server exposes generic REST endpoints covering CRUD operations, search/filter/sort/pagination, soft-delete/restore, import/export (JSON, CSV, XLSX), and automatic journal-entry creation for financial transactions.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)

   1. [Prerequisites](#prerequisites)
   2. [Installation](#installation)
   3. [Environment Variables](#environment-variables)
   4. [Running the Server](#running-the-server)
4. [Project Structure](#project-structure)
5. [Entities & DTOs](#entities--dtos)
6. [Authentication & Authorization](#authentication--authorization)
7. [CRUD Endpoints](#crud-endpoints)

   1. [Query Parameters](#query-parameters)
   2. [Soft Delete & Restore](#soft-delete--restore)
   3. [Hard Delete](#hard-delete)
   4. [Import / Export](#import--export)
8. [Automatic Journal Entries](#automatic-journal-entries)
9. [Validation](#validation)
10. [Error Handling](#error-handling)
11. [Pagination, Sorting, Filtering & Search](#pagination-sorting-filtering--search)
12. [Examples](#examples)

    1. [Create an Account](#create-an-account)
    2. [Get All Purchases (with Filters)](#get-all-purchases-with-filters)
    3. [Export Sales to CSV](#export-sales-to-csv)
    4. [Import Expenses from XLSX](#import-expenses-from-xlsx)
13. [Customizing & Extending](#customizing--extending)
14. [Testing](#testing)
15. [Deployment](#deployment)
16. [Contributing](#contributing)
17. [License](#license)

---

## Features

* **Generic CRUD** for all entities
* **Search, Filter, Sort & Pagination** via query string
* **Soft Delete & Restore** (records are never physically removed until hard delete)
* **Hard Delete** for permanent removal
* **Import & Export** data in JSON, CSV, and XLSX formats
* **DTO-based Validation** with `class-validator` & `class-transformer`
* **Automatic Journal Entries** for financial transactions (Purchase, Sale, Expense, Transaction, Stock Adjustment, Stock Transfer, etc.)
* **JWT Authentication** middleware (stubbed—plug into your user system)
* **Error Handling** with consistent JSON responses
* **Configurable “Searchable Fields”** in `entitiesMap`

---

## Tech Stack

* **Node.js (v16+)**
* **Express.js** (HTTP server)
* **TypeScript** (strong typing, decorators)
* **TypeORM** (ORM with SQLite)
* **SQLite** (file-based relational database)
* **class-validator & class-transformer** (DTO validation)
* **fast-csv & xlsx** (import/export)
* **multer** (file uploads)
* **jsonwebtoken & bcryptjs** (authentication stubs)
* **dotenv** (environment variables)

---

## Getting Started

### Prerequisites

* **Node.js** (version 16 or higher)
* **npm** (comes with Node)
* (Optional) **SQLite GUI** if you want to inspect the database file

### Installation

1. **Unzip** the source (if you downloaded a zip).

2. **Navigate** to the project directory:

   ```bash
   cd business-management-api
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

### Environment Variables

Create a file named `.env` in the root directory and set:

```ini
PORT=4000
DB_PATH=database.sqlite
JWT_SECRET=your_jwt_secret_here
```

* `PORT`: TCP port where Express will listen (default: 4000).
* `DB_PATH`: Path to the SQLite database file.
* `JWT_SECRET`: Secret key used to sign and verify JWT tokens (required by `authMiddleware`).

### Running the Server

* **Development** (with hot-reload via `ts-node-dev`):

  ```bash
  npm run dev
  ```

* **Production** (compile & run):

  ```bash
  npm run build
  npm start
  ```

Once running, you’ll see:

```
Database connected
Server listening on port 4000
```

---

## Project Structure

```
business-management-api/
├─ package.json
├─ tsconfig.json
├─ README.md
├─ .env
├─ src/
│  ├─ index.ts
│  ├─ ormconfig.ts
│  ├─ config/
│  │   └─ entities.ts
│  ├─ controllers/
│  │   └─ base.controller.ts
│  ├─ routes/
│  │   └─ index.ts
│  ├─ services/
│  │   └─ base.service.ts
│  ├─ middlewares/
│  │   ├─ auth.middleware.ts
│  │   ├─ validation.middleware.ts
│  │   └─ error.middleware.ts
│  ├─ utils/
│  │   ├─ api-features.ts
│  │   ├─ export.util.ts
│  │   └─ import.util.ts
│  ├─ entities/
│  │   └─ (all your TypeORM entity classes, e.g., Account.ts, Purchase.ts, etc.)
│  ├─ dtos/
│  │   └─ (all your CreateXDto.ts and UpdateXDto.ts files)
│  └─ entities_and_dtos.txt
```

* **`src/index.ts`**

  * Boots Express and TypeORM, mounts `/api` router, and starts listening.

* **`src/ormconfig.ts`**

  * Configures TypeORM to use SQLite, points to `src/entities/`.

* **`src/config/entities.ts`**

  * Defines `entitiesMap`, linking entity classes to their DTOs, “searchable fields,” and optional `journalConfig`.

* **`src/controllers/base.controller.ts`**

  * Generic controller class with methods for create, read, update, soft-delete, restore, hard-delete, import, export.

* **`src/routes/index.ts`**

  * Dynamically builds REST endpoints for every key in `entitiesMap` under `/api/<entityKey>`.

* **`src/services/base.service.ts`**

  * Generic service class implementing all business logic (CRUD + journal entries + import/export + search/filter/sort/paginate).

* **`src/middlewares/`**

  * `auth.middleware.ts`: JWT validation stub (requires you to issue tokens in your own user system).
  * `validation.middleware.ts`: Runs class-validator on incoming DTOs.
  * `error.middleware.ts`: Global error handler, returns JSON `{ error: "message" }`.

* **`src/utils/`**

  * `api-features.ts`: Implements search/filter/sort/paginate on a TypeORM `QueryBuilder`.
  * `export.util.ts`: Functions to export data as JSON / CSV / XLSX.
  * `import.util.ts`: Functions to parse uploaded JSON / CSV / XLSX files into arrays of plain objects.

* **`src/entities/` + `src/dtos/`**

  * Your custom entity definitions (with TypeORM decorators) and DTOs (with class-validator).

---

## Entities & DTOs

You should have one entity class (in `src/entities/`) and two DTO classes (in `src/dtos/`) for each domain object. For example:

* `src/entities/Account.ts`:

  ```ts
  import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';

  @Entity()
  export class Account {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    accountType: string; // e.g. 'Asset', 'Liability', 'Equity', 'Income', 'Expense'

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

    // (Optional) relations to JournalEntry as debit/credit, etc.
  }
  ```

* `src/dtos/CreateAccountDto.ts`:

  ```ts
  import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

  export class CreateAccountDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    accountType: string;
  }
  ```

* `src/dtos/UpdateAccountDto.ts`:

  ```ts
  import { IsString, IsOptional } from 'class-validator';

  export class UpdateAccountDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    accountType?: string;
  }
  ```

Repeat this pattern for every entity: one `EntityClass` and corresponding `CreateXDto` & `UpdateXDto`.

---

## Authentication & Authorization

All API endpoints are protected by the `authMiddleware`, which expects a valid JSON Web Token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

* **Issuing Tokens**: The current code only verifies JWTs—it does not implement user registration or login. You must integrate your own user/role system to:

  1. Create users and hash their passwords (e.g. via `bcryptjs`).
  2. On login, validate credentials and issue a JWT signed with `process.env.JWT_SECRET`, containing payload `{ userId, roles }`.
  3. Attach `req.user = { userId, roles }` in `authMiddleware`.

* **Role‐Based Authorization**: Currently, every route only checks for a valid token. To restrict certain endpoints to specific roles (e.g. only “Admin” can create users), wrap the route with an additional middleware:

  ```ts
  function permit(allowedRoles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      const roles = req.user?.roles || [];
      if (!roles.some((r) => allowedRoles.includes(r))) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      next();
    };
  }

  // usage:
  router.post(
    '/users',
    authMiddleware,
    permit(['Admin']),
    validationMiddleware(CreateUserDto),
    userController.create
  );
  ```

---

## CRUD Endpoints

All endpoints are mounted under the `/api` prefix, grouped by entity key from `entitiesMap`. For example, if you have `entitiesMap['purchase']`, then:

```
/api/purchase
```

is the base path for Purchase endpoints.

### Common CRUD Routes

For each entity `<entityKey>`, the following routes are available:

| Method | Path                               | Description                             | Body                                                  |
| ------ | ---------------------------------- | --------------------------------------- | ----------------------------------------------------- |
| POST   | `/api/<entityKey>`                 | Create a new record                     | JSON matching `Create<Entity>Dto`                     |
| GET    | `/api/<entityKey>`                 | Retrieve a paginated list of records    | —                                                     |
| GET    | `/api/<entityKey>/:id`             | Get a single record by its ID           | —                                                     |
| PUT    | `/api/<entityKey>/:id`             | Update an existing record               | JSON matching `Update<Entity>Dto`                     |
| PATCH  | `/api/<entityKey>/:id/soft-delete` | Soft delete a record (flags it deleted) | —                                                     |
| PATCH  | `/api/<entityKey>/:id/restore`     | Restore a soft-deleted record           | —                                                     |
| DELETE | `/api/<entityKey>/:id`             | Hard delete (permanent) a record        | —                                                     |
| GET    | `/api/<entityKey>/export/:format`  | Export all matching records             | —                                                     |
| POST   | `/api/<entityKey>/import`          | Import data from a file                 | Multipart/Form-Data with field `file` (JSON/CSV/XLSX) |

> All routes require a valid JWT in `Authorization: Bearer <token>`.

---

### Query Parameters

The `GET /api/<entityKey>` (retrieve all) endpoint supports:

1. **Pagination**

   * `page` (integer, default: 1)
   * `limit` (integer, default: 25)

   Example: `?page=2&limit=50`

2. **Sorting**

   * `sort` (string)
   * Comma-separated list of fields. Prefix a field with `-` for descending order.
   * Example: `?sort=-createdAt,name` (sort by `createdAt` DESC, then `name` ASC)

3. **Search**

   * `search` (string)
   * Performs a `LIKE '%search%'` on preconfigured “searchable fields” (see `entitiesMap`).
   * Example: `/api/product?search=widget` (search the `Product` entity’s `searchableFields`)

4. **Filtering**

   * Any other query param not in `search`, `sort`, `page`, `limit`, `export` is treated as a filter.
   * Supports operators: `=`, `>`, `<`, `>=`, `<=`.
   * Example: `?status=Active&amount>1000`

   Implementation:

   * TypeORM QueryBuilder applies `WHERE alias.field = :value` for simple filters.
   * If a key ends with a comparison operator (e.g. `amount>100`), it applies `amount > :value`.

5. **Export Flag (internal)**

   * The parameter `export` can be included to bypass pagination, but is typically handled by the `GET /export/:format` route.

---

### Soft Delete & Restore

* **Soft Delete**: Marks a record as deleted by setting the `deletedAt` timestamp (instead of physically removing).

  * `PATCH /api/<entityKey>/:id/soft-delete`
  * The record remains in the database and can be restored later.

* **Restore**: Clears the `deletedAt` timestamp to bring the record back.

  * `PATCH /api/<entityKey>/:id/restore`

The generic service uses TypeORM’s `softDelete()` and `restore()` methods under the hood.

---

### Hard Delete

* **Hard Delete**: Permanently removes a record.

  * `DELETE /api/<entityKey>/:id`

Once hard-deleted, the record cannot be recovered.

---

### Import / Export

#### Export

* **Path**: `GET /api/<entityKey>/export/:format`
* **Path Param**: `format` ∈ { `json`, `csv`, `xlsx` }
* **Query Params**: All the same as “retrieve all” (search, filter, sort). Pagination is ignored during export.
* **Response**:

  * `application/json` (download `.json`)
  * `text/csv` (download `.csv`)
  * `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (download `.xlsx`)

**Example**:

```
GET /api/sale/export/csv?page=1&limit=10&sort=-saleDate
Authorization: Bearer <token>
```

* Returns a CSV download of all `Sale` records sorted by descending `saleDate`.

#### Import

* **Path**: `POST /api/<entityKey>/import`
* **Headers**: `Content-Type: multipart/form-data`
* **Body**: one file field named `file`, containing JSON, CSV, or XLSX.
* **Behavior**:

  1. Parses the file into an array of plain objects.
  2. For each record, runs `validateOrReject` against the entity’s `Create<Entity>Dto`.
  3. On success, `repo.save()` the new entity.
  4. If `journalConfig` is defined, a `JournalEntry` is created for each row.
  5. Returns a JSON summary:

```json
{
  "results": [
    { "success": true, "record": { /* created record */ } },
    { "success": false, "errors": { /* validation or DB error details */ } },
    …
  ]
}
```

**Example**:

Upload an Excel file `expenses.xlsx`:

```
POST /api/expense/import
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: expenses.xlsx
```

---

## Automatic Journal Entries

Certain entities (configured in `src/config/entities.ts` with `journalConfig`) automatically generate a new `JournalEntry` whenever they are created, updated, soft-deleted, restored, or hard-deleted. The `journalConfig` for each entity defines a function:

```ts
getEntryPayload: (entityInstance) => JournalPayload
```

`JournalPayload`:

```ts
interface JournalPayload {
  date: string;           // YYYY-MM-DD
  refType: string;        // e.g. "SALE", "EXPENSE", "STOCK_ADJUSTMENT", etc.
  refId: string;          // the entity’s primary key
  debitAccountId: string; // Account UUID for debit
  creditAccountId: string;// Account UUID for credit
  amount: number;         // transaction amount
  description: string;    // description/narration
}
```

`BaseService` calls:

1. **On Create**

   * Generate payload from the newly saved entity.
   * Persist a new `JournalEntry` row.

2. **On Update**

   * Re-generate payload (with possibly updated fields) and persist a new `JournalEntry`.

3. **On Soft Delete / Restore / Hard Delete**

   * The default implementation for hard delete sets `refType = "<ENTITY>_DELETE"` with amount = 0.
   * For soft-delete/restore, it reuses `getEntryPayload` on the loaded instance (with or without `deletedAt`).
   * You can customize these as needed (e.g. create a reversal entry when restoring).

The `JournalEntry` entity typically looks like:

```ts
@Entity()
export class JournalEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: string; // "YYYY-MM-DD"

  @Column()
  refType: string;

  @Column()
  refId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'debitAccountId' })
  debitAccount: Account;
  @Column()
  debitAccountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'creditAccountId' })
  creditAccount: Account;
  @Column()
  creditAccountId: string;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  createdBy?: number; // userId who triggered it

  // (Optional) updatedAt, deletedAt if you want to log history
}
```

---

## Validation

* **DTO Classes**:

  * `Create<Entity>Dto` and `Update<Entity>Dto` use `class-validator` decorators (`@IsString()`, `@IsNotEmpty()`, `@IsOptional()`, `@IsNumber()`, etc.).
  * These DTOs are applied automatically to `POST /api/<entity>` and `PUT /api/<entity>/:id`.

* **validationMiddleware**:

  * Transforms `req.body` into an instance of the DTO (`plainToInstance`).
  * Runs `validate()` and, if any errors, returns `400 Bad Request` with a JSON array of validation errors, e.g.:

    ```json
    {
      "errors": [
        {
          "property": "name",
          "constraints": {
            "isNotEmpty": "name should not be empty"
          }
        },
        …
      ]
    }
    ```

* **Whitelist & Forbid Non-Whitelisted**:

  * Properties not defined in the DTO are stripped from `req.body`.
  * If any extra properties are present, the request is rejected.

---

## Error Handling

A global error handler returns responses in the format:

```json
{
  "error": "<message>"
}
```

* **404 Not Found**:

  * If you request a non-existent record (e.g. `GET /api/purchase/unknown-id`), you receive:

    ```json
    {
      "error": "purchase not found"
    }
    ```

* **400 Validation Errors**:

  * If the request body fails DTO validation, you receive `400` with details of which fields failed.

* **401 Unauthorized**:

  * If your JWT is missing or invalid, you receive:

    ```json
    {
      "error": "Authorization header missing or malformed"
    }
    ```

    or

    ```json
    {
      "error": "Token verification failed"
    }
    ```

* **403 Forbidden** (if you implement role middleware)

* **500 Internal Server Error** for unhandled exceptions.

---

## Pagination, Sorting, Filtering & Search

### Pagination

* Query Params:

  * `page` (integer, default: 1)
  * `limit` (integer, default: 25)

* Response format example:

  ```json
  {
    "data": [
      { /* record 1 */ },
      { /* record 2 */ },
      …
    ],
    "pagination": {
      "page": 2,
      "limit": 25,
      "total": 134
    }
  }
  ```

### Sorting

* Query Param: `sort`
* Format: Comma-separated fields. Prefix with `-` for descending.

  * `?sort=name` → ORDER BY name ASC
  * `?sort=-createdAt,name` → ORDER BY createdAt DESC, name ASC

### Filtering

* Any query param not in `search`, `sort`, `page`, `limit`, `export` is treated as a filter.
* Supports operators by appending `>`, `<`, `>=`, `<=` to the field name.

  Examples:

  * `?status=Active` → WHERE status = 'Active'
  * `?amount>1000` → WHERE amount > 1000
  * `?createdAt>=2025-01-01` → WHERE createdAt >= '2025-01-01'

### Search

* Query Param: `search`
* Performs `LIKE '%<search>%'` on the entity’s configured “searchableFields” (in `entitiesMap`).

  Example:

  * In `entitiesMap`, `product.searchableFields = ['name', 'description']`.
  * `GET /api/product?search=widget`
    → `WHERE product.name LIKE '%widget%' OR product.description LIKE '%widget%'`.

---

## Examples

Below are some common usage examples.

### 1. Create an Account

**Request**

```http
POST /api/account
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Cash",
  "description": "Main cash account",
  "accountType": "Asset"
}
```

**Response** `201 Created`

```json
{
  "id": "a1b2c3d4-5678-90ef-1234-567890abcdef",
  "name": "Cash",
  "description": "Main cash account",
  "accountType": "Asset",
  "createdAt": "2025-06-06T12:34:56.789Z",
  "updatedAt": "2025-06-06T12:34:56.789Z"
}
```

### 2. Get All Purchases (with Filters, Sort, Pagination)

**Request**

```http
GET /api/purchase?status=Pending&amount>500&sort=-createdAt&page=1&limit=10
Authorization: Bearer <token>
```

* Filters: `status = 'Pending'` and `amount > 500`.
* Sort: `createdAt DESC`.
* Pagination: page 1, 10 records per page.

**Response** `200 OK`

```json
{
  "data": [
    {
      "id": "abcd-1234-ef56-7890",
      "vendorName": "Acme Supplies",
      "status": "Pending",
      "totalAmount": 1200,
      "createdAt": "2025-06-05T10:00:00.000Z",
      "updatedAt": "2025-06-05T10:00:00.000Z"
    },
    …
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 37
  }
}
```

### 3. Export Sales to CSV

**Request**

```http
GET /api/sale/export/csv?search=2025-05&sort=-saleDate
Authorization: Bearer <token>
```

* Searches sales where any `searchableField` matches `"%2025-05%"`.
* Sorts by `saleDate` descending.
* Returns a CSV download named `export_20250606_123456.csv`.

### 4. Import Expenses from XLSX

**Request**

```
POST /api/expense/import
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [upload file “expenses.xlsx”]
```

* `expenses.xlsx` must have a header row with columns matching `CreateExpenseDto` properties (e.g. `amount`, `description`, `accountId`, etc.).
* For each row:

  * Parsed into a JS object.
  * Validated against `CreateExpenseDto`.
  * On success: inserted and a `JournalEntry` is automatically created.
  * On failure: captured in the `errors` array.

**Response**

```json
{
  "results": [
    {
      "success": true,
      "record": {
        "id": "ef-01-23-45-67",
        "amount": 250.00,
        "description": "Office Supplies",
        "accountId": "a1b2-3456-78cd-90ef",
        "createdAt": "2025-06-06T12:45:00.000Z",
        "updatedAt": "2025-06-06T12:45:00.000Z"
      }
    },
    {
      "success": false,
      "errors": {
        "property": "amount",
        "constraints": {
          "isNotEmpty": "amount should not be empty"
        }
      }
    }
  ]
}
```

---

## Customizing & Extending

### Adding a New Entity

1. **Create the Entity** in `src/entities/NewEntity.ts`:

   ```ts
   import {
     Entity,
     PrimaryGeneratedColumn,
     Column,
     CreateDateColumn,
     UpdateDateColumn,
     DeleteDateColumn,
   } from 'typeorm';

   @Entity()
   export class NewEntity {
     @PrimaryGeneratedColumn('uuid')
     id: string;

     @Column()
     name: string;

     @Column({ nullable: true })
     description: string;

     @CreateDateColumn() createdAt: Date;
     @UpdateDateColumn() updatedAt: Date;
     @DeleteDateColumn() deletedAt?: Date;
   }
   ```

2. **Create DTOs** in `src/dtos/`:

   * `CreateNewEntityDto.ts`:

     ```ts
     import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

     export class CreateNewEntityDto {
       @IsString()
       @IsNotEmpty()
       name: string;

       @IsString()
       @IsOptional()
       description?: string;
     }
     ```

   * `UpdateNewEntityDto.ts`:

     ```ts
     import { IsString, IsOptional } from 'class-validator';

     export class UpdateNewEntityDto {
       @IsString()
       @IsOptional()
       name?: string;

       @IsString()
       @IsOptional()
       description?: string;
     }
     ```

3. **Add to `entitiesMap`** (`src/config/entities.ts`):

   ```ts
   import { NewEntity } from '../entities/NewEntity';
   import { CreateNewEntityDto } from '../dtos/CreateNewEntityDto';
   import { UpdateNewEntityDto } from '../dtos/UpdateNewEntityDto';

   entitiesMap['newEntity'] = {
     entity: NewEntity,
     createDto: CreateNewEntityDto,
     updateDto: UpdateNewEntityDto,
     journalConfig: undefined, // or your getEntryPayload function
     searchableFields: ['name', 'description'],
   };
   ```

4. **Restart the server**.

   * Now the following endpoints exist automatically under `/api/newEntity`:

     * `POST /api/newEntity`
     * `GET /api/newEntity`
     * `GET /api/newEntity/:id`
     * `PUT /api/newEntity/:id`
     * `PATCH /api/newEntity/:id/soft-delete`
     * `PATCH /api/newEntity/:id/restore`
     * `DELETE /api/newEntity/:id`
     * `GET /api/newEntity/export/:format`
     * `POST /api/newEntity/import`

### Customizing Searchable Fields

In `entitiesMap`, each key can have a `searchableFields: string[]`. When a request includes `?search=<term>`, the service applies a `LIKE '%term%'` filter on those fields. Example:

```ts
entitiesMap['product'] = {
  entity: Product,
  createDto: CreateProductDto,
  updateDto: UpdateProductDto,
  searchableFields: ['name', 'description'],
  journalConfig: undefined,
};
```

### Custom Journal Entries

For financial entities, you provide a `journalConfig` with a `getEntryPayload` callback. Adjust debit/credit account IDs and amounts as needed for your Chart of Accounts. Example for a “Payment” entity:

```ts
const paymentJournalConfig = {
  getEntryPayload: (payment: Payment): JournalPayload => ({
    date: payment.paidAt.toISOString().split('T')[0],
    refType: 'PAYMENT',
    refId: payment.id,
    debitAccountId: 'ACCOUNTS_PAYABLE_UUID',
    creditAccountId: 'CASH_UUID',
    amount: Number(payment.amount),
    description: `Payment for invoice #${payment.invoiceId}`,
  }),
};
```

Then add to `entitiesMap`:

```ts
entitiesMap['payment'] = {
  entity: Payment,
  createDto: CreatePaymentDto,
  updateDto: UpdatePaymentDto,
  journalConfig: paymentJournalConfig,
  searchableFields: ['invoiceId', 'description'],
};
```

---

## Testing

This project does not include prewritten tests out of the box, but you can set up:

1. **Jest & Supertest** (or your preferred test framework).

   * Install: `npm install --save-dev jest ts-jest @types/jest supertest @types/supertest`
   * Configure `jest.config.js` for TypeScript.

2. **In-Memory SQLite** for integration tests.

   * In your tests’ `beforeAll()`, initialize a fresh TypeORM `DataSource` pointing to `:memory:` or a temporary file, run migrations, then run your test suite.
   * Use Supertest to call endpoints on an Express `app` instance (without `.listen()`).

3. **Unit Tests** for DTO validation and any custom service logic.

Example directory structure:

```
business-management-api/
└─ tests/
   ├─ account.test.ts
   ├─ purchase.test.ts
   ├─ sale.test.ts
   └─ …
```

---

## Deployment

### 1. Build & Run

1. **Build** (compile TypeScript):

   ```bash
   npm run build
   ```

2. **Start**:

   ```bash
   npm start
   ```

### 2. Environment Variables

Ensure you set environment variables in your hosting platform (e.g., Heroku, AWS, DigitalOcean):

```
PORT=4000
DB_PATH=/path/to/prod.sqlite
JWT_SECRET=<secure-secret>
```

> **Note**: SQLite is file-based and not ideal for high-traffic, horizontally scaled setups. For production, you may consider migrating to PostgreSQL or MySQL. TypeORM makes it relatively straightforward—just swap the `type: 'sqlite'` to `type: 'postgres'` (and provide connection details in `ormconfig.ts`).

### 3. Docker (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 4000
CMD ["npm", "start"]
```

Build & run:

```bash
docker build -t business-management-api .
docker run -d -p 4000:4000 --name bm-api -e JWT_SECRET=<secret> business-management-api
```

---

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/my-feature`).
3. Make your changes and add tests.
4. Commit and push to your branch.
5. Open a pull request describing your changes.

Be sure to follow coding style, add/update DTOs for new endpoints, and include any required validation.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
