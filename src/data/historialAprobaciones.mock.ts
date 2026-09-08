import type { RegistroAuditoria } from '../types/auditoria';

export const HISTORIAL_MOCK: RegistroAuditoria[] = [
    {
        id: 'DD-EUDR-2024-8842',
        productor: 'María González',
        finca: 'Finca La Esperanza',
        ubicacion: 'San Agustín, Huila',
        fecha: '2024-03-08 14:30:00 (UTC-5)',
        verificador: 'Laura Hernández',
        verificadorID: 'VA-092-COL',
        estado: 'Aprobado',
        area: '4.5 Ha',
        hashDocumento: '8f4c28b9e6db31e7...e5a2b',
    },
    {
        id: 'DD-EUDR-2024-8841',
        productor: 'Carlos Martínez',
        finca: 'Lote El Naranjo',
        ubicacion: 'Acevedo, Huila',
        fecha: '2024-03-07 09:15:22 (UTC-5)',
        verificador: 'Laura Hernández',
        verificadorID: 'VA-092-COL',
        estado: 'Rechazado',
        area: '12.0 Ha',
        hashDocumento: '3a1d9c49f8b2e10c...9f1b4',
    },
    {
        id: 'DD-EUDR-2024-8839',
        productor: 'Elena Ruiz',
        finca: 'Finca Santa Helena',
        ubicacion: 'Pitalito, Huila',
        fecha: '2024-03-05 16:45:10 (UTC-5)',
        verificador: 'Andrés Silva',
        verificadorID: 'VA-045-COL',
        estado: 'Condicionado',
        area: '8.2 Ha',
        hashDocumento: '5b8e1f7c3d9a2b4e...0c7d2',
    }
];
