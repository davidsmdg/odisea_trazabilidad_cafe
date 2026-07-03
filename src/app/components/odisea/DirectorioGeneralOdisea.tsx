import { useState, useEffect } from 'react';
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
    MapPin,
    Phone,
    IdCard,
    ArrowRight,
    Users,
    Coffee,
    Building2,
    Shield
} from 'lucide-react';
import { cn } from '../ui/utils';

type ActiveTab = 'PRODUCTOR' | 'LIDER' | 'CATADOR' | 'TOSTADOR';

import type { DirectorioUsuario } from '../../types/directorio';
import { getProductores, getLideres, getCatadores, getTostadores } from '../../../services/directorioService';
import { AlertTriangle } from 'lucide-react';

export function DirectorioGeneralOdisea() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<ActiveTab>('PRODUCTOR');
    const [search, setSearch] = useState('');

    const [productores, setProductores] = useState<DirectorioUsuario[]>([]);
    const [lideres, setLideres] = useState<DirectorioUsuario[]>([]);
    const [catadores, setCatadores] = useState<DirectorioUsuario[]>([]);
    const [tostadores, setTostadores] = useState<DirectorioUsuario[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            getProductores(),
            getLideres(),
            getCatadores(),
            getTostadores()
        ]).then(([p, l, c, t]) => {
            setProductores(p);
            setLideres(l);
            setCatadores(c);
            setTostadores(t);
            setIsLoading(false);
        }).catch(err => {
            setError('Error al cargar el directorio general');
            setIsLoading(false);
        });
    }, []);

    const getTabList = () => {
        switch (activeTab) {
            case 'PRODUCTOR': return productores;
            case 'LIDER': return lideres;
            case 'CATADOR': return catadores;
            case 'TOSTADOR': return tostadores;
        }
    };

    const filtered = getTabList().filter(u =>
        u.nombre.toLowerCase().includes(search.toLowerCase()) ||
        u.municipio.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 text-left font-sans">
            {/* Header / Filter Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-sans font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <Contact className="text-blue-600" size={40} /> Directorio de Usuarios
                    </h1>
                    <p className="text-slate-400 font-medium max-w-2xl text-sm uppercase tracking-[0.2em]">
                        Contactabilidad e Información Básica de la Red Odisea
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white p-4 rounded-[40px] border border-slate-100 shadow-xl">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-350" size={18} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por Nombre o Región..."
                            className="h-12 w-80 rounded-2xl border-slate-50 pl-12 pr-4 bg-slate-50 focus:bg-white transition-all font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600"
                        />
                    </div>
                </div>
            </div>

            {/* Selector de Pestañas (Roles) */}
            <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-2">
                {(
                    [
                        { key: 'PRODUCTOR', label: 'Productores', icon: Shield },
                        { key: 'LIDER', label: 'Líderes de Campo', icon: Users },
                        { key: 'CATADOR', label: 'Catadores', icon: Coffee },
                        { key: 'TOSTADOR', label: 'Tostadores B2B', icon: Building2 },
                    ] as { key: ActiveTab; label: string; icon: React.ElementType }[]
                ).map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => {
                            setActiveTab(key);
                            setSearch('');
                        }}
                        className={cn(
                            'h-12 px-6 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all border-none cursor-pointer',
                            activeTab === key
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                                : 'text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-700'
                        )}
                    >
                        <Icon size={14} /> {label}
                    </button>
                ))}
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[48px] border border-slate-100 shadow-2xl overflow-hidden p-2">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-none">Nombre / Entidad</TableHead>
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-none">Registro / Identificación</TableHead>
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-none">Ubicación / Cobertura</TableHead>
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-none">Contacto Directo</TableHead>
                            <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-none">Detalles del Rol</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            [1, 2, 3].map((i) => (
                                <TableRow key={i} className="animate-pulse">
                                    <TableCell colSpan={5} className="py-8 px-10">
                                        <div className="h-6 bg-slate-100 rounded w-1/3"></div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-rose-500 font-bold">
                                    <AlertTriangle className="inline mr-2" size={16} /> {error}
                                </TableCell>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-slate-400 font-bold">
                                    No se encontraron usuarios en esta categoría.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((item) => (
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
                                            <IdCard size={14} className="text-slate-350" /> {item.identificacion}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-10 py-8">
                                        <div className="flex items-center gap-3 text-slate-700 text-xs font-bold uppercase tracking-widest">
                                            <MapPin size={14} className="text-blue-500/40" /> {item.municipio}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-10 py-8">
                                        <div className="text-slate-700 text-xs font-black">
                                            {item.contacto}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-10 py-8 text-xs font-medium text-slate-550">
                                        {item.cargoDetalle}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="p-8 rounded-[32px] bg-slate-100 border border-slate-200 text-center flex items-center justify-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-tight text-slate-400 italic">
                    Restricción de Privacidad: Como administrador de Odisea, usted tiene acceso de lectura a la información de contacto para fines de soporte y control institucional.
                </span>
            </div>
        </div>
    );
}
