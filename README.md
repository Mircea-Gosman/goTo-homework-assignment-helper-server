# GoTo Homework Assignment - Helper Server

This repository contains a Node.js Express API to support the [frontend exercise](https://github.com/Mircea-Gosman/goTo-homework-assignment). 

## Commands
The project uses npm!

### Setup

```
npm install
```

### Test

```
npm run test
```

### Development

```
npm run dev
```


## Description

### Design Choices

#### User 'authentitcation'
This project uses the `src/logic/user.ts` logic in its middleware to ensure there is a user present in the request. This means there is no dedicated `user` endpoint as users are created on the fly in new requests that need them. For example, a request for `GET /api/tasks` will attempt to fetch the user with the `username` header credential before returning tasks. If it does not exist, then a user is created, and an empty task array is returned. This behavior works well with SSO or PassKey sign-in which does not require password management. 

Later for user sign-in flow management reasons, the middleware that promotes it can be scoped to certain (or only one) endpoints that are known to be hit first upon user connection, like the `GET /api/tasks`. For this project, I have kept things simple: as long as there is a `username` in the headers, then the user-check-or-create middleware behavior will trigger.

#### Endpoints
##### `GET    /api/tasks`
Gets tasks for user with `username` header, or everyone's tasks if the user is an Admin.

##### `POST   /api/task`
Create an empty task for user with `username` header.

##### `PATCH  /api/task`
Updates a task for user with `username` header. The accepted request body is the following:
```
{
  task: {
    _id:            string, // In MongoDB ObjectID format.
    title?:         string,
    description?:   string,
    endDate?:       Date,
    status?:        Pending | Completed
  }
}
```

##### `DELETE /api/task`
Deletes a task for user with `username` header. The accepted request body is the following:
```
{
  taskId: string // In MongoDB ObjectID format
}
```

### Database
This project uses the MongoDB Atlas free tier database. To use the repository, you would normally need to create a MongoDB Atlas account, create a database, and change the `LOCAL_MONGO_URI` variable in `.env`. 

However, for this exercise, I have pushed my local version of `.env` which includes the credentials of the user I have created for the database. You can use these user credentials for testing as they are only used for this project.

### Testing
For this project, I have only had time to complete user end-to-end testing as showcased in the video demo. Unfortunately, the allocated time for this project did not allow for robust testing. However, this project does include JEST and Supertest as dependencies to make future testing simple.

### Future Improvements
The list for near-future suggested improvements includes:
* Testing
* Pagination for GET endpoints.
* Passkey Authentication
* Short-lived JWT sessions support