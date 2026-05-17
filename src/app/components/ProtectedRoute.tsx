import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getCurrentUser, isAuthenticated } from '../../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'customer' | 'driver')[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Not logged in - redirect to appropriate login page
      if (redirectTo) {
        navigate(redirectTo);
      } else if (allowedRoles && allowedRoles.length > 0) {
        const role = allowedRoles[0];
        navigate(`/${role}/login`);
      } else {
        navigate('/');
      }
      setIsChecking(false);
      return;
    }

    // Check if user has required role
    const user = getCurrentUser();
    if (!user) {
      navigate('/');
      setIsChecking(false);
      return;
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      // User doesn't have required role - redirect to their dashboard
      navigate(`/${user.role}/dashboard`);
      setIsChecking(false);
      return;
    }

    setIsAuthorized(true);
    setIsChecking(false);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a2545] to-[#2a3555]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#e8b647] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
