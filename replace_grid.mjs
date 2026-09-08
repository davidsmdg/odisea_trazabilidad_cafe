import fs from 'fs';

let content = fs.readFileSync('src/app/components/tostador/ExplorarCafes.tsx', 'utf8');

const startMarker = '{/* Grid de Lotes Ultra Premium con Diseño Limpio y Refinado */}';
const endMarker = '{lotesFiltrados.length === 0 && (';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error('Markers not found');
    process.exit(1);
}

const replacement = `            {/* Grid de Lotes Ultra Premium agrupado por Finca/Municipio usando el UX público */}
            <div className="space-y-12">
                {gruposDepartamentos.map((depto: any) => (
                    <div key={depto.nombre} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-0.5 grow bg-gradient-to-r from-transparent to-[#5f705f]/20" />
                            <h2 className="text-xl font-bold uppercase tracking-[0.3em] text-[#5f705f]/50 px-4">
                                {depto.nombre}
                            </h2>
                            <div className="h-0.5 grow bg-gradient-to-l from-transparent to-[#5f705f]/20" />
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {depto.municipios.map((mun: any, mIdx: number) => (
                                <GrupoFinca
                                    key={\`\${depto.nombre}-\${mun.nombre}\`}
                                    grupo={{
                                        id: \`\${depto.nombre}-\${mun.nombre}\`,
                                        nombre: mun.nombre,
                                        municipio: depto.nombre,
                                        altitud: mun.altitud,
                                        impacto: mun.impacto,
                                        ueEstado: 'Verificado',
                                        cafesCount: mun.fincasCount,
                                        lotes: mun.lotes
                                    }}
                                    defaultExpanded={mIdx === 0}
                                    onLoteClick={(lote) => navigate(\`/tostador/historia/\${lote.id}\`)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            `;

const newContent = content.slice(0, startIndex) + replacement + content.slice(endIndex);
fs.writeFileSync('src/app/components/tostador/ExplorarCafes.tsx', newContent);
console.log('Replacement successful');
