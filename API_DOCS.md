# API Documentation

This document provides an overview of all available API endpoints in the project, their purpose, request structures, and authentication requirements.

---

## **Base URL**

```
/api
```

> Note: Adjust the base URL based on your environment (local, dev, production).

---

# **Authentication APIs**

All authentication-related routes are under the `/auth` namespace.

---

## **1. Login**

**Endpoint:**

```
POST /auth/login
```

**Description:**
Authenticates the user and returns an access token.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Headers:**
Not required.

**Response:**

```json
{
  "message" : "ok",
  "data" : {
    "id" : "int",
    "username" : "string",
    "email" : "string",
    "token" : "string"
  }
}
```

---

## **2. Register**

**Endpoint:**

```
POST /auth/register
```

**Description:**
Creates a new user account.

**Request Body:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Headers:**
Not required.

**Response Example:**

```json
{
  "message": "ok",
  "data" : {
    "id" : "int",
    "username" : "string",
    "email" : "string",
    "token" : "string"
  }
}
```

---

## **3. Verify Token**

**Endpoint:**

```
GET /auth/verify
```

**Description:**
Checks whether the provided JWT token is valid.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**
None.

**Successful Response Example:**

```json
{
  "message" : "ok",
  "data": {
    "id": "int",
    "email": "string",
    "username": "string"
  }
}
```

**Invalid Response Example:**

```json
{
  "valid": false,
  "message": "Invalid or expired token"
}
```

---

# **Notes**

* All responses shown here are examples and may differ based on your backend implementation.
* Be sure to include the `Authorization` header for all protected routes.

---

# **Version**

**API Version:** 1.0.0

---
