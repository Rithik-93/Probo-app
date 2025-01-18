import { useNavigate } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader } from "../components/ui/card";

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

export interface EventData {
  yes: Record<string, PriceData>;
  no: Record<string, PriceData>;
}

interface EventCardProps {
  symbol: string;
  data: EventData;
}

export default function EventCard({ symbol, data }: EventCardProps) {
  const navigate = useNavigate();

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

  const handleCardClick = () => {
    navigate(`/event/${symbol}`);
  };

  return (
    <Card
      className="max-w-md overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <BarChart3 className="h-4 w-4" />
          <span>{totalTraders} traders</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-md"></div>
          <h3 className="flex-1 text-lg font-medium leading-tight">{symbol}</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 text-blue-600 min-h-10 rounded-20">
            Yes ₹{yesPrice || "0.0"}
          </div>
          <div className="bg-red-50 text-red-600">No ₹{noPrice || "0.0"}</div>
        </div>
      </CardContent>
    </Card>
  );
}
