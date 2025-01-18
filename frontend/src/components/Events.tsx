import axios from "axios";
import { useEffect, useState } from "react"

export default function Events() {
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
        <>
            <pre>{data && JSON.stringify(data, null, 1)}</pre>
        </>
    );

}