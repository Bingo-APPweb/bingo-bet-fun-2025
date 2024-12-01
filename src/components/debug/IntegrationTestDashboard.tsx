import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useGame } from '@/features/game/GameProvider';
import { Check, AlertTriangle, RefreshCw } from 'lucide-react';

const IntegrationTestDashboard = () => {
  const { metrics, bingoNumbers, gameState, isValidated } = useGame();
  const [testResults, setTestResults] = useState<{
    firebase: boolean;
    youtube: boolean;
    anthropic: boolean;
  }>({
    firebase: false,
    youtube: false,
    anthropic: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTests = async () => {
    setLoading(true);
    setError(null);
    const results = { ...testResults };

    try {
      // Teste Firebase
      const services = initializeServices();
      await services.getYouTubeMetrics(import.meta.env.VITE_DEFAULT_CHANNEL);
      results.firebase = true;

      // Teste YouTube
      if (metrics && Object.keys(metrics).length > 0) {
        results.youtube = true;
      }

      // Teste Anthropic
      if (isValidated) {
        results.anthropic = true;
      }

      setTestResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTests();
  }, [metrics, isValidated]);

  return (
    <div className='space-y-6 p-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            Dashboard de Teste de Integração
            <Button variant='outline' size='sm' onClick={runTests} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Testar Novamente
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {/* Status das Integrações */}
            <div className='grid gap-4'>
              {Object.entries(testResults).map(([service, status]) => (
                <div
                  key={service}
                  className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                >
                  <span className='capitalize'>{service}</span>
                  {status ? (
                    <Check className='h-5 w-5 text-green-500' />
                  ) : (
                    <AlertTriangle className='h-5 w-5 text-yellow-500' />
                  )}
                </div>
              ))}
            </div>

            {/* Métricas Atuais */}
            {metrics && (
              <div className='mt-4'>
                <h3 className='text-sm font-medium mb-2'>Métricas Recebidas:</h3>
                <pre className='bg-gray-50 p-3 rounded-lg overflow-auto text-xs'>
                  {JSON.stringify(metrics, null, 2)}
                </pre>
              </div>
            )}

            {/* Números do Bingo */}
            {bingoNumbers.length > 0 && (
              <div className='mt-4'>
                <h3 className='text-sm font-medium mb-2'>Números Gerados:</h3>
                <div className='flex flex-wrap gap-2'>
                  {bingoNumbers.map((num) => (
                    <span
                      key={num}
                      className='inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded'
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Estado de Validação */}
            <div className='mt-4'>
              <h3 className='text-sm font-medium mb-2'>Estado da Validação:</h3>
              <Alert variant={isValidated ? 'default' : 'warning'}>
                <AlertDescription>
                  {isValidated
                    ? 'Estado do jogo validado com sucesso'
                    : 'Aguardando validação do estado do jogo'}
                </AlertDescription>
              </Alert>
            </div>

            {/* Erros */}
            {error && (
              <Alert variant='destructive' className='mt-4'>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationTestDashboard;
