import type { DirectorioUsuario } from '../types/directorio';

export const PRODUCTORES_MOCK: DirectorioUsuario[] = [
    { id: 'p1', nombre: 'María González', identificacion: 'CC 1.092.344.XXX', municipio: 'San Agustín, Huila', contacto: '+57 312 455 9876', cargoDetalle: 'Finca La Esperanza (Bourbon Rosado)' },
    { id: 'p2', nombre: 'Carlos Martínez', identificacion: 'CC 12.445.XXX', municipio: 'Acevedo, Huila', contacto: '+57 310 988 XXXX', cargoDetalle: 'Lote El Naranjo (Castillo)' },
    { id: 'p3', nombre: 'Jorge Torres', identificacion: 'CC 76.229.XXX', municipio: 'Garzón, Huila', contacto: '+57 311 234 XXXX', cargoDetalle: 'Finca El Recreo (Caturra)' },
    { id: 'p4', nombre: 'Elena Ruiz', identificacion: 'CC 36.884.XXX', municipio: 'Pitalito, Huila', contacto: '+57 314 556 XXXX', cargoDetalle: 'Finca Santa Helena (Geisha)' }
];

export const LIDERES_MOCK: DirectorioUsuario[] = [
    { id: 'l1', nombre: 'Carlos Augusto Restrepo', identificacion: 'Personería JAC Res. 034', municipio: 'Vereda La Estrella, Huila', contacto: '+57 315 789 4562', cargoDetalle: 'Líder JAC - 25 Productores' },
    { id: 'l2', nombre: 'Dora Estela Muñoz', identificacion: 'Personería JAC Res. 112', municipio: 'Vereda El Rubí, Huila', contacto: '+57 318 456 XXXX', cargoDetalle: 'Líder JAC - 18 Productores' }
];

export const CATADORES_MOCK: DirectorioUsuario[] = [
    { id: 'c1', nombre: 'Pedro Nel Giraldo', identificacion: 'Q-Grader Cert #48892', municipio: 'Bogotá, D.C.', contacto: '+57 300 123 4567', cargoDetalle: 'Catador Senior / Calibración Alta' },
    { id: 'c2', nombre: 'Sofía Andrade', identificacion: 'Sensory Cert #9921', municipio: 'Pitalito, Huila', contacto: '+57 320 789 XXXX', cargoDetalle: 'Especialista en Cafés Especiales' }
];

export const TOSTADORES_MOCK: DirectorioUsuario[] = [
    { id: 't1', nombre: 'Blue Bottle Coffee', identificacion: 'NIT USA-998242', municipio: 'Oakland, California (USA)', contacto: '+1 (510) 555-0199', cargoDetalle: 'Comprador B2B / Microperfil Dulce' },
    { id: 't2', nombre: 'Workshop Coffee', identificacion: 'NIT UK-881232', municipio: 'Londres (UK)', contacto: '+44 20 7123 4567', cargoDetalle: 'Comprador B2B / Tostadora Especializada' }
];
