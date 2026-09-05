# Proyecto ADA — Backend

Backend centralizado en Node.js/Express: autenticación (usuarios y laboratorios), perfil de usuario y consultas a la IA "ADA".

## Requisitos
- Node.js 18+
- Docker (para MongoDB local, opcional si ya tienes Mongo corriendo)

## Instalación

```bash
npm install
cp .env.example .env
# Edita .env con tus valores reales (JWT_SECRET y AI_API_KEY)
```

## Levantar MongoDB local con Docker

```bash
docker compose up -d
```

## Ejecutar el servidor

```bash
npm run dev
```

El servidor queda disponible en `http://localhost:4000`.

## Endpoints principales

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | /auth/register | Registro de usuario | No |
| POST | /auth/register-laboratorio | Registro de laboratorio | No |
| POST | /auth/login | Login (body: `{ email, password, tipo }`) | No |
| GET | /usuario/perfil | Perfil del usuario logueado | Sí (Bearer token) |
| PUT | /usuario/areas-interes | Actualiza patologías/áreas de interés | Sí |
| POST | /ada/preguntar | Pregunta a la IA (body: `{ pregunta }`) | Sí |
| GET | /ada/historial | Historial de consultas del usuario | Sí |

## Notas de seguridad importantes

- Las contraseñas se guardan con `bcrypt`, nunca en texto plano.
- Las rutas protegidas requieren el header `Authorization: Bearer <token>`.
- `AI_API_KEY` **nunca** debe exponerse al frontend — todas las llamadas a la IA pasan por este backend.
- Este proyecto maneja datos de salud (patologías). Para un entorno real de producción se necesitaría cifrado adicional y cumplimiento de normativas de protección de datos de salud.

## Próximos pasos sugeridos

1. Agregar validaciones más robustas (ej. `express-validator`).
2. Endpoint `GET /patologias` para el catálogo maestro.
3. Endpoint `GET /laboratorios` (con filtro por área).
4. Conectar la web/app consumiendo esta API.
5. Documentar con Swagger/OpenAPI.
