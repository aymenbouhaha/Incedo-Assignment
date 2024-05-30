# Incedo Assignment by Aymen Bouhaha

## Description

This project is

## Apps and Packages

This turborepo uses [Yarn](https://classic.yarnpkg.com/lang/en/) as a package manager. It includes the following
packages/apps:

- `@repos/gli-server`: an [Express](https://expressjs.com/) server
- `@repos/gli-api`: [Trpc](https://expressjs.com/) implementation used as middleware in the express server and the next
  app
- `@repos/gli-react` : a [React](https://reactjs.org/) app

- Tooling folder : contains shared configs for popular tools like jest prettier and typescript.
- The Monorepo is managed by [Turborepo](https://turbo.build/repo/docs)

## Run locally

#### Step 1 : ENV file

In the root folder:

- create an .env file
- copy the contents of .env.example in .env

#### Step 2 : Install dependencies

```bash
  yarn
```

#### Step 3 : Setup local Db

```bash
 yarn db:init
```

#### Step 4 : Run the project

```bash
 yarn dev
```
