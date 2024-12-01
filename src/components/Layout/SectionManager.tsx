// src/components/layout/SectionManager.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

type GameSection = 'stream' | 'bingo' | 'chat' | 'stats';

interface SectionInfo {
  id: GameSection;
  title: string;
  icon: React.ReactNode;
}

export const SectionManager = () => {
  const [currentSection, setCurrentSection] = useState<GameSection>('stream');

  const sections: SectionInfo[] = [
    { id: 'stream', title: 'Live Stream', icon: '📺' },
    { id: 'bingo', title: 'Bingo Card', icon: '🎮' },
    { id: 'chat', title: 'Live Chat', icon: '💭' },
    { id: 'stats', title: 'Game Stats', icon: '📊' },
  ];

  return (
    <div className='flex gap-2 p-4 bg-card rounded-lg shadow-sm'>
      {sections.map((section) => (
        <Button
          key={section.id}
          variant={currentSection === section.id ? 'default' : 'outline'}
          onClick={() => setCurrentSection(section.id)}
          className='flex items-center gap-2'
        >
          <span>{section.icon}</span>
          <span>{section.title}</span>
        </Button>
      ))}
    </div>
  );
};
