# Handoff — Odisea Trace

Guía para el desarrollador que va a ponerle base de datos y dejar una versión
usable para pruebas de campo.

---

## 1. Idea central de la arquitectura

**Los componentes nunca tocan el almacenamiento. Solo hablan con `src/services/`.**

```
Componentes  ──►  src/services/*.ts   ──►   (hoy) localStorage / mocks
   (UI)          "el contrato / la API"      (mañana) tu base de datos
```

Cada función de servicio es `async` y usa los tipos de `src/types/`.
Para conectar una BBDD real: **reescribís el cuerpo de cada servicio, no las
firmas** → ningún componente se toca.

---

## 2. Archivos clave, por prioridad

### Tier 1 — la costura con la base de datos

| Archivo(s) | Rol |
|---|---|
| `src/services/*.ts` (14) | La "API". Firmas estables, cuerpo reemplazable. |
| `src/types/*.ts` | Modelo de datos = esquema de tablas. Los del productor: `finanzas.ts`, `finca.ts`, `cosecha.ts`, `lote.ts`, `usuario.ts`. |
| `src/app/utils/loteStore.ts`, `anomalyStore.ts` | Implementación localStorage (lotes, anomalías). |
| `src/app/producer/utils/finanzasStore.ts`, `onboardingFlag.ts` | Implementación localStorage (cuentas, flag de onboarding). |
| `src/data/*.mock.ts` | Datos semilla → seed / migraciones. |

### Tier 2 — autenticación (necesita proveedor real)

| Archivo | Nota |
|---|---|
| `src/app/context/AuthContext.tsx` | **Mock.** `login(identificador, password)` acepta correo **o celular**. `register(name, contacto, password, role)` → `AGRICULTOR` guarda `celular`, el resto `email`. Sesión en `sessionStorage['cerescrop_user']`. Usuarios registrados en `localStorage['odisea_usuarios_registrados']`. |
| `src/app/components/auth/LoginPage.tsx` | Campo único correo/celular. |
| `src/app/components/auth/RegisterPage.tsx` | 6 tarjetas de rol. `AGRICULTOR` → campo "Número de celular". |
| `src/app/components/auth/ProtectedRoute.tsx` | Guard de rutas privadas. |

### Tier 3 — portal del productor (lo que se rediseñó)

| Carpeta / archivo | |
|---|---|
| `src/app/producer/ProducerMobileLayout.tsx` | Shell móvil + tab bar. Dispara el onboarding. |
| `src/app/producer/ProducerOnboarding.tsx` | Primer uso: finca → parcela → saldo inicial. |
| `src/app/producer/pages/` | `Inicio`, `FincaPage`, `CuentasPage`, `CosechasPage`, `NuevaCosechaPage`, `PerfilPage`. |
| `src/app/producer/components/` | `BottomSheet`, `TabBar`, `finanzas/HojaMovimiento`. |
| `src/app/producer/hooks/` | `useGeolocation` (GPS, funciona offline), `useOnlineStatus`. |
| `src/app/producer/data/` | `categoriasFinanzas`, `iconosFinanzas`, `regiones`, `preciosReferencia` (mock del precio del día). |
| `src/app/producer/utils/formato.ts` | Formato de plata/fechas. |
| `src/app/components/odisea/FinanzasProductoresOdisea.tsx` | Vista de Odisea admin (solo lectura) de las cuentas del productor. Ruta `/odisea/finanzas`. |

### Tier 4 — config y shell

`package.json` · `tsconfig.json` · `vite.config.ts` · `.env.example` ·
`index.html` · `src/main.tsx` · `src/app/App.tsx` · `src/app/routes.tsx` ·
`src/styles/` (`theme.css`, `producer.css`, `tailwind.css`, `fonts.css`, `index.css`) ·
`public/` (`sw.js`, `manifest.webmanifest`, `favicon.svg`, `pwa-icon.svg`)

---

## 3. Mapa `localStorage` → tablas

| Clave | Tabla sugerida | Servicio |
|---|---|---|
| `odisea_fincas` | `fincas` (+ `parcelas`) | `fincasService` |
| `lotes_produccion` | `cosechas` | `cosechasService` |
| `odisea_lotes_master` | `lotes` | `lotesService` |
| `odisea_validaciones_stage_gate` | `validaciones_stage` | `lotesService` |
| `odisea_finanzas_movimientos` | `movimientos_financieros` | `finanzasService` |
| `odisea_finanzas_categorias_custom` | `categorias_financieras` | `finanzasService` |
| `odisea_finanzas_periodos` | `periodos_cosecha` | `finanzasService` |
| `odisea_usuarios_registrados` + `MOCK_USERS` | `usuarios` | auth |
| `odisea_onboarding_productor` | `usuarios.onboarding_completo` | `onboardingFlag` |
| `perfil_productor` | `perfiles_productor` | *(falta crear `perfilService`)* |
| `odisea_anomalias` / `odisea_config_anomalias` | `anomalias` / config | `anomaliesService` |
| `comentarios_publicos_pendientes` / `_aprobados` | `valoraciones_qr` | *(inline en GestionLotesOdisea / TrazabilidadPublica)* |

> Ojo: no todos los servicios delegan en un `store`. Algunos
> (`cosechasService`, `fincasService`, `directorioService`, `validacionesService`,
> `usuariosService`, `conexionesService`) tienen `localStorage` inline — misma
> fachada async, hay que reemplazar el cuerpo igual.

---

## 4. Qué falta para "usable para pruebas"

- [ ] **Base de datos + Auth reales** (ver sección 5).
- [ ] **`.env`**: copiar `.env.example` → `.env` y completar.
- [ ] **Sincronización offline**: hoy "offline" = todo en `localStorage`. Con BBDD
      real hace falta una cola (escribir a IndexedDB, sincronizar al reconectar).
      Se implementa **dentro de `src/services/`**, la capa ya lo aísla.
- [ ] **Íconos PWA reales**: `public/pwa-icon.svg` y `favicon.svg` son placeholders.
      Generar PNG maskable 192×192 y 512×512 y actualizar `manifest.webmanifest`.
- [ ] **Deploy**: SPA estática → Vercel / Netlify + backend aparte.
- [ ] **`perfilService`**: el perfil del productor se guarda a mano en
      `PerfilPage.tsx` (`localStorage['perfil_productor']`), sin servicio.

Ya resuelto en este handoff: `tsconfig.json`, `typescript` instalado,
`react`/`react-dom` como dependencias reales, `npm run typecheck` en verde,
`.gitignore` al día, `node_runtime/` y archivos basura fuera del repo.

---

## 5. Ruta recomendada: Supabase

Por el login con **celular**, Supabase es el camino más corto (Postgres + Auth
con OTP por SMS nativo).

1. Proyecto Supabase → crear tablas desde `src/types/*.ts`.
2. **Row Level Security**: cada productor ve solo lo suyo; el rol Odisea admin ve
   todo. El código ya asume esta separación (ver `FinanzasProductoresOdisea`).
3. `npm i @supabase/supabase-js` → cliente en `src/lib/supabase.ts` leyendo
   `import.meta.env.VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
4. Reescribir el cuerpo de cada `src/services/*.ts`:
   `localStorage` → `supabase.from('tabla')…`. **Las firmas no cambian.**
5. `AuthContext.tsx` → `supabase.auth`: OTP por celular para `AGRICULTOR`,
   email+password para roles institucionales. Mantener el shape de `AuthUser`.
6. Seed inicial desde los `*.mock.ts`.
7. Offline: cola de escrituras pendientes en IndexedDB (p. ej. `dexie`) dentro de
   la capa de servicios; marcar cada registro con `pendiente_sync` y reintentar
   con el evento `online`.

**Definición de "versión para pruebas":** auth real (celular para productoras) ·
datos que persisten entre dispositivos y sesiones · flujo del productor completo
online + captura offline con sync · una URL para compartir.

---

## 6. Convenciones y gotchas

- **Import de tipos**: `src/types/` se importa como `@/types/…` o con la ruta
  relativa correcta. Desde `src/app/<x>/<y>/` son **tres** niveles: `../../../types/…`.
- **HMR + `motion` / `AnimatePresence`**: editar archivos con el server vivo a
  veces deja el módulo "wedged". Si algo raro pasa en dev, reiniciar `npm run dev`.
- **`OnboardingTour.tsx`** (tour de los portales institucionales) sigue en uso;
  su rama `AGRICULTOR` quedó muerta tras el rediseño, se puede limpiar.
- El portal `ENV_VERIFIER` (Verificador ambiental) comparte layout y rutas con
  Odisea (`/odisea/ambiental/*`).
- `PROYECTO.md` es un panorama parcialmente desactualizado del proyecto original.

---

## 7. Primer commit

Todo el rediseño del productor está sin commitear en la rama `rediseno-productor`.
Sugerencia: commits por fase (finca, cuentas, onboarding, auth, limpieza) para un
historial legible, o un único commit `feat: rediseño móvil del portal del productor`.
