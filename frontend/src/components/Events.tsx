import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { EventData } from "../components/EventsList";
import EventCard from "../components/EventsList";
import EventDetails from "./EventDetails";

export default function Events() {
    const fetchData = () =>
        axios
            .get("http://localhost:3000/api/v1/orderbook")
            .then(response => response.data);

    const { data, isFetching, isError, error } = useQuery({
        queryKey: ["orderbookData"],
        queryFn: fetchData,
        staleTime: 60000,
    });

    console.log(JSON.stringify(data));

    if (isFetching) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error occurred: {error.message || "Something went wrong"}</div>;
    }

    return (
        <div className="container mx-auto p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(data).map(([symbol, data]) => (
                <Event key={symbol} symbol={symbol} data={data as EventData} />
            ))}
        </div>
    );
}
