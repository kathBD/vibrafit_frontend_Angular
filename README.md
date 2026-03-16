# VibrafitFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

# 🏋️ VibraFit - Frontend Angular

Frontend del sistema de gestión de gimnasio **VibraFit**, desarrollado con Angular 21. Consume la API REST del backend Spring Boot mediante autenticación JWT.

---
<img width="600" height="898" alt="image" src="https://github.com/user-attachments/assets/ed3d42a9-a381-4323-a5bb-246458b3a6bb" />
<img width="600" height="891" alt="image" src="https://github.com/user-attachments/assets/972f0916-fe55-4c0d-9929-951d52b8a28b" />


## 🚀 Tecnologías

| Tecnología | Versión |
|---|---|
| Angular | 21 |
| TypeScript | 5.x |
| Bootstrap | 5.3 |
| Bootstrap Icons | 1.10 |
| RxJS | 7.x |
| Zone.js | 0.15 |

---

# 🏋️ VibraFit - Frontend Angular

Frontend del sistema de gestión de gimnasio **VibraFit**, desarrollado con Angular 21. Consume la API REST del backend Spring Boot mediante autenticación JWT.

---

## 🚀 Tecnologías

| Tecnología | Versión |
|---|---|
| Angular | 21 |
| TypeScript | 5.x |
| Bootstrap | 5.3 |
| Bootstrap Icons | 1.10 |
| RxJS | 7.x |
| Zone.js | 0.15 |

---

## 📁 Estructura del Proyecto
```
src/app/
├── core/
│   ├── guards/
│   │   ├── auth.guard.ts          # Guard de autenticación
│   │   └── role.guard.ts          # Guard de roles
│   ├── interceptors/
│   │   └── auth.interceptor.ts    # Interceptor JWT
│   └── services/
│       ├── auth.service.ts        # Servicio de autenticación
│       └── usuario.service.ts     # Servicio de usuarios
├── features/
│   ├── auth/
│   │   └── pages/login/           # Página de login
│   ├── admin/
│   │   └── pages/
│   │       ├── dashboard/         # Dashboard administrador
│   │       └── user-management/   # CRUD usuarios
│   ├── trainer/
│   │   └── pages/dashboard/       # Dashboard entrenador
│   ├── client/
│   │   └── pages/dashboard/       # Dashboard cliente
│   ├── home/
│   │   └── pages/landing/         # Landing page
│   └── exercises/
│       └── pages/catalog/         # Catálogo ejercicios
└── shared/
    └── components/
        ├── navbar/                # Barra de navegación
        └── footer/                # Pie de página
```

---

## ⚙️ Configuración

### Requisitos previos
- Node.js 20+
- npm 10+
- Angular CLI 21

### Instalar Angular CLI
```bash
npm install -g @angular/cli@21
```

---

## ▶️ Cómo Ejecutar
```bash
# 1. Clonar repositorio
git clone https://github.com/kathBD/vibrafit-frontend.git

# 2. Instalar dependencias
npm install

# 3. Ejecutar en desarrollo
ng serve
```

La app inicia en `http://localhost:4200`

> ⚠️ El backend debe estar corriendo en `http://localhost:8080`

---

## 🔐 Autenticación JWT

El flujo de autenticación funciona así:
```
1. Usuario ingresa credenciales en /auth/login
2. Angular llama POST /api/auth/login al backend
3. Backend retorna token JWT + datos del usuario
4. Token se guarda en localStorage (clave: vf_token)
5. Interceptor agrega token en cada request al backend
6. Guard redirige según rol del usuario
```

### Redirección por rol
| Rol | Ruta |
|---|---|
| `ADMINISTRADOR` | `/admin/dashboard` |
| `ENTRENADOR` | `/trainer/dashboard` |
| `CLIENTE` | `/client/dashboard` |

---

## 📡 Conexión con Backend

El interceptor agrega automáticamente el token JWT a todas las requests hacia `localhost:8080`:
```typescript
// auth.interceptor.ts
if (token && req.url.includes('localhost:8080')) {
  return next(req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  }));
}
```

---

## 🎨 Características UI

- Diseño dark mode con glassmorphism
- Imágenes de fondo con overlay
- Sidebar responsive con menú mobile
- Cards con animaciones hover
- Tabla de usuarios con filtros y búsqueda
- Modales para crear/editar/eliminar
- KPIs en tiempo real conectados al backend
- Badges de roles con colores
- Badges de estado activo/inactivo

---

## 👥 Dashboards por Rol

### 🔴 Administrador
- KPIs: total usuarios, clientes, entrenadores
- CRUD completo de usuarios
- Accesos rápidos a todas las secciones

### 🟡 Entrenador
- Stats: clientes activos, rutinas pendientes, sesiones
- Cards de navegación
- Acciones rápidas
- Actividad reciente

### 🔵 Cliente
- Cards: Mis Rutinas, Mi Progreso, Mis Planes
- Navegación a secciones personales

---

## 🗂️ Variables de Entorno

El backend se configura directamente en los servicios:
```typescript
private readonly API = 'http://localhost:8080/api';
```

Para cambiar el ambiente, modifica esta URL en:
- `src/app/core/services/auth.service.ts`
- `src/app/core/services/usuario.service.ts`

---

## 📦 Dependencias principales
```bash
npm install bootstrap bootstrap-icons zone.js
```

### angular.json - configuración clave
```json
"polyfills": ["zone.js"],
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "node_modules/bootstrap-icons/font/bootstrap-icons.css",
  "src/styles.scss"
]
```

---

## 🌐 Rutas principales

| Ruta | Componente | Guard |
|---|---|---|
| `/` | Landing | - |
| `/auth/login` | Login | - |
| `/admin/dashboard` | Dashboard Admin | auth + role(ADMIN) |
| `/admin/usuarios` | CRUD Usuarios | auth + role(ADMIN) |
| `/trainer/dashboard` | Dashboard Trainer | auth + role(ENTRENADOR) |
| `/client/dashboard` | Dashboard Cliente | auth + role(CLIENTE) |
| `/exercises/catalog` | Catálogo | auth |

---

## 👩‍💻 Desarrollado por

**Katherine** 
