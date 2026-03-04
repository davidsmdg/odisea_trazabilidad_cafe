import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ColombiaMap } from '../components/ColombiaMap';
import { DepartmentDrawer } from '../components/DepartmentDrawer';
import { TopBar } from '../components/TopBar';
import { HeroHeader } from '../components/HeroHeader';
import { YoungProducerSection } from '../components/YoungProducerSection';
import { UserRolesSection } from '../components/UserRolesSection';
import type { DepartmentData } from '../components/ColombiaMap';

export function ExplorarOrigenes() {
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  const handleDepartmentClick = (dept: DepartmentData) => {
    setSelectedDepartment(dept.id);
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      <TopBar />
      <HeroHeader />
      
      <main className="py-24">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-4">
              <span className="text-[#973333] font-medium tracking-widest uppercase text-sm mb-6 block">
                Origen Geográfico
              </span>
              <h2 className="text-5xl font-serif text-[#2C5F2D] leading-[1.1] mb-8">
                El Corazón de <br />
                <span className="italic">nuestra producción.</span>
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-10">
                Selecciona un departamento en el mapa interactivo para descubrir los cafés trazables,
                verificados bajo cumplimiento EUDR y conoce las historias detrás de cada origen.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-l-2 border-[#2C5F2D] pl-6 py-2">
                  <div className="text-3xl font-serif text-[#2C5F2D]">32</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">
                    Departamentos <br /> Cafeteros
                  </div>
                </div>
                <div className="flex items-center gap-4 border-l-2 border-[#973333] pl-6 py-2">
                  <div className="text-3xl font-serif text-[#973333]">84%</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">
                    Conformidad <br /> EUDR Promedio
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-white/40 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/60">
              <ColombiaMap 
                onDepartmentClick={handleDepartmentClick}
                selectedDepartment={selectedDepartment}
              />
            </div>
          </div>
          
          <div className="mt-24 text-center">
            <button
              onClick={() => navigate('/banco-cafes')}
              className="px-12 py-5 bg-[#2C5F2D] text-white rounded-full hover:bg-[#234d24] transition-all text-lg font-bold shadow-lg transform hover:-translate-y-1 cursor-pointer"
            >
              Ver Banco de Cafés Completo
            </button>
          </div>
        </div>
      </main>

      <UserRolesSection />
      
      <YoungProducerSection />

      <DepartmentDrawer
        departmentId={selectedDepartment}
        onClose={() => setSelectedDepartment(null)}
      />
    </div>
  );
}
