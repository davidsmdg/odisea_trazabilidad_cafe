import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getLotesMaster, isLotePublicado } from '../../utils/loteStore';
import {
    Compass,
    Search,
    ArrowRight,
    MapPin,
    Star,
    Coffee,
    FlaskConical,
    ShoppingBag,
    CheckCircle2,
    UserCircle,
    Sparkles,
    Globe2,
    Euro,
    DollarSign,
    Package,
    Check,
    Mountain,
    SlidersHorizontal,
    Users,
    Plus,
    Minus,
    X,
} from 'lucide-react';
import { GrupoFinca } from '../GrupoFinca';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { toast } from 'sonner';

// URLs ultraseguras y probadas de Unsplash alusivas a plantas de café, cerezas y montañas colombianas
export const LOTES_MARKET_DEFAULT = [
    {
        id: 'LOT-001-HUI',
        codigo: 'LOT-001-HUI',
        productor: 'ASMUER, Asociación de mujeres de Pitalito',
        finca: 'Finca ASMUER,',
        municipio: 'Pitalito',
        departamento: 'Huila',
        variedad: 'Castillo',
        proceso: 'Lavado',
        macroperfil: 'Balanceado',
        impacto: 'Mujeres',
        puntaje: '83.50',
        empaque: '3 Sacos (35 kg verde) o 4 Cajas (24.5 kg)',
        perfilTaza: 'Dulce, balanceado, notas a caramelo y chocolate con acidez cítrica suave.',
        precioBaseKgUSD: 11.19,
        avatar: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'LOT-002-HUI',
        codigo: 'LOT-002-HUI',
        productor: 'Mayerly Silva',
        finca: 'Finca Mayerly',
        municipio: 'Oporapa',
        departamento: 'Huila',
        variedad: 'Bourbon Rojo',
        proceso: 'Lavado con fermentación extendida',
        macroperfil: 'Balanceado',
        impacto: 'Mujeres',
        puntaje: '86.00',
        empaque: '14 Sacos (35 kg verde) o 19 Cajas (24.5 kg)',
        perfilTaza: 'Dulce, balanceado, notas a caramelo y chocolate con acidez cítrica suave.',
        precioBaseKgUSD: 18.58,
        avatar: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'LOT-003-HUI',
        codigo: 'LOT-003-HUI',
        productor: 'Mayerly Silva',
        finca: 'Finca Mayerly',
        municipio: 'Oporapa',
        departamento: 'Huila',
        variedad: 'Bourbon Rosado',
        proceso: 'Honey',
        macroperfil: 'Balanceado',
        impacto: 'Mujeres',
        puntaje: '86.00',
        empaque: '9 Sacos (35 kg verde) o 12 Cajas (24.5 kg)',
        perfilTaza: 'Dulce, balanceado, notas a caramelo y chocolate con acidez cítrica suave.',
        precioBaseKgUSD: 20.67,
        avatar: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'LOT-004-HUI',
        codigo: 'LOT-004-HUI',
        productor: 'Mayerly Silva',
        finca: 'Finca Mayerly',
        municipio: 'Oporapa',
        departamento: 'Huila',
        variedad: 'Bourbon Amarillo',
        proceso: 'Honey',
        macroperfil: 'Balanceado',
        impacto: 'Mujeres',
        puntaje: '86.00',
        empaque: '4 Sacos (35 kg verde) o 5 Cajas (24.5 kg)',
        perfilTaza: 'Dulce, balanceado, notas a caramelo y chocolate con acidez cítrica suave.',
        precioBaseKgUSD: 21.29,
        avatar: 'https://images.unsplash.com/photo-1522881180214-ceee21eb3fb2?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'LOT-005-HUI',
        codigo: 'LOT-005-HUI',
        productor: 'Asociación de mujeres emprendedoras de Oporapa',
        finca: 'Finca Asociación',
        municipio: 'Oporapa',
        departamento: 'Huila',
        variedad: 'Caturra',
        proceso: 'Lavado',
        macroperfil: 'Colombia',
        impacto: 'Mujeres',
        puntaje: '83.50',
        empaque: '9 Sacos (35 kg verde) o 12 Cajas (24.5 kg)',
        perfilTaza: 'Dulce, balanceado, notas a caramelo y chocolate con acidez cítrica suave.',
        precioBaseKgUSD: 12.93,
        avatar: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'LOT-006-HUI',
        codigo: 'LOT-006-HUI',
        productor: 'Asociación de mujeres emprendedoras de Oporapa',
        finca: 'Finca Asociación',
        municipio: 'Oporapa',
        departamento: 'Huila',
        variedad: 'Castillo',
        proceso: 'Lavado',
        macroperfil: 'Colombia',
        impacto: 'Mujeres',
        puntaje: '83.50',
        empaque: '10 Sacos (35 kg verde) o 14 Cajas (24.5 kg)',
        perfilTaza: 'Dulce, balanceado, notas a caramelo y chocolate con acidez cítrica suave.',
        precioBaseKgUSD: 14.53,
        avatar: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'LOT-007-HUI',
        codigo: 'LOT-007-HUI',
        productor: 'Wilmer Montenegro',
        finca: 'Finca Wilmer',
        municipio: 'Campoalegre',
        departamento: 'Huila',
        variedad: 'Bourbon Rojo',
        proceso: 'Lavado',
        macroperfil: 'Balanceado',
        impacto: 'Jóven',
        puntaje: '86.00',
        empaque: '14 Sacos (35 kg verde) o 19 Cajas (24.5 kg)',
        perfilTaza: 'Dulce, balanceado, notas a caramelo y chocolate con acidez cítrica suave.',
        precioBaseKgUSD: 21.03,
        avatar: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'LOT-008-HUI',
        codigo: 'LOT-008-HUI',
        productor: 'Wilmer Montenegro',
        finca: 'Finca Wilmer',
        municipio: 'Campoalegre',
        departamento: 'Huila',
        variedad: 'Bourbon Rosado',
        proceso: 'Lavado',
        macroperfil: 'Balanceado',
        impacto: 'Jóven',
        puntaje: '86.00',
        empaque: '9 Sacos (35 kg verde) o 12 Cajas (24.5 kg)',
        perfilTaza: 'Dulce, balanceado, notas a caramelo y chocolate con acidez cítrica suave.',
        precioBaseKgUSD: 23.46,
        avatar: 'https://images.unsplash.com/photo-1522881180214-ceee21eb3fb2?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'LOT-009-ANT',
        codigo: 'LOT-009-ANT',
        productor: 'Blanca David',
        finca: 'Finca Blanca',
        municipio: 'Dabeiba',
        departamento: 'Antioquia',
        variedad: 'Castillo, Colombia',
        proceso: 'Lavado',
        macroperfil: 'Balanceado',
        impacto: 'Mujeres',
        puntaje: '86.00',
        empaque: '6 Sacos (35 kg verde) o 8 Cajas (24.5 kg)',
        perfilTaza: 'Dulce, balanceado, notas a caramelo y chocolate con acidez cítrica suave.',
        precioBaseKgUSD: 23.77,
        avatar: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'LOT-010-HUI',
        codigo: 'LOT-010-HUI',
        productor: 'Wilmer Montenegro',
        finca: 'Finca Wilmer',
        municipio: 'Campoalegre',
        departamento: 'Huila',
        variedad: 'Geisha',
        proceso: 'Lavado',
        macroperfil: 'Balanceado',
        impacto: 'Jóven',
        puntaje: '86.00',
        empaque: '7 Sacos (35 kg verde) o 9 Cajas (24.5 kg)',
        perfilTaza: 'Dulce, balanceado, notas a caramelo y chocolate con acidez cítrica suave.',
        precioBaseKgUSD: 24.64,
        avatar: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'LOT-011-HUI',
        codigo: 'LOT-011-HUI',
        productor: 'Linarco Rodriguez',
        finca: 'Finca Linarco',
        municipio: 'Palestina',
        departamento: 'Huila',
        variedad: 'Gesha',
        proceso: 'Lavado con fermentación extendida',
        macroperfil: 'Balanceado',
        impacto: 'Asociativo',
        puntaje: '86.00',
        empaque: '20 Sacos (35 kg verde) o 28 Cajas (24.5 kg)',
        perfilTaza: 'Dulce, balanceado, notas a caramelo y chocolate con acidez cítrica suave.',
        precioBaseKgUSD: 24.85,
        avatar: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'LOT-012-HUI',
        codigo: 'LOT-012-HUI',
        productor: 'Maria Rodriguez',
        finca: 'Finca Maria',
        municipio: 'Palestina',
        departamento: 'Huila',
        variedad: 'SL28',
        proceso: 'Natural',
        macroperfil: 'Balanceado',
        impacto: 'Mujeres',
        puntaje: '86.00',
        empaque: '15 Sacos (35 kg verde) o 21 Cajas (24.5 kg)',
        perfilTaza: 'Dulce, balanceado, notas a caramelo y chocolate con acidez cítrica suave.',
        precioBaseKgUSD: 24.82,
        avatar: 'https://images.unsplash.com/photo-1522881180214-ceee21eb3fb2?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'LOT-013-HUI',
        codigo: 'LOT-013-HUI',
        productor: 'Linarco Rodriguez',
        finca: 'Finca Linarco',
        municipio: 'Palestina',
        departamento: 'Huila',
        variedad: 'Castillo',
        proceso: 'Lavado con fermentación extendida',
        macroperfil: 'Balanceado',
        impacto: 'Asociativo',
        puntaje: '83.50',
        empaque: '10 Sacos (35 kg verde) o 14 Cajas (24.5 kg)',
        perfilTaza: 'Dulce, balanceado, notas a caramelo y chocolate con acidez cítrica suave.',
        precioBaseKgUSD: 9.39,
        avatar: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'LOT-014-CAU',
        codigo: 'LOT-014-CAU',
        productor: 'Francia Astudillo',
        finca: 'Finca Francia',
        municipio: 'Caldono',
        departamento: 'Cauca',
        variedad: 'Borbón rosado',
        proceso: 'Honey',
        macroperfil: 'Balanceado',
        impacto: 'Mujeres',
        puntaje: '86.00',
        empaque: '3 Sacos (35 kg verde) o 4 Cajas (24.5 kg)',
        perfilTaza: 'Dulce, balanceado, notas a caramelo y chocolate con acidez cítrica suave.',
        precioBaseKgUSD: 18.80,
        avatar: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'LOT-015-CAU',
        codigo: 'LOT-015-CAU',
        productor: 'Productor Aliado Odisea',
        finca: 'Finca Aliada Odisea',
        municipio: 'Piendamo',
        departamento: 'Cauca',
        variedad: 'Castillo, Colombia',
        proceso: 'Lavado',
        macroperfil: 'Colombia',
        impacto: 'Asociativo',
        puntaje: '83.50',
        empaque: '17 Sacos (35 kg verde) o 24 Cajas (24.5 kg)',
        perfilTaza: 'Chocolate, caramelo,sutiles notas frutales, acidez media, cuerpo medio, posgusto aromatico y limpio',
        precioBaseKgUSD: 11.71,
        avatar: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'LOT-016-HUI',
        codigo: 'LOT-016-HUI',
        productor: 'Duvan Alejandro Quisaboni',
        finca: 'Finca Duvan',
        municipio: 'Palestina',
        departamento: 'Huila',
        variedad: 'Geisha',
        proceso: 'Lavado con fermentación extendida',
        macroperfil: 'Floral',
        impacto: 'Jóven',
        puntaje: '86.00',
        empaque: '4 Sacos (35 kg verde) o 5 Cajas (24.5 kg)',
        perfilTaza: 'Dulce, flor, aroamtico, dulce frutal, mandarina,miel y caramelo, acidez media-alta, posgusto aromatico limoncillo, limpio y agradable',
        precioBaseKgUSD: 23.21,
        avatar: 'https://images.unsplash.com/photo-1522881180214-ceee21eb3fb2?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'LOT-017-HUI',
        codigo: 'LOT-017-HUI',
        productor: 'Duvan Alejandro Quisaboni',
        finca: 'Finca Duvan',
        municipio: 'Palestina',
        departamento: 'Huila',
        variedad: 'Geisha',
        proceso: 'Honey',
        macroperfil: 'Floral',
        impacto: 'Jóven',
        puntaje: '86.00',
        empaque: '5 Sacos (35 kg verde) o 7 Cajas (24.5 kg)',
        perfilTaza: 'Frutal, flor, lavanda, manzanilla,vainilla, chocolatina,azahar, caramelo, acidez media-alta, limpio posgusto',
        precioBaseKgUSD: 22.35,
        avatar: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'LOT-018-HUI',
        codigo: 'LOT-018-HUI',
        productor: 'Juan José Rodriguez',
        finca: 'Finca Juan',
        municipio: 'Palestina',
        departamento: 'Huila',
        variedad: 'Bourbon Rosado',
        proceso: 'Lavado',
        macroperfil: 'Frutal',
        impacto: 'Jóven',
        puntaje: '83.50',
        empaque: '7 Sacos (35 kg verde) o 9 Cajas (24.5 kg)',
        perfilTaza: 'Chocolate, caramelo, frutal, dulce, balanceado, posgusto manzanilla dulce',
        precioBaseKgUSD: 21.00,
        avatar: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'LOT-019-HUI',
        codigo: 'LOT-019-HUI',
        productor: 'Juan José Rodriguez',
        finca: 'Finca Juan',
        municipio: 'Palestina',
        departamento: 'Huila',
        variedad: 'Bourbon Rosado',
        proceso: 'Lavado',
        macroperfil: 'Frutal',
        impacto: 'Jóven',
        puntaje: '85.00',
        empaque: '15 Sacos (35 kg verde) o 21 Cajas (24.5 kg)',
        perfilTaza: 'Chocolate, caramelo, citrico limon, aroamatico,dulce de guayaba',
        precioBaseKgUSD: 25.67,
        avatar: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'LOT-020-CAU',
        codigo: 'LOT-020-CAU',
        productor: 'Francia Astudillo',
        finca: 'Finca Francia',
        municipio: 'Caldono',
        departamento: 'Cauca',
        variedad: 'Bourbon Rosado',
        proceso: 'Lavado con fermentación extendida',
        macroperfil: 'Frutal',
        impacto: 'Mujeres',
        puntaje: '85.00',
        empaque: '19 Sacos (35 kg verde) o 26 Cajas (24.5 kg)',
        perfilTaza: 'Aromático, limoncillo, caramelo miel y fruta, acidez media y posgusto limpio',
        precioBaseKgUSD: 22.12,
        avatar: 'https://images.unsplash.com/photo-1522881180214-ceee21eb3fb2?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'LOT-021-HUI',
        codigo: 'LOT-021-HUI',
        productor: 'Café Origen Palestina',
        finca: 'Finca Café',
        municipio: 'Palestina',
        departamento: 'Huila',
        variedad: 'Caturra Taby',
        proceso: 'Lavado',
        macroperfil: 'Colombia',
        impacto: 'Asociativo',
        puntaje: '83.00',
        empaque: '20 Sacos (35 kg verde) o 28 Cajas (24.5 kg)',
        perfilTaza: 'Chocolate, citrico, dulce, notas aromaticas, acidez media-alta, limpio, leve notas de vainilla',
        precioBaseKgUSD: 13.52,
        avatar: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'LOT-022-HUI',
        codigo: 'LOT-022-HUI',
        productor: 'Linarco Rodriguez',
        finca: 'Finca Linarco',
        municipio: 'Palestina',
        departamento: 'Huila',
        variedad: 'Pacamara',
        proceso: 'Lavado',
        macroperfil: 'Especiado',
        impacto: 'Asociativo',
        puntaje: '85.00',
        empaque: '5 Sacos (35 kg verde) o 7 Cajas (24.5 kg)',
        perfilTaza: 'Té negro, especiado, elegante melaza, pimienta dulce',
        precioBaseKgUSD: 24.87,
        avatar: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?auto=format&fit=crop&w=800&q=80',
    }
].map(l => {
    let mp = l.macroperfil;
    if (mp === 'Balanceado') mp = 'Dulce Vainilla';
    else if (mp === 'Colombia') mp = 'Nueces';
    else if (mp === 'Frutal') {
        mp = l.id.includes('6') || l.id.includes('8') ? 'Frutal cítrico' : 'Frutal bayas';
    }
    
    let proc = l.proceso;
    if (proc.toLowerCase().includes('anaeróbic') || proc.toLowerCase().includes('extendid')) {
        proc = 'Fermentación anaeróbica';
    } else if (proc.toLowerCase().includes('honey')) {
        proc = 'Honey';
    } else if (proc.toLowerCase().includes('natural')) {
        proc = 'Natural';
    } else {
        proc = 'Lavado';
    }
    return { ...l, macroperfil: mp, proceso: proc };
});

export function ExplorarCafes() {
    const navigate = useNavigate();
    const [lotes, setLotes] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [mercadoDestino, setMercadoDestino] = useState<'EU' | 'USA'>('EU');

    useEffect(() => {
        const master = getLotesMaster();
        // Filtrar solo los lotes ofrecidos por el productor, aprobados por Odisea y que estén PUBLICADOS en el Stage Gate
        const commercialLotes = master.filter(l => l.ofrecidoPorProductor && l.aprobadoComercializacion && isLotePublicado(l.id));
        const mappedMaster = commercialLotes.map(l => ({
            id: l.id,
            codigo: l.id,
            productor: l.productor,
            finca: l.finca,
            municipio: l.municipio ? l.municipio.split(',')[0] : 'San Agustín',
            departamento: l.municipio ? (l.municipio.split(',')[1]?.trim() || 'Huila') : 'Huila',
            variedad: l.variedad,
            proceso: l.proceso,
            macroperfil: l.macroperfil || 'Balanceado',
            impacto: 'Comunidad',
            puntaje: l.calificacion ? l.calificacion.toFixed(2) : 'Sin Evaluar',
            empaque: '10 Sacos (35 kg verde)',
            perfilTaza: l.macroperfil ? `Perfil sensorial destacado con notas a ${l.macroperfil.toLowerCase()}.` : 'Perfil de taza con notas frutales y acidez equilibrada.',
            precioBaseKgUSD: 14.50,
            avatar: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80',
            regionesDisponibles: l.regionesDisponibles || ['USA', 'EU'],
        }));
        
        const combined = [...mappedMaster];
        LOTES_MARKET_DEFAULT.forEach(def => {
            if (!combined.some(c => c.id === def.id)) {
                combined.push({
                    ...def,
                    regionesDisponibles: (def as any).regionesDisponibles || ['USA', 'EU']
                });
            }
        });
        setLotes(combined);
    }, []);

    // Filtros de Sourcing Avanzados
    const [filtroVariedad, setFiltroVariedad] = useState('todas');
    const [filtroProceso, setFiltroProceso] = useState('todos');
    const [filtroMacroperfiles, setFiltroMacroperfiles] = useState<string[]>([]);
    const [filtroImpacto, setFiltroImpacto] = useState('todos');
    const [filtroOrigen, setFiltroOrigen] = useState('todos');

    const toggleFiltroMacroperfil = (perfil: string) => {
        setFiltroMacroperfiles(prev => 
            prev.includes(perfil) ? prev.filter(p => p !== perfil) : [...prev, perfil]
        );
    };

    const [accionesRealizadas, setAccionesRealizadas] = useState<Record<string, { muestra?: boolean; reserva?: boolean; cantidad?: number; tipoEmpaque?: 'Sacos' | 'Cajas' }>>({});
    const [reservaActiva, setReservaActiva] = useState<string | null>(null);
    const [cantidadSacos, setCantidadSacos] = useState(1);
    const [tipoEmpaqueSeleccionado, setTipoEmpaqueSeleccionado] = useState<'Sacos' | 'Cajas'>('Sacos');


    const lotesFiltrados = lotes.filter(l => {
        const matchSearch = l.variedad.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            l.proceso.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            l.finca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            l.productor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            l.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            l.departamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            l.perfilTaza.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            l.codigo.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (!matchSearch) return false;

        if (filtroVariedad !== 'todas' && !l.variedad.toLowerCase().includes(filtroVariedad.toLowerCase())) return false;
        if (filtroProceso !== 'todos' && !l.proceso.toLowerCase().includes(filtroProceso.toLowerCase())) return false;
        if (filtroMacroperfiles.length > 0) {
            const profiles = Array.isArray(l.macroperfil) ? l.macroperfil : (typeof l.macroperfil === 'string' ? l.macroperfil.split(',').map((s: string) => s.trim()) : []);
            const matches = profiles.some((p: string) => filtroMacroperfiles.includes(p));
            if (!matches) return false;
        }
        if (filtroImpacto !== 'todos' && l.impacto !== filtroImpacto) return false;
        if (filtroOrigen !== 'todos' && l.departamento.toLowerCase() !== filtroOrigen.toLowerCase()) return false;

        // Filtrar por mercado de destino (USA / EU)
        if (l.regionesDisponibles && !l.regionesDisponibles.includes(mercadoDestino)) return false;

        return true;
    });

    // Agrupar lotes filtrados por Departamento -> Municipio
    const groupedLotes = lotesFiltrados.reduce((acc: any, lote: any) => {
        const depto = lote.departamento;
        const mun = lote.municipio;

        if (!acc[depto]) {
            acc[depto] = { nombre: depto, municipios: {} };
        }
        if (!acc[depto].municipios[mun]) {
            acc[depto].municipios[mun] = {
                nombre: mun,
                altitud: '1.700 - 1.900 msnm', // Dato default
                impacto: lote.impacto === 'Jóven' ? 'Alto' : 'Estratégico',
                lotes: []
            };
        }

        const extractSacos = parseInt(lote.empaque.split(' ')[0]) || 10;
        acc[depto].municipios[mun].lotes.push({
            id: lote.id,
            titulo: `${lote.variedad} - ${lote.productor}`,
            productor: lote.productor,
            finca: lote.finca,
            variedad: lote.variedad,
            proceso: lote.proceso,
            puntaje: parseFloat(lote.puntaje),
            macroperfil: lote.macroperfil,
            descripcionPerfil: lote.perfilTaza,
            ueEstado: 'Verificado',
            disponibilidad: extractSacos,
            cadena: 'Completa',
            imagen: lote.avatar,
            // Agregamos precio por si luego queremos renderizarlo en la tarjeta
            precioBaseKgUSD: lote.precioBaseKgUSD,
            factorRendimiento: lote.factorRendimiento || 92.5
        });

        return acc;
    }, {});

    const gruposDepartamentos = Object.values(groupedLotes).map((d: any) => ({
        ...d,
        municipios: Object.values(d.municipios).map((m: any) => ({
            ...m,
            fincasCount: m.lotes.length
        }))
    }));

    const solicitarMuestra = (codigo: string) => {
        setAccionesRealizadas(prev => ({
            ...prev,
            [codigo]: { ...prev[codigo], muestra: true }
        }));
        toast.success(`Muestra solicitada para el lote ${codigo}`, {
            description: 'El laboratorio de Odisea Trace gestionará el envío directo a su tostaduría.'
        });
    };

    const iniciarReserva = (codigo: string) => {
        setReservaActiva(codigo);
        setCantidadSacos(1);
        setTipoEmpaqueSeleccionado('Sacos');
    };

    const confirmarReservaLote = (codigo: string, cantidad: number, tipoEmpaque: 'Sacos' | 'Cajas') => {
        setAccionesRealizadas(prev => ({
            ...prev,
            [codigo]: { ...prev[codigo], reserva: true, cantidad, tipoEmpaque }
        }));
        setReservaActiva(null);
        toast.success(`Booking confirmado: ${cantidad} ${tipoEmpaque} del lote ${codigo}`, {
            description: 'El lote ha sido asignado. Podrá ver su trazabilidad detallada en vivo en la sección "Mis Lotes".'
        });
    };

    const renderPrecio = (precioBaseUSD: number) => {
        if (mercadoDestino === 'EU') {
            const eurKg = (precioBaseUSD * 0.92).toFixed(2);
            return {
                valor: `${eurKg} €`,
                unidad: 'por Kg',
                mercado: 'Mercado Europeo (DDP est.)'
            };
        } else {
            const usdLb = (precioBaseUSD / 2.20462).toFixed(2);
            return {
                valor: `$${usdLb}`,
                unidad: 'por Lb',
                mercado: 'Mercado USA (FOB est.)'
            };
        }
    };

    const limpiarFiltrosAvanzados = () => {
        setFiltroVariedad('todas');
        setFiltroProceso('todos');
        setFiltroMacroperfiles([]);
        setFiltroImpacto('todos');
        setFiltroOrigen('todos');
        setSearchTerm('');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1300px] mx-auto font-sans">
            {/* Header / Banner Premium */}
            <div className="bg-[#5f705f] text-white p-8 md:p-12 rounded-[36px] shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#bb8d3b]/30 to-transparent pointer-events-none" />
                <div className="space-y-3 z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#bb8d3b]/20 text-[#bb8d3b] text-[10px] font-black uppercase tracking-widest border border-[#bb8d3b]/30">
                        <Compass size={12} /> Odisea Trace — Sourcing Directo
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white">
                        Explorar Cafés de Origen
                    </h1>
                    <p className="text-white/80 font-medium text-sm max-w-xl">
                        Odisea es el puente que conecta el esfuerzo de nuestros caficultores con los tostadores más exigentes. Todos los lotes presentados están listos para ser entregados en verde.
                    </p>
                </div>

                {/* Alternador Global de Mercado (Precios EU vs USA) */}
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-3xl border border-white/10 shrink-0 w-full md:w-auto z-10 space-y-2.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#bb8d3b] block text-center flex items-center justify-center gap-1">
                        <Globe2 size={10} /> Mercado Destino (Precios)
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 bg-black/20 p-1 rounded-2xl">
                        <button
                            onClick={() => setMercadoDestino('EU')}
                            className={cn(
                                "flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl font-bold text-xs transition-all",
                                mercadoDestino === 'EU' ? "bg-[#bb8d3b] text-white shadow" : "text-white/60 hover:text-white"
                            )}
                        >
                            <Euro size={12} /> Europa (€/Kg)
                        </button>
                        <button
                            onClick={() => setMercadoDestino('USA')}
                            className={cn(
                                "flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl font-bold text-xs transition-all",
                                mercadoDestino === 'USA' ? "bg-[#bb8d3b] text-white shadow" : "text-white/60 hover:text-white"
                            )}
                        >
                            <DollarSign size={12} /> USA ($/Lb)
                        </button>
                    </div>
                </div>
            </div>

            {/* Búsqueda Principal */}
            <div className="bg-white p-3.5 rounded-3xl border border-gray-100 shadow-sm">
                <div className="relative flex items-center">
                    <Search className="absolute left-4 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Búsqueda libre por palabra clave (productor, notas de cata, finca)..."
                        className="w-full h-12 bg-transparent pl-12 pr-4 text-sm font-bold border-none outline-none text-gray-900 placeholder:text-gray-400"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* SECCIÓN DE FILTROS AVANZADOS DE SOURCING */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                    <span className="text-xs font-black uppercase tracking-wider text-[#5f705f] flex items-center gap-1.5">
                        <SlidersHorizontal size={15} /> Filtros de Sourcing Específicos
                    </span>
                    {(filtroVariedad !== 'todas' || filtroProceso !== 'todos' || filtroMacroperfiles.length > 0 || filtroImpacto !== 'todos' || filtroOrigen !== 'todos' || searchTerm !== '') && (
                        <button
                            onClick={limpiarFiltrosAvanzados}
                            className="text-[11px] font-bold text-[#bb8d3b] hover:underline"
                        >
                            Limpiar todos los filtros
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* 1. Filtro Origen (Departamento) - FIRST */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">Origen (Depto)</label>
                        <select
                            value={filtroOrigen}
                            onChange={(e) => setFiltroOrigen(e.target.value)}
                            className="w-full h-10 bg-gray-50 border border-gray-200 rounded-xl px-3 text-xs font-bold text-gray-800 outline-none focus:border-[#bb8d3b]"
                        >
                            <option value="todos">Todos los orígenes</option>
                            <option value="Huila">Huila</option>
                            <option value="Antioquia">Antioquia</option>
                            <option value="Quindío">Quindío</option>
                            <option value="Cauca">Cauca</option>
                            <option value="Nariño">Nariño</option>
                        </select>
                    </div>

                    {/* 2. Filtro Variedad */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">Variedad</label>
                        <select
                            value={filtroVariedad}
                            onChange={(e) => setFiltroVariedad(e.target.value)}
                            className="w-full h-10 bg-gray-50 border border-gray-200 rounded-xl px-3 text-xs font-bold text-gray-800 outline-none focus:border-[#bb8d3b]"
                        >
                            <option value="todas">Todas las variedades</option>
                            <option value="Bourbon Rosado">Bourbon Rosado</option>
                            <option value="Geisha">Geisha</option>
                            <option value="Tabi">Tabi</option>
                            <option value="Castillo">Castillo</option>
                            <option value="Caturra">Caturra</option>
                        </select>
                    </div>

                    {/* 3. Filtro Proceso */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">Proceso</label>
                        <select
                            value={filtroProceso}
                            onChange={(e) => setFiltroProceso(e.target.value)}
                            className="w-full h-10 bg-gray-50 border border-gray-200 rounded-xl px-3 text-xs font-bold text-gray-800 outline-none focus:border-[#bb8d3b]"
                        >
                            <option value="todos">Todos los procesos</option>
                            <option value="Lavado">Lavado</option>
                            <option value="Natural">Natural</option>
                            <option value="Honey">Honey</option>
                            <option value="Fermentación anaeróbica">Fermentación anaeróbica</option>
                            <option value="Fermentación carbónica">Fermentación carbónica</option>
                            <option value="Fermentación con levadura">Fermentación con levadura</option>
                            <option value="Cofermentación">Cofermentación</option>
                        </select>
                    </div>

                    {/* 4. Filtro Macroperfiles (Multi-select) */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">Macroperfiles</label>
                        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-1 border border-gray-100 rounded-xl bg-gray-50/30">
                            {[
                                'Floral', 'Frutal bayas', 'Frutal cítrico', 'Vinoso', 'Nueces', 'Cacao', 'Especiado', 'Dulce Vainilla', 'Dulce Azúcar morena'
                            ].map((perf) => {
                                const isSelected = filtroMacroperfiles.includes(perf);
                                return (
                                    <button
                                        key={perf}
                                        type="button"
                                        onClick={() => toggleFiltroMacroperfil(perf)}
                                        className={cn(
                                            "text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border transition-all cursor-pointer",
                                            isSelected
                                                ? "bg-[#bb8d3b] border-[#bb8d3b] text-white shadow-xs"
                                                : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                                        )}
                                    >
                                        {perf}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 5. Filtro Impacto */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 block">Impacto Social</label>
                        <select
                            value={filtroImpacto}
                            onChange={(e) => setFiltroImpacto(e.target.value)}
                            className="w-full h-10 bg-gray-50 border border-gray-200 rounded-xl px-3 text-xs font-bold text-gray-800 outline-none focus:border-[#bb8d3b]"
                        >
                            <option value="todos">Todos los impactos</option>
                            <option value="Mujeres Caficultoras">Mujeres Caficultoras</option>
                            <option value="Jóvenes Productores">Jóvenes Productores</option>
                            <option value="Comunidades Indígenas">Comunidades Indígenas</option>
                        </select>
                    </div>
                </div>

                {/* Contador de resultados */}
                <div className="flex justify-between items-center pt-2 text-xs font-bold text-gray-400">
                    <span>Criterios combinados activos</span>
                    <span className="text-[#5f705f]">
                        Mostrando {lotesFiltrados.length} lote{lotesFiltrados.length !== 1 ? 's' : ''} en verde disponible{lotesFiltrados.length !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>

                        {/* Grid de Lotes Ultra Premium agrupado por Finca/Municipio usando el UX público */}
            <div className="space-y-12">
                {gruposDepartamentos.map((depto: any) => (
                    <div key={depto.nombre} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-0.5 grow bg-gradient-to-r from-transparent to-[#5f705f]/20" />
                            <h2 className="text-xl font-bold uppercase tracking-[0.3em] text-[#5f705f]/50 px-4">
                                {depto.nombre}
                            </h2>
                            <div className="h-0.5 grow bg-gradient-to-l from-transparent to-[#5f705f]/20" />
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {depto.municipios.map((mun: any, mIdx: number) => (
                                <GrupoFinca
                                    key={`${depto.nombre}-${mun.nombre}`}
                                    grupo={{
                                        id: `${depto.nombre}-${mun.nombre}`,
                                        nombre: mun.nombre,
                                        municipio: depto.nombre,
                                        altitud: mun.altitud,
                                        impacto: mun.impacto,
                                        ueEstado: 'Verificado',
                                        cafesCount: mun.fincasCount,
                                        lotes: mun.lotes
                                    }}
                                    defaultExpanded={mIdx === 0}
                                    onLoteClick={(lote) => navigate(`/tostador/historia/${lote.id}`)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {lotesFiltrados.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
                    <Coffee className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-bold text-sm">No se encontraron lotes en verde con los criterios de filtrado especificados.</p>
                    <button onClick={limpiarFiltrosAvanzados} className="text-xs text-[#bb8d3b] font-bold mt-2 underline">
                        Restablecer filtros de búsqueda
                    </button>
                </div>
            )}
        </div>
    );
}
