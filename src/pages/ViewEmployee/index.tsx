import _ from "lodash";
import Progress from "@/components/Base/Progress";
import Lucide from "@/components/Base/Lucide";
import SimpleLineChart from "@/components/SimpleLineChart";
import SimpleLineChart1 from "@/components/SimpleLineChart1";
import SimpleLineChart2 from "@/components/SimpleLineChart2";
import { Menu } from "@/components/Base/Headless";
import { useLocation } from "react-router-dom";
import { User } from "@/types/auth";
import imageUrl from '@/assets/images/logoSingle.png';

interface LocationState{
  employee: User;
}
function Main() {
  const location = useLocation();
  const employee = location.state as LocationState | undefined;
  console.log("Employee Data", employee)
  return (
    <>
      <div className="flex items-center mt-8 intro-y">
        <h2 className="mr-auto text-lg font-medium">Profile Layout</h2>
      </div>

        {/* BEGIN: Profile Info */}
        <div className="px-5 pt-5 mt-5 intro-y box">
          <div className="flex flex-col pb-5 -mx-5 border-b lg:flex-row border-slate-200/60 dark:border-darkmode-400">
            <div className="flex items-center justify-center flex-1 px-5 lg:justify-start">
              <div className="relative flex-none w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 image-fit">
                <img
                  alt="Qaretech Innovative"
                  className="rounded-full"
                  src={employee?.employee.avatar ? employee?.employee?.avatar : imageUrl}
                />
                <div className="absolute bottom-0 right-0 flex items-center justify-center p-2 mb-1 mr-1 rounded-full bg-primary">
                  <Lucide icon="Camera" className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="ml-5">
                <div className="w-24 text-lg font-bold truncate sm:w-40 sm:whitespace-normal">
                  {employee?.employee?.firstName} {employee?.employee?.lastName}
                </div>
                <div className="text-slate-500">{employee?.employee?.position}</div>
              </div>
            </div>
            <div className="flex-1 px-5 pt-5 mt-6 border-t border-l border-r lg:mt-0 border-slate-200/60 dark:border-darkmode-400 lg:border-t-0 lg:pt-0">
              <div className="font-medium text-center lg:text-left lg:mt-3">
                Contact Details
              </div>
              <div className="flex flex-col items-center justify-center mt-4 lg:items-start">
                <div className="flex items-center truncate sm:whitespace-normal">
                  <Lucide icon="Mail" className="w-4 h-4 mr-2" />
                  {employee?.employee?.email}
                </div>
                <div className="flex items-center mt-3 truncate sm:whitespace-normal">
                  <Lucide icon="Instagram" className="w-4 h-4 mr-2" /> Instagram
                  {employee?.employee?.firstName}
                </div>
                <div className="flex items-center mt-3 truncate sm:whitespace-normal">
                  <Lucide icon="Twitter" className="w-4 h-4 mr-2" /> Twitter
                  {employee?.employee?.firstName}
                </div>
              </div>
            </div>
            <div className="flex-1 px-5 pt-5 mt-6 border-t lg:mt-0 lg:border-0 border-slate-200/60 dark:border-darkmode-400 lg:pt-0">
              <div className="font-medium text-center lg:text-left lg:mt-5">
                Activity Improvement
              </div>
              <div className="flex items-center justify-center mt-2 lg:justify-start">
                <div className="flex w-20 mr-2">
                  USP:{" "}
                  <span className="ml-3 font-medium text-success">+23%</span>
                </div>
                <div className="w-3/4">
                  <SimpleLineChart1 height={55} className="-mr-5" />
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-start">
                <div className="flex w-20 mr-2">
                  STP: <span className="ml-3 font-medium text-danger">-2%</span>
                </div>
                <div className="w-3/4">
                  <SimpleLineChart2 height={55} className="-mr-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* END: Profile Info */}

            <div className="grid grid-cols-12 gap-6 pt-5">
              {/* BEGIN: Top Categories */}
              <div className="col-span-12 intro-y box lg:col-span-6">
                <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="mr-auto text-base font-bold">
                    Top Location visit
                  </h2>
                </div>
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row">
                    <div className="mr-auto">
                      <a href="" className="font-medium text-xl">
                        Ghana - Iduapriem Mines
                      </a>
                      <div className="mt-1 text-slate-500">
                        Survey on Fibre
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-32 mt-5 mr-auto -ml-2 sm:ml-0 sm:mr-5">
                        <SimpleLineChart height={30} />
                      </div>
                      <div className="text-center">
                        <div className="font-medium">612</div>
                        <div className="bg-success/20 text-success rounded px-2 mt-1.5">
                          +150
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col mt-5 sm:flex-row">
                    <div className="mr-auto">
                      <a href="" className="font-medium text-xl">
                        Mali - Sigiri
                      </a>
                      <div className="mt-1 text-slate-500">
                        Fatigue Monitoring Assistant
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-32 mt-5 mr-auto -ml-2 sm:ml-0 sm:mr-5">
                        <SimpleLineChart height={30} />
                      </div>
                      <div className="text-center">
                        <div className="font-medium">250</div>
                        <div className="bg-pending/10 text-pending rounded px-2 mt-1.5">
                          +150
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col mt-5 sm:flex-row">
                    <div className="mr-auto">
                      <a href="" className="font-medium text-xl">
                        South Africa - New Town
                      </a>
                      <div className="mt-1 text-slate-500">
                      Splicing training
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-32 mt-5 mr-auto -ml-2 sm:ml-0 sm:mr-5">
                        <SimpleLineChart height={30} />
                      </div>
                      <div className="text-center">
                        <div className="font-medium">300</div>
                        <div className="bg-primary/10 text-primary rounded px-2 mt-1.5">
                          +150
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* END: Top Categories */}
              {/* BEGIN: Work In Progress */}
              <div className="col-span-12 intro-y box lg:col-span-6 ">
                <div className="flex items-center px-5 py-5 border-b sm:py-0 border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="mr-auto text-base font-bold py-5">
                    Work In Progress
                  </h2>
                </div>
                <div className="p-5">
                      <div>
                        <div className="flex">
                          <div className="mr-auto text-xl">Pending Tasks</div>
                          <div>20%</div>
                        </div>
                        <Progress className="h-1 mt-2">
                          <Progress.Bar
                            className="w-1/2 bg-primary"
                            role="progressbar"
                            aria-valuenow={0}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          ></Progress.Bar>
                        </Progress>
                      </div>
                      <div className="mt-5">
                        <div className="flex">
                          <div className="mr-auto text-xl">Completed Tasks</div>
                          <div>2 / 20</div>
                        </div>
                        <Progress className="h-1 mt-2">
                          <Progress.Bar
                            className="w-1/4 bg-primary"
                            role="progressbar"
                            aria-valuenow={0}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          ></Progress.Bar>
                        </Progress>
                      </div>
                      <div className="mt-5">
                        <div className="flex">
                          <div className="mr-auto text-xl">Tasks In Progress</div>
                          <div>42</div>
                        </div>
                        <Progress className="h-1 mt-2">
                          <Progress.Bar
                            className="w-3/4 bg-primary"
                            role="progressbar"
                            aria-valuenow={0}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          ></Progress.Bar>
                        </Progress>
                      </div>
                </div>
              </div>
              {/* END: Work In Progress */}
            </div>
    </>
  );
}

export default Main;
