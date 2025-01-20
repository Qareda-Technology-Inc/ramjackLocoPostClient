import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [loading, setLoading] = useState(false);
  const [identityNo, setIdentityNo] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Triggered")
    
    if (!identityNo) {
      showNotification('error', 'Please enter your ID number');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/users/forgot-password', { identityNo });

      if (response.data.success) {
        showNotification('success', 'Password reset instructions have been sent to your email');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error processing request';
      showNotification('error', errorMessage);
    } finally {
      setLoading(false);
    }
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
            <div className="container relative z-10 sm:px-10">
              <div className="block grid-cols-2 gap-4 xl:grid">
                {/* BEGIN: Recovery Info */}
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
                      A few more clicks to <br />
                      recover your account.
                    </div>
                    <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
                      Enter your Employee ID
                    </div>
                  </div>
                </div>
                {/* END: Recovery Info */}
                {/* BEGIN: Recovery Form */}
                <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
                  <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                    <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                      Forgot Password
                    </h2>
                    <div className="mt-2 text-center intro-x text-slate-400 dark:text-slate-400 xl:hidden">
                      A few more clicks to recover your account.
                    </div>
                    <div className="mt-8 intro-x">
                      <FormInput
                        type="text"
                        className="block px-4 py-3 intro-x min-w-full xl:min-w-[350px]"
                        placeholder="Enter Identity No"
                        value={identityNo}
                        onChange={(e) => setIdentityNo(e.target.value)}
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
                {/* END: Recovery Form */}
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Notifications */}
      <Notification id="success-notification-content" className="hidden">
        <div className="font-medium text-success">Success</div>
        <div className="text-slate-500 mt-1">
          Check your email for password reset instructions
        </div>
      </Notification>

      <Notification id="failed-notification-content" className="hidden">
        <div className="font-medium text-danger">Error</div>
        <div className="text-slate-500 mt-1">
          Please check your ID number and try again
        </div>
      </Notification>
    </>
  );
}

export default Main;
