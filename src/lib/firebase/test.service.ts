// 4. Serviço de Teste Inicial
// src/lib/firebase/test.service.ts

import { db } from './config';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

export class FirebaseTestService {
  async testConnection() {
    try {
      // Tenta criar uma coleção de teste
      const testRef = doc(collection(db, '_test'));
      await setDoc(testRef, {
        timestamp: new Date(),
        status: 'connection_test',
      });

      // Tenta ler a coleção
      const snapshot = await getDocs(collection(db, '_test'));

      console.log('✅ Firebase connection successful');
      console.log(`Found ${snapshot.size} test documents`);

      return true;
    } catch (error) {
      console.error('❌ Firebase connection failed:', error);
      return false;
    }
  }

  async createInitialGame() {
    try {
      const gameRef = doc(collection(db, 'games'));

      await setDoc(gameRef, {
        status: 'waiting',
        hostId: 'test-host',
        createdAt: new Date(),
        updatedAt: new Date(),
        settings: {
          centerFree: true,
          autoMarkNumbers: true,
          winPatterns: ['fullHouse'],
        },
        players: {},
        currentNumber: null,
        drawnNumbers: [],
      });

      console.log('✅ Test game created:', gameRef.id);
      return gameRef.id;
    } catch (error) {
      console.error('❌ Failed to create test game:', error);
      return null;
    }
  }
}
