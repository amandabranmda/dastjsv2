export const calculateRoas = (vendas: number | null, valorAds: number | null): string => {
  if (!vendas || !valorAds || valorAds === 0) return '0.00';
  return (vendas / valorAds).toFixed(2);
};

export const calculateCPL = (valorAds: number | null, envios: number | null): string => {
  if (!valorAds || !envios || envios === 0) return '0.00';
  return (valorAds / envios).toFixed(2);
};