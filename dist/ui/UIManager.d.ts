import type { MessageType, MessageConfig, DOMElements, OutputValues, MessageManager, TooltipConfig, TooltipManager } from '../types/index.js';
/**
 * Gerenciador de interface do usuário
 * Responsável pela manipulação do DOM, mensagens, tooltips e interações do usuário
 */
export declare class UIManager implements MessageManager, TooltipManager {
    private readonly elements;
    private readonly messageConfig;
    private readonly tooltipConfig;
    private messageCounter;
    private tooltipElement;
    private tooltipTimeout;
    /**
     * Cria uma nova instância do UIManager
     * @param elements Elementos DOM a serem gerenciados
     * @param messageConfig Configurações do sistema de mensagens
     * @param tooltipConfig Configurações do sistema de tooltips
     */
    constructor(elements: DOMElements, messageConfig?: MessageConfig, tooltipConfig?: TooltipConfig);
    /**
     * Inicializa o sistema de tooltips para elementos com data-title
     * @param customElements Lista customizada de elementos (opcional)
     */
    initializeTooltips(customElements?: NodeListOf<Element> | Element[]): void;
    /**
     * Configura eventos de tooltip para um elemento específico
     * @param element Elemento HTML para configurar tooltip
     */
    private setupTooltipEvents;
    /**
     * Mostra um tooltip para um elemento específico
     * @param element Elemento de referência
     * @param content Conteúdo do tooltip
     * @param position Posição preferida (opcional)
     */
    showTooltip(element: Element, content: string, position?: string): void;
    /**
     * Calcula e aplica a posição do tooltip
     * @param element Elemento de referência
     * @param preferredPosition Posição preferida
     */
    private positionTooltip;
    /**
     * Esconde o tooltip atual
     */
    hideTooltip(): void;
    /**
     * Remove todos os tooltips e event listeners
     */
    destroyTooltips(): void;
    /**
     * Inicializa elementos contenteditable com funcionalidades especiais
     */
    private initializeContentEditableElements;
    /**
     * Configura o sistema de placeholder para elementos contenteditable
     * @param element Elemento contenteditable
     */
    private setupContentEditablePlaceholder;
    /**
     * Configura validação em tempo real para elementos contenteditable
     * @param element Elemento contenteditable
     */
    private setupContentEditableValidation;
    /**
     * Normaliza o HTML do contenteditable, mantendo apenas texto e quebras de linha
     * @param element Elemento contenteditable
     */
    private normalizeContentEditableHTML;
    /**
     * Encontra o nó de texto na posição especificada
     * @param element Elemento contenteditable
     * @param position Posição desejada
     * @returns Nó e offset encontrados
     */
    private findTextNodeAtPosition;
    /**
     * Posiciona o cursor no final do elemento contenteditable
     * @param element Elemento contenteditable
     */
    private setCursorToEnd;
    /**
     * Calcula a duração da mensagem baseada no seu tamanho
     * @param message Mensagem a ser exibida
     * @returns Duração em milissegundos
     */
    private calculateMessageDuration;
    /**
     * Adiciona uma nova mensagem ao sistema
     * @param message Texto da mensagem
     * @param type Tipo da mensagem
     * @returns ID único da mensagem
     */
    addMessage(message: string, type?: MessageType): string;
    /**
     * Remove uma mensagem específica do sistema
     * @param messageId ID da mensagem a ser removida
     */
    removeMessage(messageId: string): void;
    /**
     * Exibe uma mensagem de erro
     * @param message Mensagem de erro
     */
    showError(message: string): void;
    /**
     * Exibe uma mensagem de sucesso
     * @param message Mensagem de sucesso
     */
    showSuccess(message: string): void;
    /**
     * Exibe uma mensagem informativa
     * @param message Mensagem informativa
     */
    showInfo(message: string): void;
    /**
     * Exibe uma mensagem de aviso
     * @param message Mensagem de aviso
     */
    showWarning(message: string): void;
    /**
     * Obtém o valor de texto de um elemento contenteditable
     * @param element Elemento contenteditable
     * @returns Texto do elemento com quebras de linha preservadas
     */
    getContentEditableValue(element: HTMLElement): string;
    /**
     * Define o valor de texto de um elemento contenteditable
     * @param element Elemento contenteditable
     * @param value Novo valor
     */
    setContentEditableValue(element: HTMLElement, value: string): void;
    /**
     * Obtém valores de entrada do formulário
     * @returns Objeto com todos os valores de entrada
     */
    getInputValues(): {
        [key: string]: string;
    };
    /**
     * Atualiza valores na interface
     * @param values Objeto com valores a serem atualizados
     */
    updateOutputValues(values: OutputValues): void;
    /**
     * Limpa todos os campos de entrada
     */
    clearAllInputs(): void;
    /**
     * Limpa todas as mensagens
     */
    clearAllMessages(): void;
    /**
     * Adiciona um event listener a um elemento
     * @param elementKey Chave do elemento no objeto elements
     * @param event Tipo de evento
     * @param handler Função de callback
     */
    addEventListener(elementKey: keyof DOMElements, event: string, handler: EventListenerOrEventListenerObject): void;
    /**
     * Habilita ou desabilita um elemento
     * @param elementKey Chave do elemento
     * @param enabled Estado desejado
     */
    setElementEnabled(elementKey: keyof DOMElements, enabled: boolean): void;
    /**
     * Obtém referência aos elementos DOM gerenciados
     * @returns Objeto com elementos DOM
     */
    getElements(): Readonly<DOMElements>;
}
//# sourceMappingURL=UIManager.d.ts.map