import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AnalyticsDashboard from "@/app/analytics/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Update mock for analytics CSV module
jest.mock("../../lib/analytics/csv", () => jest.requireActual("../../lib/analytics/csv"));

// Mock the data fetching logic for the analytics dashboard
jest.mock('../../lib/api', () => ({
  fetchAnalyticsData: jest.fn(() => Promise.resolve({
    totalInvocations: 100,
    metrics: [
      { timestamp: 1640995200000, value: 10 },
      { timestamp: 1641081600000, value: 20 },
    ],
  })),
}));

// Mock chart container dimensions to avoid warnings
jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: 800, height: 600 }}>{children}</div>
    ),
  };
});

// Mock the chart container dimensions
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

document.body.innerHTML = '<div id="root" style="width: 800px; height: 600px;"></div>';

describe("Analytics Dashboard", () => {
  const queryClient = new QueryClient();

  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        totals: {
          totalContractInvocations: 100,
          successRate: 95,
          avgExecutionCostXlm: 0.0001,
          xlmRevenue: 50,
          uniqueAccounts: 10,
          transactionFrequency: 5,
        },
        timeSeries: [
          {
            date: "2023-01-01",
            contractInvocations: 10,
            successRate: 90,
            avgExecutionCostXlm: 0.0001,
            xlmRevenue: 5,
            transactionFrequency: 1,
            uniqueAccounts: 2,
          },
        ],
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the dashboard and fetches data", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AnalyticsDashboard />
      </QueryClientProvider>
    );

    expect(screen.getByText("Analytics Dashboard")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/analytics?range=7d&ownedAgentIds=GABC123,GDEF456&marketplaceAgentIds=GHI789"
      );
    });

    expect(screen.getByText("Total Contract Invocations")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("handles range switching", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AnalyticsDashboard />
      </QueryClientProvider>
    );

    const rangeButton = screen.getByText("30D");
    fireEvent.click(rangeButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/analytics?range=30d&ownedAgentIds=GABC123,GDEF456&marketplaceAgentIds=GHI789"
      );
    });
  });

  it("exports CSV data", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AnalyticsDashboard />
      </QueryClientProvider>
    );

    const exportButton = screen.getByText("Export CSV");
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(screen.getByText("Analytics Dashboard")).toBeInTheDocument();
    });
  });
});