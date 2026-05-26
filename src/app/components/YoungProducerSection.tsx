import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function YoungProducerSection() {
  return (
    <section className="py-24 bg-[#FDFDF8]">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[#a35c5c] font-medium tracking-wider uppercase text-sm mb-4 block">
                Nuestra Filosofía
              </span>
              <h2 className="text-5xl font-sans text-[#5f705f] leading-[1.1] mb-8">
                Haciendo el cultivo de café <br />
                <span className="italic">emocionante de nuevo.</span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Odisea Trace no es solo una plataforma de trazabilidad. Es un compromiso con la nueva generación
                de caficultores. Estamos conectando a productores jóvenes con tostadores que valoran
                la innovación, la sostenibilidad y la transparencia total.
              </p>
              <div className="flex gap-4">
                <button className="px-8 py-3 bg-[#5f705f] text-white rounded-full font-medium hover:bg-[#234d24] transition-all">
                  Conoce el Programa
                </button>
                <button className="px-8 py-3 border border-[#5f705f] text-[#5f705f] rounded-full font-medium hover:bg-[#5f705f]/5 transition-all">
                  Ver Productores
                </button>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1602046747040-1df0f6527803?q=80&w=1080"
                alt="Young coffee producer"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-sm font-medium opacity-80 mb-1">Productor Destacado</p>
                <h3 className="text-2xl font-sans">Mateo Restrepo</h3>
                <p className="text-sm italic">Finca La Esmeralda, Antioquia</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          {[
            {
              title: "Impacto Generacional",
              desc: "Apoyamos a jóvenes de 18-35 años a liderar la transformación tecnológica del campo."
            },
            {
              title: "Trazabilidad Radical",
              desc: "Desde la semilla hasta la taza, cada paso es verificado bajo normativas internacionales EUDR."
            },
            {
              title: "Innovación en Proceso",
              desc: "Fomentamos métodos experimentales de fermentación para perfiles de taza únicos."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-8 border-l border-[#5f705f]/20"
            >
              <h4 className="text-xl font-sans text-[#5f705f] mb-4">{item.title}</h4>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
