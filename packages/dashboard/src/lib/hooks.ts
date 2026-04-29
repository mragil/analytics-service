import api from './api';
import { useQuery } from '@tanstack/react-query';
import type { OverviewStats, SiteDetailStats, Site } from '@analytics/shared';

export function useOverviewStats(from?: string, to?: string) {
  return useQuery<OverviewStats>({
    queryKey: ['stats', from, to],
    queryFn: async () => {
      const { data } = await api.get('/stats', { params: { from, to } });
      return data;
    },
  });
}

export function useSiteStats(siteId: string, from?: string, to?: string) {
  return useQuery<SiteDetailStats>({
    queryKey: ['stats', siteId, from, to],
    queryFn: async () => {
      const { data } = await api.get(`/stats/${siteId}`, { params: { from, to } });
      return data;
    },
  });
}

export function useSites() {
  return useQuery<Site[]>({
    queryKey: ['sites'],
    queryFn: async () => {
      const { data } = await api.get('/sites');
      return data;
    },
  });
}

export function useMe() {
  return useQuery<{ id: string; name: string; domain: string }>({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await api.get('/me');
      return data;
    },
  });
}
