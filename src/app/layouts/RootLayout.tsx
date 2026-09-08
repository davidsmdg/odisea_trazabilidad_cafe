import { Outlet } from 'react-router';
import { QuickNav } from '../components/QuickNav';

export function RootLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
      <QuickNav />
    </div>
  );
}