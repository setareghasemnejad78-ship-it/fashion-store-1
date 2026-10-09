export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-img" />
          <div className="skeleton-line" />
          <div className="skeleton-line short" />
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="state" role="alert">
      <h2>We couldn’t load the products</h2>
      <p>{message}. Check your connection and try again.</p>
      <button className="btn" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}

export function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="state">
      <h2>No products match your filters</h2>
      <p>Try a different search term or remove a filter.</p>
      <button className="btn" onClick={onClear}>
        Clear all filters
      </button>
    </div>
  );
}
