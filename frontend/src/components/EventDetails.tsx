import React from 'react';
import { BarChart3, ArrowUp, ArrowDown } from 'lucide-react';

interface Order {
  userId: string;
  id: string;
  quantity: number;
  type: string;
}

interface PriceData {
  total: number;
  orders: Order[];
}

interface EventData {
  yes: Record<string, PriceData>;
  no: Record<string, PriceData>;
}

interface EventDetailsProps {
  symbol: string;
  data: EventData;
}

const EventDetails: React.FC<EventDetailsProps> = ({ symbol, data }) => {
  const getTotalOrders = (orders: Record<string, PriceData>) => {
    return Object.values(orders).reduce((acc, curr) => acc + curr.total, 0);
  };

  const getPrice = (orders: Record<string, PriceData>) => {
    const prices = Object.keys(orders);
    return prices.length > 0 ? Number(prices[0]) : 0;
  };

  const yesOrders = getTotalOrders(data.yes);
  const noOrders = getTotalOrders(data.no);
  const totalTraders = yesOrders + noOrders;

  const yesPrice = getPrice(data.yes);
  const noPrice = getPrice(data.no);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Event: {symbol}</h2>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <BarChart3 className="h-4 w-4" />
          <span>{totalTraders} traders</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Will {symbol} go up?</h3>
        <p className="text-gray-600">Predict the outcome and trade your opinion!</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button className="bg-blue-50 text-blue-600 hover:bg-blue-100 py-4 rounded text-lg flex items-center justify-center">
          <ArrowUp className="mr-2 h-6 w-6" />
          Yes ₹{yesPrice || "0.0"}
        </button>
        <button className="bg-red-50 text-red-600 hover:bg-red-100 py-4 rounded text-lg flex items-center justify-center">
          <ArrowDown className="mr-2 h-6 w-6" />
          No ₹{noPrice || "0.0"}
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Order Book</h3>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">User</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.yes).map(([price, priceData]) =>
              priceData.orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="px-4 py-2">Yes</td>
                  <td className="px-4 py-2">₹{price}</td>
                  <td className="px-4 py-2">{order.quantity}</td>
                  <td className="px-4 py-2">{order.userId}</td>
                </tr>
              ))
            )}
            {Object.entries(data.no).map(([price, priceData]) =>
              priceData.orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="px-4 py-2">No</td>
                  <td className="px-4 py-2">₹{price}</td>
                  <td className="px-4 py-2">{order.quantity}</td>
                  <td className="px-4 py-2">{order.userId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventDetails;

