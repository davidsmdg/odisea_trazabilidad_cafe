export type UserRole =
  | 'AGRICULTOR'
  | 'COMMUNITY_LEADER'
  | 'ENV_VERIFIER'
  | 'TASTER'
  | 'CERES'
  | 'ROASTER';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
}

export interface UserRecord {
    id: string;
    nombre: string;
    rol: 'Administrador' | 'Agricultor' | 'Líder de Campo' | 'Catador' | 'Tostador';
    email: string;
    celular: string;
    estado: 'Habilitado' | 'Deshabilitado';
    ultimoAcceso: string;
}
