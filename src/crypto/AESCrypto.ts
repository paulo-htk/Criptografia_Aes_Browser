import type { AESConfig, EncryptionResult, CryptoOperation } from '../types/index.js';
import { CryptoUtils } from '../utils/CryptoUtils.js';

/**
 * Classe responsável pelas operações de criptografia AES
 * Implementa encriptação e decriptação usando Web Crypto API
 */
export class AESCrypto {
    private readonly config: AESConfig;
    private readonly cryptoUtils: CryptoUtils;

    /**
     * Cria uma nova instância do AESCrypto
     * @param config Configurações para operações AES
     */
    constructor(config: AESConfig = {
        algorithm: 'AES-CBC',
        keyLength: 128,
        ivLength: 16
    }) {
        this.config = config;
        this.cryptoUtils = new CryptoUtils();
    }

    /**
     * Cria uma chave criptográfica a partir de dados binários
     * @param keyData Dados da chave em Uint8Array
     * @returns Promise com a chave criptográfica
     */
    private async createCryptoKey(keyData: Uint8Array): Promise<CryptoKey> {
        // Garantir que temos um ArrayBuffer puro
        const buffer = new ArrayBuffer(keyData.length);
        const view = new Uint8Array(buffer);
        view.set(keyData);
        
        return await crypto.subtle.importKey(
            'raw',
            buffer,
            { name: this.config.algorithm },
            false,
            ['encrypt', 'decrypt']
        );
    }

    /**
     * Valida os parâmetros de entrada para operações criptográficas
     * @param keyHex Chave em formato hexadecimal
     * @param ivHex IV em formato hexadecimal
     * @param operation Tipo de operação (encrypt/decrypt)
     * @throws Error se os parâmetros forem inválidos
     */
    private validateParameters(keyHex: string, ivHex: string, operation: CryptoOperation): void {
        if (!keyHex || !ivHex) {
            throw new Error(`Para ${operation === 'encrypt' ? 'encriptar' : 'decriptar'}, forneça uma chave e IV válidos.`);
        }

        if (!this.cryptoUtils.isValidHex(keyHex)) {
            throw new Error('Chave deve ser uma string hexadecimal válida.');
        }

        if (!this.cryptoUtils.isValidHex(ivHex)) {
            throw new Error('IV deve ser uma string hexadecimal válida.');
        }

        if (!this.cryptoUtils.isValidKeySize(keyHex)) {
            throw new Error('Chave deve ter 128, 192 ou 256 bits (16, 24 ou 32 bytes).');
        }

        if (!this.cryptoUtils.isValidIVSize(ivHex, this.config.ivLength)) {
            throw new Error(`IV deve ter ${this.config.ivLength} bytes (${this.config.ivLength * 2} caracteres hex).`);
        }
    }

    /**
     * Encripta dados usando AES
     * @param plainText Texto a ser encriptado
     * @param keyHex Chave em formato hexadecimal
     * @param ivHex IV em formato hexadecimal
     * @returns Promise com os dados encriptados em formato hexadecimal
     */
    public async encrypt(plainText: string, keyHex: string, ivHex: string): Promise<string> {
        try {
            this.validateParameters(keyHex, ivHex, 'encrypt');

            if (!plainText) {
                throw new Error('Texto para encriptação não pode estar vazio.');
            }

            const keyData = this.cryptoUtils.hexToUint8Array(keyHex);
            const ivData = this.cryptoUtils.hexToUint8Array(ivHex);
            const plainTextBuffer = this.cryptoUtils.textToArrayBuffer(plainText);

            const cryptoKey = await this.createCryptoKey(keyData);

            // Garantir que ivData é um Uint8Array com ArrayBuffer puro
            const ivBuffer = new Uint8Array(ivData);

            const encryptedBuffer = await crypto.subtle.encrypt(
                {
                    name: this.config.algorithm,
                    iv: ivBuffer
                },
                cryptoKey,
                plainTextBuffer
            );

            return this.cryptoUtils.uint8ArrayToHex(new Uint8Array(encryptedBuffer));

        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erro na encriptação: ${error.message}`);
            }
            throw new Error('Erro desconhecido na encriptação');
        }
    }

    /**
     * Decripta dados usando AES
     * @param encryptedHex Dados encriptados em formato hexadecimal
     * @param keyHex Chave em formato hexadecimal
     * @param ivHex IV em formato hexadecimal
     * @returns Promise com o texto decriptado
     */
    public async decrypt(encryptedHex: string, keyHex: string, ivHex: string): Promise<string> {
        try {
            this.validateParameters(keyHex, ivHex, 'decrypt');

            if (!encryptedHex) {
                throw new Error('Dados para decriptação não podem estar vazios.');
            }

            if (!this.cryptoUtils.isValidHex(encryptedHex)) {
                throw new Error('Dados encriptados devem ser uma string hexadecimal válida.');
            }

            const keyData = this.cryptoUtils.hexToUint8Array(keyHex);
            const ivData = this.cryptoUtils.hexToUint8Array(ivHex);
            const encryptedData = this.cryptoUtils.hexToUint8Array(encryptedHex);

            const cryptoKey = await this.createCryptoKey(keyData);

            // Garantir que ivData é um Uint8Array com ArrayBuffer puro
            const ivBuffer = new Uint8Array(ivData);
            
            // Garantir que encryptedData é um ArrayBuffer puro
            const encryptedBuffer = new ArrayBuffer(encryptedData.length);
            const encryptedView = new Uint8Array(encryptedBuffer);
            encryptedView.set(encryptedData);

            const decryptedBuffer = await crypto.subtle.decrypt(
                {
                    name: this.config.algorithm,
                    iv: ivBuffer
                },
                cryptoKey,
                encryptedBuffer
            );

            return this.cryptoUtils.arrayBufferToText(decryptedBuffer);

        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erro na decriptação: ${error.message}`);
            }
            throw new Error('Erro desconhecido na decriptação');
        }
    }

    /**
     * Gera uma nova chave e IV aleatórios
     * @returns Objeto com chave e IV gerados
     */
    public generateKeyAndIV(): { key: string; iv: string } {
        const keyLength = this.config.keyLength / 8; // Converter bits para bytes
        return {
            key: this.cryptoUtils.generateRandomKey(keyLength),
            iv: this.cryptoUtils.generateRandomIV(this.config.ivLength)
        };
    }

    /**
     * Obter configurações atuais
     * @returns Configurações AES atuais
     */
    public getConfig(): Readonly<AESConfig> {
        return { ...this.config };
    }

    /**
     * Encripta dados retornando resultado completo com IV
     * @param plainText Texto a ser encriptado
     * @param keyHex Chave em formato hexadecimal
     * @param ivHex IV em formato hexadecimal (opcional, será gerado se não fornecido)
     * @returns Promise com resultado da encriptação
     */
    public async encryptWithResult(plainText: string, keyHex: string, ivHex?: string): Promise<EncryptionResult> {
        const actualIV = ivHex || this.cryptoUtils.generateRandomIV(this.config.ivLength);
        const encryptedHex = await this.encrypt(plainText, keyHex, actualIV);
        
        return {
            encryptedData: new Uint8Array(this.cryptoUtils.hexToUint8Array(encryptedHex)).buffer,
            iv: this.cryptoUtils.hexToUint8Array(actualIV)
        };
    }
}
