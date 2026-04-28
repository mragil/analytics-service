import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useSiteStats } from '../lib/hooks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Route = createFileRoute('/sites/$id')({
  component: SiteDetailPage,
});

function SiteDetailPage() {
  const { id } = Route.useParams();
  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [to, setTo] = useState(() => new Date().toISOString().split('T')[0]);
  const [tab, setTab] = useState('pages');

  const { data, isLoading } = useSiteStats(id, from, to);

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  const tabs = [
    { key: 'pages', label: 'Top Pages' },
    { key: 'referrers', label: 'Referrers' },
    { key: 'geo', label: 'Geography' },
    { key: 'devices', label: 'Devices' },
    { key: 'browsers', label: 'Browsers' },
    { key: 'os', label: 'Operating Systems' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Site Details</h1>
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

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Visits Over Time</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.timeSeries || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="visits" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 px-6">
          <nav className="flex gap-4">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === t.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          <DataTable tab={tab} data={data} />
        </div>
      </div>
    </div>
  );
}

function DataTable({ tab, data }: { tab: string; data: any }) {
  const items = data?.[tab] || [];

  const renderRow = (item: any) => {
    switch (tab) {
      case 'pages':
        return (
          <>
            <td className="px-4 py-3 text-sm text-gray-900 truncate max-w-xs">{item.url}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{item.visits}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{item.uniques}</td>
          </>
        );
      case 'referrers':
        return (
          <>
            <td className="px-4 py-3 text-sm text-gray-900">{item.referrer}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{item.visits}</td>
          </>
        );
      case 'geo':
        return (
          <>
            <td className="px-4 py-3 text-sm text-gray-900">{item.country}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{item.city || '-'}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{item.visits}</td>
          </>
        );
      default:
        return (
          <>
            <td className="px-4 py-3 text-sm text-gray-900">{item[tab === 'devices' ? 'device' : tab === 'browsers' ? 'browser' : 'os']}</td>
            <td className="px-4 py-3 text-sm text-gray-600">{item.visits}</td>
          </>
        );
    }
  };

  const headers = {
    pages: ['Page', 'Visits', 'Uniques'],
    referrers: ['Referrer', 'Visits'],
    geo: ['Country', 'City', 'Visits'],
    devices: ['Device', 'Visits'],
    browsers: ['Browser', 'Visits'],
    os: ['OS', 'Visits'],
  };

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200">
          {headers[tab as keyof typeof headers]?.map((h) => (
            <th key={h} className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {items.map((item: any, i: number) => (
          <tr key={i}>{renderRow(item)}</tr>
        ))}
      </tbody>
    </table>
  );
}
