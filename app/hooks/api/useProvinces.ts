import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { MapPin } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface RawProvince {
  ctn: string;
  pn: string;
  spid: number;
  spn: string;
  pusn: string;
  spusn: string;
}

export interface ProvinceOption {
  value: string;
  label: string;
  province: string;
  icon: React.ReactElement;
}

const fetchProvinces = async (): Promise<RawProvince[]> => {
  const response = await axios.get(`${API_URL}/provinces`);
  return response.data.data;
};

const transformToOptions = (data: RawProvince[]): ProvinceOption[] => {
  const map = new Map<string, ProvinceOption>();

  for (const p of data) {
    if (!p.pn && !p.spn) continue;
    const isProvinceOnly = !p.spn || p.spn === p.pn;
    const name = isProvinceOnly ? p.pn : `${p.spn}, ${p.pn}`;
    const value = p.spid ? p.spid.toString() : p.pusn;

    if (!map.has(value)) {
      map.set(value, {
        value,
        label: name,
        province: p.pn,
        icon: React.createElement(MapPin, {
          size: 14,
          className: 'flex-shrink-0',
        }),
      });
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.label.localeCompare(b.label)
  );
};

export const useProvinces = () => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: fetchProvinces,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000,    // keep in cache for 1 hour
    refetchOnWindowFocus: false,
    select: transformToOptions,
  });
};

/**
 * Returns a Map<string, string> from province spid (as string) to display name.
 * Useful for resolving stored location IDs (e.g. "304") to human-readable names.
 */
export const useProvinceLookup = () => {
  const { data } = useQuery({
    queryKey: ['provinces'],
    queryFn: fetchProvinces,
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return React.useMemo(() => {
    const map = new Map<string, string>();
    if (!data) return map;
    for (const p of data) {
      if (!p.pn && !p.spn) continue;
      const isProvinceOnly = !p.spn || p.spn === p.pn;
      const name = isProvinceOnly ? p.pn : `${p.spn}, ${p.pn}`;
      const key = p.spid ? p.spid.toString() : p.pusn;
      if (!map.has(key)) map.set(key, name);
    }
    return map;
  }, [data]);
};

