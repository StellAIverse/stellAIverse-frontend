'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Button from '@/components/Button';
import MetricLineChart from '@/components/metrics/MetricLineChart';
import MetricSeriesTable from '@/components/metrics/MetricSeriesTable';
import type { MetricsPanelResponse, MetricsPanelsResponse, MetricsRange } from '@/lib/metrics/types';
import { panelToCsv } from '@/lib/metrics/csv';

const RANGES: MetricsRange[] = ['15m', '1h', '6h', '24h', '7d'];

function downloadText(filename: string, text: string, type = 'text/plain') {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function MetricsDashboardPage() {
  const [group, setGroup] = useState<'system' | 'business'>('system');
  const [range, setRange] = useState<MetricsRange>('1h');
  const [step, setStep] = useState(30);
  const [seriesFilter, setSeriesFilter] = useState('');

  const panelsQuery = useQuery<MetricsPanelsResponse>({
    queryKey: ['metrics-panels'],
    queryFn: async () => {
      const res = await fetch('/api/metrics/panels');
      if (!res.ok) throw new Error('Failed to load panels');
      return res.json();
    },
    staleTime: 60_000,
  });

  const panels = panelsQuery.data?.panels || [];
  const filteredPanels = useMemo(
    () => panels.filter((p) => p.group === group),
    [panels, group]
  );

  const [panelId, setPanelId] = useState<string>('');
  const effectivePanelId = panelId || filteredPanels[0]?.id || '';

  const panelQuery = useQuery<MetricsPanelResponse>({
    queryKey: ['metrics-panel', effectivePanelId, range, step],
    enabled: Boolean(effectivePanelId),
    queryFn: async () => {
      const u = new URL('/api/metrics/panel', window.location.origin);
      u.searchParams.set('panelId', effectivePanelId);
      u.searchParams.set('range', range);
      u.searchParams.set('step', String(step));
      const res = await fetch(u.pathname + u.search);
      if (!res.ok) throw new Error('Failed to load panel');
      return res.json();
    },
    staleTime: 15_000,
  });

  const series = useMemo(() => {
    const s = panelQuery.data?.series || [];
    const f = seriesFilter.trim().toLowerCase();
    if (!f) return s;
    return s.filter((x) => x.seriesName.toLowerCase().includes(f));
  }, [panelQuery.data, seriesFilter]);

  const source = panelsQuery.data?.source || 'mock';
  const selectedPanel = panels.find((p) => p.id === effectivePanelId) || null;

  const handleExport = () => {
    if (!panelQuery.data) return;
    const csv = panelToCsv({ ...panelQuery.data, series });
    downloadText(`metrics-${effectivePanelId}-${range}.csv`, csv, 'text/csv');
  };

  return (
    <main className="pt-20 pb-20 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-bold glow-text">System & Business Dashboard</h1>
          <p className="text-gray-300 text-lg">
            Prometheus / OpenTelemetry-compatible metrics with filtering + export. PII is blocked at the API layer.
          </p>
          <p className="text-gray-500 text-sm">
            Source: <span className="text-gray-300 font-semibold">{source}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <Button variant={group === 'system' ? 'primary' : 'outline'} onClick={() => setGroup('system')}>
            System
          </Button>
          <Button variant={group === 'business' ? 'primary' : 'outline'} onClick={() => setGroup('business')}>
            Business
          </Button>

          <div className="h-6 w-px bg-cosmic-purple/30 mx-1" />

          <label className="text-sm text-gray-300">
            Panel
            <select
              className="ml-2 bg-cosmic-dark/60 border border-cosmic-purple/30 rounded px-3 py-2"
              value={effectivePanelId}
              onChange={(e) => setPanelId(e.target.value)}
            >
              {filteredPanels.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-gray-300">
            Range
            <select
              className="ml-2 bg-cosmic-dark/60 border border-cosmic-purple/30 rounded px-3 py-2"
              value={range}
              onChange={(e) => setRange(e.target.value as MetricsRange)}
            >
              {RANGES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-gray-300">
            Step
            <input
              className="ml-2 w-24 bg-cosmic-dark/60 border border-cosmic-purple/30 rounded px-3 py-2"
              type="number"
              min={5}
              max={300}
              value={step}
              onChange={(e) => setStep(Number(e.target.value || 30))}
            />
          </label>

          <Button variant="secondary" onClick={handleExport} disabled={!panelQuery.data || series.length === 0}>
            Export CSV
          </Button>
        </div>

        {selectedPanel ? (
          <div className="p-6 rounded-lg border border-cosmic-purple/30 nebula-bg">
            <div className="flex flex-col gap-1 mb-4">
              <h2 className="text-2xl font-bold glow-text">{selectedPanel.title}</h2>
              {selectedPanel.description ? <p className="text-gray-300">{selectedPanel.description}</p> : null}
            </div>

            <div className="flex flex-wrap gap-3 items-center mb-4">
              <label className="text-sm text-gray-300">
                Filter series
                <input
                  className="ml-2 w-72 max-w-full bg-cosmic-dark/60 border border-cosmic-purple/30 rounded px-3 py-2"
                  placeholder="e.g. job=api"
                  value={seriesFilter}
                  onChange={(e) => setSeriesFilter(e.target.value)}
                />
              </label>
              <div className="text-sm text-gray-400">
                Showing <span className="text-gray-200 font-semibold">{series.length}</span> series
              </div>
            </div>

            {panelsQuery.isLoading ? <p className="text-gray-400">Loading panels…</p> : null}
            {panelsQuery.isError ? <p className="text-red-300">Failed to load panels.</p> : null}

            {panelQuery.isLoading ? <p className="text-gray-400">Loading metrics…</p> : null}
            {panelQuery.isError ? <p className="text-red-300">Failed to load metrics.</p> : null}

            {panelQuery.data ? (
              <div className="space-y-6">
                <MetricLineChart series={series} />
                <MetricSeriesTable series={series} />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="text-gray-400">No panels available.</div>
        )}
      </div>
    </main>
  );
}

