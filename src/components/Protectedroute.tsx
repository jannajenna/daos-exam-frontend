import { useUser } from '../context/UserContext';
import { Navigate, Outlet } from '@tanstack/react-router';

// This wrapper checks if user is logged in and either renders the page or redirects
const ProtectedRoute = () => {
  const { token } = useUser();

  if (!token) {
    // 👮 If not logged in, redirect to login
    return <Navigate to="/" />;
  }

  // ✅ If logged in, render the nested route
  return <Outlet />;
};

export default ProtectedRoute;
