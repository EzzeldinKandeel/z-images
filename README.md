# zImages

## Description

This is a web API for storing images using a S3-compatible object storage solution and for applying several transformations on stored images.

Developed using the [Nest](https://nestjs.com) framework.

## Project setup

### 1. To run this app, you need an instance of:

- PostgreSQL
- MinIO
- Redis

### 2. then, 

```bash
# Clone the repository
$ git clone https://github.com/EzzeldinKandeel/z-images.git

# Navigate into the project directory
$ cd z-images

# Install dependencies
$ npm install

# Create .env file
$ cp .env.example .env
```

### 3. Set the required environment variables in .env file.

### 4. Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## To run tests

```bash
# unit tests
$ npm run test
```

## Docker

A docker image & compose file are being worked on to simplify running the project. 

## What is this project?

This is a project I'm developing to learn the Nest framework. The project idea is from [roadmap.sh](https://roadmap.sh/projects/image-processing-service).

Since this is a learning project, some parts of it might be too basic, and other parts might be too overengineered. I did try, as much as I could, to follow best practices, and I used the hell out of [Node](https://nodejs.org/docs/latest/api/) and [Nest](https://docs.nestjs.com/)'s official documentations.

Other resources that were of help: [Docker's Documentaion](https://docs.docker.com/), [Mozilla Developer Network's Javascript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference), [Typescript's Documentaion](https://www.typescriptlang.org/docs/)

I also added comments to better explain the ambiguous parts.
