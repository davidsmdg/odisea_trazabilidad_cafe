import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { ChevronRight, Users, TreePine, Map, Coffee, Flame } from 'lucide-react';

const roles = [
  {
    id: 'agricultores',
    title: 'Agricultores de Excelencia',
    description: 'Empodera tu cosecha con tecnología de trazabilidad. Accede a precios justos, certificaciones EUDR automáticas y conecta directamente con el mercado global.',
    cta: 'Postular mi Finca',
    icon: TreePine,
    image: 'https://images.unsplash.com/photo-1611330556082-0ba06d2780d0?q=80&w=800',
    color: '#2C5F2D'
  },
  {
    id: 'lideres',
    title: 'Líderes Comunitarios',
    description: 'Transforma tu región coordinando grupos de productores. Gestiona el impacto social y asegura la transparencia en cada eslabón de la cadena.',
    cta: 'Crear Grupo Regional',
    icon: Users,
    image: 'https://images.unsplash.com/photo-1700502180276-efbb172d99bb?q=80&w=800',
    color: '#973333'
  },
  {
    id: 'verificadores',
    title: 'Verificadores Ambientales',
    description: 'Garantiza el cumplimiento de normativas forestales. Utiliza nuestras herramientas satelitales para validar la sostenibilidad de cada lote.',
    cta: 'Unirme como Verificador',
    icon: Map,
    image: 'https://images.unsplash.com/photo-1621906066960-606b45e546e5?q=80&w=800',
    color: '#2C5F2D'
  },
  {
    id: 'catadores',
    title: 'Catadores Q-Grader',
    description: 'Define la identidad sensorial de los cafés más exclusivos. Registra perfiles de taza detallados y ayuda a valorizar el trabajo del caficultor.',
    cta: 'Registrarme como Catador',
    icon: Coffee,
    image: 'https://images.unsplash.com/photo-1762195880370-9d68ec30bfe9?q=80&w=800',
    color: '#973333'
  },
  {
    id: 'tostadores',
    title: 'Tostadores & Importadores',
    description: 'Descubre lotes con historia verificada. Compra con la seguridad de una trazabilidad completa y una narrativa inmersiva para tus clientes.',
    cta: 'Solicitar Acceso Comercial',
    icon: Flame,
    image: 'https://images.unsplash.com/photo-1618022424528-f8a918320658?q=80&w=800',
    color: '#2C5F2D'
  }
];

export function UserRolesSection() {
  return (
    <section className="py-24 bg-[#F5F5DC]">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="text-center mb-20">
          <span className="text-[#973333] font-medium tracking-[0.2em] uppercase text-xs mb-4 block">
            Ecosistema TraceCafé
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#2C5F2D] mb-6">
            Una plataforma para cada <span className="italic">protagonista.</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            TraceCafé no es solo una herramienta, es un punto de encuentro para quienes elevan el valor del café colombiano en el mundo.
          </p>
        </div>

        <div className="space-y-16">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.21, 1.02, 0.47, 0.98] }}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
            >
              {/* Image side */}
              <div className="w-full lg:w-1/2 group">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl">
                  <ImageWithFallback
                    src={role.image}
                    alt={role.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute bottom-6 left-6 flex items-center gap-3">
                    <div className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                      <role.icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Text side */}
              <div className="w-full lg:w-1/2 space-y-8">
                <div>
                  <h3 className="text-3xl font-serif text-[#2C5F2D] mb-4">
                    {role.title}
                  </h3>
                  <div className="w-16 h-0.5 bg-[#973333]/30 mb-6" />
                  <p className="text-gray-700 text-xl leading-relaxed font-light">
                    {role.description}
                  </p>
                </div>

                <Button 
                  className="rounded-full px-8 py-6 h-auto text-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
                  style={{ backgroundColor: role.color, color: '#fff' }}
                >
                  {role.cta}
                  <ChevronRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating Call to Action */}
        <div className="mt-32 p-12 rounded-[2rem] bg-[#2C5F2D] text-white text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          
          <h4 className="text-3xl font-serif mb-6 relative z-10">
            ¿No estás seguro de dónde encajas?
          </h4>
          <p className="text-white/80 max-w-xl mx-auto mb-10 text-lg relative z-10">
            Nuestro equipo puede asesorarte para encontrar la mejor forma de integrar tu negocio o comunidad a la red de trazabilidad.
          </p>
          <Button variant="outline" className="rounded-full px-10 py-6 h-auto text-lg font-bold border-white text-white hover:bg-white hover:text-[#2C5F2D] transition-colors relative z-10">
            Contactar Asesoría
          </Button>
        </div>
      </div>
    </section>
  );
}
