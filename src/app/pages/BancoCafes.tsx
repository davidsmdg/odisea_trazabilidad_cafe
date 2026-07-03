import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { BreadcrumbNav } from '../components/BreadcrumbNav';
import { BancoHeader } from '../components/BancoHeader';
import { ControlBar } from '../components/ControlBar';
import { GrupoFinca } from '../components/GrupoFinca';
import { QuickViewDrawer } from '../components/QuickViewDrawer';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { LOTES_MARKET_DEFAULT } from '../components/tostador/ExplorarCafes';

// Generar estructura agrupada dinámica
const buildGruposDepartamentos = (filtros?: any) => {
  const deptosMap: Record<string, any> = {};

  const lotesFiltrados = LOTES_MARKET_DEFAULT.filter(lote => {
    if (!filtros) return true;
    
    // Departamento & Municipio
    if (filtros.departamento !== 'all' && lote.departamento !== filtros.departamento) return false;
    if (filtros.municipio !== 'all' && lote.municipio !== filtros.municipio) return false;

    // Procesos
    if (filtros.procesosSeleccionados?.length > 0) {
      if (!filtros.procesosSeleccionados.includes(lote.proceso)) return false;
    }

    // Macroperfil / Notas
    if (filtros.notasSeleccionadas?.length > 0) {
      const profiles = Array.isArray(lote.macroperfil) ? lote.macroperfil : (typeof lote.macroperfil === 'string' ? lote.macroperfil.split(',').map((s: string) => s.trim()) : []);
      const hasMatch = profiles.some(p => filtros.notasSeleccionadas.includes(p));
      if (!hasMatch) return false;
    }

    // Impactos (simplificado: si exige jóvenes, que tenga impacto Jóven, si exige mujeres, impacto Mujeres)
    const reqImpactos = filtros.impactos || {};
    if (reqImpactos.jovenes && lote.impacto !== 'Jóven') return false;
    if (reqImpactos.mujeres && lote.impacto !== 'Mujeres') return false;

    return true;
  });

  lotesFiltrados.forEach(lote => {
    const depto = lote.departamento;
    const mun = lote.municipio;

    if (!deptosMap[depto]) {
      deptosMap[depto] = {
        id: `depto-${depto.toLowerCase().replace(/ /g, '-')}`,
        nombre: depto,
        municipios: {}
      };
    }

    if (!deptosMap[depto].municipios[mun]) {
      deptosMap[depto].municipios[mun] = {
        nombre: mun,
        fincasCount: 0,
        altitud: '1.700 - 1.900 msnm',
        impacto: lote.impacto === 'Jóven' ? 'Alto' : 'Estratégico',
        lotes: []
      };
    }

    // Convert availability string to number loosely for availability indicator
    const extractSacos = parseInt(lote.empaque.split(' ')[0]) || 10;

    deptosMap[depto].municipios[mun].lotes.push({
      id: lote.id,
      titulo: `${lote.variedad} - ${lote.productor}`,
      productor: lote.productor,
      finca: lote.finca,
      variedad: lote.variedad,
      proceso: lote.proceso,
      puntaje: parseFloat(lote.puntaje),
      macroperfil: lote.macroperfil,
      descripcionPerfil: lote.perfilTaza,
      ueEstado: 'Verificado',
      disponibilidad: extractSacos,
      cadena: 'Completa',
      imagen: lote.avatar,
    });
    
    // Simplistic count based on lots (assuming each lot might represent a farm state)
    deptosMap[depto].municipios[mun].fincasCount = deptosMap[depto].municipios[mun].lotes.length;
  });

  return Object.values(deptosMap).map((d: any) => ({
    ...d,
    municipios: Object.values(d.municipios)
  }));
};

export function BancoCafes() {
  const [filtros, setFiltros] = useState<any>(null);
  const gruposDepartamentos = useMemo(() => buildGruposDepartamentos(filtros), [filtros]);
  const [expandAll, setExpandAll] = useState(false);
  const [selectedLote, setSelectedLote] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleExpandToggle = () => {
    setExpandAll(!expandAll);
  };

  const handleLoteClick = (lote: any) => {
    setSelectedLote({
      ...lote,
      departamento: 'Huila', // Default for demonstration
      cosecha: '2024-01',
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
      className="min-h-screen bg-[#FDFDF8]"
      style={{ fontFamily: 'var(--font-ui)' }}
    >
      <TopBar activeItem="Portafolio" />

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <BreadcrumbNav items={['Explorar orígenes', 'Colombia', 'Huila']} />

        <BancoHeader departamento="Huila" disponibles={24} ueVerificadoActive={false} />

        <ControlBar
          onAgruparChange={(tipo) => console.log('Agrupar por:', tipo)}
          onOrdenarChange={(orden) => console.log('Ordenar:', orden)}
          onFiltroChange={setFiltros}
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

        {/* Grupos por Departamentos y Municipios */}
        <div className="space-y-12">
          {gruposDepartamentos.map((depto) => (
            <div key={depto.id} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-0.5 grow bg-gradient-to-r from-transparent to-[#5f705f]/20" />
                <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-[#5f705f]/40 px-6">
                  {depto.nombre}
                </h2>
                <div className="h-0.5 grow bg-gradient-to-l from-transparent to-[#5f705f]/20" />
              </div>

              <div className="grid grid-cols-1 gap-6">
                {depto.municipios.map((mun, mIdx) => (
                  <GrupoFinca
                    key={`${depto.id}-${mun.nombre}`}
                    grupo={{
                      id: `${depto.id}-${mun.nombre}`,
                      nombre: mun.nombre,
                      municipio: depto.nombre, // Inversion here for component display
                      altitud: mun.altitud,
                      impacto: mun.impacto,
                      ueEstado: 'Verificado', // Default for demonstration
                      cafesCount: mun.lotes.length,
                      lotes: mun.lotes as any
                    }}
                    defaultExpanded={expandAll || mIdx === 0}
                    onLoteClick={handleLoteClick}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Estado vacío si no hay resultados */}
        {gruposDepartamentos.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-2">
                No encontramos cafés con estos filtros
              </h3>
              <p className="text-muted-foreground">
                Prueba quitar los filtros activos o ajusta tu búsqueda.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Quick View Drawer */}
      <QuickViewDrawer lote={selectedLote} onClose={() => setSelectedLote(null)} />

      <Footer />
    </motion.div>
  );
}