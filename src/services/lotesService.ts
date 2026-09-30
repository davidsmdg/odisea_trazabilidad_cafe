import { supabase } from '../app/utils/supabaseClient';
import type { LoteUnificado } from '../types/lote';

function mapLoteDbToUnificado(l: any): LoteUnificado {
    const meta = l.metadata || {};
    return {
        id: l.codigo || l.id,
        productor: meta.productor || 'María González',
        finca: meta.finca || 'Finca La Esperanza',
        municipio: meta.municipio || 'Pitalito',
        variedad: l.variedad || 'Bourbon Rosado',
        proceso: l.proceso || 'Lavado',
        estado: l.estado_actual || 'Cereza',
        almacenamiento: meta.almacenamiento || 'Almacén Principal',
        fecha: l.fecha_cosecha || new Date().toISOString(),
        calificacion: Number(l.calificacion_final) || undefined,
        macroperfil: meta.macroperfil || undefined,
        tostadorAsignado: meta.tostadorAsignado,
        tostadorPais: meta.tostadorPais,
        liderAsignado: meta.liderAsignado,
        catadorAsignado: meta.catadorAsignado,
        ofrecidoPorProductor: meta.ofrecidoPorProductor ?? true,
        aprobadoComercializacion: meta.aprobadoComercializacion ?? true,
        regionesDisponibles: meta.regionesDisponibles,
        historialMovimientos: meta.historialMovimientos || [],
        estadoJAC: meta.estadoJAC || 'Pendiente',
        coordenadas: meta.coordenadas,
        areaPoligono: meta.areaPoligono,
        riesgoDeforestacion: meta.riesgoDeforestacion || 'Bajo',
        verificadoEUDR: meta.verificadoEUDR ?? true,
        pruebasAlistamiento: meta.pruebasAlistamiento,
        pesos: {
            cereza: Number(l.peso_cereza) || 0,
            pergamino: Number(l.peso_pergamino) || 0,
            verde: Number(l.peso_verde) || 0,
        },
        precioBaseKgUSD: meta.precioBaseKgUSD,
        tarifaOdisea: meta.tarifaOdisea,
        porcentajeLogistica: meta.porcentajeLogistica,
        precioProductorCOP: Number(l.precio_pagado_cop) || meta.precioProductorCOP,
        costoTransporteNacionalCOP: meta.costoTransporteNacionalCOP,
        tarifaOdiseaUSD: meta.tarifaOdiseaUSD,
        costoLogisticaExportImportUSD: meta.costoLogisticaExportImportUSD,
        tasaCambioUSD_COP: meta.tasaCambioUSD_COP,
        tasaCambioEUR_USD: meta.tasaCambioEUR_USD,
        monedaVisualizacion: meta.monedaVisualizacion || 'COP',
    };
}

export async function getLotes(): Promise<LoteUnificado[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: profile } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', user.id)
        .single();

    let query = supabase.from('lotes').select('*');

    if (profile && profile.rol === 'AGRICULTOR') {
        query = query.eq('productor_id', user.id);
    }

    const { data, error } = await query;
    if (error) {
        console.error('Error fetching master lotes:', error);
        return [];
    }
    return (data || []).map(mapLoteDbToUnificado);
}

export async function getLotePorId(id: string): Promise<LoteUnificado | undefined> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let query = supabase.from('lotes').select('*');
    if (isUuid) {
        query = query.or(`id.eq.${id},codigo.eq.${id}`);
    } else {
        query = query.eq('codigo', id);
    }
    const { data, error } = await query.single();
    if (error || !data) return undefined;
    return mapLoteDbToUnificado(data);
}

export async function addLote(lote: LoteUnificado): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: fincas } = await supabase
        .from('fincas')
        .select('id')
        .eq('productor_id', user.id);

    const fincaId = fincas?.[0]?.id;
    if (!fincaId) return;

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lote.id);
    const dbId = isUuid ? lote.id : crypto.randomUUID();
    const dbCodigo = isUuid ? `LOT-HUI-${Math.floor(100 + Math.random()*900)}` : lote.id;

    const { error } = await supabase
        .from('lotes')
        .insert({
            id: dbId,
            codigo: dbCodigo,
            finca_id: fincaId,
            productor_id: user.id,
            variedad: lote.variedad || 'Bourbon Rosado',
            proceso: lote.proceso || 'Lavado',
            estado_actual: lote.estado || 'Cereza',
            peso_cereza: lote.pesos.cereza || 0,
            peso_pergamino: lote.pesos.pergamino || 0,
            peso_verde: lote.pesos.verde || 0,
            calificacion_final: lote.calificacion || 0,
            metadata: {
                productor: lote.productor,
                finca: lote.finca,
                municipio: lote.municipio,
                estado: lote.estado,
                almacenamiento: lote.almacenamiento,
                tostadorAsignado: lote.tostadorAsignado,
                tostadorPais: lote.tostadorPais,
                liderAsignado: lote.liderAsignado,
                catadorAsignado: lote.catadorAsignado,
                ofrecidoPorProductor: lote.ofrecidoPorProductor,
                aprobadoComercializacion: lote.aprobadoComercializacion,
                regionesDisponibles: lote.regionesDisponibles,
                historialMovimientos: lote.historialMovimientos,
                estadoJAC: lote.estadoJAC,
                coordenadas: lote.coordenadas,
                areaPoligono: lote.areaPoligono,
                riesgoDeforestacion: lote.riesgoDeforestacion,
                verificadoEUDR: lote.verificadoEUDR,
                pruebasAlistamiento: lote.pruebasAlistamiento,
                precioBaseKgUSD: lote.precioBaseKgUSD,
                tarifaOdisea: lote.tarifaOdisea,
                porcentajeLogistica: lote.porcentajeLogistica,
                precioProductorCOP: lote.precioProductorCOP,
                costoTransporteNacionalCOP: lote.costoTransporteNacionalCOP,
                tarifaOdiseaUSD: lote.tarifaOdiseaUSD,
                costoLogisticaExportImportUSD: lote.costoLogisticaExportImportUSD,
                tasaCambioUSD_COP: lote.tasaCambioUSD_COP,
                tasaCambioEUR_USD: lote.tasaCambioEUR_USD,
                monedaVisualizacion: lote.monedaVisualizacion,
            }
        });

    if (error) {
        console.error('Error adding lote:', error);
    } else {
        await updateValidationStage(lote.id, 'Capturado', 'Sistema (Creación del Lote)', 'Lote registrado desde campo por el productor.');
    }
}

export async function updateLote(id: string, updates: Partial<LoteUnificado>): Promise<void> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let selectQuery = supabase.from('lotes').select('*');
    if (isUuid) {
        selectQuery = selectQuery.or(`id.eq.${id},codigo.eq.${id}`);
    } else {
        selectQuery = selectQuery.eq('codigo', id);
    }
    const { data: currentLote } = await selectQuery.single();

    if (!currentLote) return;

    const mergedMetadata = {
        ...(currentLote.metadata || {}),
        ...(updates.productor ? { productor: updates.productor } : {}),
        ...(updates.finca ? { finca: updates.finca } : {}),
        ...(updates.municipio ? { municipio: updates.municipio } : {}),
        ...(updates.estado ? { estado: updates.estado } : {}),
        ...(updates.almacenamiento ? { almacenamiento: updates.almacenamiento } : {}),
        ...(updates.tostadorAsignado ? { tostadorAsignado: updates.tostadorAsignado } : {}),
        ...(updates.tostadorPais ? { tostadorPais: updates.tostadorPais } : {}),
        ...(updates.liderAsignado ? { liderAsignado: updates.liderAsignado } : {}),
        ...(updates.catadorAsignado ? { catadorAsignado: updates.catadorAsignado } : {}),
        ...(updates.ofrecidoPorProductor !== undefined ? { ofrecidoPorProductor: updates.ofrecidoPorProductor } : {}),
        ...(updates.aprobadoComercializacion !== undefined ? { aprobadoComercializacion: updates.aprobadoComercializacion } : {}),
        ...(updates.regionesDisponibles ? { regionesDisponibles: updates.regionesDisponibles } : {}),
        ...(updates.historialMovimientos ? { historialMovimientos: updates.historialMovimientos } : {}),
        ...(updates.estadoJAC ? { estadoJAC: updates.estadoJAC } : {}),
        ...(updates.coordenadas ? { coordenadas: updates.coordenadas } : {}),
        ...(updates.areaPoligono ? { areaPoligono: updates.areaPoligono } : {}),
        ...(updates.riesgoDeforestacion ? { riesgoDeforestacion: updates.riesgoDeforestacion } : {}),
        ...(updates.verificadoEUDR !== undefined ? { verificadoEUDR: updates.verificadoEUDR } : {}),
        ...(updates.pruebasAlistamiento ? { pruebasAlistamiento: updates.pruebasAlistamiento } : {}),
        ...(updates.precioBaseKgUSD !== undefined ? { precioBaseKgUSD: updates.precioBaseKgUSD } : {}),
        ...(updates.tarifaOdisea !== undefined ? { tarifaOdisea: updates.tarifaOdisea } : {}),
        ...(updates.porcentajeLogistica !== undefined ? { porcentajeLogistica: updates.porcentajeLogistica } : {}),
        ...(updates.precioProductorCOP !== undefined ? { precioProductorCOP: updates.precioProductorCOP } : {}),
        ...(updates.costoTransporteNacionalCOP !== undefined ? { costoTransporteNacionalCOP: updates.costoTransporteNacionalCOP } : {}),
        ...(updates.tarifaOdiseaUSD !== undefined ? { tarifaOdiseaUSD: updates.tarifaOdiseaUSD } : {}),
        ...(updates.costoLogisticaExportImportUSD !== undefined ? { costoLogisticaExportImportUSD: updates.costoLogisticaExportImportUSD } : {}),
        ...(updates.tasaCambioUSD_COP !== undefined ? { tasaCambioUSD_COP: updates.tasaCambioUSD_COP } : {}),
        ...(updates.tasaCambioEUR_USD !== undefined ? { tasaCambioEUR_USD: updates.tasaCambioEUR_USD } : {}),
        ...(updates.monedaVisualizacion ? { monedaVisualizacion: updates.monedaVisualizacion } : {}),
    };

    let updateQuery = supabase.from('lotes').update({
        ...(updates.variedad ? { variedad: updates.variedad } : {}),
        ...(updates.proceso ? { proceso: updates.proceso } : {}),
        ...(updates.estado ? { estado_actual: updates.estado } : {}),
        ...(updates.pesos?.cereza !== undefined ? { peso_cereza: updates.pesos.cereza } : {}),
        ...(updates.pesos?.pergamino !== undefined ? { peso_pergamino: updates.pesos.pergamino } : {}),
        ...(updates.pesos?.verde !== undefined ? { peso_verde: updates.pesos.verde } : {}),
        ...(updates.calificacion !== undefined ? { calificacion_final: updates.calificacion } : {}),
        ...(updates.precioProductorCOP !== undefined ? { precio_pagado_cop: updates.precioProductorCOP } : {}),
        metadata: mergedMetadata
    });

    if (isUuid) {
        updateQuery = updateQuery.or(`id.eq.${id},codigo.eq.${id}`);
    } else {
        updateQuery = updateQuery.eq('codigo', id);
    }

    const { error } = await updateQuery;

    if (error) {
        console.error('Error updating lote:', error);
    }
}

export async function getLotesMarket(): Promise<any[]> {
    return getLotes();
}

export async function getValidationStageForLote(loteId: string): Promise<any> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(loteId);
    let query = supabase.from('lotes').select('id');
    if (isUuid) {
        query = query.or(`id.eq.${loteId},codigo.eq.${loteId}`);
    } else {
        query = query.eq('codigo', loteId);
    }
    const { data: lote } = await query.single();

    if (!lote) {
        return {
            loteId,
            stage: 'Capturado',
            historial: [{ timestamp: new Date().toISOString(), estadoNuevo: 'Capturado', responsable: 'Sistema' }]
        };
    }

    const { data: val } = await supabase
        .from('validaciones')
        .select('*')
        .eq('lote_id', lote.id)
        .single();

    if (!val) {
        return {
            loteId,
            stage: 'Capturado',
            historial: [{ timestamp: new Date().toISOString(), estadoNuevo: 'Capturado', responsable: 'Sistema' }]
        };
    }

    return {
        loteId,
        stage: val.estado_lote,
        historial: val.historial || []
    };
}

export async function updateValidationStage(loteId: string, nextStage: any, responsable: string, motivo?: string): Promise<void> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(loteId);
    let query = supabase.from('lotes').select('id');
    if (isUuid) {
        query = query.or(`id.eq.${loteId},codigo.eq.${loteId}`);
    } else {
        query = query.eq('codigo', loteId);
    }
    const { data: lote } = await query.single();

    if (!lote) return;

    const { data: val } = await supabase
        .from('validaciones')
        .select('*')
        .eq('lote_id', lote.id)
        .single();

    const timestamp = new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    const nuevoLog = {
        timestamp,
        estadoAnterior: val?.estado_lote || 'Capturado',
        estadoNuevo: nextStage,
        responsable,
        motivo: motivo || ''
    };
    const historialActualizado = val?.historial ? [...val.historial, nuevoLog] : [nuevoLog];

    await supabase
        .from('validaciones')
        .upsert({
            lote_id: lote.id,
            estado_lote: nextStage,
            motivo_rechazo: nextStage === 'Rechazado' ? motivo : null,
            historial: historialActualizado,
            fecha_auditoria: new Date().toISOString()
        }, { onConflict: 'lote_id' });
}

export async function isLotePublicado(loteId: string): Promise<boolean> {
    const stage = await getValidationStageForLote(loteId);
    return stage.stage === 'Publicado';
}

