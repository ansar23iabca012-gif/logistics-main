import { RouterProvider } from 'react-router';
import { router } from './routes';
import DataInitializer from './components/DataInitializer';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <>
      <DataInitializer />
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
