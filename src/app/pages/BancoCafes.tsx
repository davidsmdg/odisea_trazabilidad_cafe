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
import { LOTES_MARKET_DEFAULT } from '../data/lotes.mock';
import { getLotesMarket } from '../../services/lotesService';

// Generar estructura agrupada dinámica
const buildGruposDepartamentos = (
  lotesList: any[],
  filtros: any,
  agruparPor: 'Departamento' | 'Municipio',
  ordenarPor: string
) => {
  const deptosMap: Record<string, any> = {};

  const lotesFiltrados = lotesList.filter(lote => {
    if (!filtros) return true;
    
    // Departamento & Municipio
    if (filtros.departamento !== 'all' && lote.departamento !== filtros.departamento) return false;
    if (filtros.municipio !== 'all' && lote.municipio !== filtros.municipio) return false;

    // EUDR (Solo UE verificado)
    if (filtros.ueVerificado) {
      if (lote.verificadoEUDR === false) return false;
      const lastDigitChar = lote.id.charAt(lote.id.length - 1);
      const isEven = !isNaN(Number(lastDigitChar)) && Number(lastDigitChar) % 2 === 0;
      if (isEven) return false;
    }

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

    // Impactos
    const reqImpactos = filtros.impactos || {};
    if (reqImpactos.jovenes && lote.impacto !== 'Jóven') return false;
    if (reqImpactos.mujeres && lote.impacto !== 'Mujeres') return false;
    if (reqImpactos.indigenas && lote.impacto !== 'Comunidad') return false;

    return true;
  });

  lotesFiltrados.forEach(lote => {
    const outerGroupKey = agruparPor === 'Municipio' ? lote.municipio : lote.departamento;
    const innerGroupKey = agruparPor === 'Municipio' ? lote.departamento : lote.municipio;

    if (!deptosMap[outerGroupKey]) {
      deptosMap[outerGroupKey] = {
        id: `group-${outerGroupKey.toLowerCase().replace(/ /g, '-')}`,
        nombre: outerGroupKey,
        municipios: {}
      };
    }

    if (!deptosMap[outerGroupKey].municipios[innerGroupKey]) {
      deptosMap[outerGroupKey].municipios[innerGroupKey] = {
        nombre: innerGroupKey,
        fincasCount: 0,
        altitud: '1.700 - 1.900 msnm',
        impacto: lote.impacto === 'Jóven' ? 'Alto' : 'Estratégico',
        lotes: []
      };
    }

    const extractSacos = parseInt(lote.empaque?.split(' ')[0] || '10') || 10;

    deptosMap[outerGroupKey].municipios[innerGroupKey].lotes.push({
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
  });

  const result = Object.values(deptosMap).map((d: any) => {
    const municipiosArray = Object.values(d.municipios).map((m: any) => {
      if (ordenarPor === 'puntaje') {
        m.lotes.sort((a: any, b: any) => b.puntaje - a.puntaje);
      } else if (ordenarPor === 'disponibilidad') {
        m.lotes.sort((a: any, b: any) => b.disponibilidad - a.disponibilidad);
      }
      return {
        ...m,
        fincasCount: m.lotes.length
      };
    });

    return {
      ...d,
      municipios: municipiosArray
    };
  });

  return result;
};

export function BancoCafes() {
  const [lotes, setLotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<any>(null);
  const [agruparPor, setAgruparPor] = useState<'Departamento' | 'Municipio'>('Departamento');
  const [ordenarPor, setOrdenarPor] = useState<string>('relevancia');

  const gruposDepartamentos = useMemo(
    () => buildGruposDepartamentos(lotes, filtros, agruparPor, ordenarPor),
    [lotes, filtros, agruparPor, ordenarPor]
  );
  const [expandAll, setExpandAll] = useState(false);
  const [selectedLote, setSelectedLote] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    getLotesMarket()
      .then((data) => {
        setLotes(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError('Error al cargar cafés del portafolio');
        setIsLoading(false);
      });
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
          onAgruparChange={setAgruparPor}
          onOrdenarChange={setOrdenarPor}
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
          {isLoading ? (
            <div className="space-y-6 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-100 p-8 h-48 flex flex-col justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-12 text-center bg-red-50 rounded-3xl border border-red-100 space-y-4">
              <h3 className="text-xl font-sans font-black text-red-900">Algo salió mal</h3>
              <p className="text-red-700/80 font-medium">{error}</p>
            </div>
          ) : (
            <>
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
            </>
          )}
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