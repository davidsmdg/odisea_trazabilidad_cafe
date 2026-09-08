import { useState } from 'react';
import { motion } from 'motion/react';
import {
    Users,
    Shield,
    TreePine,
    Droplets,
    Camera,
    AlertCircle,
    CheckCircle2,
    Info,
    HelpCircle
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
            <div className="w-12 h-12 rounded-2xl bg-[#1A365D]/10 flex items-center justify-center text-[#1A365D]">
                {icon}
            </div>
            <h3 className="text-lg font-sans font-black text-slate-800 uppercase tracking-tight">{title}</h3>
        </div>
        <div className="space-y-5">
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
    photoLabel = "Adjuntar evidencia fotográfica veredal"
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
        toast.info("Capturando foto con georreferenciación local...", {
            icon: <Camera className="animate-pulse" />
        });
        setTimeout(() => {
            setPhotoUploaded(true);
            toast.success("Evidencia guardada", {
                description: "Metadata: Lat 1.88, Long -76.29, Precisión 5m (Simulado)"
            });
        }, 1200);
    };

    return (
        <div className={cn(
            "group space-y-4 p-5 rounded-2xl border transition-all duration-300",
            checked
                ? "bg-emerald-50/40 border-emerald-100"
                : "bg-amber-50/30 border-amber-100"
        )}>
            <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Label className={cn(
                            "text-sm font-bold transition-colors cursor-pointer",
                            checked ? "text-[#1A365D]" : "text-slate-600"
                        )}>
                            {label}
                        </Label>
                        <Badge className={cn(
                            "text-[8px] font-black uppercase px-2 py-0.5 border-none shadow-none",
                            checked ? "bg-green-600 text-white" : "bg-amber-500 text-slate-900"
                        )}>
                            {checked ? "VERIFICADO" : "PENDIENTE"}
                        </Badge>
                    </div>
                    {description && <p className="text-xs font-semibold text-slate-400 leading-relaxed">{description}</p>}
                </div>
                <Switch
                    checked={checked}
                    onCheckedChange={onChange}
                    className={cn(
                        "transition-colors",
                        checked ? "data-[state=checked]:bg-green-600" : "data-[state=unchecked]:bg-slate-200"
                    )}
                />
            </div>

            {hasPhoto && (
                <div className={cn(
                    "pl-4 border-l-2 py-1 transition-all",
                    checked ? "border-green-200 group-hover:border-green-400" : "border-slate-200"
                )}>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleUpload}
                        className={cn(
                            "h-9 rounded-lg gap-2 font-black text-[9px] uppercase tracking-widest",
                            photoUploaded
                                ? "text-green-700 bg-green-100/50"
                                : checked
                                    ? "text-slate-400 hover:text-slate-700 bg-slate-100/50"
                                    : "text-slate-500 bg-slate-100/30"
                        )}
                    >
                        {photoUploaded ? <CheckCircle2 size={12} /> : <Camera size={12} />}
                        {photoUploaded ? "Foto de Campo Guardada" : photoLabel}
                    </Button>
                </div>
            )}
        </div>
    );
};

export function FormularioAutodeclaracion() {
    // 1. Pilar Arraigo
    const [qConoce, setQConoce] = useState(false);
    const [qReside, setQReside] = useState(false);

    // 2. Pilar Paz Veredal
    const [qLinderos, setQLinderos] = useState(false);
    const [qNoTrabajoInfantil, setQNoTrabajoInfantil] = useState(false);

    // 3. Pilar Forestal (EUDR)
    const [qNoDeforestacion, setQNoDeforestacion] = useState(false);

    // 4. Pilar Gestión Hídrica
    const [qNoContaminacionAgua, setQNoContaminacionAgua] = useState(false);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            
            {/* Aviso de Pre-Validación */}
            <div className="bg-[#1A365D]/5 rounded-[32px] p-6 border border-[#1A365D]/10 flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-[#1A365D]/10 flex items-center justify-center text-[#1A365D] shrink-0">
                    <Info size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-sans font-black text-[#1A365D] uppercase tracking-tight">Pre-Validación Social (JAC)</h2>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                        Como líder comunitario, responde estas preguntas basándote en tu conocimiento directo del territorio. Los detalles de laboratorio y almacenamiento químico serán auditados profesionalmente por el Verificador Ambiental de Odisea.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* PILAR 1: ARRAIGO E IDENTIDAD */}
                <FormSection title="1. Arraigo e Identidad" icon={<Users size={20} />}>
                    <Question
                        label="¿El productor es reconocido en la vereda?"
                        description="Valida que la comunidad lo identifique como vecino legítimo."
                        checked={qConoce}
                        onChange={setQConoce}
                    />
                    <Question
                        label="Residencia del Caficultor"
                        description="Confirma que vive en el predio o realiza la administración presencial de la cosecha."
                        checked={qReside}
                        onChange={setQReside}
                    />
                </FormSection>

                {/* PILAR 2: PAZ Y CONVIVENCIA SOCIAL */}
                <FormSection title="2. Paz y Convivencia Social" icon={<Shield size={20} />}>
                    <Question
                        label="Ausencia de Conflictos de Tierras"
                        description="Confirma que no existen disputas activas de linderos ni reclamos forzados sobre el predio."
                        checked={qLinderos}
                        onChange={setQLinderos}
                    />
                    <Question
                        label="Protección a la Niñez y Educación"
                        description="Certifica que los hijos del productor asisten a la escuela y no reemplazan mano de obra en cosecha."
                        checked={qNoTrabajoInfantil}
                        onChange={setQNoTrabajoInfantil}
                    />
                </FormSection>

                {/* PILAR 3: PREVENCIÓN DE DEFORESTACIÓN */}
                <FormSection title="3. Cuidado Forestal (EUDR)" icon={<TreePine size={20} />}>
                    <Question
                        label="No Deforestación Veredal"
                        description="Certifica visualmente que el productor no ha talado bosque primario nativo para expandir la siembra."
                        checked={qNoDeforestacion}
                        onChange={setQNoDeforestacion}
                        hasPhoto={true}
                        photoLabel="Foto de linderos boscosos"
                    />
                </FormSection>

                {/* PILAR 4: PROTECCIÓN HÍDRICA */}
                <FormSection title="4. Cuidado del Agua" icon={<Droplets size={20} />}>
                    <Question
                        label="Retorno Responsable de Aguas Mieles"
                        description="Confirma a grandes rasgos que el beneficio no descarga aguas ácidas o pulpa directo a quebradas."
                        checked={qNoContaminacionAgua}
                        onChange={setQNoContaminacionAgua}
                        hasPhoto={true}
                        photoLabel="Captura fosa de pulpa / filtro verde"
                    />
                </FormSection>

            </div>

            {/* AVISO DE JURAMENTO SIMPLIFICADO */}
            <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><HelpCircle size={120} /></div>
                <div className="relative z-10">
                    <Badge className="bg-amber-500 text-white border-none font-black text-[9px] px-3 py-1 mb-4 uppercase tracking-widest">Aval Social y Comunitario</Badge>
                    <h3 className="text-xl font-sans font-black mb-3 uppercase tracking-tighter">Declaración Veredal</h3>
                    <p className="text-slate-400 text-xs font-semibold mb-6 leading-relaxed">
                        Este registro actúa como concepto previo para habilitar la visita técnica oficial. Al aprobar las respuestas, das fe de la veracidad de estos pilares veredales básicos.
                    </p>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-white leading-none mb-1">Pre-Certificado de Alistamiento Veredal</p>
                            <p className="text-[10px] text-slate-500 font-semibold">Listo para la integración GIS de Odisea Trace</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
