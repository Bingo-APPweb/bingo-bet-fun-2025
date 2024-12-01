// 1. Estrutura de Diretórios
src/
├── components/
│   ├── game/
│   │   ├── GameRoom/
│   │   │   ├── index.tsx         // Componente principal do jogo
│   │   │   ├── BingoCard.tsx     // Cartela de bingo
│   │   │   └── Chat.tsx          // Chat da sala
│   │   └── GameLobby/
│   │       └── index.tsx         // Lista de salas disponíveis
│   └── ui/                       // Componentes de UI reutilizáveis
│       ├── Button.tsx
│       └── Card.tsx
├── services/
│   ├── game.ts                   // Lógica do jogo
│   ├── chat.ts                   // Lógica do chat
│   └── metrics.ts                // Lógica de métricas
├── hooks/
│   ├── useGame.ts                // Hook para estado do jogo
│   └── useChat.ts                // Hook para chat
└── config/
    └── firebase.ts               // Configuração já feita

// 2. Ordem de Implementação:
// a. Serviços base
// b. Hooks personalizados
// c. Componentes UI
// d. Componentes do jogo
// e. Integração e testes