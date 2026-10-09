export function queryProducts(all, params = {}) {
  const { q, category, size, maxPrice, sort } = params;
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = Math.min(48, Math.max(1, Number(params.pageSize) || 12));

  let items = all.filter((p) => {
    if (q) {
      const hay = `${p.name} ${p.brand} ${p.category} ${p.color}`.toLowerCase();
      if (!q.toLowerCase().split(/\s+/).every((word) => hay.includes(word))) return false;
    }
    if (category && p.category !== category) return false;
    if (size && !p.sizes.includes(size)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    return true;
  });

  const sorters = {
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
  };
  if (sorters[sort]) items = [...items].sort(sorters[sort]);

  const total = items.length;
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export function getCategories(all) {
  return [...new Set(all.map((p) => p.category))].sort();
}
