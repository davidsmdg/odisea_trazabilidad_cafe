export interface RegistroAuditoria {
    id: string; // Report ID
    productor: string;
    finca: string;
    ubicacion: string;
    fecha: string; // ISO or readable
    verificador: string;
    verificadorID: string;
    estado: 'Aprobado' | 'Rechazado' | 'Condicionado';
    area: string;
    hashDocumento: string; // To simulate immutable blockchain/timestamp proof
}
