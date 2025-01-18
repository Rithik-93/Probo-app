import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Events from './components/Events';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EventDetails from './components/EventDetails';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/events" element={<Events />} />
          {/* <Route path='/event/:symbol' element={<EventDetails/>}/> */}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
