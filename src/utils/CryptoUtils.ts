import type { CryptoUtilities } from '../types/index.js';

/**
 * Utilitários para operações de criptografia
 * Fornece funções auxiliares para conversão e validação de dados criptográficos
 */
export class CryptoUtils implements CryptoUtilities {
    /**
     * Valida se uma string é um hexadecimal válido
     * @param hex String a ser validada
     * @returns true se for um hex válido, false caso contrário
     */
    public isValidHex(hex: string): boolean {
        const hexRegex = /^[0-9A-Fa-f]+$/;
        return hexRegex.test(hex.trim());
    }

    /**
     * Converte string hexadecimal para Uint8Array
     * @param hexString String hexadecimal a ser convertida
     * @returns Uint8Array resultante
     * @throws Error se o hex for inválido
     */
    public hexToUint8Array(hexString: string): Uint8Array {
        const cleanHex = hexString.trim();
        
        if (!this.isValidHex(cleanHex)) {
            throw new Error('String hexadecimal inválida');
        }

        // Garantir que o hex tem um número par de caracteres
        const normalizedHex = cleanHex.length % 2 === 0 ? cleanHex : '0' + cleanHex;
        
        const result = new Uint8Array(normalizedHex.length / 2);
        
        for (let i = 0; i < normalizedHex.length; i += 2) {
            result[i / 2] = parseInt(normalizedHex.substr(i, 2), 16);
        }
        
        return result;
    }

    /**
     * Converte Uint8Array para string hexadecimal
     * @param array Array a ser convertido
     * @returns String hexadecimal resultante
     */
    public uint8ArrayToHex(array: Uint8Array): string {
        return Array.from(array)
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }

    /**
     * Converte texto para ArrayBuffer usando TextEncoder
     * @param text Texto a ser convertido
     * @returns ArrayBuffer resultante
     */
    public textToArrayBuffer(text: string): ArrayBuffer {
        const encoder = new TextEncoder();
        return encoder.encode(text).buffer;
    }

    /**
     * Converte ArrayBuffer para texto usando TextDecoder
     * @param buffer ArrayBuffer a ser convertido
     * @returns Texto resultante
     */
    public arrayBufferToText(buffer: ArrayBuffer): string {
        const decoder = new TextDecoder();
        return decoder.decode(new Uint8Array(buffer));
    }

    /**
     * Gera uma chave AES aleatória
     * @param length Tamanho da chave em bytes (16, 24 ou 32)
     * @returns String hexadecimal da chave gerada
     */
    public generateRandomKey(length: number = 16): string {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return this.uint8ArrayToHex(array);
    }

    /**
     * Gera um IV (Initialization Vector) aleatório
     * @param length Tamanho do IV em bytes (padrão 16 para AES)
     * @returns String hexadecimal do IV gerado
     */
    public generateRandomIV(length: number = 16): string {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return this.uint8ArrayToHex(array);
    }

    /**
     * Valida o tamanho de uma chave AES
     * @param keyHex Chave em formato hexadecimal
     * @returns true se o tamanho for válido (128, 192 ou 256 bits)
     */
    public isValidKeySize(keyHex: string): boolean {
        const keyBytes = keyHex.length / 2;
        return keyBytes === 16 || keyBytes === 24 || keyBytes === 32;
    }

    /**
     * Valida o tamanho de um IV
     * @param ivHex IV em formato hexadecimal
     * @param expectedLength Tamanho esperado em bytes (padrão 16)
     * @returns true se o tamanho for válido
     */
    public isValidIVSize(ivHex: string, expectedLength: number = 16): boolean {
        const ivBytes = ivHex.length / 2;
        return ivBytes === expectedLength;
    }
}
