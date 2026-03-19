const WISHLIST_STORAGE_KEY = "nord-living-wishlist";

export function getWishlistSlugs(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    window.localStorage.removeItem(WISHLIST_STORAGE_KEY);
    return [];
  }
}

export function isWishlisted(slug: string) {
  return getWishlistSlugs().includes(slug);
}

export function toggleWishlist(slug: string) {
  const current = getWishlistSlugs();
  const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
  return next;
}
