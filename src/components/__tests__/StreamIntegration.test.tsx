import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StreamIntegration } from '@/components/StreamIntegration';

describe('StreamIntegration', () => {
  it('should render connect button when not connected', () => {
    render(
      <StreamIntegration 
        onNumbersGenerated={vi.fn()}
        roomId="test-room"
      />
    );

    expect(screen.getByText(/connect/i)).toBeInTheDocument();
  });

  it('should handle stream connection', async () => {
    const onNumbersGenerated = vi.fn();
    
    render(
      <StreamIntegration 
        onNumbersGenerated={onNumbersGenerated}
        roomId="test-room"
      />
    );

    const urlInput = screen.getByPlaceholderText(/enter.*url/i);
    const connectButton = screen.getByText(/connect/i);

    fireEvent.change(urlInput, { target: { value: 'https://youtube.com/watch?v=test123' } });
    fireEvent.click(connectButton);

    expect(await screen.findByText(/connected/i)).toBeInTheDocument();
  });
});