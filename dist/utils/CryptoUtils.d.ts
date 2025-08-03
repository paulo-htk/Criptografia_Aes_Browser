import type { CryptoUtilities } from '../types/index.js';
/**
 * Utilitários para operações de criptografia
 * Fornece funções auxiliares para conversão e validação de dados criptográficos
 */
export declare class CryptoUtils implements CryptoUtilities {
    /**
     * Valida se uma string é um hexadecimal válido
     * @param hex String a ser validada
     * @returns true se for um hex válido, false caso contrário
     */
    isValidHex(hex: string): boolean;
    /**
     * Converte string hexadecimal para Uint8Array
     * @param hexString String hexadecimal a ser convertida
     * @returns Uint8Array resultante
     * @throws Error se o hex for inválido
     */
    hexToUint8Array(hexString: string): Uint8Array;
    /**
     * Converte Uint8Array para string hexadecimal
     * @param array Array a ser convertido
     * @returns String hexadecimal resultante
     */
    uint8ArrayToHex(array: Uint8Array): string;
    /**
     * Converte texto para ArrayBuffer usando TextEncoder
     * @param text Texto a ser convertido
     * @returns ArrayBuffer resultante
     */
    textToArrayBuffer(text: string): ArrayBuffer;
    /**
     * Converte ArrayBuffer para texto usando TextDecoder
     * @param buffer ArrayBuffer a ser convertido
     * @returns Texto resultante
     */
    arrayBufferToText(buffer: ArrayBuffer): string;
    /**
     * Gera uma chave AES aleatória
     * @param length Tamanho da chave em bytes (16, 24 ou 32)
     * @returns String hexadecimal da chave gerada
     */
    generateRandomKey(length?: number): string;
    /**
     * Gera um IV (Initialization Vector) aleatório
     * @param length Tamanho do IV em bytes (padrão 16 para AES)
     * @returns String hexadecimal do IV gerado
     */
    generateRandomIV(length?: number): string;
    /**
     * Valida o tamanho de uma chave AES
     * @param keyHex Chave em formato hexadecimal
     * @returns true se o tamanho for válido (128, 192 ou 256 bits)
     */
    isValidKeySize(keyHex: string): boolean;
    /**
     * Valida o tamanho de um IV
     * @param ivHex IV em formato hexadecimal
     * @param expectedLength Tamanho esperado em bytes (padrão 16)
     * @returns true se o tamanho for válido
     */
    isValidIVSize(ivHex: string, expectedLength?: number): boolean;
}
//# sourceMappingURL=CryptoUtils.d.ts.map