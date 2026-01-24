import geoip from 'geoip-lite'

export const getGeoLocation = ip => {
  try {
    const geo = geoip.lookup(ip)
    if (!geo) return { country: null, city: null }

    return {
      country: geo.country || null,
      city: geo.city || null,
    }
  } catch (error) {
    console.error('GEO_LOOKUP_ERROR:', error)
    return { country: null, city: null }
  }
}
