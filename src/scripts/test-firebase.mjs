// 5. Script de Teste
// src/scripts/test-firebase.mjs

const { FirebaseTestService } = require('../lib/firebase/test.service');

async function testFirebaseSetup() {
  console.log('🔥 Testing Firebase Setup...\n');

  const testService = new FirebaseTestService();

  // Teste de conexão
  console.log('1. Testing connection...');
  const connected = await testService.testConnection();

  if (!connected) {
    console.error('❌ Firebase setup failed');
    return;
  }

  // Teste de criação de jogo
  console.log('\n2. Testing game creation...');
  const gameId = await testService.createInitialGame();

  if (gameId) {
    console.log(`✅ Test game created with ID: ${gameId}`);
  }

  console.log('\n🎮 Firebase setup complete!');
}

// Execute teste
testFirebaseSetup().catch(console.error);
