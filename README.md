<p align="center">
  <img src="./logo.svg">
</p>

<h1 align="center">
  Sprinta
</h1>

## Introduction
Sprinta is an online web platform designed to streamline project management using SCRUM methodology. This platform is specifically crafted for teams and individuals engaged in software development, allowing them to efficiently plan, execute, and monitor tasks within the framework of SCRUM.

### Key Features
* **Scrum Board:** Sprinta provides an interactive Scrum board that empowers teams to organize tasks into customizable boards, such as "To Do," "In Progress," and "Done," fostering transparency and collaboration.

* **Task Management:** Users can create, edit tasks with the ability to assign tasks to team members and set task estimation.

* **Sprint Planning:** Sprinta facilitates efficient sprint planning, allowing teams to define sprint goals, estimate task complexity, and allocate tasks to specific sprints.

* **User Authentication:** Secure user authentication ensures that only authorized team members have access to project details, fostering a protected and private environment.

## Getting Started
### Installation
Clone the repository and install dependencies

```
git clone https://github.com/konovalovroman/sprinta-backend.git
cd sprinta-backend
yarn install
```

### Configuration
Create and fill a .env file with environment variables

```
PORT=

### DATABESE
DB_NAME=
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=

### JWT secrets
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

### Redis
REDIS_HOST=
REDIS_PORT=

### Cookie
COOKIE_SECRET=
```

### Running application
<p>Make sure you have running Postgresql and Redis instances
</p>
**Do not forget to run database migrations before the first start:**
`yarn migration:run`

```
yarn start

# or

yarn build
yarn start:prod
```

### Running application with Docker
If you are running an application with Docker, make sure you have DB\_HOST and REDIS\_HOST defined this way:

```
DB_HOST=sprinta-db
REDIS_HOST=sprinta-redis
```

Then just run `docker-compose up`

### Application access
For example, you set PORT=3000, now you can access the application using these URLs:

* [http://localhost:3000/api/v1](http://localhost:3000/api/v1) – base API url
* [http://localhost:3000/swagger](http://localhost:3000/swagger) – Swagger API documentation
* [http://localhost:5050](http://localhost:5050) – pgAdmin *(Only if running application with Docker)*


## Tech Stack
Backend of Sprinta was built using these technologies:

* Node.js
* NestJS
* TypeORM
* PostgreSQL
* Redis