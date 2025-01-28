import _ from "lodash";
import Lucide from "@/components/Base/Lucide";
import { Disclosure } from "@/components/Base/Headless";

function Main() {
  return (
    <>
      <div className="flex items-center mt-8 intro-y">
        <h2 className="mr-auto text-lg font-medium">Support & Help</h2>
      </div>
      <div className="grid grid-cols-12 gap-6">
        {/* BEGIN: FAQ Menu */}
        <div className="col-span-12 intro-y lg:col-span-4 xl:col-span-3">
          <div className="mt-5 box">
            <div className="p-5">
              <a className="flex items-center font-medium text-primary" href="">
                <Lucide icon="Activity" className="w-4 h-4 mr-2" /> 
                About Our Platform
              </a>
              <a className="flex items-center mt-5" href="">
                <Lucide icon="Box" className="w-4 h-4 mr-2" /> 
                Product Features
              </a>
            </div>
            <div className="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
              <a className="flex items-center" href="">
                <Lucide icon="Activity" className="w-4 h-4 mr-2" /> 
                Terms of Service
              </a>
              <a className="flex items-center mt-5" href="">
                <Lucide icon="Box" className="w-4 h-4 mr-2" /> 
                Licensing Options
              </a>
            </div>
            <div className="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
              <a className="flex items-center mt-5" href="">
                <Lucide icon="Lock" className="w-4 h-4 mr-2" /> 
                Security & Privacy
              </a>
              <a className="flex items-center mt-5" href="">
                <Lucide icon="Settings" className="w-4 h-4 mr-2" /> 
                Technical Support
              </a>
            </div>
          </div>
        </div>
        {/* END: FAQ Menu */}
        {/* BEGIN: FAQ Content */}
        <div className="col-span-12 intro-y lg:col-span-8 xl:col-span-9">
          <div className="intro-y box lg:mt-5">
            <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
              <h2 className="mr-auto text-base font-medium">
                About Our Platform
              </h2>
            </div>
            <Disclosure.Group className="p-5">
              <Disclosure>
                <Disclosure.Button>
                  What is RTS Location Management and What Does It Do?
                </Disclosure.Button>
                <Disclosure.Panel className="leading-relaxed text-slate-600 dark:text-slate-500">
                  Our platform is designed to streamline project management and improve team collaboration. From task allocation to real-time progress tracking, we provide tools that empower businesses to achieve their goals efficiently.
                </Disclosure.Panel>
              </Disclosure>
              <Disclosure>
                <Disclosure.Button>
                  How Does Our Product Enhance User Productivity?
                </Disclosure.Button>
                <Disclosure.Panel className="leading-relaxed text-slate-600 dark:text-slate-500">
                  By automating routine tasks and offering detailed insights, our platform reduces manual effort, minimizes errors, and ensures that users can focus on what truly matters—delivering value to their clients.
                </Disclosure.Panel>
              </Disclosure>
            </Disclosure.Group>
          </div>
          <div className="mt-5 intro-y box">
            <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
              <h2 className="mr-auto text-base font-medium">Product Features</h2>
            </div>
            <Disclosure.Group className="p-5">
              <Disclosure>
                <Disclosure.Button>
                  Key Features of Our Platform
                </Disclosure.Button>
                <Disclosure.Panel className="leading-relaxed text-slate-600 dark:text-slate-500">
                  Features include task management, automated workflows, detailed reporting, and seamless integrations with popular third-party tools.
                </Disclosure.Panel>
              </Disclosure>
              <Disclosure>
                <Disclosure.Button>
                  How to Use Analytics for Better Decisions?
                </Disclosure.Button>
                <Disclosure.Panel className="leading-relaxed text-slate-600 dark:text-slate-500">
                  Our analytics dashboard provides actionable insights into performance metrics, enabling informed decisions that drive success.
                </Disclosure.Panel>
              </Disclosure>
            </Disclosure.Group>
          </div>
          <div className="mt-5 intro-y box">
            <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
              <h2 className="mr-auto text-base font-medium">Security & Privacy</h2>
            </div>
            <Disclosure.Group className="p-5">
              <Disclosure>
                <Disclosure.Button>
                  How Do We Secure Your Data?
                </Disclosure.Button>
                <Disclosure.Panel className="leading-relaxed text-slate-600 dark:text-slate-500">
                  We use state-of-the-art encryption and regular security audits to ensure your data remains safe and confidential.
                </Disclosure.Panel>
              </Disclosure>
              <Disclosure>
                <Disclosure.Button>
                  What Are Our Privacy Policies?
                </Disclosure.Button>
                <Disclosure.Panel className="leading-relaxed text-slate-600 dark:text-slate-500">
                  We adhere to strict privacy policies that align with global standards, ensuring your data is never shared without your consent.
                </Disclosure.Panel>
              </Disclosure>
            </Disclosure.Group>
          </div>
        </div>
        {/* END: FAQ Content */}
      </div>
    </>
  );
}

export default Main;
