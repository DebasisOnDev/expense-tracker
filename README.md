# Expense Tracker

A modern, type-safe Expense tracking system built with React, Express, and TypeScript using a monorepo structure with pnpm workspace.

## 🏗 Architecture

### Monorepo Structure

```
├── packages/
│   ├── types/          # Shared TypeScript types and Zod schemas
|── apps/
|   ├── backend/        # Express.js backend server
|   └── frontend/       # React frontend application
```

### Technology Stack

#### Backend

- **Express.js** - Web framework
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **Zod** - Runtime type validation
- **TypeScript** - Type safety

#### Frontend

- **React** - UI framework
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Zod** - Form validation
- **ShadcnUI** - UI components
- **TailwindCSS** - Styling
- **Axios** - HTTP client

#### Shared

- **TypeScript** - Type definitions
- **Zod** - Schema validation
- **PNPM** - Package management

## 🔄 Authentication Flow

1. **Registration**

   ```
   Client → POST /api/auth/register → Validate Input → Hash Password → Create User → Generate Tokens → Return User & Tokens
   ```

2. **Login**

   ```
   Client → POST /api/auth/login → Validate Credentials → Generate Tokens → Return User & Tokens
   ```

3. **Token Refresh**

   ```
   Client → Access Token Expires → Use Refresh Token → Get New Access Token → Continue Using API
   ```

4. **Authentication**

   ```
   Client → Include Access Token in Header → Middleware Validates Token → Allow/Deny Access
   ```

5. **Logout**
   ```
   Client → POST /api/auth/logout → Revoke Refresh Token → Clear Cookies
   ```

## 🔒 Token System

### Access Token

- Short-lived (15 minutes)
- Used for API authentication
- JWT format
- Stored in Client Browser Cookie
- Automatically refreshed when expired

### Refresh Token

- Long-lived (30 days)
- Used to obtain new access tokens
- Secure random token
- Stored in database
- Can be revoked for security
- One refresh token per login session

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- PNPM
- PostgreSQL database

### Installation

1. Clone the repository:

   ```bash
   git clone expense-tracker
   cd expense-tracker
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   **Backend** (`packages/backend/.env`):

   ```
   BACKEND_APP_PORT=3001
   BACKEND_APP_JWT_KEY="your_secret_key"
   DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<your_db_name>?schema=public"
   ```

   **Frontend** (`packages/frontend/.env`):

   ```
   VITE_BACKEND_APP_API_URL="http://localhost:3001"
   ```

4. Initialize the database:

   ```bash
   cd packages/backend
   pnpm prisma db push
   ```

5. Start development servers:
   ```bash
   # Root directory
   pnpm dev
   ```

## 🔌 API Endpoints

### Authentication Routes

#### POST /api/auth/register

```typescript
// Request
{
  email: string; // Valid email
  password: string; // Min 8 characters
  username: string; // Min 2 characters
}

// Response
{
  user: {
    id: string;
    email: string;
    username: string;
    createdAt: string;
    updatedAt: string;
  }
  accessToken: string;
  refreshToken: string;
}
```

#### POST /api/auth/login

```typescript
// Request
{
  email: string;
  password: string;
}

// Response
{
  user: {
    id: string;
    email: string;
    username: string;
    createdAt: string;
    updatedAt: string;
  }
  accessToken: string;
  refreshToken: string;
}
```

#### POST /api/auth/refresh

```typescript
// Request
{
  refreshToken: string;
}

// Response
{
  accessToken: string;
}
```

#### POST /api/auth/logout

```typescript
// Request
{
  refreshToken: string;
}

// Response
{
  message: string;
}
```

#### GET /api/auth/me

```typescript
// Headers
Authorization: Bearer<accessToken>;

// Response
{
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}
```

#### PATCH /api/auth/updateMe

```typescript
// Headers
Authorization: Bearer<accessToken>;

// Request
{
  email: string; // Valid email
  username: string; // Min 2 characters
}

// Response
{
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}
```

#### DELETE /api/auth/updateMe

```typescript
// Headers
Authorization: Bearer<accessToken>;

// Response
{
  message: string;
}
```

### Expense Routes

#### POST /api/expense

```typescript
// Headers
Authorization: Bearer<accessToken>;

// Request
{
  title: string; // Required
  description?: string; // Optional
  amount: number; // Positive number
  category: string; // Min 3 characters
}

// Response
{
  id: string;
  title: string;
  description: string | null;
  amount: number;
  category: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
```

#### GET /api/expense

```typescript
// Headers
Authorization: Bearer<accessToken>;

// Response
{
  expenses: {
    id: string;
    title: string;
    description: string | null;
    amount: number;
    category: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  }
  [];
}
```

#### PATCH /api/expense/:id

```typescript
// Headers
Authorization: Bearer<accessToken>;

// Request
{
  title?: string;
  description?: string;
  amount?: number;
  category?: string;
}

// Response
{
  id: string;
  title: string;
  description: string | null;
  amount: number;
  category: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
```

#### DELETE /api/expense/:id

```typescript
// Headers
Authorization: Bearer<accessToken>;

// Response
{
  message: string;
}
```

## 🔒 Security Features

1. **Token Security**

   - Short-lived access tokens (15 minutes)
   - Secure refresh token rotation
   - Refresh token revocation
   - Token blacklisting support

2. **Password Security**

   - Passwords are hashed using bcrypt
   - Minimum password length enforcement
   - Password never returned in API responses

3. **Input Validation**

   - Zod schema validation
   - Type-safe request handling
   - Sanitized database queries with Prisma

4. **Protected Routes**
   - Frontend route protection
   - Backend middleware authentication
   - Automatic token refresh
   - Secure token storage

## 🔄 Token Refresh Flow

1. **Access Token Expires**

   - Frontend detects 401 response
   - Interceptor catches the error

2. **Automatic Refresh**

   - Uses refresh token to get new access token
   - Handles concurrent requests
   - Updates stored tokens

3. **Error Handling**
   - Invalid refresh token handling
   - Automatic logout on refresh failure
   - Race condition prevention

## 📊 Database Schema

### User Model

```prisma
model User {
  id           String         @id @default(uuid())
  username     String
  email        String         @unique
  password     String
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
  RefreshToken RefreshToken[]
  Expense      Expense[]
}
```

### RefreshToken Model

```prisma
model RefreshToken {
  id        String    @id @default(uuid())
  token     String    @unique
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiredAt DateTime
  createdAt DateTime  @default(now())
  revokedAt DateTime?

  @@index([userId])
}
```

### Expense Model

```prisma
model Expense {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  amount      Float
  title       String
  category    String
  description String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([userId])
}
```

## 🛠 Development Guidelines

1. **Code Style**

   - Use TypeScript for all new code
   - Follow ESLint configuration
   - Use Prettier for formatting

2. **Authentication**

   - Always use the `authenticate` middleware
   - Implement proper token handling
   - Follow security best practices

3. **API Development**

   - Use Zod for validation
   - Implement proper error responses
   - Document new endpoints

4. **Frontend Development**
   - Use ShadcnUI components
   - Handle loading states
   - Proper error handling

## 🔍 Error Handling

1. **Backend Errors**

   - Token validation errors
   - Authentication errors
   - Database errors
   - Validation errors

2. **Frontend Errors**
   - Token refresh errors
   - API request failures
   - Form validation
   - Network issues

## 📦 Available Scripts

```bash
# Link .env file across apps
frontend --> create a .env in the root
backend --> create a .env in the root


# Install dependencies
pnpm install


# Start development servers
pnpm run dev
#If any case pnpm dev or pnpm run dev does not works, run pnpm build to build the shared types package first

# Build for production
pnpm run build

# Lint code
pnpm run lint
```
