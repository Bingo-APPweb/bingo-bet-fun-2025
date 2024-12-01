// src/pages/game.tsx
import StreamIntegration from '@/components/stream/StreamIntegration';

export default function GamePage() {
  return (
    <div className="container mx-auto">
      <h1>Bingo Game</h1>
      <StreamIntegration 
        onNumbersGenerated={numbers => console.log(numbers)} 
        isDevelopment={true}
      />
      {/* Outros componentes do jogo */}
    </div>
  );
}