import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/products";
import { useDebounce } from "../hooks/useDebounce";
import type { ProductFilters } from "../types";
import Filters from "../components/Filters";
import ProductCard from "../components/ProductCard";
import { EmptyState, ErrorState, ProductGridSkeleton } from "../components/States";

export default function CatalogPage() {
  const [params, setParams] = useSearchParams();

  const filters: ProductFilters = {
    q: params.get("q") ?? "",
    category: params.get("category") ?? "",
    size: params.get("size") ?? "",
    maxPrice: params.get("maxPrice") ?? "",
    sort: params.get("sort") ?? "",
    page: Number(params.get("page") ?? 1),
  };

  const update = (key: keyof ProductFilters, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next);
  };

  const [search, setSearch] = useState(filters.q);
  const debouncedSearch = useDebounce(search, 300);
  useEffect(() => {
    if (debouncedSearch !== filters.q) update("q", debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const { data, isPending, isError, error, refetch, isPlaceholderData } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
    placeholderData: keepPreviousData,
  });

  const clearAll = () => {
    setSearch("");
    setParams(new URLSearchParams());
  };

  return (
    <div className="catalog">
      <div className="toolbar">
        <input
          type="search"
          aria-label="Search products"
          placeholder="Search by name, brand or colour"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label className="field inline">
          Sort by
          <select value={filters.sort} onChange={(e) => update("sort", e.target.value)}>
            <option value="">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
      </div>

      <div className="layout">
        <Filters
          filters={filters}
          categories={data?.categories ?? []}
          onChange={update}
          onClear={clearAll}
        />

        <section aria-live="polite">
          {isPending && <ProductGridSkeleton />}
          {isError && <ErrorState message={error.message} onRetry={() => refetch()} />}
          {data && data.items.length === 0 && <EmptyState onClear={clearAll} />}
          {data && data.items.length > 0 && (
            <>
              <p className="result-count">{data.total} products</p>
              <div className="grid" style={{ opacity: isPlaceholderData ? 0.6 : 1 }}>
                {data.items.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {data.totalPages > 1 && (
                <nav className="pager" aria-label="Pagination">
                  <button
                    className="btn secondary"
                    disabled={filters.page <= 1}
                    onClick={() => update("page", String(filters.page - 1))}
                  >
                    Previous
                  </button>
                  <span>
                    Page {data.page} of {data.totalPages}
                  </span>
                  <button
                    className="btn secondary"
                    disabled={filters.page >= data.totalPages}
                    onClick={() => update("page", String(filters.page + 1))}
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
