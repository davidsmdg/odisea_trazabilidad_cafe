export interface ExportLog {
    id: string;
    loteId: string;
    tostador: string;
    destino: string;
    precioFob: string;
    billOfLading: string;
    fechaDespacho: string;
    estadoTránsito: 'En Puerto' | 'En Tránsito' | 'Entregado';
}
