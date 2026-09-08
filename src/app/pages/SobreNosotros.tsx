import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { TopBar } from '../components/TopBar';
import { Footer } from '../components/Footer';
import { Coffee, ShieldCheck, Leaf, Users, Globe, BarChart3 } from 'lucide-react';

// Import local images
import heroImg from '../../assets/images/hero_about.png';
import techImg from '../../assets/images/tech_impact.png';
import eudrImg from '../../assets/images/eudr_compliance.png';

export function SobreNosotros() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-[#FDFDF8]">
            <TopBar activeItem="Sobre Nosotros" />

            {/* Hero Section */}
            <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={heroImg}
                        alt="Cafetal Colombiano"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 backdrop-short" />
                </div>

                <div className="relative text-center px-8 max-w-4xl py-32">
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-full border border-white/20 mb-6 mx-auto w-fit">
                        <div className="w-2.5 h-2.5 bg-[#8a9a8a] rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-white">Conexión Directa y Transparente</span>
                    </div>
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#FDFDF8] font-medium tracking-widest uppercase text-sm mb-10 block drop-shadow-lg"
                    >
                        Conectando el campo profundo con el mundo
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-sans text-white mb-10 drop-shadow-lg"
                    >
                        Odisea Trace: El Futuro de la <br />
                        <span className="italic">Trazabilidad Cafetera</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-white/90 leading-relaxed mb-10 drop-shadow-lg max-w-2xl font-light mx-auto"
                    >
                        Facilitamos el acceso directo a mercados globales para caficultores de zonas remotas,
                        garantizando trazabilidad absoluta y relaciones comerciales basadas en la confianza.
                    </motion.p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 px-8">
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/40 backdrop-blur-md p-12 rounded-[2rem] border border-white/60 shadow-xl"
                    >
                        <div className="w-14 h-14 bg-[#5f705f] rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                            <Globe className="text-white w-8 h-8" />
                        </div>
                        <h3 className="text-3xl font-sans text-[#5f705f] mb-6">Nuestra Misión</h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Acortar la distancia entre el campo profundo y el mercado internacional,
                            eliminando intermediarios innecesarios para que el valor real del café llegue
                            directamente a quienes lo cultivan con esfuerzo en zonas de difícil acceso.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/40 backdrop-blur-md p-12 rounded-[2rem] border border-white/60 shadow-xl"
                    >
                        <div className="w-14 h-14 bg-[#a35c5c] rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                            <ShieldCheck className="text-white w-8 h-8" />
                        </div>
                        <h3 className="text-3xl font-sans text-[#5f705f] mb-6">Nuestra Visión</h3>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Ser el puente de confianza definitivo para el café de especialidad, donde
                            cada relación comercial sea justa, directa y respaldada por la historia
                            viva y la trazabilidad técnica de cada grano.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* EUDR Section */}
            <section className="py-24 bg-[#E8E8D5]/50">
                <div className="max-w-[1200px] mx-auto px-8 flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <img
                            src={eudrImg}
                            alt="EUDR Compliance"
                            className="w-full h-auto rounded-[3rem] shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                        />
                    </div>
                    <div className="lg:w-1/2">
                        <span className="text-[#a35c5c] uppercase tracking-widest text-sm font-bold mb-4 block">Sostenibilidad Real</span>
                        <h2 className="text-5xl font-sans text-[#5f705f] mb-8 leading-tight">
                            Compromiso con el <br />
                            <span className="italic">Medio Ambiente</span>
                        </h2>
                        <p className="text-xl text-gray-700 leading-relaxed mb-8">
                            En Odisea Trace, no solo entregamos café; entregamos confianza ambiental. Nuestra plataforma
                            integra análisis geoespacial para asegurar que cada grano proviene de áreas libres
                            de deforestación, cumpliendo rigurosamente con el Reglamento de la Unión Europea
                            sobre Deforestación (EUDR).
                        </p>
                        <ul className="space-y-4">
                            {[
                                'Geolocalización precisa de predios',
                                'Verificación satelital en tiempo real',
                                'Certificaciones digitales audidables'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-gray-700 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-[#5f705f]/10 flex items-center justify-center">
                                        <Leaf className="w-3.5 h-3.5 text-[#5f705f]" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Impact & Tech Section */}
            <section className="py-32">
                <div className="max-w-[1200px] mx-auto px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl font-sans text-[#5f705f] mb-6">Tecnología al Servicio del Campo</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Combinamos la sabiduría de las zonas apartadas con innovación digital para crear un
                            espacio de confianza que facilite relaciones comerciales de largo plazo.
                        </p>
                    </div>

                    <div className="relative rounded-[4rem] overflow-hidden shadow-2xl h-[600px]">
                        <img
                            src={techImg}
                            alt="Technology in the farm"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#234d24]/90 via-transparent to-transparent flex items-end">
                            <div className="p-16 grid grid-cols-1 md:grid-cols-3 gap-12 w-full text-white">
                                <div className="space-y-4">
                                    <div className="text-4xl font-sans">+500</div>
                                    <div className="text-white/70 uppercase tracking-widest text-xs font-bold">Productores Activos</div>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-4xl font-sans">100%</div>
                                    <div className="text-white/70 uppercase tracking-widest text-xs font-bold">Trazabilidad de Lote</div>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-4xl font-sans">24/7</div>
                                    <div className="text-white/70 uppercase tracking-widest text-xs font-bold">Monitoreo en Tiempo Real</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-24 px-8 text-center bg-[#5f705f] text-white">
                <div className="max-w-3xl mx-auto">
                    <Coffee className="w-16 h-16 mx-auto mb-8 text-[#FDFDF8]/40" />
                    <h2 className="text-4xl md:text-5xl font-sans mb-8 italic">¿Listo para conocer el origen real?</h2>
                    <p className="text-xl text-white/80 mb-12 leading-relaxed">
                        Compra directamente a los productores, conoce su trazabilidad y forma parte de
                        un mercado que valora el esfuerzo del campo profundo colombiano.
                    </p>
                    <button
                        onClick={() => navigate('/banco-cafes')}
                        className="px-10 py-4 bg-[#FDFDF8] text-[#5f705f] rounded-full font-bold text-lg hover:bg-white transition-all shadow-xl cursor-pointer"
                    >
                        Ver Portafolio
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
}
