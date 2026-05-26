import { Coffee, Mail, MapPin, Instagram, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-20 px-8">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">

                    {/* Logo & Vision */}
                    <div className="md:col-span-5 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#5f705f] rounded-xl flex items-center justify-center shadow-lg shadow-[#5f705f]/20">
                                <Coffee className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-sans tracking-tight text-[#5f705f]">Odisea <span className="font-light italic">Coffee</span></span>
                        </div>
                        <p className="text-lg text-gray-500 leading-relaxed max-w-sm">
                            Conectando el campo profundo de Colombia con el mundo a través de la confianza,
                            la trazabilidad y el impacto real en el origen.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#5f705f] hover:text-white hover:border-[#5f705f] transition-all">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#5f705f] hover:text-white hover:border-[#5f705f] transition-all">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-[#5f705f] hover:text-white hover:border-[#5f705f] transition-all">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-3 space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Plataforma</h4>
                        <ul className="space-y-4">
                            <li><a href="/" className="text-gray-600 hover:text-[#5f705f] transition-colors font-medium">Inicio</a></li>
                            <li><a href="/banco-cafes" className="text-gray-600 hover:text-[#5f705f] transition-colors font-medium">Portafolio de Cafés</a></li>
                            <li><a href="/sobre-nosotros" className="text-gray-600 hover:text-[#5f705f] transition-colors font-medium">Sobre Nosotros</a></li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div className="md:col-span-4 space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Contacto</h4>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 w-5 h-5 flex items-center justify-center text-[#5f705f]">
                                    <MapPin size={18} />
                                </div>
                                <p className="text-gray-600 font-medium">
                                    Odisea Trace Headquarters<br />
                                    <span className="text-gray-400 font-normal">Bogotá, Colombia</span>
                                </p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 w-5 h-5 flex items-center justify-center text-[#5f705f]">
                                    <Mail size={18} />
                                </div>
                                <p className="text-gray-600 font-medium">info@odiseacoffee.co</p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-gray-400">
                        &copy; 2026 Odisea Trace. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-gray-400">
                        <a href="#" className="hover:text-[#5f705f] transition-colors">Privacidad</a>
                        <a href="#" className="hover:text-[#5f705f] transition-colors">Términos</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
