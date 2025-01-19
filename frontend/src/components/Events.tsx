import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { EventData } from "../components/EventsList";
import EventCard from "../components/EventsList";
import { EventsLoading } from "./EventsLoading";
import { EventsError } from "./Error";

export default function Events() {
    const fetchData = () =>
        axios
            .get("http://localhost:3000/api/v1/orderbook")
            .then(response => response.data);

    const { data, isFetching, isError} = useQuery({
        queryKey: ["orderbookData"],
        queryFn: fetchData,
        staleTime: 60000,
    });

    console.log(JSON.stringify(data));

    if (isFetching) {
        return <div className="min-h-screen flex text-black font-extrabold text-xl justify-center items-center">{<EventsLoading/>}</div>;
    }

    if (isError) {
        return <div className="text-black font-extrabold text-xl flex justify-center items-center min-h-screen">{<EventsError/>}</div>;
    }

    return (
        <div className="container mx-auto p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(data).map(([symbol, data]) => (
                <EventCard key={symbol} symbol={symbol} data={data as EventData} />
            ))}
        </div>
    );
}
