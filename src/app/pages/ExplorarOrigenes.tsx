import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ColombiaMap } from '../components/ColombiaMap';
import { DepartmentDrawer } from '../components/DepartmentDrawer';
import { TopBar } from '../components/TopBar';
import { HeroHeader } from '../components/HeroHeader';
import { YoungProducerSection } from '../components/YoungProducerSection';
import { UserRolesSection } from '../components/UserRolesSection';
import { Footer } from '../components/Footer';
import type { DepartmentData } from '../components/ColombiaMap';

export function ExplorarOrigenes() {
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  const handleDepartmentClick = (dept: DepartmentData) => {
    setSelectedDepartment(dept.id);
  };

  return (
    <div className="min-h-screen bg-[#FDFDF8]">
      <TopBar />
      <HeroHeader />

      <main className="py-24">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-4">
              <span className="text-[#a35c5c] font-medium tracking-widest uppercase text-sm mb-6 block">
                Impacto en el Origen
              </span>
              <h2 className="text-5xl font-sans text-[#5f705f] leading-[1.1] mb-8">
                El Corazón de <br />
                <span className="italic">nuestra producción.</span>
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-10">
                Selecciona una región para conocer a los productores que, desde zonas de difícil acceso,
                ofrecen cafés excepcionales a través de relaciones comerciales directas y seguras.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-l-2 border-[#5f705f] pl-6 py-2">
                  <div className="text-3xl font-sans text-[#5f705f]">32</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">
                    Departamentos <br /> Cafeteros
                  </div>
                </div>
                <div className="flex items-center gap-4 border-l-2 border-[#a35c5c] pl-6 py-2">
                  <div className="text-3xl font-sans text-[#a35c5c]">84%</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider">
                    Conformidad <br /> EUDR Promedio
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-white/40 backdrop-blur-sm rounded-3xl p-4 sm:p-12 shadow-2xl border border-white/60">
              <ColombiaMap
                onDepartmentClick={handleDepartmentClick}
                selectedDepartment={selectedDepartment}
              />
            </div>
          </div>

          <div className="mt-24 text-center">
            <button
              onClick={() => navigate('/banco-cafes')}
              className="px-12 py-5 bg-[#5f705f] text-white rounded-full hover:bg-[#234d24] transition-all text-lg font-bold shadow-lg transform hover:-translate-y-1 cursor-pointer"
            >
              Ver Portafolio de Cafés
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

      <Footer />
    </div>
  );
}
