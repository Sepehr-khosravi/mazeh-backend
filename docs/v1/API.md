# API Documentation

This document provides a clear and complete overview of all available API endpoints in the project, including their purpose, request structures, and authentication requirements.

---

## **Base URL**

```
/
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
  "username" : "string",
  //or
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
    // "username": "string"
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
            "name": "Sugar",
            "type": "Meterials",
            "count": 50
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
   "name" : "Sugar",
   "type" : "Meterials",
   "count" : 50
}
```

**Response Example:**

```json
{
    "message": "Created",
    "data": {
        "id": 1,
        "name": "Sugar",
        "type": "Meterials",
        "count": 50
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
DELETE /storage/delete/:id (for example we can use 1)
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
    "message": "Ok",
    "data": {
        "id": 1,
        "name": "Sugar",
        "type": "Meterials",
        "count": 50,
        "deleted": true
    }
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
            "time": 30,
            "image": "https://default.com/image.png",
            "icon": "https://default.com/icon.png",
            "category": "Dinner",
            "nationality": "Italian",
            "rate": 5,
            "difficulty": "Easy",
            "description": "Classic Italian pasta",
            "meal": "Main"
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
    "name" : "Pizza",
    "time" : 3600,
    "category" : "foods",
    "nationality" : "Italyan",
    "difficulty" : "medium",
    "description" : "it's a Perfect and veryyyy good food for eating",
    "meal" : "anywhen",
    "gallery" : [],
    "ingrediants" : [
      {
        "name" : "tomato", "amount" : 100  
      }//......
    ],
    "steps" : [
        {"order" : 1, "description" : "you need to buy all meteryals"},
        {"order" : 2 , "description" : "just make it ready for eating"}
    ]
}
```

**Response Example:**

```json
{
    "message": "Recipe created",
    "data": {
        "id": 2,
        "name": "Pizza",
        "time": 3600,
        "image": "https://default.com/image.png",
        "icon": "https://default.com/icon.png",
        "category": "foods",
        "nationality": "Italyan",
        "rate": 5,
        "difficulty": "medium",
        "description": "it's a Perfect and veryyyy good food for eating",
        "meal": "anywhen"
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
  "id": 2
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
