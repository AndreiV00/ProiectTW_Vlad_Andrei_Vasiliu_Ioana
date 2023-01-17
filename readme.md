## Prerequisite:

- node

## Running the backend

To download the necessary dependencies before running the application run the command:

- `npm install`

To start the backend run the following scripts in order:

- `npm run build`
- `npm start`

If you want to start the server that will restart with every save for development run the command:

- `npm run server`

## Database setup and configs

First required step is to have locally running mongodb instance. If you don't want to install locally the db there is a docker file in the backend directory that will run a mongodb instance, all that is needed being just the command `docker compose up -d`.

The database connection is placed inside `/config/db.ts` file. For the successfull connection to be held a .env file inside backend directory is going to be needed that contains the following parameters:

- DB_USERNAME
- DB_PASSWORD
- DB_HOST
- DB_PORT

## Endpoints and the format needed for them

Backend exposes for now the following endpoints that can be accesed from frontend for testing:

- `/projects`-> POST
- `/projects`-> PUT
- `/projects` -> GET
- `/projects/projectId/bugs`-> POST
- `/projects/projectId/bugs` -> GET
- `/projects/projectId/bugs/bugID` -> GET
- `/projects/projectId/bugs/bugID` -> PUT -> Last requirement
- `/projects/projectId/bugs/bugID` -> POST -> 1 before Last requirement.
- `/register` -> POST
- `/login` -> POST

  Bugs:

```javascript
{
name: String,
description: String,
severity: String,
priority: Number,
caussingCommit: String,
resolvingCommit: String,
}
```

Projects:

Post: #Requirement 2

```javascript
{
  name: String,
  repositoryUrl: String,
  users: ["userid1", "userid2" etc]
}
```

Put: #Requirement 3 -> No body necessarry. The entire flow of the req handled by backend.

```javascript

```

Register:

```javascript
{
  name: String,
  email: String
  password: String,
}
```

Login:

```javascript
{
  email: String
  password: String,
}
```

The bugs are assigned to a project when they are created, that's why the mapping `/projID/bugs` is correct.

The [One way embed](https://learnmongodbthehardway.com/schema/schemabasics/#:~:text=as%20a%20strategy.-,One%20Way%20Embedding,-The%20One%20Way) was chosen for the collection Project in regards to the collections Bugs and Users. The same idea applies to the User in regards to Bugs collection.

## Register and login

The backend of the application exposes the endpoints `register` and `login` described above for the creation and login of the user. When the user is firstly created there are 3 required fields: name, email and password. When registering those 3 fields the application encrypts the password using a SALT and the number of the rounds being used is defined in the constants section from the config. The user can not be created if the email is already used.

When logging in the passowrd that's being sent is compared with the hash from the db and if they match then the user is succesfully loged in.

For the incription and password matching the library `bcrypt` was used.

## Authentication

After succesfully registering or logging in a JWT token is created for the user. The token is signed with that user's unique ID and with a token secret chosen by the user (a string) that is being read from the .env file (TOKEN_KEY). After the succesfull creation of the token it is sent to the user in a cookie, that the user will add with the following requests in order to be authenticated.

The authentication happens in the middleware, on _authenticate.ts_ file.

## Authorization (RBAC)

To be done
TODO: DIscuss how I should provide usersid's so the frontend can send them to me on when posting on /project
"# ProiectTW_Vlad_Andrei_Vasiliu_Ioana" 
