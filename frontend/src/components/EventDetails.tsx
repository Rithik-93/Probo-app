import useOrderData from "../hooks/useOrderData";
import { ArrowUp, ArrowDown, BarChart3 } from "lucide-react";
import { EventData } from "./EventsList";
import { Order, PriceData } from "../pages/EventDetailsPage";

export const EventDetails = ({ mergedData, eventName }: { mergedData: EventData, eventName: string }) => {

    const { yesOrders, noOrders, totalTraders, yesPrice, noPrice } = useOrderData(mergedData || { yes: {}, no: {} });

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Event: {eventName}</h2>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                    <BarChart3 className="h-4 w-4" />
                    <span>{totalTraders} traders</span>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Will {eventName} go up?</h3>
                <p className="text-gray-600">Predict the outcome and trade your opinion!</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <button className="bg-blue-50 text-blue-600 hover:bg-blue-100 py-4 rounded text-lg flex items-center justify-center">
                    <ArrowUp className="mr-2 h-6 w-6" />
                    Yes ₹{yesPrice.toFixed(2)}
                </button>
                <button className="bg-red-50 text-red-600 hover:bg-red-100 py-4 rounded text-lg flex items-center justify-center">
                    <ArrowDown className="mr-2 h-6 w-6" />
                    No ₹{noPrice.toFixed(2)}
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
                        {Object.entries(yesOrders).map(([price, priceData]) =>
                            priceData.orders.map((order: Order) => (
                                <tr key={order.id} className="border-b">
                                    <td className="px-4 py-2">Yes</td>
                                    <td className="px-4 py-2">₹{price}</td>
                                    <td className="px-4 py-2">{order.quantity}</td>
                                    <td className="px-4 py-2">{order.userId}</td>
                                </tr>
                            ))
                        )}
                        {Object.entries(noOrders).map(([price, priceData]: [string, PriceData]) =>
                            priceData.orders.map((order: Order) => (
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
    )
}