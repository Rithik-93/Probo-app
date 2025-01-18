import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Order {
  userId: string
  id: string
  quantity: number
  type: string
}

interface EventData {
  yes: Record<string, any>
  no: Record<string, { total: number; orders: Order[] }>
}

interface EventListProps {
  events: Record<string, EventData>
}

export default function EventList({ events }: EventListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Object.entries(events).map(([eventName, eventData]) => (
        <Card key={eventName}>
          <CardHeader>
            <CardTitle>{eventName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['yes', 'no'].map((opinion) => (
                <div key={opinion}>
                  <h3 className="font-semibold mb-2 capitalize">{opinion}</h3>
                  {Object.keys(eventData[opinion]).length === 0 ? (
                    <p className="text-sm text-gray-500">No orders</p>
                  ) : (
                    Object.entries(eventData[opinion]).map(([price, data]) => (
                      <div key={price} className="mb-2">
                        <p className="text-sm">
                          Price: {price} | Total Orders: {data.total}
                        </p>
                        <ul className="list-disc list-inside text-sm">
                          {data.orders.map((order) => (
                            <li key={order.id}>
                              User: {order.userId} | Quantity: {order.quantity}
                              <Badge variant="outline" className="ml-2">
                                {order.type}
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

