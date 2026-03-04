import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { X, Shield, TrendingUp, Star, ChevronRight, MapPin } from 'lucide-react';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DepartmentDrawerProps {
  departmentId: string | null;
  onClose: () => void;
}

const topFincas = [
  { nombre: 'Finca El Porvenir', cooperativa: 'ASOHERCA', reputacion: 'Alta' },
  { nombre: 'Finca La Esperanza', cooperativa: 'ASOPEP', reputacion: 'Alta' },
  { nombre: 'Finca Villa Rosa', cooperativa: 'Independiente', reputacion: 'Media' },
];

const cafesDestacados = [
  {
    id: 'HUI-001',
    lote: 'Lote HUI-ESP-042',
    finca: 'Finca El Porvenir',
    proceso: 'Lavado',
    puntaje: 87.5,
    reputacion: 'Alta',
  },
  {
    id: 'HUI-002',
    lote: 'Lote HUI-POR-018',
    finca: 'Finca La Esperanza',
    proceso: 'Honey',
    puntaje: 86.0,
    reputacion: 'Alta',
  },
];

const reputacionColors = {
  Alta: 'bg-[#2C5F2D] text-white',
  Media: 'bg-[#F5F5DC] text-[#2C5F2D] border border-[#2C5F2D]/20',
  Nueva: 'bg-gray-100 text-gray-600',
};

export function DepartmentDrawer({ departmentId, onClose }: DepartmentDrawerProps) {
  const navigate = useNavigate();
  
  if (!departmentId) return null;

  const departmentData: Record<string, any> = {
    huila: { name: 'Huila', cafes: 24, ueVerificados: 18, reputacion: 'Alta', img: 'https://images.unsplash.com/photo-1635991062422-b3e2f8c36dce?q=80&w=600' },
    narino: { name: 'Nariño', cafes: 18, ueVerificados: 14, reputacion: 'Alta', img: 'https://images.unsplash.com/photo-1602046747040-1df0f6527803?q=80&w=600' },
    antioquia: { name: 'Antioquia', cafes: 12, ueVerificados: 8, reputacion: 'Media', img: 'https://images.unsplash.com/photo-1677505306286-0cb8de36fadb?q=80&w=600' },
    cauca: { name: 'Cauca', cafes: 9, ueVerificados: 7, reputacion: 'Alta', img: 'https://images.unsplash.com/photo-1762195657410-112fbc6f2d17?q=80&w=600' },
    tolima: { name: 'Tolima', cafes: 7, ueVerificados: 5, reputacion: 'Media', img: 'https://images.unsplash.com/photo-1635991062422-b3e2f8c36dce?q=80&w=600' },
  };

  const department = departmentData[departmentId];
  if (!department) return null;

  const handleVerBanco = () => {
    navigate('/banco-cafes');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="department-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <motion.div
        key="department-drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full max-w-[520px] bg-[#F5F5DC] shadow-2xl z-50 overflow-y-auto"
      >
        {/* Hero del Drawer */}
        <div className="relative h-[240px] overflow-hidden">
          <ImageWithFallback
            src={department.img}
            alt={department.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F5F5DC] via-transparent to-black/20" />
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md hover:bg-white/40 rounded-full text-white transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-6 left-8">
            <div className="flex items-center gap-2 text-[#2C5F2D] font-bold text-xs uppercase tracking-widest mb-2">
              <MapPin className="h-3 w-3" />
              <span>Colombia</span>
            </div>
            <h2 className="text-5xl font-serif text-[#2C5F2D]">
              {department.name}
            </h2>
          </div>
        </div>

        <div className="p-10 space-y-10">
          {/* Estadísticas Rápidas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 border border-[#2C5F2D]/5 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Cafés Disponibles</p>
              <p className="text-4xl font-serif text-[#2C5F2D] leading-none">{department.cafes}</p>
            </div>
            <div className="bg-[#2C5F2D] rounded-2xl p-6 text-white shadow-lg">
              <p className="text-[10px] uppercase font-bold text-white/60 mb-1">Verificados EUDR</p>
              <p className="text-4xl font-serif leading-none">{department.ueVerificados}</p>
            </div>
          </div>

          {/* Fincas Principales */}
          <div>
            <h3 className="text-xl font-serif text-[#2C5F2D] mb-6 flex items-center justify-between">
              Fincas del Origen
              <span className="text-xs font-sans font-normal text-gray-400 uppercase tracking-widest">Top 3</span>
            </h3>
            <div className="space-y-4">
              {topFincas.map((finca, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-5 bg-white rounded-2xl border border-[#2C5F2D]/5 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F5F5DC] flex items-center justify-center text-[#2C5F2D] font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-[#2C5F2D] group-hover:underline cursor-pointer">{finca.nombre}</p>
                      <p className="text-xs text-gray-400 uppercase font-medium">{finca.cooperativa}</p>
                    </div>
                  </div>
                  <Badge className={reputacionColors[finca.reputacion as keyof typeof reputacionColors] + " px-3 py-1 text-[10px]"}>
                    {finca.reputacion}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Lotes Destacados */}
          <div>
            <h3 className="text-xl font-serif text-[#2C5F2D] mb-6">Lotes Destacados</h3>
            <div className="space-y-4">
              {cafesDestacados.map((cafe) => (
                <div key={cafe.id} className="bg-white rounded-2xl p-6 border border-[#2C5F2D]/5 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-lg font-serif text-[#2C5F2D] group-hover:text-[#973333] transition-colors">{cafe.lote}</h4>
                      <p className="text-sm text-gray-500">{cafe.finca}</p>
                    </div>
                    <Badge variant="outline" className="border-[#2C5F2D]/20 text-[#2C5F2D] font-bold">
                      {cafe.proceso}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-[#F5F5DC]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-serif text-[#973333]">{cafe.puntaje}</span>
                      <span className="text-xs uppercase font-bold text-gray-400 tracking-tighter">pts sca</span>
                    </div>
                    <button className="flex items-center gap-2 text-[#2C5F2D] font-bold text-sm group-hover:translate-x-1 transition-transform">
                      Ver Trazabilidad <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Acción Principal */}
          <div className="pt-6">
            <button 
              onClick={handleVerBanco}
              className="w-full bg-[#973333] text-white py-5 rounded-full font-bold text-lg shadow-xl hover:bg-[#7a2929] transition-all transform hover:-translate-y-1 cursor-pointer flex items-center justify-center gap-3"
            >
              Explorar Banco de Cafés
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
