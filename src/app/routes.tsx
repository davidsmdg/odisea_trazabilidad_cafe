import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { ProducerLayout } from './layouts/ProducerLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ExplorarOrigenes } from './pages/ExplorarOrigenes';
import { BancoCafes } from './pages/BancoCafes';
import { TrazabilidadLote } from './pages/TrazabilidadLote';
import { SobreNosotros } from './pages/SobreNosotros';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ProducerDashboard } from './components/producer/ProducerDashboard';
import { MisFincas } from './components/producer/MisFincas';
import { MisCosechas } from './components/producer/MisCosechas';
import { NuevaCosecha } from './components/producer/NuevaCosecha';
import { PerfilProductor } from './components/producer/PerfilProductor';
import { ExperimentosCafe } from './components/producer/ExperimentosCafe';
import { CostosProduccion } from './components/producer/CostosProduccion';
import { LiderLayout } from './layouts/LiderLayout';
import { ValidacionesPanel } from './components/lider/ValidacionesPanel';
import { DetalleValidacion } from './components/lider/DetalleValidacion';
import { CanalReporte } from './components/lider/CanalReporte';
import { PerfilLider } from './components/lider/PerfilLider';
import { AmbientalLayout } from './layouts/AmbientalLayout';
import { BandejaRevision } from './components/ambiental/BandejaRevision';
import { AnalisisEspacial } from './components/ambiental/AnalisisEspacial';
import { HistorialAprobaciones } from './components/ambiental/HistorialAprobaciones';
import { BuenasPracticas } from './components/ambiental/BuenasPracticas';
import { CatadorLayout } from './layouts/CatadorLayout';
import { MuestrasPendientes } from './components/catador/MuestrasPendientes';
import { EvaluacionSensorial } from './components/catador/EvaluacionSensorial';
import { HistorialCatas } from './components/catador/HistorialCatas';
import { PerfilCatador } from './components/catador/PerfilCatador';
import { OdiseaLayout } from './layouts/OdiseaLayout';
import { DashboardOdisea } from './components/odisea/DashboardOdisea';
import { GestionLotesOdisea } from './components/odisea/GestionLotesOdisea';
import { DetalleLoteOdisea } from './components/odisea/DetalleLoteOdisea';
import { CalidadControlOdisea } from './components/odisea/CalidadControlOdisea';
import { DirectorioGeneralOdisea } from './components/odisea/DirectorioGeneralOdisea';
import { ControlConexionesOdisea } from './components/odisea/ControlConexionesOdisea';
import { ExportacionesOdisea } from './components/odisea/ExportacionesOdisea';
import { GestionUsuariosOdisea } from './components/odisea/GestionUsuariosOdisea';
import { TostadorLayout } from './layouts/TostadorLayout';
import { PerfilTostador } from './components/tostador/PerfilTostador';
import { ExplorarCafes } from './components/tostador/ExplorarCafes';
import { DetalleTrazabilidadRoaster } from './components/tostador/DetalleTrazabilidad';
import { LaboratorioTostador } from './components/tostador/LaboratorioTostador';
import { MisLotesTostador } from './components/tostador/MisLotesTostador';
import { HistoriaProductor } from './components/tostador/HistoriaProductor';
import { EudrCompliance } from './components/tostador/EudrCompliance';
import { RoasterToolkit } from './components/tostador/RoasterToolkit';
import { ForwardBooking } from './components/tostador/ForwardBooking';
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
      {
        path: 'sobre-nosotros',
        Component: SobreNosotros,
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
                Component: MisCosechas,
              },
              {
                path: 'nueva',
                Component: NuevaCosecha,
              },
            ],
          },
          {
            path: 'perfil',
            Component: PerfilProductor,
          },
          {
            path: 'laboratorio',
            Component: ExperimentosCafe,
          },
          {
            path: 'costos',
            Component: CostosProduccion,
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
            path: 'reportar',
            Component: CanalReporte,
          },
          {
            path: 'perfil',
            Component: PerfilLider,
          },
        ],
      },
    ],
  },

  // ── Rutas protegidas del verificador ambiental (FUSIONADO A ODISEA) ─────
  {
    path: '/ambiental',
    Component: ProtectedRoute,
    children: [
      {
        Component: OdiseaLayout,
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
            path: 'buenas-practicas',
            Component: BuenasPracticas,
          },
          {
            path: 'historial',
            Component: HistorialAprobaciones,
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
            Component: HistorialCatas,
          },
          {
            path: 'perfil',
            Component: PerfilCatador,
          },
        ],
      },
    ],
  },

  // ── Rutas protegidas de Odisea (Administrador Central) ────────────────────
  {
    path: '/odisea',
    Component: ProtectedRoute,
    children: [
      {
        Component: OdiseaLayout,
        children: [
          {
            path: 'dashboard',
            Component: DashboardOdisea,
          },
          {
            path: 'productores',
            Component: DirectorioGeneralOdisea,
          },
          {
            path: 'lotes',
            Component: GestionLotesOdisea,
          },
          {
            path: 'lote/:id',
            Component: DetalleLoteOdisea,
          },
          {
            path: 'exportaciones',
            Component: ExportacionesOdisea,
          },
          {
            path: 'calidad',
            Component: CalidadControlOdisea,
          },
          {
            path: 'conexiones',
            Component: ControlConexionesOdisea,
          },
          {
            path: 'usuarios',
            Component: GestionUsuariosOdisea,
          },
          {
            path: 'ambiental/revisiones',
            Component: BandejaRevision,
          },
          {
            path: 'ambiental/analizar/:id',
            Component: AnalisisEspacial,
          },
          {
            path: 'ambiental/buenas-practicas',
            Component: BuenasPracticas,
          },
          {
            path: 'ambiental/historial',
            Component: HistorialAprobaciones,
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
            path: 'cata/:loteId',
            Component: LaboratorioTostador,
          },
          {
            path: 'lotes',
            Component: MisLotesTostador,
          },
          {
            path: 'historia/:id',
            Component: HistoriaProductor,
          },
          {
            index: true,
            element: <Navigate to="explorar" replace />,
          },
          {
            path: 'perfil',
            Component: PerfilTostador,
          },
          {
            path: 'eudr',
            Component: EudrCompliance,
          },
          {
            path: 'toolkit',
            Component: RoasterToolkit,
          },
          {
            path: 'futuro',
            Component: ForwardBooking,
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
      <div className="w-16 h-16 rounded-2xl bg-[#5f705f]/10 flex items-center justify-center mb-4">
        <span className="text-3xl">🚧</span>
      </div>
      <h2 className="text-2xl font-sans font-bold text-[#5f705f] mb-2">{page}</h2>
      <p className="text-gray-400 text-sm max-w-xs">
        Esta sección está en construcción. Pronto estará disponible en el portal del productor.
      </p>
    </div>
  );
}

