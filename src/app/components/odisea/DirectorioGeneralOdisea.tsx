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

interface DirectorioUsuario {
    id: string;
    nombre: string;
    identificacion: string;
    municipio: string;
    contacto: string;
    cargoDetalle: string;
}

const PRODUCTORES_MOCK: DirectorioUsuario[] = [
    { id: 'p1', nombre: 'María González', identificacion: 'CC 1.092.344.XXX', municipio: 'San Agustín, Huila', contacto: '+57 312 455 9876', cargoDetalle: 'Finca La Esperanza (Bourbon Rosado)' },
    { id: 'p2', nombre: 'Carlos Martínez', identificacion: 'CC 12.445.XXX', municipio: 'Acevedo, Huila', contacto: '+57 310 988 XXXX', cargoDetalle: 'Lote El Naranjo (Castillo)' },
    { id: 'p3', nombre: 'Jorge Torres', identificacion: 'CC 76.229.XXX', municipio: 'Garzón, Huila', contacto: '+57 311 234 XXXX', cargoDetalle: 'Finca El Recreo (Caturra)' },
    { id: 'p4', nombre: 'Elena Ruiz', identificacion: 'CC 36.884.XXX', municipio: 'Pitalito, Huila', contacto: '+57 314 556 XXXX', cargoDetalle: 'Finca Santa Helena (Geisha)' }
];

const LIDERES_MOCK: DirectorioUsuario[] = [
    { id: 'l1', nombre: 'Carlos Augusto Restrepo', identificacion: 'Personería JAC Res. 034', municipio: 'Vereda La Estrella, Huila', contacto: '+57 315 789 4562', cargoDetalle: 'Líder JAC - 25 Productores' },
    { id: 'l2', nombre: 'Dora Estela Muñoz', identificacion: 'Personería JAC Res. 112', municipio: 'Vereda El Rubí, Huila', contacto: '+57 318 456 XXXX', cargoDetalle: 'Líder JAC - 18 Productores' }
];

const CATADORES_MOCK: DirectorioUsuario[] = [
    { id: 'c1', nombre: 'Pedro Nel Giraldo', identificacion: 'Q-Grader Cert #48892', municipio: 'Bogotá, D.C.', contacto: '+57 300 123 4567', cargoDetalle: 'Catador Senior / Calibración Alta' },
    { id: 'c2', nombre: 'Sofía Andrade', identificacion: 'Sensory Cert #9921', municipio: 'Pitalito, Huila', contacto: '+57 320 789 XXXX', cargoDetalle: 'Especialista en Cafés Especiales' }
];

const TOSTADORES_MOCK: DirectorioUsuario[] = [
    { id: 't1', nombre: 'Blue Bottle Coffee', identificacion: 'NIT USA-998242', municipio: 'Oakland, California (USA)', contacto: '+1 (510) 555-0199', cargoDetalle: 'Comprador B2B / Microperfil Dulce' },
    { id: 't2', nombre: 'Workshop Coffee', identificacion: 'NIT UK-881232', municipio: 'Londres (UK)', contacto: '+44 20 7123 4567', cargoDetalle: 'Comprador B2B / Tostadora Especializada' }
];

export function DirectorioGeneralOdisea() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<ActiveTab>('PRODUCTOR');
    const [search, setSearch] = useState('');

    const [productores, setProductores] = useState<DirectorioUsuario[]>(PRODUCTORES_MOCK);
    const [lideres, setLideres] = useState<DirectorioUsuario[]>(LIDERES_MOCK);
    const [catadores, setCatadores] = useState<DirectorioUsuario[]>(CATADORES_MOCK);
    const [tostadores, setTostadores] = useState<DirectorioUsuario[]>(TOSTADORES_MOCK);

    useEffect(() => {
        // Cargar cambios dinámicos del productor
        const savedProductor = localStorage.getItem('perfil_productor');
        if (savedProductor) {
            try {
                const parsed = JSON.parse(savedProductor);
                setProductores(prev => prev.map(p => p.id === 'p1' ? {
                    ...p,
                    nombre: parsed.nombre || p.nombre,
                    contacto: parsed.celular || p.contacto
                } : p));
            } catch (e) {}
        }

        // Cargar cambios del líder
        const savedLider = localStorage.getItem('perfil_lider');
        if (savedLider) {
            try {
                const parsed = JSON.parse(savedLider);
                setLideres(prev => prev.map(l => l.id === 'l1' ? {
                    ...l,
                    nombre: parsed.nombre || l.nombre,
                    contacto: parsed.celular || l.contacto
                } : l));
            } catch (e) {}
        }

        // Cargar cambios del catador
        const savedCatador = localStorage.getItem('perfil_catador');
        if (savedCatador) {
            try {
                const parsed = JSON.parse(savedCatador);
                setCatadores(prev => prev.map(c => c.id === 'c1' ? {
                    ...c,
                    nombre: parsed.nombre || c.nombre,
                    contacto: parsed.celular || c.contacto
                } : c));
            } catch (e) {}
        }

        // Cargar cambios del tostador
        const savedTostador = localStorage.getItem('perfil_tostador');
        if (savedTostador) {
            try {
                const parsed = JSON.parse(savedTostador);
                setTostadores(prev => prev.map(t => t.id === 't1' ? {
                    ...t,
                    nombre: parsed.nombreTostador || t.nombre,
                    contacto: parsed.celular || t.contacto
                } : t));
            } catch (e) {}
        }
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
                        {filtered.length === 0 ? (
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
