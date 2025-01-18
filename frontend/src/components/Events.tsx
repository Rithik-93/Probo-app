import axios from "axios";
import { useEffect, useState } from "react"
import EventList from '@/components/EventsList'

export default function Events() {
    // const 
    const [data, setData] = useState();

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get('http://localhost:3000/api/v1/orderbook');
            const data = res.data;
            setData(data);
        }
        fetchData();
    }, [])
    return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Opinion Trading Platform</h1>
          <EventList events={data} />
        </div>
      )

}