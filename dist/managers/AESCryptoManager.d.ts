import type { DOMElements, AESConfig } from '../types/index.js';
import { CryptoUtils } from '../utils/CryptoUtils.js';
import { AESCrypto } from '../crypto/AESCrypto.js';
import { UIManager } from '../ui/UIManager.js';
/**
 * Gerenciador principal da aplicação de criptografia AES
 * Orquestra a interação entre UI, criptografia e validação
 */
export declare class AESCryptoManager {
    private readonly cryptoUtils;
    private readonly aesCrypto;
    private readonly uiManager;
    /**
     * Cria uma nova instância do AESCryptoManager
     * @param elements Elementos DOM para gerenciamento
     * @param config Configurações AES (opcional)
     */
    constructor(elements: DOMElements, config?: AESConfig);
    /**
     * Inicializa todos os event listeners da aplicação
     */
    private initializeEventListeners;
    /**
     * Manipula a geração de nova chave e IV
     */
    private handleGenerateKey;
    /**
     * Manipula o processo de encriptação
     */
    private handleEncrypt;
    /**
     * Manipula o processo de decriptação
     */
    private handleDecrypt;
    /**
     * Obtém e valida os inputs da interface
     * @returns Inputs validados
     * @throws Error se os inputs forem inválidos
     */
    private getValidatedInputs;
    /**
     * Limpa todos os campos da aplicação
     */
    clearAll(): void;
    /**
     * Gera uma nova chave programaticamente
     * @returns Objeto com a nova chave e IV gerados
     */
    generateNewKey(): {
        key: string;
        iv: string;
    };
    /**
     * Encripta dados programaticamente
     * @param plainText Texto a ser encriptado
     * @param keyHex Chave em hexadecimal (opcional, usa a da UI se não fornecida)
     * @param ivHex IV em hexadecimal (opcional, usa o da UI se não fornecido)
     * @returns Promise com dados encriptados
     */
    encryptData(plainText: string, keyHex?: string, ivHex?: string): Promise<string>;
    /**
     * Decripta dados programaticamente
     * @param encryptedHex Dados encriptados em hexadecimal
     * @param keyHex Chave em hexadecimal (opcional, usa a da UI se não fornecida)
     * @param ivHex IV em hexadecimal (opcional, usa o da UI se não fornecido)
     * @returns Promise com dados decriptados
     */
    decryptData(encryptedHex: string, keyHex?: string, ivHex?: string): Promise<string>;
    /**
     * Importa uma chave e IV específicos
     * @param keyHex Chave em hexadecimal
     * @param ivHex IV em hexadecimal
     */
    importKey(keyHex: string, ivHex: string): void;
    /**
     * Exporta a chave e IV atuais
     * @returns Objeto com chave e IV ou null se não disponíveis
     */
    exportKey(): {
        key: string;
        iv: string;
    } | null;
    /**
     * Obtém informações sobre a configuração atual
     * @returns Configurações AES atuais
     */
    getConfig(): Readonly<AESConfig>;
    /**
     * Obtém referência ao gerenciador de UI
     * @returns Instância do UIManager
     */
    getUIManager(): UIManager;
    /**
     * Obtém referência ao utilitário de criptografia
     * @returns Instância do CryptoUtils
     */
    getCryptoUtils(): CryptoUtils;
    /**
     * Obtém referência ao motor de criptografia AES
     * @returns Instância do AESCrypto
     */
    getAESCrypto(): AESCrypto;
}
//# sourceMappingURL=AESCryptoManager.d.ts.map