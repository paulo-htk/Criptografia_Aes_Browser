/**
 * Gerenciador de interface do usuário
 * Responsável pela manipulação do DOM, mensagens, tooltips e interações do usuário
 */
export class UIManager {
    /**
     * Cria uma nova instância do UIManager
     * @param elements Elementos DOM a serem gerenciados
     * @param messageConfig Configurações do sistema de mensagens
     * @param tooltipConfig Configurações do sistema de tooltips
     */
    constructor(elements, messageConfig = {
        baseDuration: 3000, // Duração base para mensagens
        durationFactor: 50, // Fator de duração por palavra
        fadeTimeout: 300 // Tempo de transição para efeitos de fade
    }, tooltipConfig = {
        baseClass: 'tooltip',
        showDelay: 500, // Delay para mostrar o tooltip
        hideDelay: 100, // Delay para esconder o tooltip
        position: 'auto', // Posição do tooltip
        offset: 8, // Offset do tooltip
        allowHtml: true // Permitir HTML no conteúdo do tooltip
    }) {
        this.messageCounter = 0;
        this.tooltipElement = null;
        this.tooltipTimeout = null;
        this.elements = elements;
        this.messageConfig = messageConfig;
        this.tooltipConfig = tooltipConfig;
        this.initializeContentEditableElements();
        this.initializeTooltips();
    }
    /**
     * Inicializa o sistema de tooltips para elementos com data-title
     * @param customElements Lista customizada de elementos (opcional)
     */
    initializeTooltips(customElements) {
        const elementsToProcess = customElements || document.querySelectorAll('[data-title]');
        Array.from(elementsToProcess).forEach(element => {
            this.setupTooltipEvents(element);
        });
    }
    /**
     * Configura eventos de tooltip para um elemento específico
     * @param element Elemento HTML para configurar tooltip
     */
    setupTooltipEvents(element) {
        let showTimeout = null;
        let hideTimeout = null;
        const showTooltip = () => {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            showTimeout = window.setTimeout(() => {
                const content = element.getAttribute('data-title');
                if (content) {
                    this.showTooltip(element, content);
                }
            }, this.tooltipConfig.showDelay);
        };
        const hideTooltip = () => {
            if (showTimeout) {
                clearTimeout(showTimeout);
                showTimeout = null;
            }
            hideTimeout = window.setTimeout(() => {
                this.hideTooltip();
            }, this.tooltipConfig.hideDelay);
        };
        // Eventos de mouse
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        // Eventos de foco para acessibilidade
        element.addEventListener('focus', showTooltip);
        element.addEventListener('blur', hideTooltip);
        // Armazenar referências para limpeza posterior
        element._tooltipEvents = { showTooltip, hideTooltip };
    }
    /**
     * Mostra um tooltip para um elemento específico
     * @param element Elemento de referência
     * @param content Conteúdo do tooltip
     * @param position Posição preferida (opcional)
     */
    showTooltip(element, content, position) {
        // Remover tooltip existente
        this.hideTooltip();
        // Criar elemento do tooltip
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.className = `${this.tooltipConfig.baseClass} ${this.tooltipConfig.baseClass}--visible`;
        if (this.tooltipConfig.allowHtml) {
            this.tooltipElement.innerHTML = content;
        }
        else {
            this.tooltipElement.textContent = content;
        }
        // Adicionar ao body para não ser afetado por overflow dos pais
        document.body.appendChild(this.tooltipElement);
        // Calcular e aplicar posição
        this.positionTooltip(element, position || this.tooltipConfig.position);
    }
    /**
     * Calcula e aplica a posição do tooltip
     * @param element Elemento de referência
     * @param preferredPosition Posição preferida
     */
    positionTooltip(element, preferredPosition) {
        if (!this.tooltipElement)
            return;
        const rect = element.getBoundingClientRect();
        const tooltipRect = this.tooltipElement.getBoundingClientRect();
        const offset = this.tooltipConfig.offset;
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        let position = preferredPosition;
        let top = 0;
        let left = 0;
        // Auto-posicionamento se necessário
        if (position === 'auto') {
            const spaceTop = rect.top;
            const spaceBottom = viewport.height - rect.bottom;
            const spaceLeft = rect.left;
            const spaceRight = viewport.width - rect.right;
            if (spaceTop > tooltipRect.height + offset) {
                position = 'top';
            }
            else if (spaceBottom > tooltipRect.height + offset) {
                position = 'bottom';
            }
            else if (spaceLeft > tooltipRect.width + offset) {
                position = 'left';
            }
            else {
                position = 'right';
            }
        }
        // Calcular posições
        switch (position) {
            case 'top':
                top = rect.top - tooltipRect.height - offset;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                this.tooltipElement.setAttribute('data-position', 'top');
                break;
            case 'bottom':
                top = rect.bottom + offset;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                this.tooltipElement.setAttribute('data-position', 'bottom');
                break;
            case 'left':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.left - tooltipRect.width - offset;
                this.tooltipElement.setAttribute('data-position', 'left');
                break;
            case 'right':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.right + offset;
                this.tooltipElement.setAttribute('data-position', 'right');
                break;
        }
        // Ajustar para não sair da viewport
        left = Math.max(offset, Math.min(left, viewport.width - tooltipRect.width - offset));
        top = Math.max(offset, Math.min(top, viewport.height - tooltipRect.height - offset));
        // Aplicar posição
        this.tooltipElement.style.position = 'fixed';
        this.tooltipElement.style.top = `${top + window.scrollY}px`;
        this.tooltipElement.style.left = `${left + window.scrollX}px`;
        this.tooltipElement.style.zIndex = '10000';
    }
    /**
     * Esconde o tooltip atual
     */
    hideTooltip() {
        if (this.tooltipElement) {
            this.tooltipElement.remove();
            this.tooltipElement = null;
        }
        if (this.tooltipTimeout) {
            clearTimeout(this.tooltipTimeout);
            this.tooltipTimeout = null;
        }
    }
    /**
     * Remove todos os tooltips e event listeners
     */
    destroyTooltips() {
        this.hideTooltip();
        // Remover event listeners dos elementos
        document.querySelectorAll('[data-title]').forEach(element => {
            const events = element._tooltipEvents;
            if (events) {
                element.removeEventListener('mouseenter', events.showTooltip);
                element.removeEventListener('mouseleave', events.hideTooltip);
                element.removeEventListener('focus', events.showTooltip);
                element.removeEventListener('blur', events.hideTooltip);
                delete element._tooltipEvents;
            }
        });
    }
    /**
     * Inicializa elementos contenteditable com funcionalidades especiais
     */
    initializeContentEditableElements() {
        const contentEditableElements = [this.elements.encryptInput, this.elements.decryptInput];
        contentEditableElements.forEach(element => {
            if (element) {
                this.setupContentEditablePlaceholder(element);
                this.setupContentEditableValidation(element);
            }
        });
    }
    /**
     * Configura o sistema de placeholder para elementos contenteditable
     * @param element Elemento contenteditable
     */
    setupContentEditablePlaceholder(element) {
        const placeholder = element.getAttribute('data-placeholder') || '';
        // Função para verificar e aplicar placeholder
        const checkPlaceholder = () => {
            const isEmpty = element.textContent?.trim() === '';
            element.classList.toggle('empty', isEmpty);
            if (isEmpty && !element.matches(':focus')) {
                element.setAttribute('data-empty', 'true');
            }
            else {
                element.removeAttribute('data-empty');
            }
        };
        // Eventos para gerenciar placeholder
        element.addEventListener('input', checkPlaceholder);
        element.addEventListener('focus', checkPlaceholder);
        element.addEventListener('blur', checkPlaceholder);
        // Verificação inicial
        checkPlaceholder();
    }
    /**
     * Configura validação em tempo real para elementos contenteditable
     * @param element Elemento contenteditable
     */
    setupContentEditableValidation(element) {
        // Tratar evento paste para manter apenas texto
        element.addEventListener('paste', (e) => {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const selection = window.getSelection();
            if (!selection?.rangeCount)
                return;
            selection.deleteFromDocument();
            selection.getRangeAt(0).insertNode(document.createTextNode(paste));
            selection.collapseToEnd();
        });
        // Tratar tecla Enter para garantir quebras de linha consistentes
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const selection = window.getSelection();
                if (!selection?.rangeCount)
                    return;
                const range = selection.getRangeAt(0);
                // Criar quebra de linha
                const br = document.createElement('br');
                range.deleteContents();
                range.insertNode(br);
                // Posicionar cursor após a quebra de linha
                range.setStartAfter(br);
                range.setEndAfter(br);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
        // Normalizar formatação, preservando quebras de linha
        element.addEventListener('input', () => {
            this.normalizeContentEditableHTML(element);
        });
    }
    /**
     * Normaliza o HTML do contenteditable, mantendo apenas texto e quebras de linha
     * @param element Elemento contenteditable
     */
    normalizeContentEditableHTML(element) {
        // Preservar quebras de linha enquanto remove outras formatações
        let html = element.innerHTML;
        // Converter divs para quebras de linha (alguns navegadores criam divs)
        html = html.replace(/<div[^>]*><br[^>]*><\/div>/gi, '<br>');
        html = html.replace(/<div[^>]*>/gi, '<br>');
        html = html.replace(/<\/div>/gi, '');
        // Remover outros elementos HTML exceto <br>
        html = html.replace(/<(?!br\s*\/?)[^>]+>/gi, '');
        // Normalizar múltiplas quebras de linha seguidas
        html = html.replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>');
        // Atualizar apenas se houve mudança para evitar loop infinito
        if (element.innerHTML !== html) {
            const selection = window.getSelection();
            const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
            const cursorPos = range ? range.startOffset : 0;
            element.innerHTML = html;
            // Restaurar posição do cursor
            if (range) {
                try {
                    const newRange = document.createRange();
                    const textNode = this.findTextNodeAtPosition(element, cursorPos);
                    if (textNode) {
                        newRange.setStart(textNode.node, Math.min(textNode.offset, textNode.node.textContent?.length || 0));
                        newRange.collapse(true);
                        selection?.removeAllRanges();
                        selection?.addRange(newRange);
                    }
                }
                catch (e) {
                    // Fallback: posicionar no final se houver erro
                    this.setCursorToEnd(element);
                }
            }
        }
    }
    /**
     * Encontra o nó de texto na posição especificada
     * @param element Elemento contenteditable
     * @param position Posição desejada
     * @returns Nó e offset encontrados
     */
    findTextNodeAtPosition(element, position) {
        let currentPos = 0;
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
        let node;
        while (node = walker.nextNode()) {
            const textLength = node.textContent?.length || 0;
            if (currentPos + textLength >= position) {
                return {
                    node,
                    offset: position - currentPos
                };
            }
            currentPos += textLength;
        }
        // Se não encontrar, retornar o último nó
        if (walker.currentNode) {
            return {
                node: walker.currentNode,
                offset: walker.currentNode.textContent?.length || 0
            };
        }
        return null;
    }
    /**
     * Posiciona o cursor no final do elemento contenteditable
     * @param element Elemento contenteditable
     */
    setCursorToEnd(element) {
        const selection = window.getSelection();
        const range = document.createRange();
        if (element.lastChild) {
            range.setStartAfter(element.lastChild);
        }
        else {
            range.setStart(element, 0);
        }
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
    }
    /**
     * Calcula a duração da mensagem baseada no seu tamanho
     * @param message Mensagem a ser exibida
     * @returns Duração em milissegundos
     */
    calculateMessageDuration(message) {
        const wordCount = message.split(' ').length;
        return Math.max(this.messageConfig.baseDuration, this.messageConfig.baseDuration + (wordCount * this.messageConfig.durationFactor));
    }
    /**
     * Adiciona uma nova mensagem ao sistema
     * @param message Texto da mensagem
     * @param type Tipo da mensagem
     * @returns ID único da mensagem
     */
    addMessage(message, type = 'info') {
        const messageId = `msg-${++this.messageCounter}-${Date.now()}`;
        const duration = this.calculateMessageDuration(message);
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.id = messageId;
        messageElement.textContent = message;
        // Adicionar ao DOM
        this.elements.report.appendChild(messageElement);
        // Efeito de fade in
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 10);
        // Programar remoção automática
        setTimeout(() => {
            this.removeMessage(messageId);
        }, duration);
        return messageId;
    }
    /**
     * Remove uma mensagem específica do sistema
     * @param messageId ID da mensagem a ser removida
     */
    removeMessage(messageId) {
        const messageElement = document.getElementById(messageId);
        if (!messageElement)
            return;
        messageElement.classList.add('fade-out');
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, this.messageConfig.fadeTimeout);
    }
    /**
     * Exibe uma mensagem de erro
     * @param message Mensagem de erro
     */
    showError(message) {
        this.addMessage(message, 'error');
    }
    /**
     * Exibe uma mensagem de sucesso
     * @param message Mensagem de sucesso
     */
    showSuccess(message) {
        this.addMessage(message, 'success');
    }
    /**
     * Exibe uma mensagem informativa
     * @param message Mensagem informativa
     */
    showInfo(message) {
        this.addMessage(message, 'info');
    }
    /**
     * Exibe uma mensagem de aviso
     * @param message Mensagem de aviso
     */
    showWarning(message) {
        this.addMessage(message, 'warning');
    }
    /**
     * Obtém o valor de texto de um elemento contenteditable
     * @param element Elemento contenteditable
     * @returns Texto do elemento com quebras de linha preservadas
     */
    getContentEditableValue(element) {
        // Converter <br> tags para quebras de linha reais
        let html = element.innerHTML;
        html = html.replace(/<br\s*\/?>/gi, '\n');
        // Criar um elemento temporário para extrair o texto
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return (tempDiv.textContent || '').trim();
    }
    /**
     * Define o valor de texto de um elemento contenteditable
     * @param element Elemento contenteditable
     * @param value Novo valor
     */
    setContentEditableValue(element, value) {
        // Converter quebras de linha para <br> tags
        const htmlValue = value.replace(/\n/g, '<br>');
        element.innerHTML = htmlValue;
        // Trigger do evento de input para atualizar placeholder
        element.dispatchEvent(new Event('input', { bubbles: true }));
    }
    /**
     * Obtém valores de entrada do formulário
     * @returns Objeto com todos os valores de entrada
     */
    getInputValues() {
        return {
            keyHex: this.elements.aesKey.value.trim(),
            ivHex: this.elements.iv.value.trim(),
            encryptData: this.getContentEditableValue(this.elements.encryptInput),
            decryptData: this.getContentEditableValue(this.elements.decryptInput)
        };
    }
    /**
     * Atualiza valores na interface
     * @param values Objeto com valores a serem atualizados
     */
    updateOutputValues(values) {
        Object.entries(values).forEach(([key, value]) => {
            if (value === undefined)
                return;
            switch (key) {
                case 'aesKey':
                    if (this.elements.aesKey) {
                        this.elements.aesKey.value = value;
                    }
                    break;
                case 'iv':
                    if (this.elements.iv) {
                        this.elements.iv.value = value;
                    }
                    break;
                case 'encryptedOutput':
                    this.setContentEditableValue(this.elements.decryptInput, value);
                    break;
                case 'decryptedOutput':
                    this.setContentEditableValue(this.elements.encryptInput, value);
                    break;
                default:
                    // Para outros valores personalizados
                    const element = document.getElementById(key);
                    if (element) {
                        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                            element.value = value;
                        }
                        else {
                            element.textContent = value;
                        }
                    }
                    break;
            }
        });
    }
    /**
     * Limpa todos os campos de entrada
     */
    clearAllInputs() {
        this.elements.aesKey.value = '';
        this.elements.iv.value = '';
        this.setContentEditableValue(this.elements.encryptInput, '');
        this.setContentEditableValue(this.elements.decryptInput, '');
    }
    /**
     * Limpa todas as mensagens
     */
    clearAllMessages() {
        this.elements.report.innerHTML = '';
    }
    /**
     * Adiciona um event listener a um elemento
     * @param elementKey Chave do elemento no objeto elements
     * @param event Tipo de evento
     * @param handler Função de callback
     */
    addEventListener(elementKey, event, handler) {
        const element = this.elements[elementKey];
        if (element) {
            element.addEventListener(event, handler);
        }
    }
    /**
     * Habilita ou desabilita um elemento
     * @param elementKey Chave do elemento
     * @param enabled Estado desejado
     */
    setElementEnabled(elementKey, enabled) {
        const element = this.elements[elementKey];
        if (element) {
            if ('disabled' in element) {
                element.disabled = !enabled;
            }
            element.classList.toggle('disabled', !enabled);
        }
    }
    /**
     * Obtém referência aos elementos DOM gerenciados
     * @returns Objeto com elementos DOM
     */
    getElements() {
        return { ...this.elements };
    }
}
//# sourceMappingURL=UIManager.js.map