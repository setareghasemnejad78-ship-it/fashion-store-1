const rows = [
  ["Merino Crewneck", "Nordkamm", "knitwear", 89, null, "Ink", "#1f2a44", ["S", "M", "L", "XL"], 4.6, "Fine merino knit with a relaxed fit. Machine washable."],
  ["Chunky Cable Cardigan", "Nordkamm", "knitwear", 119, 149, "Oat", "#c9b79c", ["S", "M", "L"], 4.4, "Heavy cable knit with horn buttons."],
  ["Wool Overcoat", "Atelier Voss", "coats", 249, null, "Charcoal", "#3a3d42", ["S", "M", "L", "XL"], 4.8, "Single-breasted overcoat in a wool-cashmere blend."],
  ["Water-Repellent Parka", "Fjordline", "coats", 199, 249, "Moss", "#4d5b45", ["M", "L", "XL"], 4.5, "Recycled shell with a detachable hood."],
  ["Short Trench", "Atelier Voss", "coats", 179, null, "Sand", "#b9a27e", ["XS", "S", "M", "L"], 4.3, "Cotton gabardine trench cut above the knee."],
  ["Straight Selvedge Jeans", "Denimwerk", "trousers", 99, null, "Indigo", "#26385c", ["28", "30", "32", "34"], 4.7, "Japanese selvedge denim, mid rise, straight leg."],
  ["Pleated Wool Trousers", "Atelier Voss", "trousers", 129, 159, "Slate", "#575f69", ["S", "M", "L"], 4.2, "Tailored trousers with a double pleat."],
  ["Cotton Chinos", "Denimwerk", "trousers", 69, null, "Khaki", "#a89a78", ["28", "30", "32", "34"], 4.1, "Garment-dyed stretch cotton chinos."],
  ["Heavyweight Tee", "Basisco", "tops", 35, null, "White", "#ececea", ["XS", "S", "M", "L", "XL"], 4.6, "240 gsm organic cotton, boxy cut."],
  ["Oxford Shirt", "Basisco", "tops", 59, null, "Sky", "#9db7d1", ["S", "M", "L", "XL"], 4.4, "Brushed oxford cotton with a button-down collar."],
  ["Linen Camp Shirt", "Fjordline", "tops", 65, 79, "Rust", "#a4532f", ["S", "M", "L"], 4.0, "Breathable linen with a camp collar."],
  ["Leather Derby Shoes", "Schuhmacher 1921", "shoes", 189, null, "Brown", "#5a3a26", ["40", "41", "42", "43", "44"], 4.7, "Goodyear-welted derbies in calf leather."],
  ["Suede Chelsea Boots", "Schuhmacher 1921", "shoes", 169, 199, "Taupe", "#8b7765", ["40", "41", "42", "43"], 4.5, "Suede boots with elastic side gussets."],
  ["Canvas Low Sneakers", "Basisco", "shoes", 79, null, "Black", "#1c1c1e", ["39", "40", "41", "42", "43", "44"], 4.3, "Vulcanised sole, organic canvas upper."],
  ["Leather Belt", "Schuhmacher 1921", "accessories", 49, null, "Cognac", "#8a4b21", ["S", "M", "L"], 4.2, "Full-grain leather with a brushed steel buckle."],
  ["Ribbed Wool Beanie", "Nordkamm", "accessories", 29, null, "Heather", "#7d7f86", ["One size"], 4.5, "Soft lambswool beanie with a folded cuff."],
];

export const products = rows.map(
  ([name, brand, category, price, original, color, colorHex, sizes, rating, description], i) => ({
    id: i + 1,
    name,
    brand,
    category,
    price,
    originalPrice: original,
    color,
    colorHex,
    sizes,
    rating,
    description,
  }),
);
