import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { ProducerLayout } from './layouts/ProducerLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ExplorarOrigenes } from './pages/ExplorarOrigenes';
import { BancoCafes } from './pages/BancoCafes';
import { TrazabilidadLote } from './pages/TrazabilidadLote';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ProducerDashboard } from './components/producer/ProducerDashboard';
import { MisFincas } from './components/producer/MisFincas';
import { NuevaCosecha } from './components/producer/NuevaCosecha';
import { LiderLayout } from './layouts/LiderLayout';
import { ValidacionesPanel } from './components/lider/ValidacionesPanel';
import { DetalleValidacion } from './components/lider/DetalleValidacion';
import { AmbientalLayout } from './layouts/AmbientalLayout';
import { BandejaRevision } from './components/ambiental/BandejaRevision';
import { AnalisisEspacial } from './components/ambiental/AnalisisEspacial';
import { CatadorLayout } from './layouts/CatadorLayout';
import { MuestrasPendientes } from './components/catador/MuestrasPendientes';
import { EvaluacionSensorial } from './components/catador/EvaluacionSensorial';
import { CeresLayout } from './layouts/CeresLayout';
import { GestionLotesCeres } from './components/ceres/GestionLotesCeres';
import { DetalleLoteCeres } from './components/ceres/DetalleLoteCeres';
import { CalidadControlCeres } from './components/ceres/CalidadControlCeres';
import { DirectorioProductoresCeres } from './components/ceres/DirectorioProductoresCeres';
import { TostadorLayout } from './layouts/TostadorLayout';
import { ExplorarCafes } from './components/tostador/ExplorarCafes';
import { DetalleTrazabilidadRoaster } from './components/tostador/DetalleTrazabilidad';
import { LaboratorioTostador } from './components/tostador/LaboratorioTostador';
import { PublicLayout } from './layouts/PublicLayout';
import { TrazabilidadPublica } from './components/public/TrazabilidadPublica';

export const router = createBrowserRouter([
  // ── Rutas públicas (explorador) ──────────────────────────────────────────
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: ExplorarOrigenes,
      },
      {
        path: 'banco-cafes',
        Component: BancoCafes,
      },
      {
        path: 'lote/:loteId',
        Component: TrazabilidadLote,
      },
    ],
  },

  // ── Rutas de autenticación ───────────────────────────────────────────────
  {
    path: '/auth',
    Component: AuthLayout,
    children: [
      {
        path: 'login',
        Component: LoginPage,
      },
      {
        path: 'register',
        Component: RegisterPage,
      },
    ],
  },

  // ── Rutas protegidas del productor ───────────────────────────────────────
  {
    path: '/producer',
    Component: ProtectedRoute,
    children: [
      {
        Component: ProducerLayout,
        children: [
          {
            path: 'dashboard',
            Component: ProducerDashboard,
          },
          // Páginas en construcción — placeholder genérico
          {
            path: 'fincas',
            Component: MisFincas,
          },
          {
            path: 'cosechas',
            children: [
              {
                index: true,
                Component: () => <ComingSoon page="Historial de Cosechas" />,
              },
              {
                path: 'nueva',
                Component: NuevaCosecha,
              },
            ],
          },
          {
            path: 'wallet',
            Component: () => <ComingSoon page="Pagos/Billetera" />,
          },
          {
            path: 'settings',
            Component: () => <ComingSoon page="Configuración" />,
          },
        ],
      },
    ],
  },

  // ── Rutas protegidas del líder comunitario ────────────────────────────────
  {
    path: '/lider',
    Component: ProtectedRoute,
    children: [
      {
        Component: LiderLayout,
        children: [
          {
            path: 'validaciones',
            Component: ValidacionesPanel,
          },
          {
            path: 'validar/:id',
            Component: DetalleValidacion,
          },
          {
            path: 'agricultores',
            Component: () => <ComingSoon page="Directorio de Agricultores" />,
          },
        ],
      },
    ],
  },

  // ── Rutas protegidas del verificador ambiental ──────────────────────────
  {
    path: '/ambiental',
    Component: ProtectedRoute,
    children: [
      {
        Component: AmbientalLayout,
        children: [
          {
            path: 'revisiones',
            Component: BandejaRevision,
          },
          {
            path: 'analizar/:id',
            Component: AnalisisEspacial,
          },
          {
            path: 'historial',
            Component: () => <ComingSoon page="Historial de Aprobaciones" />,
          },
        ],
      },
    ],
  },

  // ── Rutas protegidas del catador ─────────────────────────────────────────
  {
    path: '/catador',
    Component: ProtectedRoute,
    children: [
      {
        Component: CatadorLayout,
        children: [
          {
            path: 'muestras',
            Component: MuestrasPendientes,
          },
          {
            path: 'evaluar/:loteId',
            Component: EvaluacionSensorial,
          },
          {
            path: 'historial',
            Component: () => <ComingSoon page="Historial de Catas" />,
          },
        ],
      },
    ],
  },

  // ── Rutas protegidas de Ceres (Administrador Central) ────────────────────
  {
    path: '/ceres',
    Component: ProtectedRoute,
    children: [
      {
        Component: CeresLayout,
        children: [
          {
            path: 'dashboard',
            Component: () => <ComingSoon page="Dashboard Logístico" />,
          },
          {
            path: 'productores',
            Component: DirectorioProductoresCeres,
          },
          {
            path: 'lotes',
            Component: GestionLotesCeres,
          },
          {
            path: 'lote/:id',
            Component: DetalleLoteCeres,
          },
          {
            path: 'exportaciones',
            Component: () => <ComingSoon page="Panel de Exportaciones" />,
          },
          {
            path: 'calidad',
            Component: CalidadControlCeres,
          },
        ],
      },
    ],
  },

  // ── Rutas protegidas del tostador / cliente B2B ──────────────────────────
  {
    path: '/tostador',
    Component: ProtectedRoute,
    children: [
      {
        Component: TostadorLayout,
        children: [
          {
            path: 'explorar',
            Component: ExplorarCafes,
          },
          {
            path: 'lote/:id',
            Component: DetalleTrazabilidadRoaster,
          },
          {
            path: 'laboratorio',
            Component: () => <ComingSoon page="Mi Laboratorio de Cata" />,
          },
          {
            path: 'cata/:loteId',
            Component: LaboratorioTostador,
          },
          {
            path: 'lotes',
            Component: () => <ComingSoon page="Mis Lotes Comprados" />,
          },
        ],
      },
    ],
  },

  // ── Rutas Públicas de Trazabilidad (Escaneo QR) ──────────────────────────
  {
    path: '/trazabilidad',
    Component: PublicLayout,
    children: [
      {
        path: 'publica/:loteId',
        Component: TrazabilidadPublica,
      },
    ],
  },
]);

// Placeholder para páginas aún no implementadas
function ComingSoon({ page }: { page: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#2C5F2D]/10 flex items-center justify-center mb-4">
        <span className="text-3xl">🚧</span>
      </div>
      <h2 className="text-2xl font-serif font-bold text-[#2C5F2D] mb-2">{page}</h2>
      <p className="text-gray-400 text-sm max-w-xs">
        Esta sección está en construcción. Pronto estará disponible en el portal del productor.
      </p>
    </div>
  );
}

