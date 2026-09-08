import { useCallback, useState } from 'react';

export interface PosicionCapturada {
    lat: number;
    lng: number;
    precisionMetros: number;
    fechaISO: string;
}

interface GeolocationState {
    posicion: PosicionCapturada | null;
    capturando: boolean;
    error: string | null;
}

/**
 * Captura la ubicación del lote usando el GPS del celular.
 *
 * Funciona SIN señal de datos: el chip GPS del teléfono no necesita internet
 * para dar coordenadas (lo que no carga offline es el mapa de fondo, no el punto).
 * Requiere HTTPS o localhost y que la productora acepte el permiso de ubicación.
 */
export function useGeolocation() {
    const [state, setState] = useState<GeolocationState>({
        posicion: null,
        capturando: false,
        error: null,
    });

    const capturar = useCallback(() => {
        if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
            setState((s) => ({ ...s, error: 'Este dispositivo no permite capturar ubicación.' }));
            return;
        }

        setState((s) => ({ ...s, capturando: true, error: null }));

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setState({
                    capturando: false,
                    error: null,
                    posicion: {
                        lat: Number(pos.coords.latitude.toFixed(6)),
                        lng: Number(pos.coords.longitude.toFixed(6)),
                        precisionMetros: Math.round(pos.coords.accuracy),
                        fechaISO: new Date().toISOString(),
                    },
                });
            },
            (err) => {
                const mensajes: Record<number, string> = {
                    1: 'Necesitamos tu permiso para usar la ubicación. Actívalo en los ajustes del celular.',
                    2: 'No pudimos encontrar tu ubicación. Sal a un lugar abierto e intenta de nuevo.',
                    3: 'La ubicación tardó demasiado. Intenta otra vez.',
                };
                setState({
                    posicion: null,
                    capturando: false,
                    error: mensajes[err.code] ?? 'No se pudo capturar la ubicación.',
                });
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
        );
    }, []);

    const limpiar = useCallback(() => {
        setState({ posicion: null, capturando: false, error: null });
    }, []);

    const fijarManual = useCallback((lat: number, lng: number) => {
        setState({
            capturando: false,
            error: null,
            posicion: {
                lat,
                lng,
                precisionMetros: 0,
                fechaISO: new Date().toISOString(),
            },
        });
    }, []);

    return { ...state, capturar, limpiar, fijarManual };
}
