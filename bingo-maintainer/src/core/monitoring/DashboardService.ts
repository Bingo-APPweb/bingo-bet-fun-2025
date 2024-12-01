
import { WebSocket } from 'ws';
import { BingoMetric } from '../../types/monitoring';

export class DashboardService {
  private clients: Set<WebSocket> = new Set();

  initialize(server: any): void {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
      this.clients.add(ws);
      ws.on('close', () => this.clients.delete(ws));
    });
  }

  broadcastMetric(metric: BingoMetric): void {
    const message = JSON.stringify({
      type: 'METRIC_UPDATE',
      data: metric,
    });

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}
