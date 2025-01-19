export const connectWS = ({
    socket,
    eventName,
    setWsData }: {
        socket: WebSocket,
        eventName: string,
        setWsData: (data: any) => void
    }) => {

    socket.onopen = () => {
        console.log('WebSocket connection established');

        const message = {
            type: "SUBSCRIBE",
            orderbookId: eventName
        };

        socket.send(JSON.stringify(message));
    };

    socket.onmessage = (event) => {
        const rawData = event.data;
        const message = JSON.parse(rawData);
        console.log(JSON.stringify(message));
        setWsData(message);
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
        console.log("WebSocket connection closed.");
    };
}