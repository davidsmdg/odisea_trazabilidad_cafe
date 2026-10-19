import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';
import { UpdateBanner } from './components/UpdateBanner';

export default function App() {
  return (
    <AuthProvider>
      <UpdateBanner />
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}
