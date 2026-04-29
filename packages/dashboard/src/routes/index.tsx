import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useOverviewStats } from '../lib/hooks';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Route = createFileRoute('/')({
  component: OverviewPage,
});

function OverviewPage() {
  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [to, setTo] = useState(() => new Date().toISOString().split('T')[0]);

  const { data, isLoading } = useOverviewStats(from, to);

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <div className="flex gap-2">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <span className="self-center text-gray-500">to</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Total Visits" value={data?.totalVisits || 0} />
        <KpiCard label="Unique Visitors" value={data?.uniqueVisitors || 0} />
        <KpiCard label="Bounce Rate" value={`${data?.bounceRate || 0}%`} />
        <KpiCard label="Avg Duration" value={`${data?.avgDuration || 0}s`} />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Visits Over Time</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.timeSeries || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="uniques" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <InfoCard title="Devices" data={data?.devices || []} />
        <InfoCard title="Browsers" data={data?.browsers || []} />
        <InfoCard title="Operating Systems" data={data?.os || []} />
        <InfoCard title="Languages" data={data?.languages || []} valueKey="language" />
        <InfoCard title="Screen Sizes" data={data?.screenSizes || []} valueKey="screenSize" />
      </div>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function InfoCard({ title, data, valueKey = 'device' }: { title: string; data: any[]; valueKey?: string }) {
  const total = data.reduce((sum, item) => sum + item.visits, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.slice(0, 6).map((item, i) => {
          const pct = total > 0 ? ((item.visits / total) * 100).toFixed(1) : '0';
          return (
            <div key={i}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-700 truncate">{item[valueKey]}</span>
                <span className="text-gray-500 ml-2">{item.visits}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
        {data.length === 0 && (
          <p className="text-sm text-gray-400">No data yet</p>
        )}
      </div>
    </div>
  );
}
