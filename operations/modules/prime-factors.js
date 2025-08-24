// =======================================================
// --- operations/modules/prime-factors.js (VERSIÓN FINAL CON COLORES CORREGIDOS) ---
// =======================================================
"use strict";

import { calculateLayout } from '../utils/layout-calculator.js';
import { crearCelda } from '../utils/dom-helpers.js';
import { salida, display } from '../../config.js';
import { ErrorHandler } from '../../error-handler.js';

/**
 * Realiza y visualiza la descomposición en factores primos.
 */
export function desFacPri() {
    salida.innerHTML = "";
    const fragment = document.createDocumentFragment();

    const entrada = display.innerHTML;

    // --- 1. VALIDACIÓN Y CÁLCULO ---
    if (!ErrorHandler.validarFactoresPrimos(salida, entrada)) {
        return;
    }
    
    let numIzda = parseInt(entrada, 10);
    const numIzdaArray = [];
    const numDchaArray = [];

    if (numIzda === 1) {
        numIzdaArray.push(1);
        numDchaArray.push(1);
    } else {
        let tempNum = numIzda;
        let i = 2;
        while (i * i <= tempNum) {
            if (tempNum % i === 0) {
                numIzdaArray.push(tempNum);
                numDchaArray.push(i);
                tempNum /= i;
            } else {
                i++;
            }
        }
        if (tempNum > 1 || numIzdaArray.length === 0) {
            numIzdaArray.push(tempNum);
            numDchaArray.push(tempNum);
        }
    }
    numIzdaArray.push(1);

    // --- 2. CÁLCULO DEL LAYOUT ---
    const maxDigitsIzda = Math.max(...numIzdaArray.map(n => n.toString().length));
    const maxDigitsDcha = Math.max(...numDchaArray.map(n => n.toString().length));
    const separatorWidth = 1;
    const totalCols = maxDigitsIzda + separatorWidth + maxDigitsDcha;
    const numRows = numIzdaArray.length;
    
    const { tamCel, tamFuente, offsetHorizontal, paddingLeft, paddingTop } = calculateLayout(salida, totalCols, numRows);

    // --- 3. LÓGICA DE VISUALIZACIÓN ---

    // Dibujar la columna izquierda (números que se van dividiendo)
    numIzdaArray.forEach((n, idx) => {
        let s = n.toString();
        const xPos = offsetHorizontal + (maxDigitsIzda - s.length) * tamCel + paddingLeft;
        const yPos = paddingTop + idx * tamCel;
        // CORRECCIÓN: Usamos output-grid__cell--dividendo o similar para que tome color
        fragment.appendChild(crearCelda("output-grid__cell output-grid__cell--dividendo", s, { left: `${xPos}px`, top: `${yPos}px`, width: `${s.length * tamCel}px`, height: `${tamCel}px`, fontSize: `${tamFuente}px` }));
    });

    // Dibujar la línea vertical de separación
    const xLineaVertical = offsetHorizontal + maxDigitsIzda * tamCel + (separatorWidth * tamCel / 2) + paddingLeft;
    fragment.appendChild(crearCelda("output-grid__line", "", { left: `${xLineaVertical}px`, top: `${paddingTop}px`, width: `2px`, height: `${numRows * tamCel}px` }));
    
    // Dibujar la columna derecha (factores primos)
    numDchaArray.forEach((n, idx) => {
        let s = n.toString();
        const xPos = offsetHorizontal + (maxDigitsIzda + separatorWidth) * tamCel + paddingLeft;
        const yPos = paddingTop + idx * tamCel;
        // CORRECCIÓN: Usamos output-grid__cell--divisor o similar para que tome color
        fragment.appendChild(crearCelda("output-grid__cell output-grid__cell--divisor", s, { left: `${xPos}px`, top: `${yPos}px`, width: `${s.length * tamCel}px`, height: `${tamCel}px`, fontSize: `${tamFuente}px` }));
    });

    salida.appendChild(fragment);
}