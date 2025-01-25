import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';
import AdminDashboard from '../AdminDashboard';
import EmployeeHome from '../EmployeeHome';

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  // Render different dashboard based on role
  if (user?.role === "ADMIN" || user?.role === "MANAGER") {
    return <AdminDashboard />;
  }

  // Default to employee dashboard for other roles
  return <EmployeeHome />;
};

export default Dashboard; 