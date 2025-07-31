// =======================================================
// --- operations/modules/multiplication.js (VERSIÓN FINALÍSIMA) ---
// =======================================================
"use strict";

import { calculateLayout } from '../utils/layout-calculator.js';
import { crearCelda } from '../utils/dom-helpers.js';
// --- ¡LA LÍNEA QUE FALTABA! ---
import { salida, errorMessages } from '../../config.js';

/**
 * Realiza y visualiza la operación de multiplicación.
 * @param {Array<[string, number]>} numerosAR - Los operandos.
 */
export function multiplica(numerosAR) {
    salida.innerHTML = "";
    const fragment = document.createDocumentFragment();

    const [num1, numDec1] = numerosAR[0];
    const [num2, numDec2] = numerosAR[1];

    if (num1 === "0" || num2 === "0") {
        salida.innerHTML = `<p class="output-screen__error-message">${errorMessages.multiplicacion1}</p>`;
        return;
    }
    const resultadoS = (BigInt(num1) * BigInt(num2)).toString();
    if (resultadoS.length > 20) {
        salida.innerHTML = `<p class="output-screen__error-message">${errorMessages.multiplicacion2}</p>`;
        return;
    }
    
    const totalDecimalesResultado = numDec1 + numDec2;
    let num1Display = num1; if (numDec1 > 0) num1Display = num1.slice(0, num1.length - numDec1) + ',' + num1.slice(num1.length - numDec1);
    let num2Display = num2; if (numDec2 > 0) num2Display = num2.slice(0, num2.length - numDec2) + ',' + num2.slice(num2.length - numDec2);
    
    let resultadoDisplay = resultadoS;
    if (totalDecimalesResultado > 0) {
        if (resultadoDisplay.length <= totalDecimalesResultado) resultadoDisplay = '0'.repeat(totalDecimalesResultado - resultadoDisplay.length + 1) + resultadoDisplay;
        resultadoDisplay = resultadoDisplay.slice(0, resultadoDisplay.length - totalDecimalesResultado) + ',' + resultadoDisplay.slice(resultadoDisplay.length - totalDecimalesResultado);
    }
    if (resultadoDisplay.includes(',')) resultadoDisplay = resultadoDisplay.replace(/0+$/, '').replace(/,$/, '');

    const longestPartialProductLength = num2.length > 1 ? [...num2].reduce((max, d) => Math.max(max, (BigInt(num1) * BigInt(d)).toString().length), 0) : 0;
    const anchuraEnCeldas = Math.max(num1Display.length, num2Display.length + 1, resultadoDisplay.length, longestPartialProductLength + num2.length - 1);
    const alturaEnCeldas = 3 + (num2.length > 1 ? num2.length + 1 : 0);
    
    const { tamCel, tamFuente, offsetHorizontal, paddingLeft, paddingTop } = calculateLayout(salida, anchuraEnCeldas, alturaEnCeldas);
    
    let yPos = paddingTop;

    for (let i = 0; i < num1Display.length; i++) {
        const leftPos = offsetHorizontal + (anchuraEnCeldas - num1Display.length + i) * tamCel + paddingLeft;
        fragment.appendChild(crearCelda("output-grid__cell output-grid__cell--dividendo", num1Display[i], { left: `${leftPos}px`, top: `${yPos}px`, width: `${tamCel}px`, height: `${tamCel}px`, fontSize: `${tamFuente}px` }));
    }
    yPos += tamCel;
    const signLeft = offsetHorizontal + (anchuraEnCeldas - num2Display.length - 1) * tamCel + paddingLeft;
    fragment.appendChild(crearCelda("output-grid__cell output-grid__cell--producto", "x", { left: `${signLeft}px`, top: `${yPos}px`, width: `${tamCel}px`, height: `${tamCel}px`, fontSize: `${tamFuente}px` }));
    for (let i = 0; i < num2Display.length; i++) {
        const leftPos = offsetHorizontal + (anchuraEnCeldas - num2Display.length + i) * tamCel + paddingLeft;
        fragment.appendChild(crearCelda("output-grid__cell output-grid__cell--dividendo", num2Display[i], { left: `${leftPos}px`, top: `${yPos}px`, width: `${tamCel}px`, height: `${tamCel}px`, fontSize: `${tamFuente}px` }));
    }

    yPos += tamCel;
    const line1Left = offsetHorizontal + (anchuraEnCeldas - Math.max(num1Display.length, num2Display.length + 1)) * tamCel + paddingLeft;
    const line1Width = Math.max(num1Display.length, num2Display.length + 1) * tamCel;
    fragment.appendChild(crearCelda("output-grid__line", "", { left: `${line1Left}px`, top: `${yPos}px`, width: `${line1Width}px`, height: `2px` }));
    
    if (num2.length > 1) {
        yPos += tamCel * 0.2;
        for (let i = num2.length - 1; i >= 0; i--) {
            let resultadoFila = (BigInt(num1) * BigInt(num2[i])).toString();
            let colOffset = num2.length - 1 - i;
            
            if (i === 0) {
                const signPlusLeft = offsetHorizontal + (anchuraEnCeldas - resultadoFila.length - colOffset - 1) * tamCel + paddingLeft;
                fragment.appendChild(crearCelda("output-grid__cell output-grid__cell--producto", "+", { left: `${signPlusLeft}px`, top: `${yPos}px`, width: `${tamCel}px`, height: `${tamCel}px`, fontSize: `${tamFuente}px` }));
            }

            for (let j = 0; j < resultadoFila.length; j++) {
                const leftPos = offsetHorizontal + (anchuraEnCeldas - resultadoFila.length - colOffset + j) * tamCel + paddingLeft;
                fragment.appendChild(crearCelda("output-grid__cell output-grid__cell--producto", resultadoFila[j], { left: `${leftPos}px`, top: `${yPos}px`, width: `${tamCel}px`, height: `${tamCel}px`, fontSize: `${tamFuente}px` }));
            }
            yPos += tamCel;
        }
        const finalLineLeft = offsetHorizontal;
        const totalBlockWidth = anchuraEnCeldas * tamCel;
        fragment.appendChild(crearCelda("output-grid__line", "", { left: `${finalLineLeft}px`, top: `${yPos}px`, width: `${totalBlockWidth}px`, height: `2px` }));
    }
    
    yPos += tamCel * 0.2;
    for (let i = 0; i < resultadoDisplay.length; i++) {
        const leftPos = offsetHorizontal + (anchuraEnCeldas - resultadoDisplay.length + i) * tamCel + paddingLeft;
        fragment.appendChild(crearCelda("output-grid__cell output-grid__cell--cociente", resultadoDisplay[i], { left: `${leftPos}px`, top: `${yPos}px`, width: `${tamCel}px`, height: `${tamCel}px`, fontSize: `${tamFuente}px` }));
    }

    salida.appendChild(fragment);
}