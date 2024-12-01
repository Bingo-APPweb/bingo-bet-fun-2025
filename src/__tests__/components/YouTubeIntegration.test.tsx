import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { YouTubeIntegration } from '@/components/YouTubeIntegration';
import { useYouTubeStream } from '@/hooks/useYouTubeStream';
import { MockYouTubeService } from '@/tests/mocks/YouTubeService';

// Mock do hook useYouTubeStream
jest.mock('@/hooks/useYouTubeStream');
const mockUseYouTubeStream = useYouTubeStream as jest.Mock;

// Mock do serviço do YouTube
const mockYouTubeService = new MockYouTubeService();

describe('YouTubeIntegration Component', () => {
  beforeEach(() => {
    // Reset dos mocks antes de cada teste
    jest.clearAllMocks();

    // Estado inicial padrão
    mockUseYouTubeStream.mockReturnValue({
      metrics: {
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        timestamp: new Date(),
      },
      isLoading: false,
      error: null,
      streamStatus: 'offline',
    });
  });

  it('should initialize with YouTube player when streamId is provided', async () => {
    render(<YouTubeIntegration streamId='test-stream-123' />);

    await waitFor(() => {
      expect(screen.getByTestId('youtube-player')).toBeInTheDocument();
    });
  });

  it('should handle stream metrics updates correctly', async () => {
    const mockMetrics = {
      viewCount: 1000,
      likeCount: 500,
      commentCount: 100,
      timestamp: new Date(),
    };

    mockUseYouTubeStream.mockReturnValue({
      metrics: mockMetrics,
      isLoading: false,
      error: null,
      streamStatus: 'live',
    });

    render(<YouTubeIntegration streamId='test-stream-123' />);

    await waitFor(() => {
      expect(screen.getByText('1000')).toBeInTheDocument(); // viewCount
      expect(screen.getByText('500')).toBeInTheDocument(); // likeCount
      expect(screen.getByText('100')).toBeInTheDocument(); // commentCount
    });
  });

  it('should generate bingo numbers from metrics', async () => {
    const mockMetrics = {
      viewCount: 1000,
      likeCount: 500,
      commentCount: 100,
      timestamp: new Date(),
    };

    mockUseYouTubeStream.mockReturnValue({
      metrics: mockMetrics,
      isLoading: false,
      error: null,
      streamStatus: 'live',
    });

    const { getByTestId } = render(
      <YouTubeIntegration streamId='test-stream-123' onNumbersGenerated={jest.fn()} />
    );

    await waitFor(() => {
      const generatedNumbers = getByTestId('generated-numbers');
      expect(generatedNumbers.children.length).toBeGreaterThan(0);
      // Verifica se os números gerados estão no intervalo válido (1-75)
      Array.from(generatedNumbers.children).forEach((numberElement) => {
        const number = parseInt(numberElement.textContent || '0');
        expect(number).toBeGreaterThanOrEqual(1);
        expect(number).toBeLessThanOrEqual(75);
      });
    });
  });

  it('should handle stream errors gracefully', async () => {
    mockUseYouTubeStream.mockReturnValue({
      metrics: null,
      isLoading: false,
      error: new Error('Stream not found'),
      streamStatus: 'error',
    });

    render(<YouTubeIntegration streamId='invalid-stream' />);

    await waitFor(() => {
      expect(screen.getByText(/Stream not found/i)).toBeInTheDocument();
    });
  });

  it('should update numbers when metrics change', async () => {
    const onNumbersGenerated = jest.fn();

    // Renderiza com métricas iniciais
    const { rerender } = render(
      <YouTubeIntegration streamId='test-stream-123' onNumbersGenerated={onNumbersGenerated} />
    );

    // Simula atualização de métricas
    mockUseYouTubeStream.mockReturnValue({
      metrics: {
        viewCount: 2000, // Novo valor
        likeCount: 1000,
        commentCount: 200,
        timestamp: new Date(),
      },
      isLoading: false,
      error: null,
      streamStatus: 'live',
    });

    // Re-renderiza com novas métricas
    rerender(
      <YouTubeIntegration streamId='test-stream-123' onNumbersGenerated={onNumbersGenerated} />
    );

    await waitFor(() => {
      expect(onNumbersGenerated).toHaveBeenCalledTimes(2);
    });
  });

  it('should respect rate limiting for number generation', async () => {
    jest.useFakeTimers();

    const onNumbersGenerated = jest.fn();

    render(
      <YouTubeIntegration
        streamId='test-stream-123'
        onNumbersGenerated={onNumbersGenerated}
        updateInterval={5000} // 5 segundos
      />
    );

    // Avança o tempo e verifica as chamadas
    act(() => {
      jest.advanceTimersByTime(20000); // Avança 20 segundos
    });

    expect(onNumbersGenerated).toHaveBeenCalledTimes(4); // 20s / 5s = 4 chamadas

    jest.useRealTimers();
  });

  it('should handle reconnection attempts on stream failure', async () => {
    // Simula falha inicial
    mockUseYouTubeStream.mockReturnValueOnce({
      metrics: null,
      isLoading: false,
      error: new Error('Connection failed'),
      streamStatus: 'error',
    });

    const { rerender } = render(<YouTubeIntegration streamId='test-stream-123' />);

    // Verifica mensagem de erro
    expect(screen.getByText(/Connection failed/i)).toBeInTheDocument();

    // Simula reconexão bem-sucedida
    mockUseYouTubeStream.mockReturnValue({
      metrics: {
        viewCount: 1000,
        likeCount: 500,
        commentCount: 100,
        timestamp: new Date(),
      },
      isLoading: false,
      error: null,
      streamStatus: 'live',
    });

    rerender(<YouTubeIntegration streamId='test-stream-123' />);

    await waitFor(() => {
      expect(screen.queryByText(/Connection failed/i)).not.toBeInTheDocument();
      expect(screen.getByTestId('youtube-player')).toBeInTheDocument();
    });
  });
});
