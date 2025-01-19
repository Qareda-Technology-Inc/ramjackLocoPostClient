import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ThemeSwitcher from "@/components/ThemeSwitcher";
import logoUrl from "@/assets/images/logoSingle.png";
import illustrationUrl from "@/assets/images/logo.png";
import { FormInput } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import clsx from "clsx";
import api from "@/api/axios";
import Toastify from 'toastify-js';
import { LoadingTag } from "@/components/Loading";
import Notification from "@/components/Base/Notification";

function Main() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      showNotification('error', 'Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      showNotification('error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/users/reset-password', {
        token,
        newPassword: formData.newPassword
      });

      if (response.data.success) {
        showNotification('success', 'Password has been reset successfully');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error resetting password';
      showNotification('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  return (
    <>
      {loading ? (
        <LoadingTag />
      ) : (
        <form onSubmit={handleSubmit}>
          <div
            className={clsx([
              "p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
              "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
              "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
            ])}
          >
            <ThemeSwitcher />
            <div className="container relative z-10 sm:px-10">
              <div className="block grid-cols-2 gap-4 xl:grid">
                {/* BEGIN: Reset Password Info */}
                <div className="flex-col hidden min-h-screen xl:flex">
                  <a href="" className="flex items-center pt-5 -intro-x">
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
                      Reset Your Password <br />
                      to Continue.
                    </div>
                    <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
                      Please enter your new password
                    </div>
                  </div>
                </div>
                {/* END: Reset Password Info */}
                {/* BEGIN: Reset Password Form */}
                <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
                  <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                    <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                      Reset Password
                    </h2>
                    <div className="mt-2 text-center intro-x text-slate-400 dark:text-slate-400 xl:hidden">
                      Please enter your new password to continue.
                    </div>
                    <div className="mt-8 intro-x">
                      <FormInput
                        type="password"
                        name="newPassword"
                        className="block px-4 py-3 intro-x min-w-full xl:min-w-[350px]"
                        placeholder="New Password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                      />
                      <FormInput
                        type="password"
                        name="confirmPassword"
                        className="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
                        placeholder="Confirm New Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="flex mt-5 intro-x xl:mt-8 text-center xl:text-left">
                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                      >
                        Submit
                      </Button>
                      <Button
                        type="button"
                        variant="outline-secondary"
                        className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                        onClick={() => navigate('/login')}
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                </div>
                {/* END: Reset Password Form */}
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Notifications */}
      <Notification id="success-notification-content" className="hidden">
        <div className="font-medium text-success">Success</div>
        <div className="text-slate-500 mt-1">
          Your password has been reset successfully
        </div>
      </Notification>

      <Notification id="failed-notification-content" className="hidden">
        <div className="font-medium text-danger">Error</div>
        <div className="text-slate-500 mt-1">
          Please check your input and try again
        </div>
      </Notification>
    </>
  );
}

export default Main; 