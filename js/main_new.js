'use strict';

/**
 * Classe utilitária para operações de conversão e validação
 */
class CryptoUtils {
	/**
	 * Valida se uma string hex é válida
	 */
	static isValidHex(hex) {
		return /^[0-9A-Fa-f]*$/.test(hex) && hex.length % 2 === 0;
	}

	/**
	 * Converte hex string para Uint8Array com validação
	 */
	static hexToUint8Array(hexString) {
		if (!hexString) {
			throw new Error('String hexadecimal não pode estar vazia');
		}
		
		if (!this.isValidHex(hexString)) {
			throw new Error('String hexadecimal inválida');
		}

		const matches = hexString.match(/.{1,2}/g);
		if (!matches) {
			throw new Error('Formato hexadecimal inválido');
		}

		return new Uint8Array(matches.map(byte => parseInt(byte, 16)));
	}

	/**
	 * Converte Uint8Array para hex string
	 */
	static uint8ArrayToHex(array) {
		return Array.from(array)
			.map(byte => byte.toString(16).padStart(2, '0'))
			.join('');
	}

	/**
	 * Converte texto para ArrayBuffer
	 */
	static textToArrayBuffer(text) {
		return new TextEncoder().encode(text);
	}

	/**
	 * Converte ArrayBuffer para texto
	 */
	static arrayBufferToText(buffer) {
		return new TextDecoder().decode(buffer);
	}

	/**
	 * Valida o tamanho da chave AES
	 */
	static validateKeySize(keyBuffer, expectedSize = 16) {
		if (keyBuffer.length !== expectedSize) {
			throw new Error(`Chave deve ter ${expectedSize} bytes (${expectedSize * 8} bits)`);
		}
	}

	/**
	 * Valida o tamanho do IV
	 */
	static validateIVSize(ivBuffer, expectedSize = 16) {
		if (ivBuffer.length !== expectedSize) {
			throw new Error(`IV deve ter ${expectedSize} bytes (${expectedSize * 8} bits)`);
		}
	}
}

/**
 * Classe para operações de criptografia AES
 */
class AESCrypto {
	constructor() {
		this.ALGORITHM = 'AES-CBC';
		this.KEY_LENGTH = 128;
		this.IV_LENGTH = 16;
	}

	/**
	 * Gera uma chave AES aleatória
	 */
	async generateKey() {
		try {
			return await crypto.subtle.generateKey(
				{
					name: this.ALGORITHM,
					length: this.KEY_LENGTH
				},
				true,
				['encrypt', 'decrypt']
			);
		} catch (error) {
			throw new Error(`Erro ao gerar chave: ${error.message}`);
		}
	}

	/**
	 * Importa uma chave a partir de dados binários
	 */
	async importKey(keyBuffer, operations = ['encrypt', 'decrypt']) {
		try {
			// Para AES-128, a chave deve ter 16 bytes
			CryptoUtils.validateKeySize(keyBuffer, 16);
			
			return await crypto.subtle.importKey(
				'raw',
				keyBuffer,
				{ name: this.ALGORITHM },
				true,
				operations
			);
		} catch (error) {
			throw new Error(`Erro ao importar chave: ${error.message}`);
		}
	}

	/**
	 * Criptografa dados
	 */
	async encryptData(key, data, iv = null) {
		try {
			const initVector = iv || crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));
			
			if (iv) {
				CryptoUtils.validateIVSize(iv);
			}

			const encrypted = await crypto.subtle.encrypt(
				{
					name: this.ALGORITHM,
					iv: initVector
				},
				key,
				CryptoUtils.textToArrayBuffer(data)
			);

			return {
				encryptedData: encrypted,
				iv: initVector
			};
		} catch (error) {
			throw new Error(`Erro ao criptografar: ${error.message}`);
		}
	}

	/**
	 * Descriptografa dados
	 */
	async decryptData(key, encryptedData, iv) {
		try {
			CryptoUtils.validateIVSize(iv);

			const decrypted = await crypto.subtle.decrypt(
				{
					name: this.ALGORITHM,
					iv: iv
				},
				key,
				encryptedData
			);

			return CryptoUtils.arrayBufferToText(decrypted);
		} catch (error) {
			throw new Error(`Erro ao descriptografar: ${error.message}`);
		}
	}
}

/**
 * Classe para gerenciar a interface do usuário
 */
class UIManager {
	constructor() {
		this.elements = this.initializeElements();
		this.setupContentEditableHandlers();
		
		// Configurações para o sistema de mensagens
		this.messageConfig = {
			baseDuration: 3000, // 3 segundos base
			durationFactor: 50, // 50ms por caractere adicional
			fadeTimeout: 300    // 300ms para o efeito fade
		};
		
		this.messageCounter = 0; // Contador para IDs únicos
	}

	/**
	 * Configura handlers específicos para elementos contenteditable
	 */
	setupContentEditableHandlers() {
		// Handler para o placeholder - agora apenas os elementos que existem
		const contentEditableElements = ['encryptInput', 'decryptInput'];
		
		contentEditableElements.forEach(elementId => {
			const element = this.elements[elementId];
			if (element && element.contentEditable === 'true') {
				// Remove placeholder quando o elemento recebe foco
				element.addEventListener('focus', () => {
					if (element.textContent === '' || element.textContent === element.dataset.placeholder) {
						element.textContent = '';
					}
				});

				// Adiciona placeholder quando o elemento perde foco e está vazio
				element.addEventListener('blur', () => {
					if (element.textContent.trim() === '') {
						element.textContent = '';
					}
				});

				// Previne quebras de linha desnecessárias em alguns casos
				element.addEventListener('keydown', (e) => {
					// Permite Ctrl+A para selecionar tudo
					if (e.ctrlKey && e.key === 'a') {
						return;
					}
					
					// Permite Ctrl+V para colar
					if (e.ctrlKey && e.key === 'v') {
						return;
					}
					
					// Permite Ctrl+C para copiar
					if (e.ctrlKey && e.key === 'c') {
						return;
					}
				});

				// Handler para paste - limpa formatação
				element.addEventListener('paste', (e) => {
					e.preventDefault();
					const text = (e.clipboardData || window.clipboardData).getData('text/plain');
					document.execCommand('insertText', false, text);
				});
			}
		});
	}

	/**
	 * Inicializa referências dos elementos DOM
	 */
	initializeElements() {
		const elementIds = [
			'generateKey', 'encryptButton', 'decryptButton',
			'aesKey', 'iv', 'encryptInput', 'decryptInput', 'report'
		];

		const elements = {};
		
		elementIds.forEach(id => {
			const element = document.getElementById(id);
			if (!element) {
				throw new Error(`Elemento com ID '${id}' não encontrado`);
			}
			elements[id] = element;
		});

		return elements;
	}

	/**
	 * Gera um ID único para mensagens
	 */
	generateMessageId() {
		return `report_${++this.messageCounter}_${Date.now()}`;
	}

	/**
	 * Calcula a duração da mensagem baseada no seu tamanho
	 */
	calculateMessageDuration(message) {
		return this.messageConfig.baseDuration + (message.length * this.messageConfig.durationFactor);
	}

	/**
	 * Adiciona uma mensagem ao elemento report
	 */
	addMessage(message, type = 'info') {
		const messageId = this.generateMessageId();
		const duration = this.calculateMessageDuration(message);
		
		// Cria o elemento de mensagem
		const messageElement = document.createElement('p');
		messageElement.id = messageId;
		messageElement.className = `message message-${type}`;
		messageElement.textContent = message;
		
		// Adiciona a mensagem ao report
		this.elements.report.appendChild(messageElement);
		
		// Aplica efeito de fade-in
		messageElement.style.opacity = '0';
		messageElement.style.transition = `opacity ${this.messageConfig.fadeTimeout}ms ease-in-out`;
		
		// Fade-in
		setTimeout(() => {
			messageElement.style.opacity = '1';
		}, 10);
		
		// Remove a mensagem após a duração calculada
		setTimeout(() => {
			this.removeMessage(messageId);
		}, duration);
		
		return messageId;
	}

	/**
	 * Remove uma mensagem com efeito de fade
	 */
	removeMessage(messageId) {
		const messageElement = document.getElementById(messageId);
		if (messageElement) {
			// Fade-out
			messageElement.style.opacity = '0';
			
			// Remove do DOM após o fade
			setTimeout(() => {
				if (messageElement.parentNode) {
					messageElement.parentNode.removeChild(messageElement);
				}
			}, this.messageConfig.fadeTimeout);
		}
	}

	/**
	 * Exibe mensagem de erro para o usuário
	 */
	showError(message) {
		console.error('Erro:', message);
		this.addMessage(`Erro: ${message}`, 'error');
	}

	/**
	 * Exibe mensagem de sucesso para o usuário
	 */
	showSuccess(message) {
		console.log('Sucesso:', message);
		this.addMessage(message, 'success');
	}

	/**
	 * Exibe mensagem de informação para o usuário
	 */
	showInfo(message) {
		console.log('Info:', message);
		this.addMessage(message, 'info');
	}

	/**
	 * Obtém valores dos campos de entrada
	 */
	getInputValues() {
		return {
			keyHex: this.elements.aesKey.value.trim(),
			ivHex: this.elements.iv.value.trim(),
			encryptData: this.getElementValue(this.elements.encryptInput).trim(),
			decryptData: this.getElementValue(this.elements.decryptInput).trim()
		};
	}

	/**
	 * Obtém o valor de um elemento (input ou contenteditable)
	 */
	getElementValue(element) {
		if (element.tagName.toLowerCase() === 'div' && element.contentEditable === 'true') {
			return element.textContent || element.innerText || '';
		}
		return element.value || '';
	}

	/**
	 * Define o valor de um elemento (input ou contenteditable)
	 */
	setElementValue(element, value) {
		if (element.tagName.toLowerCase() === 'div' && element.contentEditable === 'true') {
			element.textContent = value;
		} else {
			element.value = value;
		}
	}

	/**
	 * Define valores nos campos de saída - adaptado para nova interface
	 */
	setOutputValues(values) {
		// O resultado da encriptação vai para decryptInput
		if (values.encryptedOutput) {
			this.setElementValue(this.elements.decryptInput, values.encryptedOutput);
		}
		
		// O resultado da decriptação vai para encryptInput
		if (values.decryptedOutput) {
			this.setElementValue(this.elements.encryptInput, values.decryptedOutput);
		}
		
		// Outros valores mantém comportamento padrão
		Object.keys(values).forEach(key => {
			if (key !== 'encryptedOutput' && key !== 'decryptedOutput' && this.elements[key]) {
				this.setElementValue(this.elements[key], values[key]);
			}
		});
	}

	/**
	 * Valida entradas obrigatórias
	 */
	validateRequiredInputs(inputs, requiredFields) {
		for (const field of requiredFields) {
			if (!inputs[field]) {
				const fieldNames = {
					keyHex: 'Chave AES',
					ivHex: 'IV',
					encryptData: 'Dados para encriptação',
					decryptData: 'Dados para decriptação'
				};
				throw new Error(`${fieldNames[field] || field} é obrigatório`);
			}
		}
	}
}

/**
 * Classe principal para gerenciar operações de criptografia AES
 */
class AESCryptoManager {
	constructor() {
		this.crypto = new AESCrypto();
		this.ui = new UIManager();
		this.setupEventListeners();
		
		// Mostra mensagem inicial
		this.ui.showInfo('Informe a chave AES e o IV para encriptar ou decriptar.');
	}

	/**
	 * Configura os event listeners
	 */
	setupEventListeners() {
		this.ui.elements.generateKey.addEventListener('click', () => this.handleGenerateKey());
		this.ui.elements.encryptButton.addEventListener('click', () => this.handleEncrypt());
		this.ui.elements.decryptButton.addEventListener('click', () => this.handleDecrypt());
	}

	/**
	 * Manipula a geração de chave e IV
	 */
	async handleGenerateKey() {
		try {
			const key = await this.crypto.generateKey();
			const iv = crypto.getRandomValues(new Uint8Array(this.crypto.IV_LENGTH));
			
			const keyBuffer = new Uint8Array(await crypto.subtle.exportKey('raw', key));
			
			this.ui.setOutputValues({
				aesKey: CryptoUtils.uint8ArrayToHex(keyBuffer),
				iv: CryptoUtils.uint8ArrayToHex(iv)
			});
			
			this.ui.showSuccess('Chave AES e IV gerados com sucesso');
		} catch (error) {
			this.ui.showError(error.message);
		}
	}

	/**
	 * Manipula a criptografia
	 */
	async handleEncrypt() {
		try {
			const inputs = this.ui.getInputValues();
			
			// Validações
			this.ui.validateRequiredInputs(inputs, ['keyHex', 'ivHex', 'encryptData']);

			// Conversões com validação
			const keyBuffer = CryptoUtils.hexToUint8Array(inputs.keyHex);
			const ivBuffer = CryptoUtils.hexToUint8Array(inputs.ivHex);

			const key = await this.crypto.importKey(keyBuffer, ['encrypt']);
			const { encryptedData } = await this.crypto.encryptData(key, inputs.encryptData, ivBuffer);

			// O resultado da encriptação vai para decryptInput
			this.ui.setOutputValues({
				encryptedOutput: CryptoUtils.uint8ArrayToHex(new Uint8Array(encryptedData))
			});
			
			this.ui.showSuccess('Dados criptografados com sucesso');
		} catch (error) {
			this.ui.showError(error.message);
		}
	}

	/**
	 * Manipula a descriptografia
	 */
	async handleDecrypt() {
		try {
			const inputs = this.ui.getInputValues();
			
			// Validações
			this.ui.validateRequiredInputs(inputs, ['keyHex', 'ivHex', 'decryptData']);

			// Conversões com validação
			const keyBuffer = CryptoUtils.hexToUint8Array(inputs.keyHex);
			const ivBuffer = CryptoUtils.hexToUint8Array(inputs.ivHex);
			const encryptedBuffer = CryptoUtils.hexToUint8Array(inputs.decryptData);

			const key = await this.crypto.importKey(keyBuffer, ['decrypt']);
			const decryptedData = await this.crypto.decryptData(key, encryptedBuffer, ivBuffer);

			// O resultado da decriptação vai para encryptInput
			this.ui.setOutputValues({
				decryptedOutput: decryptedData
			});
			
			this.ui.showSuccess('Dados descriptografados com sucesso');
		} catch (error) {
			this.ui.showError(error.message);
		}
	}
}

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
	try {
		// Verifica se a Web Crypto API está disponível
		if (!window.crypto || !window.crypto.subtle) {
			throw new Error('Web Crypto API não está disponível neste navegador');
		}

		new AESCryptoManager();
		console.log('AES Crypto Manager inicializado com sucesso');
	} catch (error) {
		console.error('Erro ao inicializar a aplicação:', error.message);
		alert(`Erro ao inicializar a aplicação: ${error.message}`);
	}
});
