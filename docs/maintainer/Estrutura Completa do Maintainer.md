packages/maintainer/
├── bin/
│ └── bingo-maintain.ts
├── src/
│ ├── auth/
│ │ ├── index.ts // Exportações do módulo auth
│ │ ├── AuthService.ts // Serviço principal de autenticação
│ │ ├── TokenManager.ts // Gerenciamento de tokens JWT
│ │ └── SecurityValidator.ts // Validação de segurança
│ ├── core/
│ │ ├── index.ts // Exportações do módulo core
│ │ ├── Runner.ts // Executor principal de análises
│ │ ├── Reporter.ts // Gerador de relatórios
│ │ ├── AutoFixer.ts // Sistema de correções automáticas
│ │ └── analyzers/
│ │ ├── index.ts // Exportações dos analisadores
│ │ ├── BaseAnalyzer.ts // Classe base para analisadores
│ │ ├── CodeComplexityAnalyzer.ts
│ │ ├── IntegratedAnalyzer.ts
│ │ ├── DuplicationAnalyzer.ts // FALTANDO
│ │ ├── SecurityAnalyzer.ts // FALTANDO
│ │ ├── PerformanceAnalyzer.ts // FALTANDO
│ │ └── TypeCheckAnalyzer.ts // FALTANDO
│ ├── utils/
│ │ ├── index.ts // FALTANDO
│ │ ├── logger.ts // FALTANDO
│ │ ├── config.ts // FALTANDO
│ │ └── formatters.ts // FALTANDO
│ ├── notifications/
│ │ ├── index.ts // FALTANDO
│ │ ├── NotificationService.ts // FALTANDO
│ │ ├── SlackNotifier.ts // FALTANDO
│ │ └── EmailNotifier.ts // FALTANDO
│ └── types/
│ ├── index.ts // Exportações de tipos
│ ├── analyzers.ts // Tipos para analisadores
│ ├── auth.ts // Tipos para autenticação
│ └── reports.ts // Tipos para relatórios
├── tests/
│ ├── unit/ // FALTANDO
│ ├── integration/ // FALTANDO
│ └── fixtures/ // FALTANDO
├── config/
│ ├── default.json // FALTANDO
│ └── schema.json // FALTANDO
└── docs/
├── README.md // FALTANDO
├── CONTRIBUTING.md // FALTANDO
└── API.md // FALTANDO

packages/maintainer/

- └── tests/
-       └── unit/
-           └── chat/
-               └── message-validation.test.ts

/tests/
├── unit/
│ ├── chat/
│ │ ├── message-validation.test.ts
│ │ ├── rate-limiting.test.ts
│ │ └── content-filtering.test.ts
│ ├── community/
│ │ ├── user-profiles.test.ts
│ │ └── moderation.test.ts
│ └── interactions/
│ ├── user-actions.test.ts
│ └── rewards.test.ts
├── integration/
│ ├── real-time-communication.test.ts
│ └── user-sessions.test.ts
└── performance/
├── chat-load.test.ts
└── concurrent-users.test.ts
