import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { BreadcrumbNav } from '../components/BreadcrumbNav';
import { BancoHeader } from '../components/BancoHeader';
import { ControlBar } from '../components/ControlBar';
import { GrupoFinca } from '../components/GrupoFinca';
import { QuickViewDrawer } from '../components/QuickViewDrawer';
import { Button } from '../components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Datos de ejemplo
const gruposFincas = [
  {
    id: '1',
    nombre: 'Finca La Esperanza',
    municipio: 'Pitalito',
    altitud: '1.850 msnm',
    impacto: 'Alto' as const,
    ueEstado: 'Verificado' as const,
    cafesCount: 4,
    lotes: [
      {
        id: 'HUI-001',
        titulo: 'Lote HUI-ESP-042',
        proceso: 'Lavado' as const,
        puntaje: 87.5,
        notas: ['Chocolate', 'Caramelo'],
        reputacion: 'Alta' as const,
        ueEstado: 'Verificado' as const,
        disponibilidad: 12,
        cadena: 'Completa' as const,
      },
      {
        id: 'HUI-002',
        titulo: 'Lote HUI-ESP-043',
        proceso: 'Honey' as const,
        puntaje: 86.0,
        notas: ['Frutos rojos', 'Cítrico'],
        reputacion: 'Alta' as const,
        ueEstado: 'Verificado' as const,
        disponibilidad: 8,
        cadena: 'Completa' as const,
      },
      {
        id: 'HUI-003',
        titulo: 'Lote HUI-ESP-044',
        proceso: 'Natural' as const,
        puntaje: 85.5,
        notas: ['Chocolate', 'Especias'],
        reputacion: 'Media' as const,
        ueEstado: 'Verificado' as const,
        disponibilidad: 15,
        cadena: 'Completa' as const,
      },
    ],
  },
  {
    id: '2',
    nombre: 'Finca El Porvenir',
    municipio: 'Acevedo',
    altitud: '1.900 msnm',
    impacto: 'Alto' as const,
    ueEstado: 'Verificado' as const,
    cafesCount: 3,
    lotes: [
      {
        id: 'HUI-004',
        titulo: 'Lote HUI-POR-018',
        proceso: 'Lavado' as const,
        puntaje: 88.0,
        notas: ['Floral', 'Caramelo'],
        reputacion: 'Alta' as const,
        ueEstado: 'Verificado' as const,
        disponibilidad: 10,
        cadena: 'Completa' as const,
      },
      {
        id: 'HUI-005',
        titulo: 'Lote HUI-POR-019',
        proceso: 'Honey' as const,
        puntaje: 86.5,
        notas: ['Chocolate', 'Frutos rojos'],
        reputacion: 'Alta' as const,
        ueEstado: 'Verificado' as const,
        disponibilidad: 14,
        cadena: 'Completa' as const,
      },
      {
        id: 'HUI-006',
        titulo: 'Lote HUI-POR-020',
        proceso: 'Natural' as const,
        puntaje: 87.0,
        notas: ['Cítrico', 'Caramelo'],
        reputacion: 'Media' as const,
        ueEstado: 'En revisión' as const,
        disponibilidad: 9,
        cadena: 'Completa' as const,
      },
    ],
  },
  {
    id: '3',
    nombre: 'Finca Villa Rosa',
    municipio: 'Garzón',
    altitud: '1.750 msnm',
    impacto: 'Medio' as const,
    ueEstado: 'En revisión' as const,
    cafesCount: 3,
    lotes: [
      {
        id: 'HUI-007',
        titulo: 'Lote HUI-VIL-024',
        proceso: 'Lavado' as const,
        puntaje: 85.0,
        notas: ['Chocolate', 'Especias'],
        reputacion: 'Media' as const,
        ueEstado: 'En revisión' as const,
        disponibilidad: 18,
        cadena: 'Parcial' as const,
      },
      {
        id: 'HUI-008',
        titulo: 'Lote HUI-VIL-025',
        proceso: 'Honey' as const,
        puntaje: 84.5,
        notas: ['Caramelo', 'Chocolate'],
        reputacion: 'Nueva' as const,
        ueEstado: 'Pendiente' as const,
        disponibilidad: 20,
        cadena: 'Parcial' as const,
      },
    ],
  },
  {
    id: '4',
    nombre: 'Finca Santa Helena',
    municipio: 'Palestina',
    altitud: '2.000 msnm',
    impacto: 'Alto' as const,
    ueEstado: 'Verificado' as const,
    cafesCount: 2,
    lotes: [
      {
        id: 'HUI-009',
        titulo: 'Lote HUI-SAN-031',
        proceso: 'Lavado' as const,
        puntaje: 89.0,
        notas: ['Floral', 'Cítrico', 'Frutos rojos'],
        reputacion: 'Alta' as const,
        ueEstado: 'Verificado' as const,
        disponibilidad: 6,
        cadena: 'Completa' as const,
      },
      {
        id: 'HUI-010',
        titulo: 'Lote HUI-SAN-032',
        proceso: 'Honey' as const,
        puntaje: 87.5,
        notas: ['Chocolate', 'Caramelo'],
        reputacion: 'Alta' as const,
        ueEstado: 'Verificado' as const,
        disponibilidad: 11,
        cadena: 'Completa' as const,
      },
    ],
  },
];

export function BancoCafes() {
  const [expandAll, setExpandAll] = useState(false);
  const [selectedLote, setSelectedLote] = useState<any>(null);
  const navigate = useNavigate();

  const handleExpandToggle = () => {
    setExpandAll(!expandAll);
  };

  const handleLoteClick = (lote: any) => {
    // Simular datos completos para el QuickView
    setSelectedLote({
      id: lote.id,
      titulo: lote.titulo,
      finca: 'Finca La Esperanza',
      departamento: 'Huila',
      proceso: lote.proceso,
      variedad: 'Caturra',
      cosecha: '2024-01',
      puntaje: lote.puntaje,
      reputacion: lote.reputacion,
      ueEstado: lote.ueEstado,
      evidencias: 6,
      cadena: [
        { paso: 'Finca', estado: 'Verificado' as const },
        { paso: 'Proceso', estado: 'Verificado' as const },
        { paso: 'Secado', estado: 'Verificado' as const },
        { paso: 'Exportación', estado: 'Documentado' as const },
        { paso: 'Cata', estado: 'Verificado' as const },
        { paso: 'Venta', estado: 'Pendiente' as const },
      ],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#F5F5DC]"
      style={{ fontFamily: 'var(--font-ui)' }}
    >
      <TopBar activeItem="Banco" />

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <BreadcrumbNav items={['Explorar orígenes', 'Colombia', 'Huila']} />

        <BancoHeader departamento="Huila" disponibles={24} ueVerificadoActive={false} />

        <ControlBar
          onAgruparChange={(tipo) => console.log('Agrupar por:', tipo)}
          onOrdenarChange={(orden) => console.log('Ordenar:', orden)}
        />

        {/* Botón expandir/colapsar todo */}
        <div className="flex justify-end mb-4">
          <Button variant="outline" size="sm" onClick={handleExpandToggle} className="gap-2">
            {expandAll ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Colapsar todo
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Expandir todo
              </>
            )}
          </Button>
        </div>

        {/* Grupos de fincas */}
        <div className="space-y-4">
          {gruposFincas.map((grupo, index) => (
            <GrupoFinca
              key={grupo.id}
              grupo={grupo}
              defaultExpanded={expandAll || index < 2}
              onLoteClick={handleLoteClick}
            />
          ))}
        </div>

        {/* Estado vacío si no hay resultados */}
        {gruposFincas.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-2">
                No encontramos cafés con estos filtros
              </h3>
              <p className="text-muted-foreground">
                Prueba quitar 'Solo UE verificado' o ajusta otros filtros.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Quick View Drawer */}
      <QuickViewDrawer lote={selectedLote} onClose={() => setSelectedLote(null)} />
    </motion.div>
  );
}