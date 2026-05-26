import { useState } from 'react';
import { motion } from 'motion/react';
import {
    Users,
    Landmark,
    Droplets,
    FlaskConical,
    Baby,
    Camera,
    MapPin,
    AlertCircle,
    CheckCircle2,
    Info
} from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import { toast } from 'sonner';

interface FormSectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const FormSection = ({ title, icon, children }: FormSectionProps) => (
    <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-[#5f705f]/10 flex items-center justify-center text-[#5f705f]">
                {icon}
            </div>
            <h3 className="text-xl font-sans font-black text-slate-800 uppercase tracking-tight">{title}</h3>
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);

const Question = ({
    label,
    description,
    checked,
    onChange,
    hasPhoto = false,
    photoLabel = "Adjuntar evidencia fotográfica"
}: {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (v: boolean) => void;
    hasPhoto?: boolean;
    photoLabel?: string;
}) => {
    const [photoUploaded, setPhotoUploaded] = useState(false);

    const handleUpload = () => {
        toast.info("Simulando captura de foto georeferenciada...", {
            icon: <Camera className="animate-pulse" />
        });
        setTimeout(() => {
            setPhotoUploaded(true);
            toast.success("Foto guardada", {
                description: "Metadata: Lat 1.88, Long -76.29, Precisión 3m"
            });
        }, 1500);
    };

    return (
        <div className={cn(
            "group space-y-4 p-6 rounded-2xl border transition-all duration-300",
            checked
                ? "bg-emerald-50/50 border-emerald-100/50"
                : "bg-rose-50/50 border-rose-100/50"
        )}>
            <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Label className={cn(
                            "text-sm font-bold transition-colors cursor-pointer",
                            checked ? "text-[#5f705f]" : "text-rose-900"
                        )}>
                            {label}
                        </Label>
                        <Badge className={cn(
                            "text-[8px] font-black uppercase px-2 py-0.5 border-none shadow-none",
                            checked ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                        )}>
                            {checked ? "CUMPLE" : "INCUMPLE"}
                        </Badge>
                    </div>
                    {description && <p className={cn(
                        "text-xs font-medium leading-relaxed",
                        checked ? "text-slate-400" : "text-rose-400/70"
                    )}>{description}</p>}
                </div>
                <Switch
                    checked={checked}
                    onCheckedChange={onChange}
                    className={cn(
                        "transition-colors",
                        checked ? "data-[state=checked]:bg-emerald-600" : "data-[state=unchecked]:bg-rose-400"
                    )}
                />
            </div>

            {hasPhoto && (
                <div className={cn(
                    "pl-4 border-l-2 py-1 transition-all",
                    checked ? "border-emerald-200 group-hover:border-emerald-400" : "border-rose-200"
                )}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleUpload}
                        className={cn(
                            "h-10 rounded-xl gap-2 font-black text-[10px] uppercase tracking-widest",
                            photoUploaded
                                ? "text-emerald-700 bg-emerald-100/50"
                                : checked
                                    ? "text-slate-400 hover:text-[#5f705f] bg-slate-100/50"
                                    : "text-rose-400 bg-rose-100/30"
                        )}
                    >
                        {photoUploaded ? <CheckCircle2 size={14} /> : <Camera size={14} />}
                        {photoUploaded ? "Foto Georeferenciada Lista" : photoLabel}
                    </Button>
                </div>
            )}
        </div>
    );
};

export function FormularioAutodeclaracion() {
    // Inicializamos todo en FALSE (No Cumple) para forzar la lectura y validación manual

    // 1. Arraigo
    const [qConoce, setQConoce] = useState(false);
    const [qViveCerca, setQViveCerca] = useState(false);

    // 2. Tierra
    const [qTitularidad, setQTitularidad] = useState(false);
    const [qNoDesplazado, setQNoDesplazado] = useState(false);
    const [qLegitimo, setQLegitimo] = useState(false);

    // 3. Ambiental
    const [qRondas, setQRondas] = useState(false);
    const [qTratamiento, setQTratamiento] = useState(false);
    const [qNoVertimientos, setQNoVertimientos] = useState(false);

    // 4. Insumos
    const [qTripleLavado, setQTripleLavado] = useState(false);
    const [qBodega, setQBodega] = useState(false);
    const [qNoQuemas, setQNoQuemas] = useState(false);

    // 5. Social
    const [qEscuela, setQEscuela] = useState(false);
    const [qTratoDigno, setQTratoDigno] = useState(false);
    const [qNoDiscriminacion, setQNoDiscriminacion] = useState(false);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="bg-[#e3d5b8]/10 rounded-[32px] p-8 border border-[#e3d5b8]/30 flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-[#e3d5b8] flex items-center justify-center text-[#5f705f]">
                    <Info size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-sans font-black text-[#5f705f] uppercase tracking-tight">Autodeclaración Asistida</h2>
                    <p className="text-sm text-[#5f705f]/70 font-medium">Formulario de verificación de campo para Líderes Comunicados Ceres.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* SECCIÓN 1: ARRAIGO */}
                <FormSection title="Reconocimiento Social" icon={<Users />}>
                    <Question
                        label="¿Conoce personalmente al productor?"
                        description="Validación de identidad y vecindad en la vereda."
                        checked={qConoce}
                        onChange={setQConoce}
                    />
                    <div className="space-y-2 px-6">
                        <Label className="text-[10px] font-black uppercase text-slate-400">Tiempo de conocimiento</Label>
                        <select className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#5f705f]/20">
                            <option>Menos de 1 año</option>
                            <option>1 a 5 años</option>
                            <option>Más de 5 años</option>
                            <option>Toda la vida</option>
                        </select>
                    </div>
                    <Question
                        label="¿Confirma que el productor reside en la zona?"
                        checked={qViveCerca}
                        onChange={setQViveCerca}
                    />
                </FormSection>

                {/* SECCIÓN 2: TIERRA */}
                <FormSection title="Derechos de Tierra" icon={<Landmark />}>
                    <Question
                        label="¿Conoce la titularidad de su tierra?"
                        description="Sabe si tiene escritura, carta-venta o posesión."
                        checked={qTitularidad}
                        onChange={setQTitularidad}
                    />
                    <Question
                        label="Validación No-Desplazamiento"
                        description="Confirma que la tierra NO pertenece a víctimas de desplazamiento forzado o abandono."
                        checked={qNoDesplazado}
                        onChange={setQNoDesplazado}
                    />
                    <Question
                        label="Reconocimiento de Posesión Legítima"
                        description="La comunidad lo reconoce como el dueño legítimo aunque no tenga títulos formales."
                        checked={qLegitimo}
                        onChange={setQLegitimo}
                    />
                </FormSection>

                {/* SECCIÓN 3: AMBIENTAL */}
                <FormSection title="Gestión Hídrica" icon={<Droplets />}>
                    <Question
                        label="Respeto a Rondas Hídricas"
                        description="Límites físicos de 30 metros protegidos frente a quebradas y fuentes de agua."
                        checked={qRondas}
                        onChange={setQRondas}
                        hasPhoto={true}
                        photoLabel="Foto de zona de ronda"
                    />
                    <Question
                        label="Tratamiento de Aguas Mieles"
                        description="Posee filtros verdes o fosas de pulpa reglamentarias."
                        checked={qTratamiento}
                        onChange={setQTratamiento}
                        hasPhoto={true}
                        photoLabel="Capturar sistema de beneficio"
                    />
                    <Question
                        label="Sin Vertimientos Directos"
                        description="Verifica que NO existen descargas directas a fuentes de agua."
                        checked={qNoVertimientos}
                        onChange={setQNoVertimientos}
                    />
                </FormSection>

                {/* SECCIÓN 4: INSUMOS Y QUEMAS */}
                <FormSection title="Prácticas Agrícolas" icon={<FlaskConical />}>
                    <Question
                        label="Triple Lavado de Envases"
                        description="Los recipientes de agroquímicos se lavan 3 veces antes de su disposición."
                        checked={qTripleLavado}
                        onChange={setQTripleLavado}
                    />
                    <Question
                        label="Almacenamiento Seguro"
                        description="Lugar ventilado, lejos de la casa y de fuentes hídricas."
                        checked={qBodega}
                        onChange={setQBodega}
                        hasPhoto={true}
                        photoLabel="Foto de bodega de insumos"
                    />
                    <Question
                        label="Prohibición de Quemas"
                        description="No se realizan quemas para preparar suelo ni para residuos de cosecha."
                        checked={qNoQuemas}
                        onChange={setQNoQuemas}
                    />
                </FormSection>

                {/* SECCIÓN 5: LABORAL Y SOCIAL */}
                <FormSection title="Responsabilidad Social" icon={<Baby />}>
                    <Question
                        label="Protección de la Infancia"
                        description="Menores asisten a la escuela; sus labores en finca son ligeras, formativas y seguras."
                        checked={qEscuela}
                        onChange={setQEscuela}
                    />
                    <Question
                        label="Bienestar Trabajadores Itinerantes"
                        description="Trato digno, acceso a agua potable y elementos de protección durante cosecha."
                        checked={qTratoDigno}
                        onChange={setQTratoDigno}
                        hasPhoto={true}
                        photoLabel="Verificar condiciones de vivienda"
                    />
                    <Question
                        label="Inclusión y No-Discriminación"
                        description="Sin tratos diferenciados por género, raza u origen (migrantes)."
                        checked={qNoDiscriminacion}
                        onChange={setQNoDiscriminacion}
                    />
                </FormSection>

                {/* RESUMEN CRÍTICO */}
                <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><AlertCircle size={100} /></div>
                    <div className="relative">
                        <Badge className="bg-amber-500 text-white border-none font-black text-[10px] px-3 py-1 mb-4 uppercase">Compromiso Ético</Badge>
                        <h3 className="text-2xl font-sans font-black mb-4 uppercase tracking-tighter">Declaración Juramentada</h3>
                        <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed">
                            Al completar este formulario, usted como líder certifica que ha verificado presencialmente
                            cada criterio y que la información proporcionada es fruto del conocimiento veraz sobre su comunidad.
                        </p>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase text-white">Validación de Integridad Ceres</p>
                                <p className="text-[10px] text-slate-500 font-medium">Registrado mediante ID de Líder: LC-2024-HUI</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
