# Sistema de Gestión de Eventos - API REST

API REST para la gestión de eventos, participantes y asistencias, construida con Node.js, Express y PostgreSQL siguiendo la arquitectura MVC.

---

## Tabla de Contenidos

- [Instalación](#-instalación)
- [Arquitectura](#-arquitectura)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnologías](#-tecnologías)
- [Pruebas](#-pruebas)
- [Seguridad](#-seguridad)
- [API Endpoints](#-api-endpoints)

---

## Instalación

### Prerequisitos

- Node.js >= 18
- PostgreSQL >= 14
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone <url-repositorio>
cd practicaPruebas
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en la raíz:
```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=sistema_eventos
DB_NAME_TEST=sistema_eventos_test
```

4. **Crear base de datos**
```bash
# Base de datos de desarrollo
psql -U postgres -c "CREATE DATABASE sistema_eventos;"

# Base de datos de pruebas
psql -U postgres -c "CREATE DATABASE sistema_eventos_test;"
```

5. **Ejecutar migraciones**
```bash
npm run migrar
```

6. **Iniciar servidor**
```bash
# Desarrollo (con nodemon)
npm run dev



# Producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

---

## Arquitectura

Este proyecto sigue el patrón **MVC (Modelo-Vista-Controlador)** adaptado para APIs REST:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Cliente    │─────▶│    Rutas     │─────▶│ Controlador  │─────▶│   Servicio   │
│   (HTTP)     │      │  (Routes)    │      │ (Controller) │      │  (Business)  │
└──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘
                                                                           │
                                                                           ▼
                                                                    ┌──────────────┐
                                                                    │    Modelo    │
                                                                    │  (Sequelize) │
                                                                    └──────────────┘
                                                                           │
                                                                           ▼
                                                                    ┌──────────────┐
                                                                    │  PostgreSQL  │
                                                                    └──────────────┘
```

### Capas

- **Rutas (Routes)**: Define los endpoints y mapea a controladores
- **Controladores (Controllers)**: Maneja las peticiones HTTP y respuestas
- **Servicios (Services)**: Contiene la lógica de negocio
- **Modelos (Models)**: Define la estructura de datos y relaciones (ORM)

---

## 📁 Estructura del Proyecto

```
practicaPruebas/
├── controllers/          # Controladores (manejo de peticiones HTTP)
│   ├── asistenciasControlador.js
│   ├── eventosControlador.js
│   └── participantesControlador.js
├── models/              # Modelos de Sequelize (definición de tablas)
│   ├── asistencia.js
│   ├── evento.js
│   ├── participante.js
│   └── index.js
├── routes/              # Definición de rutas/endpoints
│   ├── asistencias.js
│   ├── eventos.js
│   └── participantes.js
├── services/            # Lógica de negocio
│   ├── asistenciaService.js
│   ├── eventoService.js
│   └── participanteService.js
├── migrations/          # Migraciones de base de datos
├── tests/               # Pruebas (unitarias, integración, sistema)
│   ├── asistenciaService.test.js
│   ├── asistencias.integration.test.js
│   ├── cache.test.js
│   ├── sistema.test.js
│   └── setup.js
├── config/              # Configuración de base de datos
│   └── config.json
├── .github/workflows/   # CI/CD con GitHub Actions
│   └── ci.yml
├── index.js             # Punto de entrada de la aplicación
├── eslint.config.js     # Configuración de análisis estático
├── jest.config.js       # Configuración de pruebas
└── package.json         # Dependencias y scripts
```

---

## 🛠️ Tecnologías

### Backend
- **Node.js** - Entorno de ejecución
- **Express 5** - Framework web
- **Sequelize** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos relacional

### Caché
- **memory-cache** - Sistema de caché en memoria (TTL: 60s)

### Testing
- **Jest** - Framework de pruebas
- **Supertest** - Pruebas de integración HTTP

### Seguridad
- **ESLint + eslint-plugin-security** - Análisis estático de seguridad
- **bcryptjs** - Hash de contraseñas
- **express-validator** - Validación de entradas

### CI/CD
- **GitHub Actions** - Pipeline automatizado

---

## Pruebas

### Tipos de Pruebas Implementadas

```bash
# Ejecutar todas las pruebas
npm test

# Pruebas unitarias (servicios)
npm test -- tests/asistenciaService.test.js tests/cache.test.js

# Pruebas de integración (API)
npm test -- tests/asistencias.integration.test.js

# Pruebas de sistema (flujo completo)
npm test -- tests/sistema.test.js
```


## Seguridad

### Análisis Estático

```bash
# Ejecutar análisis de seguridad
npm run lint

# Corregir problemas automáticamente
npm run lint:fix
```

**Herramienta**: ESLint con plugin de seguridad

**Reglas implementadas**:
- Detección de expresiones regulares inseguras
- Detección de eval() y código dinámico
- Detección de inyección de objetos
- Validación de procesos hijos
- Detección de números aleatorios inseguros



## 🚀 CI/CD Pipeline

El proyecto incluye un workflow de GitHub Actions que ejecuta automáticamente:

1. Instalación de dependencias
2. Pruebas unitarias
3. Pruebas de integración
4. Análisis estático de seguridad
5. Pruebas de sistema


**Resultado**: Si todo pasa, imprime `OK` en consola

---

## Sistema de Caché

Implementado con `memory-cache` (TTL: 60 segundos)

**Endpoints con caché**:
- `GET /api/participantes` (lista)
- `GET /api/participantes/:id` (individual)
- `GET /api/eventos` (lista)
- `GET /api/eventos/:id` (individual)
- `GET /api/asistencias/estadisticas`

