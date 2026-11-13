# Consumo de Microservicio con autenticación JWT y control de acceso por roles

Aplicación compuesta por un microservicio REST con autenticación JWT y control de acceso por roles en Node.js/Express + PostgreSQL, y una interfaz web en Vue.js para el consumo y administración de usuarios, roles y empleados.

## Autor

- **Nombre:** Rodríguez Juárez José Daniel
- **Número de control:** 22161222
- **Institución:** Instituto Tecnológico de Oaxaca
- **Materia:** Desarrollo de Servicios Web

## Características

- **Autenticación y Seguridad (JWT + Roles):**
  - Inicio de sesión con nombre de usuario o correo electrónico (`/api/v1/auth/login`) y validación de sesión (`/api/v1/auth/me`).
  - Tokens JWT firmados con `HS256` (vigencia de 15 minutos) y contraseñas cifradas con `bcrypt`.
  - Bloqueo temporal de cuenta tras 5 intentos fallidos de inicio de sesión.
  - Control de acceso por roles (`admin`, `manager`, `cashier`):
    - `admin`: acceso completo a Usuarios, Roles y Empleados.
    - `manager`: acceso únicamente a Empleados.
    - `cashier`: sin acceso a módulos administrativos.
- **Frontend con Restricciones Visuales (Vue 3):**
  - Dashboard interactivo con barra lateral (`Sidebar`) que bloquea visualmente las secciones no permitidas según el rol.
  - Protección de rutas en Vue Router con redirección automática según el rol del usuario.
  - **Gestión de Usuarios:** listado, filtro por rol, creación/edición en modal y eliminación.
  - **Gestión de Roles:** catálogo de roles, creación/edición en modal y actualización en tiempo real.
  - **Gestión de Empleados:** directorio de personal vinculado a usuarios, búsqueda por nombre/apellido/puesto y operaciones CRUD.
- **Documentación API:**
  - Interfaz interactiva de Swagger disponible en `/api-docs`.

## Tecnologías

**Backend (`22161222_RodriguezJJoseD_Microservicio_ConLogin`)**

- [Node.js](https://nodejs.org/) y [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/) (`pg`)
- [JSON Web Token (`jsonwebtoken`)](https://github.com/auth0/node-jsonwebtoken) y [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- Helmet, CORS, dotenv y Swagger (`swagger-jsdoc`, `swagger-ui-express`)

**Frontend (`22161222_RodriguezJJoseD_ConsumoMS`)**

- [Vue.js 3](https://vuejs.org/) con `<script setup>` (Composition API)
- [Vite](https://vite.dev/)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Axios](https://axios-http.com/)

## Instalación y uso

Requisitos: [Node.js](https://nodejs.org/) 22.18 o superior y una instancia de [PostgreSQL](https://www.postgresql.org/) en ejecución.

### 1. Base de datos

Ejecuta el script `22161222_RodriguezJJoseD_Microservicio_ConLogin/src/database/data_base.sql` en tu base de datos PostgreSQL. Esto creará las tablas (`roles`, `users`, `employees`), los roles iniciales y un usuario administrador de prueba:

- **Usuario:** `admin`
- **Correo:** `admin@example.com`
- **Contraseña:** `Admin1234!`

### 2. Microservicio Backend

1. Entra a la carpeta del microservicio e instala las dependencias:

   ```bash
   cd 22161222_RodriguezJJoseD_Microservicio_ConLogin
   npm install
   ```

2. Crea el archivo `.env` a partir de `.env.example` y configura tus variables (asegúrate de usar un `JWT_SECRET` de al menos 32 bytes):

   ```env
   NODE_ENV=development
   PORT=3000
   SERVICE_NAME=first microservice
   URL_DB=postgresql://postgres:password@localhost:5432/backend_for_students
   DB_SSL=false
   JWT_SECRET=reemplaza-con-al-menos-32-caracteres-aleatorios
   ```

3. Inicia el servidor:
   ```bash
   npm run dev
   ```
   La documentación Swagger estará disponible en `http://localhost:3000/api-docs`.

### 3. Aplicación Frontend

1. Entra a la carpeta del cliente Vue e instala las dependencias:

   ```bash
   cd 22161222_RodriguezJJoseD_ConsumoMS
   npm install
   ```

2. Configura la URL base del microservicio en `.env` (opcional si usa el puerto predeterminado):

   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
