# AES Crypto Browser - Versão Modular TypeScript

Sistema modular de criptografia AES para navegador, completamente refatorado em TypeScript para máxima reutilização e manutenibilidade.

## 🏗️ Arquitetura Modular

### Estrutura do Projeto

```
src/
├── types/
│   └── index.ts          # Definições de tipos e interfaces
├── utils/
│   └── CryptoUtils.ts    # Utilitários de criptografia
├── crypto/
│   └── AESCrypto.ts      # Motor de criptografia AES
├── ui/
│   └── UIManager.ts      # Gerenciador de interface
├── managers/
│   └── AESCryptoManager.ts # Orquestrador principal
└── main.ts               # Arquivo de inicialização
```

## 🚀 Características

### ✅ Modularidade Completa
- **Classes independentes** para reutilização em outros projetos
- **Tipos TypeScript** bem definidos para segurança de código
- **Arquitetura desacoplada** com responsabilidades bem separadas

### ✅ Funcionalidades Avançadas
- **AES-CBC 128-bit** usando Web Crypto API nativa
- **Interface contenteditable** para melhor experiência do usuário
- **Sistema de mensagens sofisticado** com fade effects e duração inteligente
- **Validação robusta** de entradas e formatos hexadecimais

### ✅ Reutilização de Componentes
- **CryptoUtils**: Utilitários de conversão e validação
- **AESCrypto**: Motor de criptografia independente
- **UIManager**: Gerenciador de interface reutilizável
- **AESCryptoManager**: Orquestrador configurável

## 📦 Como Usar os Módulos

### Importação Individual das Classes

```typescript
// Usar apenas utilitários de criptografia
import { CryptoUtils } from './src/utils/CryptoUtils.js';

const utils = new CryptoUtils();
const keyHex = utils.generateRandomKey(16);
```

```typescript
// Usar apenas o motor de criptografia
import { AESCrypto } from './src/crypto/AESCrypto.js';

const aes = new AESCrypto();
const encrypted = await aes.encrypt("texto", "chave_hex", "iv_hex");
```

```typescript
// Usar apenas o gerenciador de UI
import { UIManager } from './src/ui/UIManager.js';

const ui = new UIManager(elementos);
ui.showSuccess("Operação realizada!");
```

### Uso Completo do Sistema

```typescript
import { AESCryptoManager } from './src/managers/AESCryptoManager.js';

const manager = new AESCryptoManager(elementos);
// Sistema completo pronto para usar
```

## 🛠️ Scripts Disponíveis

```bash
# Compilar TypeScript para JavaScript
npm run build

# Desenvolvimento com watch mode
npm run dev

# Servir aplicação localmente
npm run serve

# Construir e servir
npm run start

# Verificar tipos sem compilar
npm run type-check
```

## 🎯 Configuração para Outros Projetos

### 1. Copiar Classes Necessárias

```bash
# Copiar apenas utilitários
cp src/utils/CryptoUtils.ts seu-projeto/
cp src/types/index.ts seu-projeto/

# Copiar motor de criptografia
cp src/crypto/AESCrypto.ts seu-projeto/
```

### 2. Importar em Seu Projeto

```typescript
import { CryptoUtils } from './CryptoUtils.js';
import { AESCrypto } from './AESCrypto.js';

// Usar independentemente
const utils = new CryptoUtils();
const crypto = new AESCrypto();
```

### 3. Configurar Diferentes Algoritmos

```typescript
import { AESCrypto } from './crypto/AESCrypto.js';

// AES-256 com GCM
const aes256 = new AESCrypto({
    algorithm: 'AES-GCM',
    keyLength: 256,
    ivLength: 12
});
```

## 📋 Exemplos de Uso

### Criptografia Básica

```typescript
import { CryptoUtils, AESCrypto } from './src/index.js';

const utils = new CryptoUtils();
const aes = new AESCrypto();

// Gerar chave e IV
const key = utils.generateRandomKey(16);
const iv = utils.generateRandomIV(16);

// Encriptar
const encrypted = await aes.encrypt("meu texto", key, iv);

// Decriptar
const decrypted = await aes.decrypt(encrypted, key, iv);
```

### Interface Personalizada

```typescript
import { UIManager } from './src/ui/UIManager.js';

const ui = new UIManager(meuselementos, {
    baseDuration: 5000,  // Mensagens mais longas
    durationFactor: 100, // Fator de duração personalizado
    fadeTimeout: 500     // Fade mais longo
});

ui.showSuccess("Configuração personalizada!");
```

## 🔧 Customização

### Algoritmos Suportados
- `AES-CBC` (padrão)
- `AES-GCM`
- `AES-CTR`

### Tamanhos de Chave
- 128 bits (16 bytes) - padrão
- 192 bits (24 bytes)
- 256 bits (32 bytes)

### Tipos de Mensagem
- `info` - Informativa (azul)
- `success` - Sucesso (verde)
- `error` - Erro (vermelho)
- `warning` - Aviso (amarelo)

## 🎨 Personalização de Interface

O sistema de mensagens e interface são completamente customizáveis via CSS:

```css
/* Personalizar mensagens */
.message.success {
    background: linear-gradient(45deg, #4CAF50, #45a049);
    color: white;
    border-radius: 8px;
}

/* Personalizar contenteditable */
.content-editable {
    border: 2px solid #your-color;
    background: #your-background;
}
```

## 🔒 Segurança

- **Web Crypto API nativa** - Criptografia de nível browser
- **Validação rigorosa** de entradas e formatos
- **Chaves aleatórias criptograficamente seguras**
- **Sem dependências externas** de criptografia

## 📚 Documentação das Classes

### CryptoUtils
- `isValidHex()` - Validação de hexadecimal
- `hexToUint8Array()` - Conversão hex para array
- `generateRandomKey()` - Geração de chaves
- `generateRandomIV()` - Geração de IVs

### AESCrypto
- `encrypt()` - Encriptação AES
- `decrypt()` - Decriptação AES
- `generateKeyAndIV()` - Geração de par chave/IV

### UIManager
- `addMessage()` - Adicionar mensagem
- `showSuccess/Error/Info()` - Mensagens tipadas
- `updateOutputValues()` - Atualizar interface

### AESCryptoManager
- `handleEncrypt/Decrypt()` - Operações principais
- `generateNewKey()` - Geração programática
- `importKey()` / `exportKey()` - Gerenciamento de chaves

## 🌐 Compatibilidade

- **Chrome 37+**
- **Firefox 34+**
- **Safari 7+**
- **Edge 12+**

Todos os navegadores com suporte à Web Crypto API.

---

## Migração do Projeto Anterior

O projeto foi completamente refatorado de um arquivo monolítico JavaScript para uma arquitetura modular TypeScript:

### Antes (main.js)
- Arquivo único com todas as funcionalidades
- Textareas para entrada de dados
- Sistema de alert() para mensagens

### Agora (src/)
- **4 classes modulares independentes**
- **Contenteditable divs** para melhor UX
- **Sistema de mensagens sofisticado**
- **Tipos TypeScript** para segurança
- **Arquitetura reutilizável**

Todas as funcionalidades originais foram preservadas e aprimoradas!
