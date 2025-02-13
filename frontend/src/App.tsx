import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Events from './pages/Events';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from './pages/Landing';
import EventDetailsPage from './pages/EventDetailsPage';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:eventName" element={<EventDetailsPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
