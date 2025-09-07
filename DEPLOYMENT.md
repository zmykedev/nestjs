# CMPC Backend - Google Cloud Deployment Guide

Este documento explica cómo desplegar la aplicación CMPC Backend en Google Cloud Platform usando Cloud Build y Cloud Run.

## 📋 Prerrequisitos

1. **Google Cloud SDK**: Instalar y configurar `gcloud` CLI
2. **Docker**: Instalado y funcionando
3. **Cuenta de Google Cloud**: Con facturación habilitada
4. **Proyecto de Google Cloud**: Con las APIs necesarias habilitadas

## 🚀 Despliegue Rápido

### Opción 1: Script Automatizado

```bash
# Hacer el script ejecutable
chmod +x deploy.sh

# Ejecutar el despliegue
./deploy.sh
```

### Opción 2: Comandos Manuales

```bash
# 1. Configurar proyecto
export PROJECT_ID="strategic-arc-471303-m4"
gcloud config set project $PROJECT_ID

# 2. Habilitar APIs necesarias
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# 3. Construir y desplegar
gcloud builds submit --config cloudbuild.yaml .

# 4. Desplegar a Cloud Run
gcloud run deploy cmpc-backend \
    --image gcr.io/$PROJECT_ID/cmpc-backend:latest \
    --region us-central1 \
    --platform managed \
    --allow-unauthenticated \
    --port 3000 \
    --memory 1Gi \
    --cpu 1 \
    --max-instances 10 \
    --set-env-vars NODE_ENV=production
```

## 🔧 Configuración de Variables de Entorno

### Variables Requeridas

```bash
# Base de datos
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_USER=your-db-user
DATABASE_PASSWORD=your-db-password
DATABASE_NAME=your-db-name

# JWT
JWT_SECRET=your-jwt-secret

# GCP Storage
GCS_PROJECT_ID=strategic-arc-471303-m4
GCS_BUCKET_NAME=cmpc-book
GCS_KEY_FILE=google-strategy-new.json
```

### Configurar Secretos en Cloud Run

```bash
# Crear secretos
gcloud secrets create cmpc-secrets --data-file=secrets.json

# O crear secretos individuales
gcloud secrets create database-host --data-file=db-host.txt
gcloud secrets create database-password --data-file=db-password.txt
gcloud secrets create jwt-secret --data-file=jwt-secret.txt
```

## 📁 Estructura de Archivos

```
cmpc-backend/
├── cloudbuild.yaml          # Configuración de Cloud Build
├── cloud-run.yaml           # Configuración de Cloud Run
├── Dockerfile               # Imagen Docker optimizada
├── .dockerignore            # Archivos a ignorar en Docker
├── deploy.sh                # Script de despliegue automatizado
└── DEPLOYMENT.md            # Esta guía
```

## 🏗️ Proceso de Build

El archivo `cloudbuild.yaml` ejecuta los siguientes pasos:

1. **Instalación de dependencias**: `npm ci`
2. **Linting**: `npm run lint`
3. **Tests**: `npm run test`
4. **Build**: `npm run build`
5. **Docker Build**: Construcción de imagen optimizada
6. **Push**: Subida a Google Container Registry
7. **Deploy**: Despliegue a Cloud Run (opcional)

## 🐳 Docker Multi-stage Build

El Dockerfile utiliza un build multi-stage para optimizar la imagen:

- **Builder stage**: Instala dependencias y construye la aplicación
- **Production stage**: Solo incluye dependencias de producción y el código compilado

### Características de Seguridad

- Usuario no-root (`nestjs`)
- Health checks integrados
- Imagen Alpine Linux (más pequeña y segura)
- Solo dependencias de producción

## 🌐 Configuración de CORS

La aplicación está configurada para manejar CORS correctamente:

- **Desarrollo**: Orígenes locales con `credentials: true`
- **Producción**: Dominio específico de Netlify con `credentials: true`

## 📊 Monitoreo y Logs

### Ver logs en tiempo real

```bash
gcloud run services logs tail cmpc-backend --region=us-central1
```

### Métricas de Cloud Run

- CPU y memoria utilizada
- Número de requests
- Latencia de respuesta
- Errores HTTP

## 🔄 CI/CD con GitHub

Para automatizar el despliegue desde GitHub:

1. Conectar repositorio a Cloud Build
2. Configurar trigger en `cloudbuild.yaml`
3. Desplegar automáticamente en cada push a `main`

```bash
# Crear trigger
gcloud builds triggers create github \
    --repo-name=cmpc-backend \
    --repo-owner=tu-usuario \
    --branch-pattern="^main$" \
    --build-config=cloudbuild.yaml
```

## 🚨 Troubleshooting

### Error: "Cannot write file because it would overwrite input file"

```bash
# Limpiar directorio dist
rm -rf dist/
npm run build
```

### Error: "Permission denied"

```bash
# Verificar permisos de Cloud Build
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:PROJECT_NUMBER@cloudbuild.gserviceaccount.com" \
    --role="roles/run.admin"
```

### Error: "Image not found"

```bash
# Verificar que la imagen se subió correctamente
gcloud container images list --repository=gcr.io/$PROJECT_ID
```

## 📞 Soporte

Para problemas o preguntas:

1. Revisar logs de Cloud Run
2. Verificar configuración de variables de entorno
3. Comprobar conectividad de base de datos
4. Validar configuración de CORS

## 🔗 URLs Importantes

- **API Base**: `https://cmpc-backend-xxxxx-uc.a.run.app/api/v1`
- **Documentación Swagger**: `https://cmpc-backend-xxxxx-uc.a.run.app/api`
- **Health Check**: `https://cmpc-backend-xxxxx-uc.a.run.app/api/v1/books/test`
