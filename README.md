# Nexus Bank API 🏦

Banking system API built with Node.js, Express, and MongoDB.

## Features

- **MVC Architecture**: Clean and modular folder structure.
- **Double-Entry Accounting**: Ensures financial integrity by recording source and destination for every transaction.
- **JWT Security**: Access and Refresh token logic.
- **OTP Verification**: Required for sensitive operations (Withdrawals, Transfers).
- **Zod Validation**: Strict request body validation.
- **Error Handling**: Centralized error management with meaningful messages.

---

## 🛠 Setup & Installation

1. **Environment Variables**: Configure `.env` based on `.env.example`.
2. **Install Dependencies**: `npm install`
3. **Run Server**: `npm run dev`

---

## 🚀 API Endpoints & Sample Requests

### 1. Authentication

#### Register User

`POST /api/auth/register`

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login User

`POST /api/auth/login`

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

_Response returns `accessToken` and `refreshToken`._

#### Request OTP

`POST /api/auth/request-otp`
_Headers: `Authorization: Bearer <accessToken>`_
_Response: OTP is logged in the console._

---

### 2. Accounts

#### Create Account

`POST /api/accounts`
_Headers: `Authorization: Bearer <accessToken>`_

```json
{
  "type": "CHECKING",
  "currency": "USD"
}
```

#### Get My Accounts

`GET /api/accounts`
_Headers: `Authorization: Bearer <accessToken>`_

---

### 3. Transactions

#### Deposit Money

`POST /api/transactions/deposit`
_Headers: `Authorization: Bearer <accessToken>`_

```json
{
  "accountId": "ACCOUNT_ID",
  "amount": 1000,
  "description": "Initial deposit"
}
```

#### Withdraw Money (Requires OTP)

`POST /api/transactions/withdraw`
_Headers: `Authorization: Bearer <accessToken>`_

```json
{
  "accountId": "ACCOUNT_ID",
  "amount": 200,
  "otpCode": "123456",
  "description": "ATM Withdrawal"
}
```

#### Transfer Money (Requires OTP)

`POST /api/transactions/transfer`
_Headers: `Authorization: Bearer <accessToken>`_

```json
{
  "fromAccountId": "SOURCE_ACCOUNT_ID",
  "toAccountNumber": "DESTINATION_ACCOUNT_NUMBER",
  "amount": 150,
  "otpCode": "123456",
  "description": "Rent payment"
}
```

#### Transaction History

`GET /api/transactions/history/:accountId`
_Headers: `Authorization: Bearer <accessToken>`_

---

## 🛡 Security Notes

- Passwords are hashed using `bcrypt` (12 rounds).
- Secrets are managed via Environment Variables.
- Transactional atomicity is handled using Mongoose Sessions.
- OTPs are one-time use and expire after 10 minutes.
