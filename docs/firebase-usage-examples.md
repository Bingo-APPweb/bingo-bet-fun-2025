# Exemplos de Uso do Firebase no BingoBetFun

## Referências do Banco
```typescript
import { database, DB_REFS } from '@/config/firebase';
import { ref, onValue, set } from 'firebase/database';
```

## 1. Monitoramento de Sala
```typescript
// Exemplo de uso em uma sala de jogo
const gameRef = ref(database, `${DB_REFS.games}/${roomId}`);
    
const unsubscribe = onValue(gameRef, (snapshot) => {
  const gameData = snapshot.val();
  console.log('Game data:', gameData);
});

// Importante: limpar listener
return () => unsubscribe();
```

## 2. Perfil de Usuário (Firestore)
```typescript
import { firestore, DB_REFS } from '@/config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

async function updateUserProfile(userId: string, data: any) {
  const userRef = doc(firestore, DB_REFS.users, userId);
  await updateDoc(userRef, data);
}
```

## 3. Chat em Tempo Real
```typescript
const sendMessage = async (message: string) => {
  const chatRef = ref(database, `${DB_REFS.chat}/${roomId}/messages`);
  const newMessage = {
    text: message,
    timestamp: Date.now(),
    userId: 'current-user-id'
  };
  
  await set(chatRef, newMessage);
};
```

## 4. Sistema de Métricas
```typescript
const updateMetrics = async (metrics: any) => {
  const metricsRef = ref(database, `${DB_REFS.metrics}/${gameId}`);
  await set(metricsRef, {
    ...metrics,
    timestamp: Date.now()
  });
};
```

## 5. Sistema de Recompensas
```typescript
const addReward = async (reward: any) => {
  const rewardRef = ref(database, `${DB_REFS.rewards}/${userId}`);
  await set(rewardRef, {
    ...reward,
    awardedAt: Date.now()
  });
};
```

## Boas Práticas
1. Sempre use as referências de DB_REFS
2. Limpe os listeners quando componente for desmontado
3. Trate erros adequadamente
4. Valide dados antes de salvar
5. Use tipagem TypeScript

## Estrutura do Banco
```
games/
  ├── [gameId]/
  │   ├── status
  │   ├── currentNumber
  │   ├── drawnNumbers[]
  │   └── players/
  │       └── [playerId]/
  │           ├── name
  │           ├── card[][]
  │           └── markedNumbers[]
users/
  └── [userId]/
      ├── profile
      └── stats
```