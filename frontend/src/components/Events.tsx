import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import EventList from "../components/EventsList";

export default function Events() {
    const fetchData = () =>
        axios
            .get("http://localhost:3000/api/v1/orderbook")
            .then(response => response.data);

    const { data, isFetching, isError, error } = useQuery({
        queryKey: ["orderbookData"],
        queryFn: fetchData,
        staleTime: 60000, // Optional
    });

    if (isFetching) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error occurred: {error.message || "Something went wrong"}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Opinion Trading Platform</h1>
            <EventList events={data} />
        </div>
    );
}
