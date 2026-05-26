"use client";

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { BreadcrumbNav } from '../components/BreadcrumbNav';
import { HeroLote } from '../components/HeroLote';
import { StepNavigator, stepIcons, type Step } from '../components/StepNavigator';
import { CapituloTrazabilidad } from '../components/CapituloTrazabilidad';
import { CapituloCata } from '../components/CapituloCata';
import { EslabonDrawer } from '../components/EslabonDrawer';
import { StickyActionBar } from '../components/StickyActionBar';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { EUDRCompliance } from '../components/EUDRCompliance';

// Datos del lote
const loteData = {
  titulo: 'Lote HUI-ESP-042',
  finca: 'Finca La Esperanza',
  departamento: 'Huila',
  altitud: '1.850 msnm',
  proceso: 'Honey',
  variedad: 'Caturra',
  cosecha: 'Oct 2025',
  reputacion: 4.6,
  cumplimientoUE: 'Verificado' as const,
  cadena: 'Completa' as const,
};

// Steps de navegación
const steps: Step[] = [
  { id: 'finca', nombre: 'Finca', estado: 'Verificado', icon: stepIcons.Finca },
  { id: 'cosecha', nombre: 'Cosecha', estado: 'Verificado', icon: stepIcons.Cosecha },
  { id: 'beneficio', nombre: 'Beneficio', estado: 'Verificado', icon: stepIcons.Beneficio },
  { id: 'secado', nombre: 'Secado', estado: 'Documentado', icon: stepIcons.Secado },
  { id: 'almacenamiento', nombre: 'Almacenamiento', estado: 'Verificado', icon: stepIcons.Almacenamiento },
  { id: 'exportacion', nombre: 'Exportación', estado: 'Documentado', icon: stepIcons.Exportación },
  { id: 'cata', nombre: 'Cata', estado: 'Verificado', icon: stepIcons.Cata },
];

// Capítulos con datos mock
const capitulos = [
  {
    id: 'finca',
    titulo: 'Finca',
    resumen: 'Productora María González, cultivo bajo sombra con prácticas agroforestales.',
    calificacion: 4.7,
    confiabilidad: 'Alta' as const,
    quepaso: [
      'Cultivo en lote Las Flores con variedades Caturra y Colombia',
      'Prácticas de agricultura regenerativa certificadas',
      'Verificación de coordenadas geográficas y límites de finca',
      'Trazabilidad desde semilla hasta cereza',
    ],
    evidencias: [
      { id: 'e1', tipo: 'Geo' as const, nombre: 'Coordenadas GPS verificadas', estado: 'Verificado' as const },
      { id: 'e2', tipo: 'Certificado' as const, nombre: 'Certificado Rainforest Alliance', estado: 'Verificado' as const },
      { id: 'e3', tipo: 'Foto' as const, nombre: 'Foto aérea del lote', estado: 'Verificado' as const },
      { id: 'e4', tipo: 'PDF' as const, nombre: 'Plan de manejo ambiental', estado: 'En revisión' as const },
    ],
    datosClaves: [
      { label: 'Responsable', valor: 'María González' },
      { label: 'Fecha de registro', valor: '12 Oct 2025' },
      { label: 'Método', valor: 'Cultivo bajo sombra' },
      { label: 'Altitud', valor: '1.850 msnm' },
    ],
    tags: ['Auditable', 'Trazado', 'Con evidencia'],
  },
  {
    id: 'cosecha',
    titulo: 'Cosecha',
    resumen: 'Recolección selectiva de cerezas maduras durante 4 semanas.',
    calificacion: 4.8,
    confiabilidad: 'Alta' as const,
    quepaso: [
      'Selección manual de cerezas en estado óptimo de maduración',
      'Recolección en 3 pases para garantizar uniformidad',
      'Registro de kilogramos por jornada y recolector',
      'Control de calidad post-cosecha (flotación y selección)',
    ],
    evidencias: [
      { id: 'e5', tipo: 'Registro' as const, nombre: 'Libro de campo con fechas', estado: 'Verificado' as const },
      { id: 'e6', tipo: 'Foto' as const, nombre: 'Cerezas maduras seleccionadas', estado: 'Verificado' as const },
      { id: 'e7', tipo: 'PDF' as const, nombre: 'Control de calidad', estado: 'Verificado' as const },
    ],
    datosClaves: [
      { label: 'Responsable', valor: 'Equipo recolección ASOHERCA' },
      { label: 'Fecha inicio', valor: '18 Oct 2025' },
      { label: 'Fecha fin', valor: '15 Nov 2025' },
      { label: 'Kg cosechados', valor: '1.240 kg cereza' },
    ],
    tags: ['Auditable', 'Trazado', 'Con evidencia'],
  },
  {
    id: 'beneficio',
    titulo: 'Beneficio / Proceso',
    resumen: 'Procesamiento Honey: despulpado parcial con fermentación controlada.',
    calificacion: 4.5,
    confiabilidad: 'Alta' as const,
    quepaso: [
      'Despulpado mecánico con conservación del 40% de mucílago',
      'Fermentación controlada en tanques de 48 horas',
      'Lavado suave para mantener dulzor característico',
      'Monitoreo de pH y temperatura cada 6 horas',
    ],
    evidencias: [
      { id: 'e8', tipo: 'Registro' as const, nombre: 'Bitácora de fermentación', estado: 'Verificado' as const },
      { id: 'e9', tipo: 'Foto' as const, nombre: 'Café en proceso Honey', estado: 'Verificado' as const },
      { id: 'e10', tipo: 'PDF' as const, nombre: 'Protocolo de procesamiento', estado: 'Verificado' as const },
    ],
    datosClaves: [
      { label: 'Responsable', valor: 'Carlos Martínez (Beneficio)' },
      { label: 'Fecha proceso', valor: '16-18 Nov 2025' },
      { label: 'Método', valor: 'Honey (40% mucílago)' },
    ],
    tags: ['Auditable', 'Trazado', 'Con evidencia'],
  },
];

// Capítulo especial de Cata
const capituloCata = {
  id: 'cata',
  titulo: 'Cata / Validación',
  resumen: 'Validación sensorial por catadores Q Grader certificados.',
  calificacion: 4.9,
  confiabilidad: 'Alta' as const,
  validadores: 3,
  radarSensorial: {
    acidez: 8.5,
    cuerpo: 7.5,
    dulzor: 9.0,
    balance: 8.8,
    limpieza: 9.2,
  },
  tags: ['Auditable', 'Trazado', 'Validado por expertos'],
};

export function TrazabilidadLote() {
  const [activeStep, setActiveStep] = useState('finca');
  const [selectedEslabon, setSelectedEslabon] = useState<any>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showActionBar, setShowActionBar] = useState(false);

  // Scroll tracking para progress bar y action bar
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;

      setScrollProgress(progress);
      setShowActionBar(progress > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll a capítulo
  const handleStepClick = (stepId: string) => {
    setActiveStep(stepId);
    const element = document.getElementById(stepId);
    if (element) {
      const offset = 140; // Altura de top bar + step navigator
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  const handleVerDetalle = (capituloId: string) => {
    const capitulo = [...capitulos, capituloCata].find(c => c.id === capituloId);
    if (capitulo) {
      setSelectedEslabon({
        id: capitulo.id,
        titulo: capitulo.titulo,
        descripcion: capitulo.resumen,
        responsable: 'María González',
        fecha: '12 Oct 2025',
        evidencias: [
          { nombre: 'Coordenadas GPS verificadas', tipo: 'GeoJSON', estado: 'Verificado' },
          { nombre: 'Certificado Rainforest', tipo: 'PDF', estado: 'Verificado' },
          { nombre: 'Foto aérea del lote', tipo: 'Imagen', estado: 'Verificado' },
        ],
        calificaciones: [
          { dimension: 'Calidad del proceso', estrellas: 5, comentario: 'Excelente control de calidad' },
          { dimension: 'Confiabilidad', estrellas: 5, comentario: 'Evidencias completas y verificadas' },
          { dimension: 'Trazabilidad', estrellas: 4, comentario: 'Muy buena documentación' },
        ],
        observaciones: [
          'Proceso completado según protocolo estándar',
          'Sin anomalías detectadas durante inspección',
        ],
      });
    }
  };

  const handlePublicarCata = () => {
    alert('Funcionalidad de publicar cata - Próxima interfaz');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#FDFDF8]"
    >
      <TopBar activeItem="Lotes" />
      <ProgressIndicator progress={scrollProgress} />

      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <BreadcrumbNav
          items={['Explorar', 'Colombia', 'Huila', 'Banco de cafés', 'Lote HUI-ESP-042']}
        />

        <HeroLote lote={loteData} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <h2 className="text-3xl font-sans text-[#5f705f] mb-4">Monitoreo y Cumplimiento EUDR</h2>
            <EUDRCompliance />

            <h2 className="text-3xl font-sans text-[#5f705f] mt-16 mb-8">Cronología del Lote</h2>
            <StepNavigator steps={steps} activeStep={activeStep} onStepClick={handleStepClick} />

            <div className="space-y-12 mt-12">
              {capitulos.map((capitulo) => (
                <CapituloTrazabilidad
                  key={capitulo.id}
                  capitulo={capitulo}
                  onVerDetalle={() => handleVerDetalle(capitulo.id)}
                />
              ))}

              <CapituloCata
                capitulo={capituloCata}
                onPublicarCata={handlePublicarCata}
                onVerDetalle={() => handleVerDetalle('cata')}
              />
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-[#5f705f]/5 rounded-3xl p-8 border border-[#5f705f]/10">
              <h4 className="text-lg font-sans text-[#5f705f] mb-4">Notas del Productor</h4>
              <p className="text-gray-600 italic leading-relaxed">
                "Este lote HUI-ESP-042 representa nuestro mejor esfuerzo este año. El proceso Honey
                potencia la dulzura natural del Caturra que cultivamos en la parte alta de la finca.
                Estamos orgullosos de ser parte de la red de trazabilidad de Odisea Trace."
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1602046747040-1df0f6527803?q=80&w=150" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-bold text-[#5f705f]">María González</div>
                  <div className="text-sm text-gray-500">Productora Senior</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <EslabonDrawer eslabon={selectedEslabon} onClose={() => setSelectedEslabon(null)} />
      <StickyActionBar visible={showActionBar} />
    </motion.div>
  );
}
