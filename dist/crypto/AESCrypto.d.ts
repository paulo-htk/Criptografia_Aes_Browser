import type { AESConfig, EncryptionResult } from '../types/index.js';
/**
 * Classe responsável pelas operações de criptografia AES
 * Implementa encriptação e decriptação usando Web Crypto API
 */
export declare class AESCrypto {
    private readonly config;
    private readonly cryptoUtils;
    /**
     * Cria uma nova instância do AESCrypto
     * @param config Configurações para operações AES
     */
    constructor(config?: AESConfig);
    /**
     * Cria uma chave criptográfica a partir de dados binários
     * @param keyData Dados da chave em Uint8Array
     * @returns Promise com a chave criptográfica
     */
    private createCryptoKey;
    /**
     * Valida os parâmetros de entrada para operações criptográficas
     * @param keyHex Chave em formato hexadecimal
     * @param ivHex IV em formato hexadecimal
     * @param operation Tipo de operação (encrypt/decrypt)
     * @throws Error se os parâmetros forem inválidos
     */
    private validateParameters;
    /**
     * Encripta dados usando AES
     * @param plainText Texto a ser encriptado
     * @param keyHex Chave em formato hexadecimal
     * @param ivHex IV em formato hexadecimal
     * @returns Promise com os dados encriptados em formato hexadecimal
     */
    encrypt(plainText: string, keyHex: string, ivHex: string): Promise<string>;
    /**
     * Decripta dados usando AES
     * @param encryptedHex Dados encriptados em formato hexadecimal
     * @param keyHex Chave em formato hexadecimal
     * @param ivHex IV em formato hexadecimal
     * @returns Promise com o texto decriptado
     */
    decrypt(encryptedHex: string, keyHex: string, ivHex: string): Promise<string>;
    /**
     * Gera uma nova chave e IV aleatórios
     * @returns Objeto com chave e IV gerados
     */
    generateKeyAndIV(): {
        key: string;
        iv: string;
    };
    /**
     * Obter configurações atuais
     * @returns Configurações AES atuais
     */
    getConfig(): Readonly<AESConfig>;
    /**
     * Encripta dados retornando resultado completo com IV
     * @param plainText Texto a ser encriptado
     * @param keyHex Chave em formato hexadecimal
     * @param ivHex IV em formato hexadecimal (opcional, será gerado se não fornecido)
     * @returns Promise com resultado da encriptação
     */
    encryptWithResult(plainText: string, keyHex: string, ivHex?: string): Promise<EncryptionResult>;
}
//# sourceMappingURL=AESCrypto.d.ts.map