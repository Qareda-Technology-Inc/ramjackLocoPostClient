import errorIllustration from "@/assets/images/error-illustration.svg";
import Button from "@/components/Base/Button";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Main() {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleGoHome = () => {
    console.log("Moved")
    navigate(-2); // Navigate back to the previous page
  };

  return (
    <>
      <div className="py-2 bg-gradient-to-b from-theme-1 to-theme-2 dark:from-darkmode-800 dark:to-darkmode-800">
        <div className="container">
          {/* BEGIN: Unauthorized Page */}
          <div className="flex flex-col items-center justify-center h-screen text-center error-page lg:flex-row lg:text-left">
            <div className="-intro-x lg:mr-20">
              <img
                alt="Illustration depicting an error in accessing the page"
                className="w-[450px] h-48 lg:h-auto"
                src={errorIllustration}
              />
            </div>
            <div className="mt-10 text-white lg:mt-0">
              <div className="font-medium intro-x text-8xl">401</div>
              <div className="mt-5 text-xl font-medium intro-x lg:text-3xl">
                Oops. This page is restricted from your account.
              </div>
              <div className="mt-3 text-lg intro-x">
                Contact your administrator to give you the right permission.
              </div>
              <Button
                onClick={handleGoHome} // Use the handleGoHome function
                className="px-4 py-3 mt-10 text-white border-white intro-x dark:border-darkmode-400 dark:text-slate-200"
              >
                Go Home
              </Button>
            </div>
          </div>
          {/* END: Unauthorized Page */}
        </div>
      </div>
    </>
  );
}

export default Main;
