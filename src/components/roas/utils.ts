export const calculateRoas = (vendas: number | null, valorAds: number | null): string => {
  if (!vendas || !valorAds || valorAds === 0) return '0.00';
  return (vendas / valorAds).toFixed(2);
};