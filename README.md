# Incedo Assignment by Aymen Bouhaha

## Description

This project is part of hiring process of Incedo. It's a Node.js application that serves as a RESTful API for searching
artists by name and exporting the search results to a CSV file. It provides a simple and efficient way to retrieve
artist information and store it in a user-specified CSV file. Also, it can be used to retrieve the created csv files by
the file name

## Folder Structure

- `documentation`documentation : it contains the swagger file documentation of the api
- `src/assets` : it contains the assets that are shared inside the application (E.g : here it contains "
  dummy-artists.json")
- `src/config` : it contains the configuration files of external libraries and packges
- `src/constant` : it contains the constants shared inside the application
- `src/controllers` : it contains the controllers of the application : the entry points of each api
- `src/helpers` : it contains the files which contains formatting logic, pipes, and helpers functions
- `src/models` : it contains the schema used alongside the app (Exception classes, Dtos(Data transfer objects))
- `src/routes` : it contains the routers classes of the application
- `src/services` : it contains the service layer of the application, the classes that handles the business logic inside
  the app

## Run locally

#### Step 1 : ENV file

In the root folder:

- create an `.env` file
- copy the contents of `.env.example` in `.env`

(I know the .env.example must not contain a real API_KEY but in my case I didn't find a way to give you the credentials
to access the external api, it could be made by mail, but I thought maybe it won't be read by the one who will test)

### Running the application in a docker container

Before running the project please ensure that the port `3000` is not used by any other process,if the port is not free,
either kill the process using it or change the port mapping in `docker-compose.yml` file to `"WHATEVER_PORT":"3000"`

#### Step 2 : Run the project

```bash
 docker-compose up -d
```

### Running the application without a docker container

#### Step 2 : Install Dependencies

```bash
 npm install
```

#### Step 3 : Creating an output_files folder

    Create a folder named "output_files" in the root directory of the application

- hint : this folder will store the csv files made by the requests

#### Step 4 : Run the project

Before running the project please ensure that the port `3000` is not used by any other process,if the port is not free,
either kill the process using it or change the port inside `.env` file to another one `PORT=WHATEVER_PORT`

```bash
 npm run dev
```

## Access the api documentation

To access the api documentation, after running the application either on your local pc or inside a container you need to
access
the swagger documentation through this link

    http://localhost:3000/api-docs


