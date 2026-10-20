import React from 'react';
import { AlertCircle, CheckCircle2, Smartphone, Mail } from 'lucide-react';

/**
 * Hace vibrar el dispositivo móvil cuando falta un campo o hay un error.
 * Funciona en navegadores Android/Chrome; en iOS o PC se ignora sin error.
 */
export function vibrarError(): void {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([90, 45, 90]);
    }
  } catch {}
}

/**
 * Hace vibrar suavemente cuando algo queda bien completado.
 */
export function vibrarExito(): void {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(35);
    }
  } catch {}
}

/**
 * Hace scroll suave hacia un elemento por su ID o selector para que no quede oculto por el teclado.
 */
export function enfocarCampoConError(idOrSelector: string): void {
  try {
    const el =
      document.getElementById(idOrSelector) ||
      document.querySelector(idOrSelector);
    if (el && 'scrollIntoView' in el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if ('focus' in el && typeof (el as HTMLElement).focus === 'function') {
        setTimeout(() => {
          try {
            (el as HTMLElement).focus({ preventScroll: true });
          } catch {}
        }, 250);
      }
    }
  } catch {}
}

/**
 * Analiza en vivo un campo donde el usuario puede escribir un número de celular (10 dígitos) o correo.
 */
export interface EstadoContacto {
  modo: 'vacio' | 'celular' | 'correo';
  digitos: number;
  faltan: number;
  sobran: number;
  valido: boolean;
  mensaje: string;
  color: 'neutro' | 'ambar' | 'rojo' | 'verde';
}

export function analizarCelularOCorreo(valor: string): EstadoContacto {
  const limpio = valor.trim();
  if (!limpio) {
    return {
      modo: 'vacio',
      digitos: 0,
      faltan: 10,
      sobran: 0,
      valido: false,
      mensaje: '',
      color: 'neutro',
    };
  }

  // Si contiene letras o arroba, tratar como correo electrónico
  const tieneLetrasOArroba = /[a-zA-Z@]/.test(limpio);
  if (tieneLetrasOArroba) {
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio);
    if (correoValido) {
      return {
        modo: 'correo',
        digitos: 0,
        faltan: 0,
        sobran: 0,
        valido: true,
        mensaje: '¡Correo electrónico completo y bien escrito!',
        color: 'verde',
      };
    }
    if (!limpio.includes('@')) {
      return {
        modo: 'correo',
        digitos: 0,
        faltan: 0,
        sobran: 0,
        valido: false,
        mensaje: 'Si es un correo, recuerda poner el símbolo @ (ej: nombre@gmail.com)',
        color: 'ambar',
      };
    }
    return {
      modo: 'correo',
      digitos: 0,
      faltan: 0,
      sobran: 0,
      valido: false,
      mensaje: 'Termina de escribir el correo (ej: .com o .co)',
      color: 'ambar',
    };
  }

  // Es un número de celular
  let soloNumeros = limpio.replace(/\D/g, '');
  // Si pegó con +57 adelante (12 dígitos empezando por 573)
  if (soloNumeros.length === 12 && soloNumeros.startsWith('573')) {
    soloNumeros = soloNumeros.slice(2);
  }

  const digitos = soloNumeros.length;

  if (digitos < 10) {
    const faltan = 10 - digitos;
    return {
      modo: 'celular',
      digitos,
      faltan,
      sobran: 0,
      valido: false,
      mensaje:
        faltan === 1
          ? `Llevas ${digitos} números. ¡Solo te falta 1 número más!`
          : `Llevas ${digitos} ${digitos === 1 ? 'número' : 'números'}. Te faltan ${faltan} para completar los 10.`,
      color: 'ambar',
    };
  }

  if (digitos === 10) {
    return {
      modo: 'celular',
      digitos: 10,
      faltan: 0,
      sobran: 0,
      valido: true,
      mensaje: '¡Así está muy bien! Ya están los 10 números de tu celular.',
      color: 'verde',
    };
  }

  const sobran = digitos - 10;
  return {
    modo: 'celular',
    digitos,
    faltan: 0,
    sobran,
    valido: false,
    mensaje: `Pusiste ${digitos} números (sobran ${sobran}). Un celular en Colombia tiene 10 números.`,
    color: 'rojo',
  };
}

/**
 * Convierte una cifra en pesos colombianos a una lectura clara y humana
 * para evitar errores de ceros en el campo.
 */
export function describirMontoEnPalabras(montoStrOrNum: string | number): string {
  const n = typeof montoStrOrNum === 'number' ? montoStrOrNum : Number(String(montoStrOrNum).replace(/\D/g, ''));
  if (!n || isNaN(n) || n <= 0) return '';

  if (n < 1000) {
    return `${n} pesos (¿seguro que no te faltan ceros?)`;
  }

  const millones = Math.floor(n / 1_000_000);
  const restoMillones = n % 1_000_000;
  const miles = Math.floor(restoMillones / 1000);
  const pesos = restoMillones % 1000;

  const partes: string[] = [];

  if (millones > 0) {
    partes.push(millones === 1 ? '1 millón' : `${millones.toLocaleString('es-CO')} millones`);
  }
  if (miles > 0) {
    partes.push(miles === 1 ? 'mil' : `${miles.toLocaleString('es-CO')} mil`);
  }
  if (pesos > 0) {
    partes.push(`${pesos}`);
  }

  return `Estás anotando: ${partes.join(' ')} de pesos`;
}

/**
 * Convierte kilos de café a su equivalente aproximado en arrobas (1 arroba = 12.5 kg) y bultos.
 */
export function describirKilosCafe(kilosStrOrNum: string | number): string {
  const k = typeof kilosStrOrNum === 'number' ? kilosStrOrNum : parseFloat(String(kilosStrOrNum));
  if (!k || isNaN(k) || k <= 0) return '';

  const arrobas = k / 12.5;
  const arrobasTxt = Number.isInteger(arrobas) ? String(arrobas) : arrobas.toFixed(1);

  if (k >= 50) {
    const bultos = (k / 62.5).toFixed(1);
    return `${k.toLocaleString('es-CO')} kilos (aprox. ${arrobasTxt} arrobas / ${bultos} bultos)`;
  }
  return `${k.toLocaleString('es-CO')} kilos (aprox. ${arrobasTxt} ${Number(arrobasTxt) === 1 ? 'arroba' : 'arrobas'})`;
}

/**
 * Componente visual para mostrar el mensaje de error debajo de un campo obligatorio.
 */
export function MensajeErrorCampo({ mensaje }: { mensaje?: string | null }) {
  if (!mensaje) return null;
  return (
    <div className="mt-1.5 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-[13px] font-extrabold text-red-700 animate-fade-in">
      <AlertCircle size={16} className="shrink-0 text-red-600" />
      <span>{mensaje}</span>
    </div>
  );
}

/**
 * Componente visual que muestra en tiempo real cuántos números de celular lleva el usuario.
 */
export function AsistenteCelular({ valor }: { valor: string }) {
  const estado = analizarCelularOCorreo(valor);
  if (estado.modo === 'vacio') return null;

  const estilos = {
    neutro: 'bg-gray-50 border-gray-200 text-gray-700',
    ambar: 'bg-amber-50 border-amber-300 text-amber-900',
    rojo: 'bg-red-50 border-red-300 text-red-800',
    verde: 'bg-emerald-50 border-emerald-300 text-emerald-900',
  }[estado.color];

  return (
    <div className={`mt-2 flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-[13px] font-extrabold transition-all ${estilos}`}>
      {estado.color === 'verde' ? (
        <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
      ) : estado.modo === 'correo' ? (
        <Mail size={18} className="shrink-0 text-amber-600" />
      ) : (
        <Smartphone size={18} className={estado.color === 'rojo' ? 'shrink-0 text-red-600' : 'shrink-0 text-amber-600'} />
      )}
      <div className="flex-1 leading-snug">
        <span>{estado.mensaje}</span>
        {estado.modo === 'celular' && (
          <div className="mt-1.5 flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i < estado.digitos
                    ? estado.color === 'verde'
                      ? 'bg-emerald-600'
                      : estado.color === 'rojo'
                      ? 'bg-red-500'
                      : 'bg-amber-500'
                    : 'bg-black/10'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
