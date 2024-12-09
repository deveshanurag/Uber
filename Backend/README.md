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
