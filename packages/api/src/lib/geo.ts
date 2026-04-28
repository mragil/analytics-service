import maxmind from 'maxmind';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let geoLookup: any = null;

export async function initGeoLookup() {
  const dbPath = process.env.GEOLITE2_PATH;
  if (!dbPath) return null;
  try {
    geoLookup = await maxmind.open(dbPath);
  } catch {
    console.warn('GeoLite2 DB not found, geo lookups disabled');
  }
  return geoLookup;
}

export function lookupGeo(ip: string) {
  if (!geoLookup) return { country: null, city: null };
  const result = geoLookup.get(ip);
  if (!result) return { country: null, city: null };
  return {
    country: result.country?.names?.en || null,
    city: result.city?.names?.en || null,
  };
}
