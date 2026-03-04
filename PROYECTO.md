# Dashboard de Trazabilidad de Café — Documentación del Proyecto

> Exportado desde Figma: https://www.figma.com/design/saG6l45qL2MghXD4AaUmoP/Dashboard-de-trazabilidad-de-caf%C3%A9  
> Servidor local: **http://localhost:5173**

---

## 1. ¿Qué es este proyecto?

Es una **aplicación web de trazabilidad de café** diseñada para que productores, exportadores, compradores y organismos de cumplimiento puedan visualizar el ciclo de vida completo de un lote de café: desde la finca de origen hasta la taza del consumidor. El sistema también verifica el cumplimiento de la regulación **EUDR** (Reglamento de la Unión Europea sobre Deforestación).

El proyecto fue generado a partir de un diseño en **Figma** y exportado como código React listo para correr con Vite.

---

## 2. Stack Tecnológico

| Categoría | Tecnología | Versión |
|---|---|---|
| Framework UI | **React** | 18.3.1 |
| Build tool | **Vite** | 6.3.5 |
| Estilos | **TailwindCSS** v4 | 4.1.12 |
| Routing | **React Router** | ^7.13.0 |
| Componentes UI base | **Radix UI** (suite completa) | varias |
| Sistema de diseño extra | **MUI (Material UI)** | 7.3.5 |
| Animaciones | **Motion (Framer Motion)** | 12.23.24 |
| Gráficas | **Recharts** | 2.15.2 |
| Iconos | **Lucide React** | 0.487.0 |
| Drag & Drop | **React DnD** | 16.0.1 |
| Formularios | **React Hook Form** | 7.55.0 |
| Fechas | **date-fns** | 3.6.0 |
| Notificaciones | **Sonner** | 2.0.3 |
| TypeScript | Sí (`.tsx`) | — |

---

## 3. Estructura de Archivos

```
Dashboard de trazabilidad de café (1)/
├── index.html                        # Punto de entrada HTML
├── package.json                      # Dependencias y scripts
├── vite.config.ts                    # Configuración de Vite + TailwindCSS
├── postcss.config.mjs                # Configuración de PostCSS
├── guidelines/                       # Directrices del proyecto (Figma)
└── src/
    ├── main.tsx                      # Montaje de React en el DOM
    ├── styles/
    │   ├── index.css                 # Importaciones principales de CSS
    │   ├── tailwind.css              # Directiva @import tailwindcss
    │   ├── fonts.css                 # Fuentes web (Inter, Merriweather)
    │   └── theme.css                 # Variables CSS del tema (colores, radii, fuentes)
    └── app/
        ├── App.tsx                   # Raíz de la app — monta el AuthProvider y RouterProvider
        ├── routes.tsx                # Definición de rutas (públicas, auth y protegidas)
        ├── context/
        │   └── AuthContext.tsx       # Contexto de autenticación mock y gestión de sesión
        ├── layouts/
        │   ├── RootLayout.tsx        # Layout para el explorador público
        │   ├── AuthLayout.tsx        # Layout centrado para Login y Registro
        │   └── ProducerLayout.tsx    # Layout con sidebar para el portal del productor
        ├── pages/
        │   ├── ExplorarOrigenes.tsx  # Página 1: Mapa interactivo de Colombia
        │   ├── BancoCafes.tsx        # Página 2: Catálogo de lotes por finca
        │   └── TrazabilidadLote.tsx  # Página 3: Detalle completo de un lote
        └── components/
            ├── auth/
            │   ├── LoginPage.tsx     # Pantalla de acceso
            │   ├── RegisterPage.tsx  # Selección de rol y formulario de registro
            │   └── ProtectedRoute.tsx # Guardián de rutas para áreas privadas
            ├── producer/
            │   ├── ProducerDashboard.tsx # Panel principal del productor (Bento Grid)
            │   ├── MisFincas.tsx         # Gestión de predios y cumplimiento EUDR
            │   └── NuevaCosecha.tsx      # Formulario de registro de recolección daily
            ├── ui/                   # Componentes genéricos (shadcn-style, basados en Radix UI)
            ├── ColombiaMap.tsx       # Mapa SVG interactivo de Colombia
            ├── TopBar.tsx            # Barra de navegación superior
            ├── HeroHeader.tsx        # Hero de la página de inicio
            ├── HeroLote.tsx          # Hero del detalle del lote
            ├── BancoHeader.tsx       # Encabezado de la página Banco de Cafés
            ├── BreadcrumbNav.tsx     # Navegación de migas de pan
            ├── ControlBar.tsx        # Filtros y ordenamiento del banco de cafés
            ├── GrupoFinca.tsx        # Acordeón de lotes agrupados por finca
            ├── LoteBancoCard.tsx     # Tarjeta individual de un lote en el banco
            ├── StepNavigator.tsx     # Navegador de pasos del ciclo del lote
            ├── CapituloTrazabilidad.tsx # Sección de un eslabón de la cadena
            ├── CapituloCata.tsx      # Sección especial de cata y puntuación sensorial
            ├── EUDRCompliance.tsx    # Widget de cumplimiento EUDR
            ├── SensorRadar.tsx       # Gráfica radar de notas sensoriales
            ├── DepartmentDrawer.tsx  # Panel lateral de un departamento del mapa
            ├── EslabonDrawer.tsx     # Panel lateral de detalle de un eslabón
            ├── QuickViewDrawer.tsx   # Panel lateral de vista rápida de un lote
            ├── QuickNav.tsx          # Navegación rápida lateral
            ├── UserRolesSection.tsx  # Sección de roles de usuario
            ├── YoungProducerSection.tsx # Sección de productores jóvenes
            ├── StickyActionBar.tsx   # Barra de acción fija al hacer scroll
            └── ProgressIndicator.tsx # Barra de progreso de scroll
```

---

## 4. Rutas de la Aplicación

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `ExplorarOrigenes` | Explorador público con mapa interactivo |
| `/banco-cafes` | `BancoCafes` | Catálogo público de lotes por finca |
| `/lote/:loteId` | `TrazabilidadLote` | Detalle público de trazabilidad |
| `/auth/login` | `LoginPage` | Acceso al portal privado |
| `/auth/register` | `RegisterPage` | Registro con selección de rol |
| `/producer/*` | `ProducerLayout` | Portal del **Agricultor** (Gestión de fincas y cosechas) |
| `/lider/*` | `LiderLayout` | Portal del **Líder Comunitario** (Validación de campo) |
| `/ambiental/*` | `AmbientalLayout` | Portal del **Verificador Ambiental** (Check EUDR/Mapas) |
| `/catador/*` | `CatadorLayout` | Portal del **Catador Q-Grader** (Evaluación sensorial) |
| `/ceres/*` | `CeresLayout` | Portal **Ceres Admin** (Logística, Exportación y Calidad) |
| `/tostador/*` | `TostadorLayout` | Portal del **Tostador / B2B** (Sourcing y Micro-tueste) |
| `/trazabilidad/publica/:id`| `PublicLayout` | Portal del **Cliente Final** (Storytelling y QR) |

---

## 5. Descripción de las Páginas

### 5.1 `ExplorarOrigenes` — Página de inicio

**Ruta:** `/`

La página de entrada de la aplicación. Presenta un **mapa SVG interactivo de Colombia** donde el usuario puede hacer clic en los principales departamentos cafeteros (Huila, Nariño, Antioquia, Cauca, Tolima). Cada departamento muestra una burbuja con el número de cafés disponibles y su estado de verificación EUDR.

**Flujo:**
1. El usuario hace clic en un departamento → se abre un `DepartmentDrawer` lateral con los datos del departamento.
2. El botón "Ver Banco de Cafés Completo" lleva a `/banco-cafes`.

**Secciones:**
- `TopBar` — Navegación superior
- `HeroHeader` — Banner principal con eslogan
- `ColombiaMap` — Mapa SVG con burbujas animadas y tooltips
- `UserRolesSection` — Explica los 4 roles: Productor, Comprador, Exportador, Auditor
- `YoungProducerSection` — Sección de apoyo a productores jóvenes
- `DepartmentDrawer` — Panel lateral que aparece al seleccionar un departamento

**Estadísticas mostradas:** 32 departamentos cafeteros, 84% de conformidad EUDR promedio.

---

### 5.2 `BancoCafes` — Banco de Cafés

**Ruta:** `/banco-cafes`

Catálogo completo de lotes de café disponibles, **agrupados por finca** mediante acordeones expandibles. Incluye un panel de control con filtros y opciones de ordenamiento.

**Fincas de ejemplo en los datos mock:**

| Finca | Municipio | Altitud | Lotes | EUDR |
|---|---|---|---|---|
| Finca La Esperanza | Pitalito | 1.850 msnm | 3 | Verificado |
| Finca El Porvenir | Acevedo | 1.900 msnm | 3 | Verificado |
| Finca Villa Rosa | Garzón | 1.750 msnm | 2 | En revisión |
| Finca Santa Helena | Palestina | 2.000 msnm | 2 | Verificado |

**Interacciones:**
- Expandir/colapsar todos los grupos de finca simultáneamente.
- Hacer clic en un lote → abre `QuickViewDrawer` con datos rápidos del lote.
- Desde el QuickView hay un botón "Ver trazabilidad completa" → navega a `/lote/:loteId`.

**Datos de cada lote (tarjeta):**
- Proceso (Lavado, Honey, Natural)
- Puntaje SCA (84–89 puntos)
- Notas de cata (Chocolate, Frutos rojos, Floral, etc.)
- Reputación del productor (Alta / Media / Nueva)
- Estado EUDR (Verificado / En revisión / Pendiente)
- Disponibilidad en sacos
- Cadena de trazabilidad (Completa / Parcial)

---

### 5.3 `TrazabilidadLote` — Detalle del Lote

**Ruta:** `/lote/:loteId`

La vista más compleja de la aplicación. Muestra la **cronología completa** de un lote de café desde la finca hasta la cata, con un sistema de pasos navegables (`StepNavigator`) y secciones ancladas (`CapituloTrazabilidad`).

**Lote de ejemplo:** `Lote HUI-ESP-042` — Finca La Esperanza, Huila, Caturra Honey, 1.850 msnm, Cosecha Oct 2025.

**Pasos de la cadena de trazabilidad:**
1. 🌿 **Finca** — Verificado
2. 🍒 **Cosecha** — Verificado
3. ⚙️ **Beneficio** — Verificado
4. ☀️ **Secado** — Documentado
5. 📦 **Almacenamiento** — Verificado
6. 🚢 **Exportación** — Documentado
7. ☕ **Cata** — Verificado

**Funcionalidades:**
- **StepNavigator**: menú fijo con los pasos. Al hacer clic, hace scroll suave a la sección correspondiente.
- **ProgressIndicator**: barra de progreso de scroll en la parte superior de la página.
- **StickyActionBar**: aparece cuando el usuario pasa del 30% del scroll, con botones de acción (Exportar PDF, Compartir, etc.).
- **CapituloTrazabilidad**: cada eslabón muestra quién fue responsable, qué evidencias existen (GPS, fotos, PDF, certificados), datos clave (fecha, método, cantidad) y tags (Auditable, Trazado, Con evidencia).
- **CapituloCata**: sección especial con gráfica radar de los 5 atributos sensoriales (acidez, cuerpo, dulzor, balance, limpieza), puntaje 4.9/5, validado por 3 catadores Q Grader.
- **EUDRCompliance**: widget lateral de cumplimiento de la regulación europea.
- **EslabonDrawer**: panel lateral con detalle completo de un eslabón al hacer clic en "Ver detalle".

### 5.4 `Auth` — Sistema de Acceso

**Rutas:** `/auth/login`, `/auth/register`

Sistema de autenticación mock que permite simular el acceso de diferentes usuarios.
- **Login**: Interfaz limpia con validación simple de campos. Incluye un hint para la demo (`maria@finca.co`).
- **Registro**: Flujo de dos pasos. Primero, selección de rol mediante tarjetas interactivas (Productor, Transformador, Exportador, Comprador). Segundo, formulario de datos personales.

### 5.5 `ProducerPortal` — Portal del Productor

**Ruta:** `/producer/dashboard` (Ruta protegida)

Área privada diseñada para que el caficultor gestione su operación.
- **Layout**: Sidebar responsive con navegación a Dashboard, Fincas, Cosechas, Billetera y Configuración.
- **Dashboard**: Vista estilo **Bento Grid** con:
    - Resumen de café procesado, lotes entregados y precio de mercado del día.
    - Widget de clima local (San Agustín, Huila).
    - Acciones rápidas para registrar nuevas recolecciones y fertilizantes.
    - Tabla "Últimas Entregas" con seguimiento de estado.

### 5.6 `Mis Fincas` — Gestión de Predios

**Ruta:** `/producer/fincas`

Pantalla para registrar y visualizar los terrenos del productor.
- **Lista de Fincas**: Tarjetas con información de altura, municipio y variedades.
- **Registro EUDR**: Formulario con captura de geolocalización (simulada) y subida de documentos legales (Certificado de Libertad) necesarios para la exportación.

### 5.7 `Registrar Recolección` — Nueva Cosecha

**Ruta:** `/producer/cosechas/nueva`

Formulario móvil optimizado para el registro diario de actividades.
- **Campos**: Selección de finca, fecha/hora, tipo de grano (cereza/pergamino).
- **Entrada de Datos**: Input de peso (kg) de gran tamaño y slider de calidad de madurez.
- **Evidencia**: Captura fotográfica del lote para auditoría.
- **Feedback**: Uso de notificaciones `sonner` para confirmar el guardado exitoso.

### 5.8 Portal del Líder Comunitario (`LiderLayout`)
- **Objetivo**: Validar la veracidad de los datos registrados por el agricultor en el territorio.
- **Funcionalidad**: Panel de validaciones pendientes, toma de coordenadas GPS de control, y revisión de documentos de propiedad.
- **Permisos**: Solo Lectura (C) y Validación (V). No crea datos maestros.

### 5.9 Portal del Verificador Ambiental (`AmbientalLayout`)
- **Objetivo**: Asegurar que el café no proviene de zonas deforestadas según el reglamento EUDR.
- **Funcionalidad**: Análisis geoespacial mediante capas de satélite, revisión de Planes de Manejo Ambiental (PMA) y emisión de conceptos técnicos de cumplimiento.
- **Aesthetica**: Minimalista, enfoque en mapas y seguridad ("EcoCheck").

### 5.10 Portal del Catador / Laboratorio (`CatadorLayout`)
- **Objetivo**: Realizar el análisis físico y sensorial del café (SCA).
- **Funcionalidad**: Formulario SCA digital (Fragancia, Aroma, Sabor, etc.), radar sensorial automático y gestión de muestras pendientes.
- **Aesthetica**: Clínica, limpia ("LabSensory"), tonos crema y madera.

### 5.11 Portal Ceres Admin / Exportador (`CeresLayout`)
- **Objetivo**: Control central de la logística, el inventario y la exportación.
- **Funcionalidad**: Dashboard de envíos internacionales, gestión de lotes en bodega, directorio global de productores y auditoría de calidad.
- **Aesthetica**: Corporativa (ERP), tonos Slate y Azul, alta densidad de datos.

### 5.12 Portal del Tostador / Cliente B2B (`TostadorLayout`)
- **Objetivo**: Comprar café de alta especialidad con trazabilidad garantizada.
- **Funcionalidad**: Marketplace B2B, laboratorio de micro-tostión para registrar perfiles propios y acceso a la narrativa de origen para marketing.
- **Privacidad**: No tiene acceso a datos de contacto directo del productor (Anónimización institucional).
- **Aesthetica**: Artesanal ("RoastMaster"), tonos café oscuro, bronce y fuego.

### 5.13 Portal del Cliente Final (`PublicLayout`)
- **Ruta Pública:** `/trazabilidad/publica/:loteId`
- **Objetivo**: Conectar emocionalmente al consumidor con la historia de su café.
- **Funcionalidad**: Storytelling visual, datos sociales (Municipio, Edad, Género), y feedback (valoración de 5 estrellas).
- **Aesthetica**: Mobile-first, editorial, alto impacto visual y tipográfico.

---

## 6. Matriz de Roles y Permisos

La plataforma utiliza una matriz de permisos estricta para garantizar la integridad de los datos y el cumplimiento de la privacidad:

| Rol | Sigla (Código) | Permisos (Sigla) | Descripción |
|---|---|---|---|
| **Agricultor** | `AGRICULTOR` | **D, C, A** | Registra fincas (D), cosechas (C) y actualiza sus datos (A). |
| **Líder Comunitario**| `COMMUNITY_LEADER` | **C, V** | Consulta datos (C) y valida campo (V). No edita. |
| **Verificador Ambiental**| `ENV_VERIFIER` | **C, V** | Consulta coordenadas (C) y emite concepto ambiental (V). |
| **Catador Q-Grader** | `TASTER` | **C, D** | Consulta historial (C) y diligencia formularios de cata (D). |
| **Ceres Admin** | `CERES` | **C, D, Cr, A** | Visión total (C). Registra bodega (D), crea exportaciones (Cr) y audita (A). |
| **Tostador / B2B** | `ROASTER` | **C, D** | Consulta trazabilidad anónima (C) y registra su propia cata (D). |
| **Consumidor Final** | `FINAL_CLIENT` | **C, D** | Consulta narrativa emocional (C) y valoriza el café (D). |

> **Siglas de Permisos:** **C**onsultar, **D**iligenciar (Formularios), **Cr**ear (Registros Maestros), **A**ctualizar, **V**alidar.

---

## 7. Sistema de Autenticación y Seguridad (Mock)

El proyecto implementa un sistema de seguridad simulado basado en:
1. **AuthContext**: Proveedor de estado global que gestiona el usuario actual y la persistencia en `sessionStorage`.
2. **ProtectedRoute**: Componente de alto orden que intercepta el acceso a rutas privadas y redirige según el rol.
3. **Roles**: Soporte nativo para los 7 perfiles descritos en la matriz.

---

## 8. Paleta de Colores y Tema Visual

El sistema de diseño está definido en `src/styles/theme.css` mediante variables CSS:

| Variable | Valor | Nombre conceptual |
|---|---|---|
| `--background` | `#F5F5DC` | Crema Pergamino |
| `--primary` | `#2C5F2D` | Verde Bosque (café maduro) |
| `--destructive` | `#973333` | Rojo Cereza (alertas) |
| `--chart-2` | `#5a8f5b` | Verde claro (datos secundarios) |
| `--chart-5` | `#8b7355` | Marrón tierra (café tostado) |
| `--radius` | `0.75rem` | Bordes redondeados uniformes |

**Tipografía:**
- **UI**: `Inter` (sans-serif) — texto general, botones, etiquetas.
- **Headings**: `Merriweather` (serif) — títulos y elementos editoriales.

---

## 7. Componentes UI Base (`/components/ui/`)

La carpeta `ui/` contiene ~48 componentes genéricos construidos con **Radix UI** y estilizados con TailwindCSS v4, al estilo de [shadcn/ui](https://ui.shadcn.com/). Incluyen:

`accordion`, `alert`, `alert-dialog`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `carousel`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input`, `label`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `skeleton`, `slider`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `toast`, `toggle`, `toggle-group`, `tooltip`.

---

## 8. Datos

Toda la información que muestra la aplicación son **datos mock** (hardcodeados directamente en los componentes de página). No existe backend ni base de datos real. Esto es intencionado ya que el proyecto fue exportado de Figma como prototipo funcional.

Los datos simulan:
- 4 fincas en el departamento de Huila con 10 lotes en total.
- 5 departamentos cafeteros principales de Colombia.
- 7 eslabones de la cadena de trazabilidad de un lote.
- Perfiles de productores con evidencias y calificaciones.
- Atributos sensoriales de cata (SCAA format).

---

## 9. Scripts Disponibles

```bash
npm install --legacy-peer-deps   # Instalar dependencias (requiere --legacy-peer-deps)
npm run dev                      # Iniciar servidor de desarrollo → http://localhost:5173
npm run build                    # Compilar para producción
```

> **Nota:** Se necesita `--legacy-peer-deps` porque `react` y `react-dom` están declarados como `peerDependencies` opcionales en el `package.json`, lo que genera conflictos con npm v7+.

---

## 10. Posibles Extensiones

Si se quisiera escalar el proyecto, los próximos pasos naturales serían:

1. **Conectar a un backend real** (REST API o GraphQL) para reemplazar los datos mock.
2. **Agregar autenticación** para los diferentes roles (Productor, Comprador, Exportador, Auditor).
3. **Completar el mapa de Colombia** con todos los 32+ departamentos cafeteros con paths SVG reales.
4. **Implementar filtros activos** en `ControlBar` (actualmente solo loggea en consola).
5. **Añadir la ruta `/lote/:loteId`** con resolución dinámica según el ID del lote seleccionado.
6. **Internacionalización** (i18n) para inglés, dado que el mercado objetivo incluye compradores europeos (cumplimiento EUDR).
7. **Exportación a PDF** del reporte de trazabilidad (la barra de acción ya tiene el botón preparado).
