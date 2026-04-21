# ETAPA 1: Construcción (Node 22 es obligatorio para tu versión de Angular)
FROM node:22-alpine AS build
WORKDIR /app

# Optimizamos la instalación de dependencias
COPY package*.json ./
RUN npm install

# Copiamos el código fuente
COPY . .

# Compilamos para producción
RUN npm run build --configuration=production

# ETAPA 2: Servidor Nginx para servir el contenido estático
FROM nginx:alpine

# AJUSTE DE RUTA SEGÚN TU ANGULAR.JSON:
# 1. 'dist' es la carpeta base.
# 2. 'vibrafit-frontend' es el nombre de tu proyecto.
# 3. 'browser' es el estándar del nuevo builder de Angular.
COPY --from=build /app/dist/vibrafit-frontend/browser /usr/share/nginx/html

# Copiamos una configuración básica de Nginx para manejar rutas de Angular (SPA)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]