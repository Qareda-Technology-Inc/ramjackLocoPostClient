import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ThemeSwitcher from "@/components/ThemeSwitcher";
import logoUrl from "@/assets/images/logoSingle.png";
import illustrationUrl from "@/assets/images/logo.png";
import { FormInput, FormCheck } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import clsx from "clsx";
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from "@/stores/store";
import { login } from "@/stores/authSlice";
import { unwrapResult } from '@reduxjs/toolkit';
import { redirectToPage } from '@/utils/roleRedirect';
import ShowMessage from '@/components/ShowMessage'; // Import your ShowMessage component

function Main() {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [identityNo, setIdentityNo] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(""); // State to hold message
  const [isSuccess, setIsSuccess] = useState<boolean>(false); // State to determine success or error

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resultAction = await dispatch(login({ identityNo, password }));
      const result = unwrapResult(resultAction);

      if (result.success) {
        setMessage("Login successful!"); // Set success message
        setIsSuccess(true); // Set success state
        navigate(redirectToPage(result.user.role));
      } else {
        // Handle login failure
        setMessage(result.message); // Set error message from server response
        setIsSuccess(false); // Set error state
      }
    } catch (error) {
      console.error("Unexpected Error", error);
      setMessage("Unexpected error occurred. Please try again."); // Generic error message
      setIsSuccess(false); // Set error state
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
    <form onSubmit={handleLogin}>
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
            {/* BEGIN: Login Info */}
            <div className="flex-col hidden min-h-screen xl:flex">
              <a href="www.google.com" className="flex items-center pt-5 -intro-x">
                <img
                  alt="Qaretech Innovative"
                  className="w-6"
                  src={logoUrl}
                />
                <span className="ml-3 text-lg text-white"> RAMJACK </span>
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
                  <a href="/register">Forgot Password?</a>
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
  );
}

export default Main;
