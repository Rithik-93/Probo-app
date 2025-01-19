import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { connectWS } from "@/actions/connectWs";
import { EventDetails } from "./EventDetails";

export type Order = {
  userId: string;
  id: string;
  quantity: number;
  type: string;
};

export type PriceData = {
  total: number;
  orders: Order[];
};

export type EventData = {
  yes: Record<string, PriceData>;
  no: Record<string, PriceData>;
};

const EventDetailsPage: React.FC = () => {
  const { eventName } = useParams<{ eventName: string }>();
  const [wsData, setWsData] = useState<EventData | null>(null);

  const fetchData = async (): Promise<EventData> => {
    const response = await axios.get(`http://localhost:3000/api/v1/orderbook/${eventName}`);
    return response.data;
  }

  const { data, isFetching, isError, error } = useQuery({
    queryKey: ['eventDetail', eventName],
    queryFn: fetchData
  });

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');

    if (eventName) {
      connectWS({socket, eventName, setWsData});
    }

    return () => {
      socket.close();
    };
  }, [eventName]);
  
  const mergedData: EventData = wsData ? { ...data, ...wsData } : data as EventData;

  if (isFetching) {
    return <div className="text-center">Loading...</div>;
  }

  if (isError) {
    return <div className="text-center text-red-500">{error.toString()}</div>;
  }

  if (!data) {
    return <div className="text-center">No data available.</div>;
  }

  if (!eventName) {
    return <div className="text-center">Invalid event name.</div>;
  }

  return (
    <EventDetails mergedData={mergedData} eventName={eventName}/>
  );
};

export default EventDetailsPage;
