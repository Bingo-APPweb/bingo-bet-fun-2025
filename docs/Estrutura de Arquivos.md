src/
├── components/
│ ├── game/
│ │ ├── BingoCard/
│ │ │ ├── index.tsx // Cartela de bingo
│ │ │ └── styles.ts // Estilos da cartela
│ │ ├── GameControls/
│ │ │ ├── index.tsx // Controles do jogo
│ │ │ └── styles.ts // Estilos dos controles
│ │ ├── StreamViewer/
│ │ │ ├── index.tsx // Visualizador de stream
│ │ │ └── styles.ts // Estilos do visualizador
│ │ └── Chat/
│ │ ├── index.tsx // Chat do jogo
│ │ └── styles.ts // Estilos do chat
│ └── ui/ // Componentes shadcn/ui
├── services/ // Nova pasta para serviços
│ ├── metrics/
│ │ ├── MetricsService.ts // Implementação do serviço
│ │ └── config.ts // Configurações específicas do serviço
│ ├── analytics/ // Preparado para futura implementação
│ ├── cache/ // Preparado para futura implementação
│ └── sync/ // Preparado para futura implementação
├── stores/
│ ├── gameStore.ts // Estado do jogo
│ ├── chatStore.ts // Estado do chat
│ └── streamStore.ts // Estado da stream
├── lib/
│ ├── firebase/
│ │ ├── config.ts // Configuração Firebase
│ │ └── client.ts // Cliente Firebase
│ └── youtube/
│ ├── config.ts // Configuração YouTube API
│ └── client.ts // Cliente YouTube
├── types/
│ ├── game.ts // Tipos do jogo
│ ├── stream.ts // Tipos da stream
│ ├── chat.ts // Tipos do chat
│ └── metrics.ts // Novos tipos para métricas
├── utils/
│ ├── validation.ts // Funções de validação
│ └── numbers.ts // Funções de números
└── app.tsx // Componente raiz

//depois do teste

C:\Users\jobs\Documents\bingo-bet-fun-2025> tree /f src
Auflistung der Ordnerpfade
Volumeseriennummer : BE24-0547
C:\USERS\JOBS\DOCUMENTS\BINGO-BET-FUN-2025\SRC
│ app.tsx
│  
├───components
│ ├───game
│ │ ├───BingoCard
│ │ │ index.tsx
│ │ │ styles.ts
│ │ │  
│ │ ├───Chat
│ │ │ index.tsx
│ │ │ styles.ts
│ │ │  
│ │ ├───GameControls
│ │ │ index.tsx
│ │ │ styles.ts
│ │ │  
│ │ └───StreamViewer
│ │ index.tsx
│ │ styles.ts
│ │
│ └───ui
│ button.tsx
│
├───lib
│ │ utils.ts
│ │  
│ ├───firebase
│ │ client.ts
│ │ config.ts
│ │  
│ └───youtube
│ client.ts
│ config.ts
│
├───stores
│ chatStore.ts
│ gameStore.ts
│ streamStore.ts
│  
├───types
│ chat.ts
│ game.ts
│ stream.ts
│
└───utils
numbers.ts
validation.ts

        BINGO-BET-FUN-2025/

├── src/
│ ├── services/
│ │ └── chat/
│ │ └── ChatService.ts
│ ├── components/
│ │ └── chat/
│ │ └── ChatRoom.tsx
│ ├── hooks/
│ │ └── chat/
│ │ └── useChat.ts
│ └── types/
│ └── chat/
│ └── index.ts
└── scripts/
└── organize-tree.ts

    BINGO-BET-FUN-2025/          # Raiz do projeto

├── src/ # Código fonte da aplicação
│ ├── services/
│ │ └── chat/
│ │ └── ChatService.ts
│ ├── components/
│ └── ...
├── scripts/ # Scripts de utilidade na raiz
│ ├── organize-tree.ts
│ ├── build-validation.ts
│ └── staging-setup.ts
├── public/
├── package.json
└── ...

project/
├── src/
│ ├── components/
│ │ └── youtube/
│ │ └── YouTubeStreamViewer.tsx
│ ├── config/
│ │ └── youtube.config.ts
│ ├── hooks/
│ │ └── useYoutubeStream.ts
│ └── views/
│ └── YoutubeStreamView.tsx
├── .env
└── vite.config.ts

src/
├── features/
│ └── ai/
│ ├── services/
│ │ └── claude.service.ts # Claude API service
│ ├── hooks/
│ │ └── useClaudeAssistant.ts # Custom hook for Claude
│ ├── types/
│ │ └── claude.types.ts # Type definitions
│ └── components/
│ ├── ClaudeAssistant.tsx # Main assistant component
│ ├── ClaudeChat.tsx # Chat interface
│ └── ClaudeGameTips.tsx # Game-specific assistance
├── lib/
│ └── claude/
│ ├── config.ts # Claude configuration
│ └── utils.ts # Helper functions
└── components/
└── ui/
└── streaming-room/
└── StreamingRoom.tsx # Updated with Claude integration

            src/

└── features/
└── player/
├── components/
│ └── Dashboard/
│ ├── index.tsx // Main PlayerDashboard component
│ ├── StatsCard.tsx // Optional: Extracted stat card component
│ └── Achievements.tsx // Optional: Extracted achievements component
├── types/
│ └── dashboard.types.ts // Types for dashboard data
└── hooks/
└── usePlayerStats.ts // Custom hook for player statistics

BINGO-BET-FUN-2025/
├── src/
│ ├── components/
│ │ ├── game/
│ │ │ ├── BingoCard/
│ │ │ ├── GameStats/
│ │ │ └── GameControls/
│ │ ├── stream/
│ │ ├── chat/
│ │ └── layout/
│ ├── features/
│ │ └── game/
│ │ └── GameInterface.tsx // Our complete interface
│ ├── App.tsx
│ └── main.tsx
├── package.json
├── vite.config.ts
└── tsconfig.json

bingobet-maintainer/
├── bin/
│   └── bingo-maintain.ts    # Ponto de entrada do CLI
├── src/
│   ├── core/               # Lógica principal
│   │   ├── Runner.ts
│   │   ├── Analyzer.ts
│   │   └── Fixer.ts
│   ├── auth/              # Sistema de autenticação
│   │   └── index.ts
│   ├── types/            # Definições de tipos
│   │   └── index.ts
│   └── utils/            # Utilitários
│       └── logger.ts
├── dist/                 # Código compilado
├── tests/               # Testes
├── package.json
├── tsconfig.json
└── .bingomaintainrc.json

BINGO-BET-FUN-2025/
├── packages/
│   └── maintainer/
│       ├── bin/
│       │   └── bingo-maintain.ts     # CLI entry point
│       ├── src/
│       │   ├── core/
│       │   │   ├── analyzers/
│       │   │   │   ├── CodeComplexityAnalyzer.ts
│       │   │   │   └── IntegratedAnalyzer.ts
│       │   │   ├── Runner.ts
│       │   │   └── Fixer.ts
│       │   ├── auth/
│       │   │   └── index.ts
│       │   └── types/
│       │       └── index.ts
│       ├── package.json
│       ├── tsconfig.json
│       └── .bingomaintainrc.json