export interface ValidacionItem {
    id: string;
    loteId: string;
    agricultor: string;
    finca: string;
    vereda: string;
    municipio: string;
    estado: 'Pendiente' | 'Revisado';
    fecha: string;
    tipo: string;
    alistamiento: 'Apto' | 'Subsanable' | 'No Apto';
}
