import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Events from './components/Events';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/events" element={<Events />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
