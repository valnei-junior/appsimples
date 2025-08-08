# Quiz Interativo - React Native

Um aplicativo de quiz interativo desenvolvido em React Native com Expo, que inclui perguntas de múltipla escolha, feedback visual e navegação por gestos.

## 🎯 Características

- **10 perguntas** de conhecimentos gerais
- **Feedback visual** para respostas certas e erradas
- **Navegação por gestos** (swipe para próxima pergunta)
- **Animações fluidas** entre telas e transições
- **Pontuação detalhada** com estatísticas
- **Interface moderna** com design responsivo

## 🚀 Funcionalidades

### Tela Inicial (Home)
- Apresentação do quiz
- Informações sobre o número de perguntas
- Botão para iniciar o quiz
- Dicas de navegação

### Tela do Quiz
- Apresentação das perguntas uma por vez
- Barra de progresso
- Opções de múltipla escolha (A, B, C, D)
- Feedback imediato após seleção
- Navegação por swipe (deslizar para direita)
- Auto-avanço para próxima pergunta

### Tela de Resultado
- Pontuação final e porcentagem
- Resumo detalhado das respostas
- Estatísticas completas
- Opções para refazer ou voltar ao início

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **Expo Router** - Navegação entre telas
- **React Native Reanimated** - Animações avançadas
- **React Native Gesture Handler** - Gestos de toque

## 📱 Como Usar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI
- Dispositivo móvel com Expo Go ou emulador

### Instalação
1. Clone ou baixe o projeto
2. Navegue até a pasta do projeto
3. Instale as dependências:
   ```bash
   npm install
   ```

### Executar o App
```bash
npm start
```

Isso abrirá o Expo DevTools. Você pode:
- Escanear o QR code com o app Expo Go (Android/iOS)
- Pressionar 'a' para abrir no emulador Android
- Pressionar 'i' para abrir no simulador iOS
- Pressionar 'w' para abrir no navegador web

## 🎮 Como Jogar

1. **Tela Inicial**: Toque em "Iniciar Quiz"
2. **Durante o Quiz**: 
   - Leia a pergunta
   - Toque na opção que considera correta
   - Aguarde o feedback (verde = correto, vermelho = erro)
   - Deslize para a direita ou aguarde para próxima pergunta
3. **Resultado**: 
   - Veja sua pontuação e estatísticas
   - Escolha "Refazer Quiz" ou "Voltar ao Início"

## 🎨 Funcionalidades Técnicas

### Estados e Efeitos
- `useState` para gerenciar estado das perguntas, respostas e pontuação
- `useEffect` para animações iniciais e transições

### Navegação
- Expo Router com Stack Navigator
- Navegação programática entre telas
- Passagem de parâmetros entre rotas

### Estilo Condicional
- Cores diferentes para acerto/erro
- Animações baseadas em estado
- Feedback visual dinâmico

### Componentização
- Componente `Pergunta` para exibição das questões
- Componente `Opcoes` para alternativas interativas
- Reutilização de código e separação de responsabilidades

### Gestos
- PanResponder para detectar swipe
- Animações coordenadas com gestos
- Feedback tátil e visual

## 📁 Estrutura do Projeto

```
QuizInterativo/
├── app/
│   ├── _layout.tsx          # Layout e navegação principal
│   ├── index.tsx            # Tela inicial (Home)
│   ├── quiz.tsx             # Tela do quiz
│   └── resultado.tsx        # Tela de resultados
├── components/
│   ├── Pergunta.jsx         # Componente de pergunta
│   └── Opcoes.jsx           # Componente de opções
├── data/
│   └── perguntas.json       # Dados das perguntas
├── assets/                  # Imagens e recursos
└── package.json            # Dependências e scripts
```

## 🎯 Aprendizados Práticos

Este projeto permite praticar:
- **Estados e Efeitos**: Gerenciamento complexo de estado
- **Navegação**: Transição entre múltiplas telas
- **Estilo Condicional**: UI dinâmica baseada em dados
- **Componentização**: Organização e reutilização de código
- **Gestos**: Interação avançada com o usuário
- **Animações**: Experiência de usuário fluida

## 📝 Personalização

### Adicionar Novas Perguntas
Edite o arquivo `data/perguntas.json`:
```json
{
  "id": 11,
  "pergunta": "Sua pergunta aqui?",
  "opcoes": ["Opção A", "Opção B", "Opção C", "Opção D"],
  "respostaCorreta": 2
}
```

### Modificar Temas
Ajuste as cores nos arquivos de estilo de cada tela.

### Adicionar Categorias
Implemente diferentes arrays de perguntas e seleção de categoria.

## 🚀 Próximas Funcionalidades

- Diferentes níveis de dificuldade
- Categorias de perguntas
- Sistema de ranking
- Modo multiplayer
- Tempo limite por pergunta
- Sons e efeitos sonoros

## 📄 Licença

Este projeto é para fins educacionais e de aprendizado.

---

Desenvolvido com ❤️ usando React Native e Expo!