import type { DOMElements } from './types/index.js';
import { AESCryptoManager } from './managers/AESCryptoManager.js';

/**
 * Arquivo principal de inicialização da aplicação AES Crypto
 * Este arquivo substitui o main.js original com arquitetura modular TypeScript
 */

/**
 * Inicializa a aplicação AES Crypto
 */
function initializeAESCryptoApp(): void {
    // Aguardar o DOM estar completamente carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initializeAESCryptoApp());
        return;
    }

    try {
        // Mapear elementos DOM
        const elements: DOMElements = {
            generateKey: document.getElementById('generateKey')!,
            encryptButton: document.getElementById('encryptButton')!,
            decryptButton: document.getElementById('decryptButton')!,
            aesKey: document.getElementById('aesKey') as HTMLInputElement,
            iv: document.getElementById('iv') as HTMLInputElement,
            encryptInput: document.getElementById('encryptInput')!,
            decryptInput: document.getElementById('decryptInput')!,
            report: document.getElementById('report')!
        };

        // Verificar se todos os elementos foram encontrados
        const missingElements = Object.entries(elements)
            .filter(([key, element]) => !element)
            .map(([key]) => key);

        if (missingElements.length > 0) {
            throw new Error(`Elementos DOM não encontrados: ${missingElements.join(', ')}`);
        }

        // Inicializar o gerenciador principal
        const cryptoManager = new AESCryptoManager(elements);

        // Expor para debugging (apenas em desenvolvimento)
        if (typeof window !== 'undefined') {
            (window as any).cryptoManager = cryptoManager;
        }

        console.log('AES Crypto App inicializada com sucesso!');

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao inicializar a aplicação:', message);
        
        // Tentar mostrar erro na interface se o elemento report existir
        const reportElement = document.getElementById('report');
        if (reportElement) {
            reportElement.innerHTML = `
                <div class="message error">
                    Erro ao inicializar a aplicação: ${message}
                </div>
            `;
        }
    }
}

/**
 * Função para reinicializar a aplicação
 * Útil para debugging ou recarregamento dinâmico
 */
function reinitializeApp(): void {
    console.log('Reinicializando AES Crypto App...');
    initializeAESCryptoApp();
}

/**
 * Verificar compatibilidade do navegador
 */
function checkBrowserCompatibility(): boolean {
    // Verificar Web Crypto API
    if (!window.crypto || !window.crypto.subtle) {
        console.error('Web Crypto API não disponível neste navegador');
        return false;
    }

    // Verificar outras APIs necessárias
    if (!window.TextEncoder || !window.TextDecoder) {
        console.error('TextEncoder/TextDecoder não disponível neste navegador');
        return false;
    }

    return true;
}

// Verificar compatibilidade antes de inicializar
if (checkBrowserCompatibility()) {
    initializeAESCryptoApp();
} else {
    console.error('Navegador não compatível com os recursos necessários');
    
    // Mostrar mensagem de erro se possível
    document.addEventListener('DOMContentLoaded', () => {
        const reportElement = document.getElementById('report');
        if (reportElement) {
            reportElement.innerHTML = `
                <div class="message error">
                    Seu navegador não suporta os recursos necessários para esta aplicação.
                    Por favor, use um navegador moderno como Chrome, Firefox, Safari ou Edge.
                </div>
            `;
        }
    });
}

// Expor funções globais para debugging
if (typeof window !== 'undefined') {
    (window as any).reinitializeApp = reinitializeApp;
    (window as any).checkBrowserCompatibility = checkBrowserCompatibility;
}

// Exportar para uso como módulo
export { initializeAESCryptoApp, reinitializeApp, checkBrowserCompatibility };
