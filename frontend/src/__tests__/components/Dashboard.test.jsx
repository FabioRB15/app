import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import DashboardPreview from '../../components/DashboardPreview';

// Mock API server
const server = setupServer(
  rest.get('http://localhost:8001/api/dashboard/stats', (req, res, ctx) => {
    return res(
      ctx.json({
        stats: [
          { title: 'Servidores Ativos', value: '3', change: '+12%', trend: 'up' },
          { title: 'Jogadores Online', value: '210', change: '+8%', trend: 'up' },
          { title: 'Uptime Médio', value: '99.9%', change: '+0.1%', trend: 'up' },
          { title: 'Latência Média', value: '12ms', change: '-2ms', trend: 'down' },
        ]
      })
    );
  }),

  rest.get('http://localhost:8001/api/servers', (req, res, ctx) => {
    return res(
      ctx.json({
        servers: [
          {
            id: '1',
            name: 'Minecraft Java',
            players: '2-100',
            price: 'R$ 15,90',
            ram: '2GB',
            storage: '10GB SSD',
            status: 'online',
            image: 'minecraft.jpg'
          },
          {
            id: '2', 
            name: 'Counter-Strike 2',
            players: '1-64',
            price: 'R$ 25,90',
            ram: '4GB',
            storage: '20GB SSD',
            status: 'online',
            image: 'cs2.jpg'
          }
        ]
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('DashboardPreview Component', () => {
  test('renders loading state initially', () => {
    render(<DashboardPreview />);
    
    expect(screen.getByText(/carregando/i) || screen.getByTestId('loading')).toBeInTheDocument();
  });

  test('displays dashboard statistics after loading', async () => {
    render(<DashboardPreview />);

    // Wait for stats to load
    await waitFor(() => {
      expect(screen.getByText('Servidores Ativos')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('+12%')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Jogadores Online')).toBeInTheDocument();
      expect(screen.getByText('210')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Uptime Médio')).toBeInTheDocument();
      expect(screen.getByText('99.9%')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Latência Média')).toBeInTheDocument();
      expect(screen.getByText('12ms')).toBeInTheDocument();
    });
  });

  test('displays server list after loading', async () => {
    render(<DashboardPreview />);

    // Wait for servers to load
    await waitFor(() => {
      expect(screen.getByText('Minecraft Java')).toBeInTheDocument();
      expect(screen.getByText('R$ 15,90')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Counter-Strike 2')).toBeInTheDocument();
      expect(screen.getByText('R$ 25,90')).toBeInTheDocument();
    });
  });

  test('shows online status for servers', async () => {
    render(<DashboardPreview />);

    await waitFor(() => {
      const statusElements = screen.getAllByText('online');
      expect(statusElements.length).toBeGreaterThan(0);
    });
  });

  test('handles API error gracefully', async () => {
    // Override server with error response
    server.use(
      rest.get('http://localhost:8001/api/dashboard/stats', (req, res, ctx) => {
        return res(ctx.status(500));
      }),
      rest.get('http://localhost:8001/api/servers', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<DashboardPreview />);

    // Should show error state or fallback UI
    await waitFor(() => {
      expect(
        screen.getByText(/erro/i) || 
        screen.getByText(/falha/i) ||
        screen.getByTestId('error-state')
      ).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('shows correct trend indicators', async () => {
    render(<DashboardPreview />);

    await waitFor(() => {
      // Should have up trend indicators
      const upTrends = screen.getAllByText('+12%');
      expect(upTrends.length).toBeGreaterThan(0);
    });
  });
});

describe('DashboardPreview Integration', () => {
  test('matches API contract for stats', async () => {
    render(<DashboardPreview />);

    await waitFor(() => {
      // Verify all required stat fields are displayed
      expect(screen.getByText('Servidores Ativos')).toBeInTheDocument();
      expect(screen.getByText('Jogadores Online')).toBeInTheDocument();  
      expect(screen.getByText('Uptime Médio')).toBeInTheDocument();
      expect(screen.getByText('Latência Média')).toBeInTheDocument();
    });
  });

  test('matches API contract for servers', async () => {
    render(<DashboardPreview />);

    await waitFor(() => {
      // Verify server data structure
      expect(screen.getByText('Minecraft Java')).toBeInTheDocument();
      expect(screen.getByText('2-100')).toBeInTheDocument(); // players
      expect(screen.getByText('R$ 15,90')).toBeInTheDocument(); // price
      expect(screen.getByText('2GB')).toBeInTheDocument(); // ram
    });
  });
});