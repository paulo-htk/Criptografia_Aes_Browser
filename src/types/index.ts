/**
 * Tipos e interfaces para o sistema de criptografia AES
 */

/**
 * Tipos de mensagens suportados pelo sistema
 */
export type MessageType = 'info' | 'success' | 'error' | 'warning';

/**
 * Configurações para tooltips
 */
export interface TooltipConfig {
    /** Classe CSS base para tooltips */
    baseClass: string;
    /** Delay para mostrar o tooltip (ms) */
    showDelay: number;
    /** Delay para esconder o tooltip (ms) */
    hideDelay: number;
    /** Posição preferida do tooltip */
    position: 'top' | 'bottom' | 'left' | 'right' | 'auto';
    /** Offset do tooltip em pixels */
    offset: number;
    /** Se permite HTML no conteúdo */
    allowHtml: boolean;
}

/**
 * Interface para gerenciadores de tooltip
 */
export interface TooltipManager {
    /** Inicializa tooltips em elementos */
    initializeTooltips(elements: NodeListOf<Element> | Element[]): void;
    /** Mostra tooltip em elemento específico */
    showTooltip(element: Element, content: string, position?: string): void;
    /** Esconde tooltip */
    hideTooltip(): void;
    /** Remove todos os tooltips */
    destroyTooltips(): void;
}

/**
 * Configurações para o sistema de mensagens
 */
export interface MessageConfig {
    /** Duração base da mensagem em milissegundos */
    baseDuration: number;
    /** Fator multiplicador baseado no tamanho da mensagem */
    durationFactor: number;
    /** Tempo de transição para efeitos de fade */
    fadeTimeout: number;
}

/**
 * Dados de entrada para operações de criptografia
 */
export interface CryptoInputs {
    /** Chave AES em formato hexadecimal */
    keyHex: string;
    /** Vetor de inicialização em formato hexadecimal */
    ivHex: string;
    /** Dados para encriptação */
    encryptData: string;
    /** Dados para decriptação */
    decryptData: string;
}

/**
 * Valores de saída para atualização da interface
 */
export interface OutputValues {
    /** Chave AES gerada */
    aesKey?: string;
    /** IV gerado */
    iv?: string;
    /** Resultado da encriptação */
    encryptedOutput?: string;
    /** Resultado da decriptação */
    decryptedOutput?: string;
    /** Outros valores dinâmicos */
    [key: string]: string | undefined;
}

/**
 * Resultado de uma operação de criptografia
 */
export interface EncryptionResult {
    /** Dados criptografados */
    encryptedData: ArrayBuffer;
    /** Vetor de inicialização usado */
    iv: Uint8Array;
}

/**
 * Algoritmos de criptografia suportados
 */
export type CryptoAlgorithm = 'AES-CBC' | 'AES-GCM' | 'AES-CTR';

/**
 * Tamanhos de chave suportados
 */
export type KeyLength = 128 | 192 | 256;

/**
 * Operações criptográficas permitidas
 */
export type CryptoOperation = 'encrypt' | 'decrypt';

/**
 * Configurações para operações de criptografia AES
 */
export interface AESConfig {
    /** Algoritmo a ser usado */
    algorithm: CryptoAlgorithm;
    /** Tamanho da chave em bits */
    keyLength: KeyLength;
    /** Tamanho do IV em bytes */
    ivLength: number;
}

/**
 * Elementos DOM gerenciados pela interface
 */
export interface DOMElements {
    /** Botão para gerar chave */
    generateKey: HTMLElement;
    /** Botão para encriptar */
    encryptButton: HTMLElement;
    /** Botão para decriptar */
    decryptButton: HTMLElement;
    /** Campo da chave AES */
    aesKey: HTMLInputElement;
    /** Campo do IV */
    iv: HTMLInputElement;
    /** Campo de entrada para encriptação */
    encryptInput: HTMLElement;
    /** Campo de entrada para decriptação */
    decryptInput: HTMLElement;
    /** Elemento para exibir relatórios/mensagens */
    report: HTMLElement;
}

/**
 * Interface para gerenciadores de mensagens
 */
export interface MessageManager {
    /** Adiciona uma nova mensagem */
    addMessage(message: string, type?: MessageType): string;
    /** Remove uma mensagem específica */
    removeMessage(messageId: string): void;
    /** Exibe mensagem de erro */
    showError(message: string): void;
    /** Exibe mensagem de sucesso */
    showSuccess(message: string): void;
    /** Exibe mensagem informativa */
    showInfo(message: string): void;
}

/**
 * Interface para utilitários de criptografia
 */
export interface CryptoUtilities {
    /** Valida string hexadecimal */
    isValidHex(hex: string): boolean;
    /** Converte hex para Uint8Array */
    hexToUint8Array(hexString: string): Uint8Array;
    /** Converte Uint8Array para hex */
    uint8ArrayToHex(array: Uint8Array): string;
    /** Converte texto para ArrayBuffer */
    textToArrayBuffer(text: string): ArrayBuffer;
    /** Converte ArrayBuffer para texto */
    arrayBufferToText(buffer: ArrayBuffer): string;
}
