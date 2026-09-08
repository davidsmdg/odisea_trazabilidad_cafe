import { useEffect, useState } from 'react';

/**
 * Estado de conexión del dispositivo. La app funciona sin señal; esto solo
 * sirve para avisarle al productor que sus datos se guardaron en el celular
 * y se sincronizarán cuando vuelva el internet.
 */
export function useOnlineStatus(): boolean {
    const [online, setOnline] = useState(
        typeof navigator !== 'undefined' ? navigator.onLine : true
    );

    useEffect(() => {
        const goOnline = () => setOnline(true);
        const goOffline = () => setOnline(false);
        window.addEventListener('online', goOnline);
        window.addEventListener('offline', goOffline);
        return () => {
            window.removeEventListener('online', goOnline);
            window.removeEventListener('offline', goOffline);
        };
    }, []);

    return online;
}
