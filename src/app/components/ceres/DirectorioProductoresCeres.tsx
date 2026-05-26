import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import {
    Contact,
    Search,
    Filter,
    ArrowRight,
    MapPin,
    Phone,
    IdCard,
} from 'lucide-react';
import { cn } from '../ui/utils';

const PRODUCTORES_MOCK = [
    {
        id: '1',
        nombre: 'María González',
        cedula: '1.092.344.XXX',
        municipio: 'San Agustín',
        celular: '+57 312 455 XXXX',
    },
    {
        id: '2',
        nombre: 'Carlos Martínez',
        cedula: '12.445.XXX',
        municipio: 'Acevedo',
        celular: '+57 310 988 XXXX',
    },
    {
        id: '3',
        nombre: 'Jorge Torres',
        cedula: '76.229.XXX',
        municipio: 'Garzón',
        celular: '+57 311 234 XXXX',
    },
    {
        id: '4',
        nombre: 'Elena Ruiz',
        cedula: '36.884.XXX',
        municipio: 'Pitalito',
        celular: '+57 314 556 XXXX',
    },
];

export function DirectorioProductoresCeres() {
    const navigate = useNavigate();

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header / Filter Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-sans font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <Contact className="text-blue-600" size={40} /> Directorio de Productores
                    </h1>
                    <p className="text-slate-400 font-medium max-w-2xl text-sm uppercase tracking-[0.2em]">
                        Contactabilidad y Gestión de Alianzas con Caficultores
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white p-4 rounded-[40px] border border-slate-100 shadow-xl">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por Nombre o Cédula..."
                            className="h-12 w-80 rounded-2xl border-slate-50 pl-12 pr-4 bg-slate-50 focus:bg-white transition-all font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600"
                        />
                    </div>
                </div>
            </div>

            {/* Table Area (Solo Lectura C) */}
            <div className="bg-white rounded-[48px] border border-slate-100 shadow-2xl overflow-hidden p-2">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-none">Nombre Productor</TableHead>
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-none">Documento / Cédula</TableHead>
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-none">Municipio / Región</TableHead>
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-none">Contacto Celular</TableHead>
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-none text-right">Perfil</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {PRODUCTORES_MOCK.map((item) => (
                            <TableRow
                                key={item.id}
                                className="group hover:bg-slate-50 transition-colors border-slate-50"
                            >
                                <TableCell className="px-10 py-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-sans font-black text-xs shadow-sm uppercase">
                                            {item.nombre.substring(0, 1)}
                                        </div>
                                        <span className="text-sm font-black text-slate-900 leading-none tracking-tight">{item.nombre}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-10 py-8">
                                    <div className="flex items-center gap-3 text-slate-500 font-mono text-xs">
                                        <IdCard size={14} className="text-slate-300" /> {item.cedula}
                                    </div>
                                </TableCell>
                                <TableCell className="px-10 py-8">
                                    <div className="flex items-center gap-3 text-slate-700 text-xs font-bold uppercase tracking-widest">
                                        <MapPin size={14} className="text-blue-500/40" /> {item.municipio}
                                    </div>
                                </TableCell>
                                <TableCell className="px-10 py-8">
                                    <div className="flex items-center gap-3 text-slate-700 text-xs font-black">
                                        <Phone size={14} className="text-blue-500" /> {item.celular}
                                    </div>
                                </TableCell>
                                <TableCell className="px-10 py-8 text-right">
                                    <Button
                                        variant="ghost"
                                        className="h-10 w-10 p-0 rounded-full hover:bg-slate-900 hover:text-white transition-all"
                                    >
                                        <ArrowRight size={16} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="p-8 rounded-[32px] bg-slate-100 border border-slate-200 text-center flex items-center justify-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-tight text-slate-400 italic">
                    Restricción de Privacidad: Como administrador Ceres, usted tiene acceso de Solo Lectura (C) a la información personal del caficultor para fines de contacto institucional.
                </span>
            </div>
        </div>
    );
}
