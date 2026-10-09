import type { ProductFilters } from "../types";

const SIZES = ["XS", "S", "M", "L", "XL", "40", "42", "44"];

interface Props {
  filters: ProductFilters;
  categories: string[];
  onChange: (key: keyof ProductFilters, value: string) => void;
  onClear: () => void;
}

export default function Filters({ filters, categories, onChange, onClear }: Props) {
  return (
    <aside className="filters" aria-label="Filters">
      <fieldset>
        <legend>Category</legend>
        <button
          className={`chip ${filters.category === "" ? "active" : ""}`}
          onClick={() => onChange("category", "")}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            className={`chip ${filters.category === c ? "active" : ""}`}
            aria-pressed={filters.category === c}
            onClick={() => onChange("category", c)}
          >
            {c}
          </button>
        ))}
      </fieldset>

      <fieldset>
        <legend>Size</legend>
        {SIZES.map((s) => (
          <button
            key={s}
            className={`chip ${filters.size === s ? "active" : ""}`}
            aria-pressed={filters.size === s}
            onClick={() => onChange("size", filters.size === s ? "" : s)}
          >
            {s}
          </button>
        ))}
      </fieldset>

      <label className="field">
        Max price
        <select value={filters.maxPrice} onChange={(e) => onChange("maxPrice", e.target.value)}>
          <option value="">Any</option>
          <option value="50">Up to €50</option>
          <option value="100">Up to €100</option>
          <option value="200">Up to €200</option>
        </select>
      </label>

      <button className="link-btn" onClick={onClear}>
        Clear all filters
      </button>
    </aside>
  );
}
