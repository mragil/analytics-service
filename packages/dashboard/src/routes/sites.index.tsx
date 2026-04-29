import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import type { Site } from '@analytics/shared';

export const Route = createFileRoute('/sites/')({
  component: SitesPage,
});

function SitesPage() {
  const { data: sites, isLoading } = useQuery<Site[]>({
    queryKey: ['sites'],
    queryFn: async () => {
      const { data } = await api.get('/sites');
      return data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Sites</h1>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Domain</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">API Key</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sites?.map((site) => (
              <tr key={site.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{site.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{site.domain}</td>
                <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(site.apiKey);
                    }}
                    className="hover:text-blue-600"
                  >
                    {site.apiKey.slice(0, 12)}...
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(site.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <Link
                    to="/sites/$id"
                    params={{ id: site.id }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!sites || sites.length === 0) && (
          <div className="text-center py-8 text-gray-500">No sites configured. Run the seed script to add one.</div>
        )}
      </div>
    </div>
  );
}
