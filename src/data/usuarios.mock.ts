import type { AuthUser, UserRecord } from '../types/usuario';

export const MOCK_USERS: AuthUser[] = [
  {
    id: 'u1',
    name: 'María González',
    email: 'maria@finca.co',
    role: 'AGRICULTOR',
    avatarInitials: 'MG',
  },
  {
    id: 'u2',
    name: 'Carlos Martínez',
    email: 'carlos@beneficio.co',
    role: 'CERES',
    avatarInitials: 'CM',
  },
];

export const DEFAULT_USERS: UserRecord[] = [
    { id: 'usr-1', nombre: 'Odisea Admin', rol: 'Administrador', email: 'admin@odisea.co', celular: '+57 300 123 4567', estado: 'Habilitado', ultimoAcceso: 'Hoy, 09:12 AM' },
    { id: 'usr-2', nombre: 'María González', rol: 'Agricultor', email: 'maria.gonzalez@cafe.co', celular: '+57 312 455 9876', estado: 'Habilitado', ultimoAcceso: 'Ayer, 04:30 PM' },
    { id: 'usr-3', nombre: 'Pedro Nel Giraldo', rol: 'Catador', email: 'pedro.nel@calidad.co', celular: '+57 310 445 1122', estado: 'Habilitado', ultimoAcceso: 'Hoy, 08:00 AM' },
    { id: 'usr-4', nombre: 'Sofía Andrade', rol: 'Catador', email: 'sofia.andrade@calidad.co', celular: '+57 315 223 9988', estado: 'Habilitado', ultimoAcceso: 'Hace 2 días' },
    { id: 'usr-5', nombre: 'Carlos Augusto Restrepo', rol: 'Líder de Campo', email: 'carlos.restrepo@lider.co', celular: '+57 314 556 7788', estado: 'Habilitado', ultimoAcceso: 'Hoy, 10:45 AM' },
    { id: 'usr-6', nombre: 'Blue Bottle Coffee', rol: 'Tostador', email: 'sourcing@bluebottle.com', celular: '+1 415 889 0011', estado: 'Habilitado', ultimoAcceso: 'Hace 3 horas' },
    { id: 'usr-7', nombre: 'Workshop Coffee', rol: 'Tostador', email: 'roaster@workshop.co.uk', celular: '+44 20 7729 0099', estado: 'Deshabilitado', ultimoAcceso: 'Hace 2 semanas' },
];
