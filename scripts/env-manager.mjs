#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const environments = ['development', 'production', 'staging'];

async function switchEnvironment() {
  console.log('\nDisponíveis ambientes:');
  environments.forEach((env, index) => {
    console.log(`${index + 1}. ${env}`);
  });

  const answer = await question('\nEscolha o ambiente (número): ');
  const selectedIndex = parseInt(answer) - 1;

  if (selectedIndex >= 0 && selectedIndex < environments.length) {
    const selectedEnv = environments[selectedIndex];
    try {
      const envContent = readFileSync(`.env.${selectedEnv}`, 'utf8');
      writeFileSync('.env', envContent);
      console.log(`\n✅ Ambiente alterado para ${selectedEnv}`);
    } catch (error) {
      console.error(`\n❌ Erro ao trocar ambiente: ${error.message}`);
    }
  } else {
    console.log('\n❌ Seleção inválida');
  }

  rl.close();
}

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

// Executa o script
console.log('🔧 Gerenciador de Ambientes BingoBetFun');
switchEnvironment().catch(console.error);
