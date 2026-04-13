import { Outlet } from 'react-router-dom';
import AdminSidebar from '../Components/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen pt-20">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-[#0a0a0a]">
        <Outlet />
      </main>
    </div>
  );
}
