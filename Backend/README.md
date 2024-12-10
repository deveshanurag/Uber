# User Registration API

## Overview

This API allows users to register by providing their first name, last name, email, and password. The registration process includes validation, hashing of the password for security, and the generation of an authentication token upon successful registration.

---

## Endpoint

**POST** `/users/register`

### Request Body

The API accepts the following fields in the request body:

| Field                | Type   | Required | Validation                    |
| -------------------- | ------ | -------- | ----------------------------- |
| `fullname.firstname` | String | Yes      | Minimum 3 characters          |
| `fullname.lastname`  | String | No       | Minimum 3 characters          |
| `email`              | String | Yes      | Must be a valid email address |
| `password`           | String | Yes      | Minimum 6 characters          |

---

### Request Example

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

---

## Response

### Success Response

**Status Code:** `201 Created`

**Response Body:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "_id": "648f4d6f4d8f4d8f4d8f4d8",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

### Error Response

**Status Code:** `400 Bad Request`

**Response Body (Validation Errors):**

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "Must be of length 6 characters",
      "param": "password",
      "location": "body"
    }
  ]
}
```

---

## Functionality

1. **Validation**:

   - Validates the `email` format.
   - Ensures `fullname.firstname` is at least 3 characters long.
   - Ensures `password` is at least 6 characters long.

2. **Password Hashing**:

   - The password is hashed using `bcrypt` before being saved in the database.

3. **User Creation**:

   - Saves the user data to the MongoDB database, ensuring unique emails.

4. **Token Generation**:
   - Generates a JWT token for authentication using the user's unique ID.

---

## Database Schema

The following schema is used for storing user data:

```javascript
const userSchema = mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters"],
    },
    lastname: {
      type: String,
      minlength: [3, "Last name must be at least 3 characters"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, "Email must be at least 5 characters long"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  socketId: {
    type: String,
  },
});
```

---

## Environment Variables

The following environment variable must be set in your `.env` file:

| Variable     | Description                        |
| ------------ | ---------------------------------- |
| `JWT_SECRET` | Secret key used for token signing. |

---

## Errors and Validation

### Common Errors:

- **400 Bad Request**: Validation error in request data.
- **500 Internal Server Error**: Unexpected error during database operations or token generation.

### Validation Rules:

- **Email**: Must be in valid email format.
- **Password**: Minimum 6 characters.
- **First Name**: Minimum 3 characters.

---

## Setup and Testing

### Dependencies

- **Node.js**: JavaScript runtime.
- **Express.js**: Web framework.
- **MongoDB**: Database.
- **bcrypt**: For password hashing.
- **jsonwebtoken**: For token generation.
- **express-validator**: For input validation.

### Run the Server

```bash
npm start
```

### Test with cURL

```bash
curl -X POST http://localhost:3000/users/register \
-H "Content-Type: application/json" \
-d '{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}'
```

---

## Notes

- Ensure `email` is unique in the database; duplicate emails will throw a MongoDB error.
- The `password` field is not returned in responses for security reasons.
- Add proper logging and error handling in production for debugging and monitoring.

---

# **User Login API**

## **Overview**

The `/users/login` endpoint allows registered users to log in by providing their email and password. Upon successful login, the API returns a JSON Web Token (JWT) for authentication in subsequent requests.

---

## **Endpoint**

**`POST /users/login`**

---

## **Request Format**

### **Headers**

| Key          | Value              |
| ------------ | ------------------ |
| Content-Type | `application/json` |

### **Body Parameters**

| Field      | Type   | Required | Description                                      |
| ---------- | ------ | -------- | ------------------------------------------------ |
| `email`    | String | Yes      | The registered email address of the user.        |
| `password` | String | Yes      | The password associated with the user's account. |

**Example Request Body**:

```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

---

## **Response Format**

### **Success Response**

| Field     | Type    | Description                                              |
| --------- | ------- | -------------------------------------------------------- |
| `success` | Boolean | Indicates if the operation was successful.               |
| `user`    | Object  | Contains user details (excluding sensitive information). |
| `token`   | String  | JWT token for authentication.                            |

**Example Success Response**:

```json
{
  "success": true,
  "user": {
    "id": "64f5b8d0b9c8e0c8f8a97f65",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNjE2MjM5MDIyfQ.sflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

### **Error Responses**

#### **1. Validation Error**

- **HTTP Status Code**: `400 Bad Request`
- **Description**: Input validation failed.

**Example Response**:

```json
{
  "errors": [
    {
      "msg": "Invalid email address",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### **2. Unauthorized - Invalid Credentials**

- **HTTP Status Code**: `401 Unauthorized`
- **Description**: The provided email or password is incorrect.

**Example Response**:

```json
{
  "success": false,
  "message": "Unauthorized: Incorrect credentials"
}
```

#### **3. Server Error**

- **HTTP Status Code**: `500 Internal Server Error`
- **Description**: An unexpected error occurred.

**Example Response**:

```json
{
  "success": false,
  "message": "An unexpected error occurred"
}
```

---

## **Validation Rules**

- `email`: Must be a valid email address.
- `password`: Cannot be empty.

---

## **Usage Instructions**

### **Prerequisites**

1. A registered user account with valid credentials.
2. Obtain the JWT token after login to authenticate further requests.

### **Example cURL Command**

```bash
curl -X POST \
  http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
        "email": "john.doe@example.com",
        "password": "securepassword123"
      }'
```

---

## **Notes**

- Ensure your `.env` file contains the `JWT_SECRET` environment variable to sign the JWT tokens.
- Use the token in the `Authorization` header (format: `Bearer <token>`) for subsequent authenticated API calls.

---

Here’s the **README.md** file detailing both the `/users/profile` and `/users/logout` routes, one by one:

---

## GET /users/profile\*\*

### **Description**

Fetch the profile of the currently authenticated user. The request must include a valid JWT token in the `Authorization` header or cookies.

### **Endpoint**

**`GET /users/profile`**

### **Headers**

| Key           | Value                       |
| ------------- | --------------------------- |
| Authorization | `Bearer <token>` (Required) |

### **Response Format**

#### **Success Response**

| Field        | Type   | Description                     |
| ------------ | ------ | ------------------------------- |
| `fullname`   | Object | The user's first and last name. |
| `email`      | String | The user's email address.       |
| Other Fields | -      | Additional user information.    |

**Example Success Response**:

```json
{
  "_id": "64f5b8d0b9c8e0c8f8a97f65",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com"
}
```

#### **Error Response**

##### **1. Unauthorized**

- **HTTP Status Code**: `401 Unauthorized`
- **Description**: Token is missing, invalid, or blacklisted.

**Example Response**:

```json
{
  "message": "Unauthorized"
}
```

---

## GET /users/logout\*\*

### **Description**

Logs out the authenticated user by blacklisting their JWT token. The token is invalidated for 24 hours or the duration of its expiry.

### **Endpoint**

**`GET /users/logout`**

### **Headers**

| Key           | Value                       |
| ------------- | --------------------------- |
| Authorization | `Bearer <token>` (Required) |

### **Response Format**

#### **Success Response**

| Field     | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| `message` | String | Confirmation of logout action. |

**Example Success Response**:

```json
{
  "message": "Logged out"
}
```

#### **Error Response**

##### **1. Unauthorized**

- **HTTP Status Code**: `401 Unauthorized`
- **Description**: Token is missing, invalid, or blacklisted.

**Example Response**:

```json
{
  "message": "Unauthorized"
}
```

---

## **Authentication Mechanism**

1. **Token Validation**:
   - Tokens are verified using `jsonwebtoken`.
   - Blacklisted tokens are stored in the database and checked for validity.
2. **Token Blacklisting**:
   - Upon logout, the token is stored in a blacklist database with a 24-hour expiry to ensure it cannot be reused.

---

## **Usage Instructions**

### **1. Fetch User Profile**

- Include the JWT token in the `Authorization` header or cookies.
- Call the `/users/profile` endpoint.

**Example cURL Command**:

```bash
curl -X GET \
  http://localhost:3000/users/profile \
  -H "Authorization: Bearer <your-token>"
```

### **2. Logout User**

- Include the JWT token in the `Authorization` header or cookies.
- Call the `/users/logout` endpoint.

**Example cURL Command**:

```bash
curl -X GET \
  http://localhost:3000/users/logout \
  -H "Authorization: Bearer <your-token>"
```

---
