# API Documentation

This document provides a clear and complete overview of all available API endpoints in the project, including their purpose, request structures, and authentication requirements.

---

## **Base URL**

```
/api/v1
```

> Note: Adjust the base URL based on your environment (local, development, or production).

---

# **Authentication APIs**

All authentication-related routes are under the `/auth` namespace.

For protected routes, a valid JWT token is required.

**Authorization Header:**

```
Authorization: Bearer <token>
```

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

**Response Example:**

```json
{
  "message": "ok",
  "data": {
    "id": "int",
    "username": "string",
    "email": "string",
    "token": "string"
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
  "data": {
    "id": "int",
    "username": "string",
    "email": "string",
    "token": "string"
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

**Response Example:**

```json
{
  "message": "ok",
  "data": {
    "id": "int",
    "email": "string",
    "username": "string"
  }
}
```

---

# **Storage APIs**

All storage-related routes are under the `/storage` namespace. These endpoints allow authenticated users to manage materials stored in their refrigerator.

---

## **1. Get All Materials**

**Endpoint:**

```
GET /storage
```

**Description:**
Returns all stored materials for the authenticated user.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**
None.

**Response Example:**

```json
{
  "message": "ok",
  "data": [
    {
      "id": 1,
      "name": "Milk",
      "amount": 500,
      "userId": 1
    }
  ]
}
```

---

## **2. Add New Material**

**Endpoint:**

```
POST /storage/add
```

**Description:**
Adds a new material to the user's storage. Material names must be unique per user.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "Sugar"
}
```

**Response Example:**

```json
{
  "message": "Created",
  "data": {
    "id": 2,
    "name": "Sugar",
    "amount": 100
  }
}
```

---

## **3. Increase Material Amount**

**Endpoint:**

```
PATCH /storage/count/plus/:id
```

**Description:**
Increases the material amount by **100 units**.

**Headers:**

```
Authorization: Bearer <token>
```

**URL Params:**

```
id: number (material ID)
```

**Response Example:**

```json
{
  "message": "Ok",
  "data": {
    "id": 2,
    "name": "Sugar",
    "amount": 200
  }
}
```

---

## **4. Decrease Material Amount**

**Endpoint:**

```
PATCH /storage/count/mines/:id
```

**Description:**
Decreases the material amount by **100 units**. The minimum allowed amount is **100**.

**Headers:**

```
Authorization: Bearer <token>
```

**URL Params:**

```
id: number (material ID)
```

**Response Example:**

```json
{
  "message": "Ok",
  "data": {
    "id": 2,
    "name": "Sugar",
    "amount": 100
  }
}
```

---

## **5. Delete Material**

**Endpoint:**

```
DELETE /storage/delete/:id
```

**Description:**
Deletes a material from the authenticated user's storage.

**Headers:**

```
Authorization: Bearer <token>
```

**URL Params:**

```
id: number (material ID)
```

**Response Example:**

```json
{
  "message": "Ok"
}
```

---

# **Recipe APIs**

All recipe-related routes are under the `/recipe` namespace.

---

## **1. Get All Recipes**

**Endpoint:**

```
GET /recipe
```

**Description:**
Returns all available recipes.

**Headers:**
Not required.

**Response Example:**

```json
{
  "message": "ok",
  "data": [
    {
      "id": 1,
      "name": "Pasta",
      "category": "Dinner",
      "difficulty": "Easy"
    }
  ]
}
```

---

## **2. Add New Recipe**

**Endpoint:**

```
POST /recipe/add
```

**Description:**
Creates a new recipe with gallery images, ingredients, and cooking steps.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "Pasta",
  "time": 30,
  "category": "Dinner",
  "nationality": "Italian",
  "difficulty": "Easy",
  "meal": "Main",
  "description": "Classic Italian pasta",
  "gallery": [
    { "url": "https://example.com/image.jpg" }
  ],
  "ingrediants": [
    { "name": "Pasta", "amount": "200g" }
  ],
  "steps": [
    { "order": 1, "description": "Boil water" }
  ]
}
```

**Response Example:**

```json
{
  "message": "Recipe created",
  "data": {
    "id": 1,
    "name": "Pasta"
  }
}
```

---

## **3. Delete Recipe**

**Endpoint:**

```
DELETE /recipe/delete
```

**Description:**
Deletes a recipe by its ID.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "id": 1
}
```

**Response Example:**

```json
{
  "message": "Ok"
}
```

---

# **Error Responses**

Common error response format:

```json
{
  "message": "Error message",
  "data": null,
  "error": true
}
```

---

# **Notes**

* All example responses are for documentation purposes and may differ based on implementation.
* All protected routes require the `Authorization` header with a valid JWT token.
* Recipe creation supports nested gallery, ingredients, and steps.

---

# **Version**

**API Version:** 1.0.0
