# Odisea Trace

Aplicación web de trazabilidad de café. Portal del productor rediseñado para celular
(registro de finca, cosechas y cuentas), más portales para líder comunitario,
verificador ambiental, catador, administración Odisea y tostador/cliente.

**Stack:** React 18 · Vite 6 · TypeScript · TailwindCSS v4 · React Router 7

## Arrancar

```bash
npm install
npm run dev        # http://localhost:5173
```

Scripts: `npm run build` · `npm run preview` · `npm run typecheck`

## Estado actual

Sin backend. Todos los datos viven en `localStorage` a través de la capa
`src/services/`. Ver **[HANDOFF.md](./HANDOFF.md)** para el mapa de archivos,
el modelo de datos y cómo conectar una base de datos real.

## Demo

- **Productor**: entra con celular `3124559876` y cualquier contraseña.
- **Institucional**: `maria@finca.co` (o registra un rol nuevo en `/auth/register`).
