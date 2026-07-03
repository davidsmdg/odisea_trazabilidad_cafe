import { useState, useEffect } from 'react';
import {
    Link as LinkIcon,
    Users,
    Coffee,
    Building2,
    CheckCircle2,
    XCircle,
    PlusCircle,
    UserCheck,
    Briefcase,
    Shield,
    Trash2,
    TrendingUp
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { cn } from '../ui/utils';

interface LinkLider {
    id: string;
    productor: string;
    lider: string;
}

interface LinkCatador {
    id: string;
    productor: string;
    catador: string;
}

interface LinkTostador {
    id: string;
    loteId: string;
    tostador: string;
}

const INITIAL_LIDERES_LINKS: LinkLider[] = [
    { id: '1', productor: 'María González', lider: 'Carlos Augusto Restrepo' },
    { id: '2', productor: 'Carlos Martínez', lider: 'Dora Estela Muñoz' }
];

const INITIAL_CATADORES_LINKS: LinkCatador[] = [
    { id: '1', productor: 'María González', catador: 'Pedro Nel Giraldo' },
    { id: '2', productor: 'Elena Ruiz', catador: 'Sofía Andrade' }
];

const INITIAL_TOSTADORES_LINKS: LinkTostador[] = [
    { id: '1', loteId: 'LOT-HUILA-084', tostador: 'Blue Bottle Coffee (USA)' },
    { id: '2', loteId: 'LOT-ANT-112', tostador: 'Workshop Coffee (UK)' }
];

import { getLotesMaster } from '../../utils/loteStore';

const MOCK_PRODUCTORES = ['María González', 'Carlos Martínez', 'Jorge Torres', 'Elena Ruiz'];
const MOCK_LIDERES = ['Carlos Augusto Restrepo', 'Dora Estela Muñoz'];
const MOCK_CATADORES = ['Pedro Nel Giraldo', 'Sofía Andrade'];
const MOCK_TOSTADORES = ['Blue Bottle Coffee (USA)', 'Workshop Coffee (UK)', 'The Barn (Alemania)'];

export function ControlConexionesOdisea() {
    const [tab, setTab] = useState<'lideres' | 'catadores' | 'tostadores'>('lideres');

    const [liderLinks, setLiderLinks] = useState<LinkLider[]>([]);
    const [catadorLinks, setCatadorLinks] = useState<LinkCatador[]>([]);
    const [tostadorLinks, setLinkTostador] = useState<LinkTostador[]>([]);
    const [lotesList, setLotesList] = useState<string[]>([]);

    // Form inputs
    const [selectedProductor, setSelectedProductor] = useState(MOCK_PRODUCTORES[0]);
    const [selectedLider, setSelectedLider] = useState(MOCK_LIDERES[0]);
    const [selectedCatador, setSelectedCatador] = useState(MOCK_CATADORES[0]);
    const [selectedLote, setSelectedLote] = useState('');
    const [selectedTostador, setSelectedTostador] = useState(MOCK_TOSTADORES[0]);

    useEffect(() => {
        const loadedLotes = getLotesMaster();
        if (loadedLotes && loadedLotes.length > 0) {
            setLotesList(loadedLotes.map(l => l.id));
            setSelectedLote(loadedLotes[0].id);
        }

        const storedLider = localStorage.getItem('links_lider');
        if (storedLider) {
            setLiderLinks(JSON.parse(storedLider));
        } else {
            localStorage.setItem('links_lider', JSON.stringify(INITIAL_LIDERES_LINKS));
            setLiderLinks(INITIAL_LIDERES_LINKS);
        }

        const storedCata = localStorage.getItem('links_catador');
        if (storedCata) {
            setCatadorLinks(JSON.parse(storedCata));
        } else {
            localStorage.setItem('links_catador', JSON.stringify(INITIAL_CATADORES_LINKS));
            setCatadorLinks(INITIAL_CATADORES_LINKS);
        }

        const storedTost = localStorage.getItem('links_tostador');
        if (storedTost) {
            setLinkTostador(JSON.parse(storedTost));
        } else {
            localStorage.setItem('links_tostador', JSON.stringify(INITIAL_TOSTADORES_LINKS));
            setLinkTostador(INITIAL_TOSTADORES_LINKS);
        }
    }, []);

    // Action creators
    const handleAddLiderLink = () => {
        // Evitar duplicados
        if (liderLinks.some(l => l.productor === selectedProductor && l.lider === selectedLider)) {
            toast.error("Este enlace ya existe");
            return;
        }
        const updated = [...liderLinks, { id: Date.now().toString(), productor: selectedProductor, lider: selectedLider }];
        setLiderLinks(updated);
        localStorage.setItem('links_lider', JSON.stringify(updated));
        toast.success("Enlace Productor ↔ Líder registrado correctamente");
    };

    const handleRemoveLiderLink = (id: string) => {
        const updated = liderLinks.filter(l => l.id !== id);
        setLiderLinks(updated);
        localStorage.setItem('links_lider', JSON.stringify(updated));
        toast.success("Enlace removido");
    };

    const handleAddCatadorLink = () => {
        if (catadorLinks.some(c => c.productor === selectedProductor && c.catador === selectedCatador)) {
            toast.error("Este enlace ya existe");
            return;
        }
        const updated = [...catadorLinks, { id: Date.now().toString(), productor: selectedProductor, catador: selectedCatador }];
        setCatadorLinks(updated);
        localStorage.setItem('links_catador', JSON.stringify(updated));
        toast.success("Enlace Productor ↔ Catador registrado correctamente");
    };

    const handleRemoveCatadorLink = (id: string) => {
        const updated = catadorLinks.filter(c => c.id !== id);
        setCatadorLinks(updated);
        localStorage.setItem('links_catador', JSON.stringify(updated));
        toast.success("Enlace de cata removido");
    };

    const handleAddTostadorLink = () => {
        if (tostadorLinks.some(t => t.loteId === selectedLote && t.tostador === selectedTostador)) {
            toast.error("Este enlace de compra ya existe");
            return;
        }
        const updated = [...tostadorLinks, { id: Date.now().toString(), loteId: selectedLote, tostador: selectedTostador }];
        setLinkTostador(updated);
        localStorage.setItem('links_tostador', JSON.stringify(updated));
        toast.success("Compra y enlace B2B asociado al Tostador");
    };

    const handleRemoveTostadorLink = (id: string) => {
        const updated = tostadorLinks.filter(t => t.id !== id);
        setLinkTostador(updated);
        localStorage.setItem('links_tostador', JSON.stringify(updated));
        toast.success("Venta desvinculada del tostador");
    };

    return (
        <div className="space-y-12 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20 px-4 text-left font-sans">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 justify-start">
                    <div className="h-16 w-16 rounded-[24px] bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm shadow-blue-100">
                        <LinkIcon size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-sans font-black text-slate-900 tracking-tight leading-none mb-1">Mapeo de Cadena de Valor</h1>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Vínculos de Trazabilidad Comercial y de Campo</p>
                    </div>
                </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex bg-slate-100 p-1.5 rounded-full w-max overflow-hidden shadow-inner">
                <button
                    onClick={() => setTab('lideres')}
                    className={cn("px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 border-none", tab === 'lideres' ? "bg-white text-slate-800 shadow-sm font-black" : "text-slate-500 hover:text-slate-800")}
                >
                    <Users size={14} /> Productor ↔ Líder
                </button>
                <button
                    onClick={() => setTab('catadores')}
                    className={cn("px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 border-none", tab === 'catadores' ? "bg-white text-slate-800 shadow-sm font-black" : "text-slate-500 hover:text-slate-800")}
                >
                    <Coffee size={14} /> Productor ↔ Catador
                </button>
                <button
                    onClick={() => setTab('tostadores')}
                    className={cn("px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 border-none", tab === 'tostadores' ? "bg-white text-slate-800 shadow-sm font-black" : "text-slate-500 hover:text-slate-800")}
                >
                    <Building2 size={14} /> Lote ↔ Tostador
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* FORM LEFT */}
                <div className="lg:col-span-5">
                    <div className="bg-white rounded-[48px] border border-slate-100 p-8 md:p-10 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                            <PlusCircle className="text-blue-600" size={24} />
                            <h3 className="text-xl font-sans font-black text-slate-800">
                                {tab === 'lideres' && 'Asociar Líder Comunitario'}
                                {tab === 'catadores' && 'Asociar Catador Q-Grader'}
                                {tab === 'tostadores' && 'Vincular Venta a Tostador'}
                            </h3>
                        </div>

                        {tab === 'lideres' && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Agricultor / Productor</label>
                                    <select
                                        value={selectedProductor}
                                        onChange={(e) => setSelectedProductor(e.target.value)}
                                        className="w-full h-14 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 outline-none"
                                    >
                                        {MOCK_PRODUCTORES.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Líder Comunitario (Auditoría Campo)</label>
                                    <select
                                        value={selectedLider}
                                        onChange={(e) => setSelectedLider(e.target.value)}
                                        className="w-full h-14 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 outline-none"
                                    >
                                        {MOCK_LIDERES.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                                <Button
                                    onClick={handleAddLiderLink}
                                    className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-widest transition-all active:scale-95 border-none"
                                >
                                    Establecer Enlace de Campo
                                </Button>
                            </div>
                        )}

                        {tab === 'catadores' && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Agricultor / Productor</label>
                                    <select
                                        value={selectedProductor}
                                        onChange={(e) => setSelectedProductor(e.target.value)}
                                        className="w-full h-14 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 outline-none"
                                    >
                                        {MOCK_PRODUCTORES.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Catador Certificado (SCA)</label>
                                    <select
                                        value={selectedCatador}
                                        onChange={(e) => setSelectedCatador(e.target.value)}
                                        className="w-full h-14 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 outline-none"
                                    >
                                        {MOCK_CATADORES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <Button
                                    onClick={handleAddCatadorLink}
                                    className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-widest transition-all active:scale-95 border-none"
                                >
                                    Asignar Catador Oficial
                                </Button>
                            </div>
                        )}

                        {tab === 'tostadores' && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">ID Lote Producido</label>
                                    <select
                                        value={selectedLote}
                                        onChange={(e) => setSelectedLote(e.target.value)}
                                        className="w-full h-14 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 outline-none"
                                    >
                                        {lotesList.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tostador / Comprador Internacional</label>
                                    <select
                                        value={selectedTostador}
                                        onChange={(e) => setSelectedTostador(e.target.value)}
                                        className="w-full h-14 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 outline-none"
                                    >
                                        {MOCK_TOSTADORES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <Button
                                    onClick={handleAddTostadorLink}
                                    className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-widest transition-all active:scale-95 border-none"
                                >
                                    Registrar Venta B2B
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* TABLE RIGHT */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-[48px] border border-slate-100 p-8 md:p-10 shadow-sm space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                            <h3 className="text-xl font-sans font-black text-slate-800">Vínculos Activos del Sistema</h3>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Registro Persistido</span>
                        </div>

                        {tab === 'lideres' && (
                            <div className="space-y-4">
                                {liderLinks.map((link) => (
                                    <div key={link.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-800">Productor: {link.productor}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Líder Asignado: {link.lider}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveLiderLink(link.id)}
                                            className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors border-none"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {tab === 'catadores' && (
                            <div className="space-y-4">
                                {catadorLinks.map((link) => (
                                    <div key={link.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-800">Productor: {link.productor}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Catador Oficial: {link.catador}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveCatadorLink(link.id)}
                                            className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors border-none"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {tab === 'tostadores' && (
                            <div className="space-y-4">
                                {tostadorLinks.map((link) => (
                                    <div key={link.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-800">Lote: {link.loteId}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tostador / Destino: {link.tostador}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveTostadorLink(link.id)}
                                            className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors border-none"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
