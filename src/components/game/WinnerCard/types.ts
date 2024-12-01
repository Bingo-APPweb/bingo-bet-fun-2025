// WinnerCard/types.ts
export interface WinnerCardProps {
  winner: Winner;
  prize: number;
  onClose: () => void;
}

export interface Winner {
  id: string;
  name: string;
  score: number;
  gameTime: number;
}
