// src/components/PrivateRoute.tsx
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/stores/store';
import { logout, setUser } from '@/stores/authSlice'; // Import setUser action
import { showLoading, hideLoading } from '@/stores/loadingSlice'; // Import loading actions
import api from '@/api/axios';
import { LoadingTag } from './Loading';

interface PrivateRouteProps {
  element: JSX.Element;
  allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, allowedRoles }) => {
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyUser = async () => {
      if (user) return; // If user is already set, return early

      try {
        dispatch(showLoading());
        const token = localStorage.getItem('token');
        if (token) {
          const { data } = await api.post("/users/get-user", { token }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          dispatch(hideLoading());
          if (!data.success) {
            handleLogout();
          } else {
            dispatch(setUser(data.data)); // Set the user data correctly
          }
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error('Error verifying user:', error);
        handleLogout();
      } finally {
        dispatch(hideLoading());
      }
    };

    const handleLogout = () => {
      localStorage.clear();
      dispatch(logout());
    };

    verifyUser(); // Call verifyUser once
  }, [user, dispatch]);

  if (isLoading) {
    return <LoadingTag />  
  }

  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && allowedRoles.length > 0 && user) {
    const userRole = user.role;
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" />;
    }
  }

  return element;
};

export default PrivateRoute;
