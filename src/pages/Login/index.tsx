import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import logoUrl from "@/assets/images/logoSingle.png";
import illustrationUrl from "@/assets/images/logo.png";
import { FormInput, FormCheck } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import clsx from "clsx";
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from "@/stores/store";
import { login, setUser } from "@/stores/authSlice";
import { unwrapResult } from '@reduxjs/toolkit';
import { redirectToPage } from '@/utils/roleRedirect';
import ShowMessage from '@/components/ShowMessage'; // Import your ShowMessage component
import { useAppDispatch } from "@/stores/hooks";
import api from "@/api/axios";
import Toastify from 'toastify-js';
import { LoadingTag } from "@/components/Loading";
import Notification from "@/components/Base/Notification";
import axios from 'axios';

function Main() {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [identityNo, setIdentityNo] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(""); // State to hold message
  const [isSuccess, setIsSuccess] = useState<boolean>(false); // State to determine success or error

  const showNotification = (type: 'success' | 'error', message: string) => {
    const notificationId = type === 'success' ? 
      '#success-notification-content' : 
      '#failed-notification-content';
    
    const notificationEl = document.querySelector(notificationId);
    if (notificationEl) {
      const clonedEl = notificationEl.cloneNode(true) as HTMLElement;
      clonedEl.classList.remove('hidden');
      
      const messageEl = clonedEl.querySelector('.font-medium');
      if (messageEl) {
        messageEl.textContent = message;
      }
      
      Toastify({
        node: clonedEl,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();
    }
  };

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!identityNo || !password) {
  //     showNotification('error', 'Please enter both ID and password');
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const response = await api.post('/users/login', {
  //       identityNo,
  //       password
  //     });

  //     if (response.data.success) {
  //       setMessage(""); // Clear previous messages
  //       setIsSuccess(true); // Set to success for ShowMessage
  //       showNotification('success', 'Login successful');
        
  //       // Store user data and token
  //       localStorage.setItem('token', response.data.token);
  //       localStorage.setItem('user', JSON.stringify(response.data.user));
        
  //       // Check for first login
  //       if (response.data.user.isFirstLogin) {
  //         navigate('/change-password');
  //       } else {
  //         navigate('/');
  //       }
  //     }
  //   } catch (error) {
  //     let errorMessage = 'An error occurred during login';
      
  //     if (axios.isAxiosError(error)) {
  //       errorMessage = error.response?.data?.message || errorMessage;
  //     }
      
  //     showNotification('error', errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identityNo || !password) {
      showNotification('error', 'Please enter both ID and password');
      return;
    }
  
    try {
      setLoading(true);
      const resultAction = await dispatch(login({ identityNo, password }));
      const response = unwrapResult(resultAction);
  
      if (response.success) {
        showNotification('success', 'Login successful');
        if (response.user.isFirstLogin) {
          navigate('/change-password');
        } else {
          navigate('/');
        }
      } else {
        showNotification('error', response.message || 'Login failed');
      }
    } catch (error: any) {
      showNotification('error', error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    const storedRememberMe = localStorage.getItem('rememberMe');
    setRememberMe(storedRememberMe === 'true'); // Parse to boolean
  }, []);

  const handleRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
    localStorage.setItem('rememberMe', e.target.checked.toString());
  };

  return (
    <>
      {loading ? (
        <LoadingTag />
      ) : (
        <form onSubmit={handleLogin}>
          <div
            className={clsx([
              "p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
              "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
              "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
            ])}
          >
            <div className="container relative z-10 sm:px-10">
              <div className="block grid-cols-2 gap-4 xl:grid">
                {/* BEGIN: Login Info */}
                <div className="flex-col hidden min-h-screen xl:flex">
                  <a href="www.google.com" className="flex items-center pt-5 -intro-x">
                    <img
                      alt="Qaretech Innovative"
                      className="w-6"
                      src={logoUrl}
                    />
                    <span className="ml-3 text-lg text-white"> RTS </span>
                  </a>
                  <div className="my-auto">
                    <img
                      alt="Qaretech Innovative"
                      className="w-1/2 -mt-16 -intro-x"
                      src={illustrationUrl}
                    />
                    <div className="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
                      A few more clicks to <br />
                      sign in to your account.
                    </div>
                    <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
                      Manage all your assigned location and track your field progress
                    </div>
                  </div>
                </div>
                {/* END: Login Info */}
                {/* BEGIN: Login Form */}

                <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">

                  <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                    <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                      Sign In
                    </h2>
                    <div className="mt-2 text-center intro-x text-slate-400 xl:hidden">
                      A few more clicks to sign in to your account. Manage all your
                      e-commerce accounts in one place
                    </div>

                    {/* Error Message Display */}
                    {message && <ShowMessage message={message} isSuccess={isSuccess} />} {/* Display message with variant */}

                    <div className="mt-8 intro-x">
                      <FormInput
                        type="text"
                        className="block px-4 py-3 intro-x min-w-full xl:min-w-[350px]"
                        placeholder="Employee ID"
                        value={identityNo}
                        onChange={(e) => setIdentityNo(e.target.value)}
                      />
                      <FormInput
                        type="password"
                        className="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
                      <div className="flex items-center mr-auto">
                        <FormCheck.Input
                          id="remember-me"
                          type="checkbox"
                          className="mr-2 border"
                          checked={rememberMe}
                          onChange={handleRememberMe}
                        />
                        <label
                          className="cursor-pointer select-none"
                          htmlFor="remember-me"
                        >
                          Remember me
                        </label>
                      </div>
                      <a href="/forgot-password">Forgot Password?</a>
                    </div>
                    <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                      <Button
                        type={"submit"}
                        variant="primary"
                        className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                        disabled={loading}
                      >
                        Login
                      </Button>
                    </div>
                    <div className="mt-10 text-center intro-x xl:mt-24 text-slate-600 dark:text-slate-500 xl:text-left">
                      By sign in up, you agree to our{" "}
                      <a className="text-primary dark:text-slate-200" href="www.google.com">
                        Terms and Conditions
                      </a>{" "}
                      &{" "}
                      <a className="text-primary dark:text-slate-200" href="www.google.com">
                        Privacy Policy
                      </a>
                    </div>
                  </div>
                </div>

                {/* END: Login Form */}
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Notifications */}
      <Notification id="success-notification-content" className="hidden">
        <div className="font-medium text-success">Success</div>
        <div className="text-slate-500 mt-1">
          Login successful
        </div>
      </Notification>

      <Notification id="failed-notification-content" className="hidden">
        <div className="font-medium text-danger">Error</div>
        <div className="text-slate-500 mt-1">
          Please check your credentials and try again
        </div>
      </Notification>
    </>
  );
}

export default Main;
