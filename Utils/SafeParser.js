export const safeParse = (data, fallback = null) => {
  try {
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}
