/** Departamentos y municipios cafeteros para el registro de finca. */
export const REGIONES: Record<string, string[]> = {
    Antioquia: ['Andes', 'Betania', 'Ciudad Bolívar', 'Concordia', 'Dabeiba', 'Jericó', 'Salgar', 'Támesis', 'Urrao'],
    Caldas: ['Aguadas', 'Anserma', 'Chinchiná', 'Manizales', 'Palestina', 'Riosucio', 'Salamina'],
    Cauca: ['Cajibío', 'Inzá', 'Piendamó', 'Popayán', 'Santander de Quilichao', 'Timbío', 'Totoró'],
    Huila: ['Acevedo', 'Garzón', 'La Plata', 'Palestina', 'Pitalito', 'San Agustín', 'Timaná'],
    Nariño: ['Buesaco', 'Chachagüí', 'La Unión', 'Sandoná', 'Taminango'],
    'Norte de Santander': ['Chitagá', 'Pamplona', 'Toledo'],
    Quindío: ['Armenia', 'Calarcá', 'Génova', 'Pijao', 'Salento'],
    Risaralda: ['Apía', 'Belén de Umbría', 'Marsella', 'Pereira', 'Santa Rosa de Cabal'],
    Santander: ['Rionegro', 'San Vicente de Chucurí', 'Socorro'],
    Tolima: ['Chaparral', 'Ibagué', 'Líbano', 'Planadas', 'Rioblanco'],
};

export const DEPARTAMENTOS = Object.keys(REGIONES);
