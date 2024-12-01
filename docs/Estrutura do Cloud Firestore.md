// Estrutura principal do Firestore para BingoBetFun

// Coleção: games
interface Game {
hostId: string; // ID do host do jogo
status: 'pending' | 'active' | 'completed' | 'cancelled';
startTime: Timestamp; // Momento de início
settings: {
maxPlayers: number; // Máximo de jogadores (ex: 100)
centerFree: boolean; // Se o centro é livre
winningPatterns: { // Padrões de vitória permitidos
fullHouse: boolean; // Cartela completa
singleLine: boolean; // Linha única
}
};
currentNumbers: number[]; // Números já sorteados
players: {
[playerId: string]: {
name: string;
card: number[][]; // Cartela 5x5
markedNumbers: number[];
joinedAt: Timestamp;
status: 'active' | 'winner';
}
};
metrics: {
totalPlayers: number;
activeTime: number; // Tempo total de jogo
numbersDrawn: number; // Quantidade de números sorteados
}
}

// Coleção: players
interface Player {
userId: string;
displayName: string;
email: string;
stats: {
gamesPlayed: number;
gamesWon: number;
lastGameId: string;
winStreak: number;
joinDate: Timestamp;
};
achievements: {
firstWin: boolean;
winStreak5: boolean;
perfectGame: boolean; // Vitória sem erros
};
preferences: {
notifications: boolean;
autoMarkNumbers: boolean;
}

// Coleção: metrics
interface GameMetrics {
gameId: string;
timestamp: Timestamp;
snapshot: {
activePlayers: number;
totalGames: number;
onlineUsers: number;
activeTime: number;
};
hourly: {
[hour: string]: {
gamesStarted: number;
gamesCompleted: number;
newPlayers: number;
}
}
}
