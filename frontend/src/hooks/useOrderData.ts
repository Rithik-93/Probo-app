import { useMemo } from 'react';

interface PriceData {
  total: number;
}

interface MergedData {
  yes: Record<string, PriceData>;
  no: Record<string, PriceData>;
}

const useOrderData = (mergedData: MergedData) => {
  const getTotalOrders = (orders: Record<string, PriceData>) =>
    Object.values(orders).reduce((acc, curr) => acc + curr.total, 0);

  const getPrice = (orders: Record<string, PriceData>) => {
    const prices = Object.keys(orders);
    return prices.length > 0 ? Number(prices[0]) : 0;
  };

  const yesOrders = useMemo(() => getTotalOrders(mergedData.yes), [mergedData.yes]);
  const noOrders = useMemo(() => getTotalOrders(mergedData.no), [mergedData.no]);
  const totalTraders = useMemo(() => yesOrders + noOrders, [yesOrders, noOrders]);

  const yesPrice = useMemo(() => getPrice(mergedData.yes), [mergedData.yes]);
  const noPrice = useMemo(() => getPrice(mergedData.no), [mergedData.no]);

  return { yesOrders, noOrders, totalTraders, yesPrice, noPrice };
};

export default useOrderData;
