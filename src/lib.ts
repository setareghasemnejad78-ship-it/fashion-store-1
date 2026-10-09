const eur = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
export const formatPrice = (value: number) => eur.format(value);

export const FREE_SHIPPING_FROM = 100;
export const SHIPPING_FEE = 4.9;
export const shippingFor = (subtotal: number) =>
  subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
export const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB");
