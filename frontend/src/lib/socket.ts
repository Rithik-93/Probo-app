const wsUrl = 'ws://localhost:8080';

const ws = new WebSocket(wsUrl);

ws.onopen = () => {
  console.log('Connected to WebSocket server');

  const subscribeMessage = {
    type: 'SUBSCRIBE',
    orderbookId: 'orderbook-123',
  };
  ws.send(JSON.stringify(subscribeMessage));
  console.log('Sent SUBSCRIBE message:', subscribeMessage);
};

ws.onmessage = (event) => {
  console.log('Received message:', event.data);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('WebSocket connection closed');
};

// setTimeout(() => {
//   const unsubscribeMessage = {
//     type: 'UNSUBSCRIBE',
//     orderbookId: 'orderbook-123', // Replace with your actual orderbookId
//   };
//   ws.send(JSON.stringify(unsubscribeMessage));
//   console.log('Sent UNSUBSCRIBE message:', unsubscribeMessage);
// }, 10000);
