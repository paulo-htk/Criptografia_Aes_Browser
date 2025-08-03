import { CryptoUtils } from '../utils/CryptoUtils.js';
import { AESCrypto } from '../crypto/AESCrypto.js';
import { UIManager } from '../ui/UIManager.js';
/**
 * Gerenciador principal da aplicação de criptografia AES
 * Orquestra a interação entre UI, criptografia e validação
 */
export class AESCryptoManager {
    /**
     * Cria uma nova instância do AESCryptoManager
     * @param elements Elementos DOM para gerenciamento
     * @param config Configurações AES (opcional)
     */
    constructor(elements, config) {
        this.cryptoUtils = new CryptoUtils();
        this.aesCrypto = new AESCrypto(config);
        this.uiManager = new UIManager(elements);
        this.initializeEventListeners();
    }
    /**
     * Inicializa todos os event listeners da aplicação
     */
    initializeEventListeners() {
        // Gerar nova chave e IV
        this.uiManager.addEventListener('generateKey', 'click', () => {
            this.handleGenerateKey();
        });
        // Encriptar dados
        this.uiManager.addEventListener('encryptButton', 'click', () => {
            this.handleEncrypt();
        });
        // Decriptar dados
        this.uiManager.addEventListener('decryptButton', 'click', () => {
            this.handleDecrypt();
        });
    }
    /**
     * Manipula a geração de nova chave e IV
     */
    handleGenerateKey() {
        try {
            const { key, iv } = this.aesCrypto.generateKeyAndIV();
            this.uiManager.updateOutputValues({
                aesKey: key,
                iv: iv
            });
            this.uiManager.showSuccess('Nova chave AES e IV gerados com sucesso!');
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erro desconhecido ao gerar chave';
            this.uiManager.showError(`Erro ao gerar chave: ${message}`);
        }
    }
    /**
     * Manipula o processo de encriptação
     */
    async handleEncrypt() {
        try {
            const inputs = this.getValidatedInputs();
            if (!inputs.encryptData) {
                this.uiManager.showError('Digite o texto a ser encriptado.');
                return;
            }
            this.uiManager.showInfo('Encriptando dados...');
            const encryptedData = await this.aesCrypto.encrypt(inputs.encryptData, inputs.keyHex, inputs.ivHex);
            this.uiManager.updateOutputValues({
                encryptedOutput: encryptedData
            });
            this.uiManager.showSuccess('Dados encriptados com sucesso!');
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erro desconhecido na encriptação';
            this.uiManager.showError(message);
        }
    }
    /**
     * Manipula o processo de decriptação
     */
    async handleDecrypt() {
        try {
            const inputs = this.getValidatedInputs();
            if (!inputs.decryptData) {
                this.uiManager.showError('Digite os dados a serem decriptados.');
                return;
            }
            this.uiManager.showInfo('Decriptando dados...');
            const decryptedData = await this.aesCrypto.decrypt(inputs.decryptData, inputs.keyHex, inputs.ivHex);
            this.uiManager.updateOutputValues({
                decryptedOutput: decryptedData
            });
            this.uiManager.showSuccess('Dados decriptados com sucesso!');
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erro desconhecido na decriptação';
            this.uiManager.showError(message);
        }
    }
    /**
     * Obtém e valida os inputs da interface
     * @returns Inputs validados
     * @throws Error se os inputs forem inválidos
     */
    getValidatedInputs() {
        const inputs = this.uiManager.getInputValues();
        // Mapear para o formato esperado
        const cryptoInputs = {
            keyHex: inputs.keyHex,
            ivHex: inputs.ivHex,
            encryptData: inputs.encryptData,
            decryptData: inputs.decryptData
        };
        // Validações básicas
        if (!cryptoInputs.keyHex || !cryptoInputs.ivHex) {
            throw new Error('Chave AES e IV são obrigatórios. Use "Gerar Chaves" se necessário.');
        }
        return cryptoInputs;
    }
    /**
     * Limpa todos os campos da aplicação
     */
    clearAll() {
        this.uiManager.clearAllInputs();
        this.uiManager.clearAllMessages();
        this.uiManager.showInfo('Todos os campos foram limpos.');
    }
    /**
     * Gera uma nova chave programaticamente
     * @returns Objeto com a nova chave e IV gerados
     */
    generateNewKey() {
        return this.aesCrypto.generateKeyAndIV();
    }
    /**
     * Encripta dados programaticamente
     * @param plainText Texto a ser encriptado
     * @param keyHex Chave em hexadecimal (opcional, usa a da UI se não fornecida)
     * @param ivHex IV em hexadecimal (opcional, usa o da UI se não fornecido)
     * @returns Promise com dados encriptados
     */
    async encryptData(plainText, keyHex, ivHex) {
        const inputs = this.uiManager.getInputValues();
        const finalKeyHex = keyHex || inputs.keyHex;
        const finalIvHex = ivHex || inputs.ivHex;
        if (!finalKeyHex || !finalIvHex) {
            throw new Error('Chave e IV são obrigatórios para encriptação.');
        }
        return await this.aesCrypto.encrypt(plainText, finalKeyHex, finalIvHex);
    }
    /**
     * Decripta dados programaticamente
     * @param encryptedHex Dados encriptados em hexadecimal
     * @param keyHex Chave em hexadecimal (opcional, usa a da UI se não fornecida)
     * @param ivHex IV em hexadecimal (opcional, usa o da UI se não fornecido)
     * @returns Promise com dados decriptados
     */
    async decryptData(encryptedHex, keyHex, ivHex) {
        const inputs = this.uiManager.getInputValues();
        const finalKeyHex = keyHex || inputs.keyHex;
        const finalIvHex = ivHex || inputs.ivHex;
        if (!finalKeyHex || !finalIvHex) {
            throw new Error('Chave e IV são obrigatórios para decriptação.');
        }
        return await this.aesCrypto.decrypt(encryptedHex, finalKeyHex, finalIvHex);
    }
    /**
     * Importa uma chave e IV específicos
     * @param keyHex Chave em hexadecimal
     * @param ivHex IV em hexadecimal
     */
    importKey(keyHex, ivHex) {
        try {
            // Validar antes de importar
            if (!this.cryptoUtils.isValidHex(keyHex) || !this.cryptoUtils.isValidHex(ivHex)) {
                throw new Error('Chave e IV devem ser strings hexadecimais válidas.');
            }
            if (!this.cryptoUtils.isValidKeySize(keyHex)) {
                throw new Error('Chave deve ter 128, 192 ou 256 bits.');
            }
            if (!this.cryptoUtils.isValidIVSize(ivHex)) {
                throw new Error('IV deve ter 128 bits (16 bytes).');
            }
            this.uiManager.updateOutputValues({
                aesKey: keyHex,
                iv: ivHex
            });
            this.uiManager.showSuccess('Chave e IV importados com sucesso!');
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erro desconhecido ao importar chave';
            this.uiManager.showError(`Erro ao importar chave: ${message}`);
        }
    }
    /**
     * Exporta a chave e IV atuais
     * @returns Objeto com chave e IV ou null se não disponíveis
     */
    exportKey() {
        const inputs = this.uiManager.getInputValues();
        if (!inputs.keyHex || !inputs.ivHex) {
            this.uiManager.showWarning('Nenhuma chave disponível para exportação.');
            return null;
        }
        return {
            key: inputs.keyHex,
            iv: inputs.ivHex
        };
    }
    /**
     * Obtém informações sobre a configuração atual
     * @returns Configurações AES atuais
     */
    getConfig() {
        return this.aesCrypto.getConfig();
    }
    /**
     * Obtém referência ao gerenciador de UI
     * @returns Instância do UIManager
     */
    getUIManager() {
        return this.uiManager;
    }
    /**
     * Obtém referência ao utilitário de criptografia
     * @returns Instância do CryptoUtils
     */
    getCryptoUtils() {
        return this.cryptoUtils;
    }
    /**
     * Obtém referência ao motor de criptografia AES
     * @returns Instância do AESCrypto
     */
    getAESCrypto() {
        return this.aesCrypto;
    }
}
//# sourceMappingURL=AESCryptoManager.js.map