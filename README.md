# NestJS User API

## Descripción

Esta API de usuarios permite el registro, inicio de sesión y operaciones CRUD protegidas con JWT (almacenado en cookies). Además, se emiten mensajes en tiempo real mediante Socket.IO cuando se realizan operaciones de escritura, se registra cada operación en un fichero y la API está documentada con Swagger.

## Requisitos

- Node.js (>= 14)
- MongoDB

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/jcm94/nestjs-user-api.git
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno en el archivo `.env`, por ejemplo:
   ```
   MONGO_URI=mongodb://localhost:27017/nestjs-api
   JWT_SECRET=tu_clave_secreta
   PORT=3000
   ```
4. Inicia la aplicación:
   ```bash
   npm run start:dev
   ```

## Documentación de la API

Accede a Swagger en: [http://localhost:3000/api](http://localhost:3000/api)

## Pruebas

Utiliza herramientas como Postman para probar los endpoints de la API.

> Nota: Para probar el flujo completo desde [Swagger](http://localhost:3000/api) puede obtener el token de JWT utilizando las herramientas del navegador en la seccion de Network.


