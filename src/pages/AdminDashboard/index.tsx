import _ from "lodash";
import clsx from "clsx";
import { useState, useEffect, useMemo } from "react";
import { FormInput } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import Litepicker from "@/components/Base/Litepicker";
import ReportDonutChart from "@/components/ReportDonutChart";
import ReportLineChart from "@/components/ReportLineChart";
import ReportPieChart from "@/components/ReportPieChart";
import LeafletMap from "@/components/LeafletMap";
import { Menu } from "@/components/Base/Headless";
import {User} from "@/types/auth";
import {Site} from "@/types/site";
import api from "@/api/axios";
import { Assignment } from "@/types/assignment";
import imageUrl from '@/assets/images/logoSingle.png';

function Main() {
  const token = localStorage.getItem("token");

  const [employees, setEmployees] = useState<User[]>([]);
  const [employeesTag, setEmployeesTag] = useState<User[]>([]);
  const [sites, setSites] = useState<Site[]>();
  const [assignments, setAssignments] = useState<Assignment[]>();

  const [salesReportFilter, setSalesReportFilter] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/users/list', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const filteredEmployees = data.filter((employee: User) => employee.currentSite);
        setEmployeesTag(filteredEmployees);
        setEmployees(data);
        console.log("Tags", filteredEmployees)

        const siteResponse = await api.get("/sites/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setSites(siteResponse.data);

        const assignmentResponse = await api.get("/assignments/", {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        setAssignments(assignmentResponse.data);

      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [token])

  // ✅ Native JavaScript function to calculate days difference
  const getDaysDifference = (dueDate: Date) => {
    const today = new Date();
    const due = new Date(dueDate); 
    const diffTime = due.getTime() - today.getTime(); 
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

   // ✅ Categorize assignments
    const { urgent, warning, normal, } = useMemo(() => {
      let urgent = 0, warning = 0, normal = 0;

      assignments?.forEach((assignment: any) => {
        const daysLeft = getDaysDifference(assignment.endDate);

        if (daysLeft <= 3) urgent++;      // 🔴 High Priority (Urgent)
        else if (daysLeft <= 7) warning++; // 🟡 Medium Priority (Warning)
        else normal++;                     // 🔵 Low Priority (Normal)
      });

      return { urgent, warning, normal };
    }, [assignments]);

  const totalAssignments = assignments?.length || 0;
  const urgentPercent = totalAssignments > 0 ? ((urgent / totalAssignments) * 100).toFixed(1) : 0;
  const warningPercent = totalAssignments > 0 ? ((warning / totalAssignments) * 100).toFixed(1) : 0;
  const normalPercent = totalAssignments > 0 ? ((normal / totalAssignments) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 2xl:col-span-9">
        <div className="grid grid-cols-12 gap-6">
          {/* BEGIN: General Report */}
          <div className="col-span-12 mt-8">
            <div className="flex items-center h-10 intro-y">
              <h2 className="mr-5 text-lg font-medium truncate">
                General Report
              </h2>
              <a href="/" className="flex items-center ml-auto text-primary">
                <Lucide icon="RefreshCcw" className="w-4 h-4 mr-3" /> Reload
                Data
              </a>
            </div>
            <div className="grid grid-cols-12 gap-6 mt-5">
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="Users"
                        className="w-[28px] h-[28px] text-primary"
                      />
                      <div className="ml-auto">
                      </div>
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {employees.length}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      TOTAL EMPLOYEES
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="TentTree"
                        className="w-[28px] h-[28px] text-pending"
                      />
                      <div className="ml-auto">
                      </div>
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {sites?.length}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      TOTAL SITES
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="NotebookTabs"
                        className="w-[28px] h-[28px] text-warning"
                      />
                      <div className="ml-auto">
                      </div>
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {assignments?.length}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      TOTAL ASSIGNMENT
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="User"
                        className="w-[28px] h-[28px] text-success"
                      />
                      <div className="ml-auto">
                      </div>
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      70
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      AVAILABLE EMPLOYEE
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* END: General Report */}
          {/* BEGIN: Employee Distribution */}
          <div className="col-span-12 mt-8 lg:col-span-14">
            <div className="items-center block h-10 intro-y sm:flex">
              <h2 className="mr-5 text-lg font-medium truncate">
                Employees distribution across sites
              </h2>
            </div>
            <div className="p-5 mt-12 intro-y box sm:mt-5">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex">
                  <div>
                    <div className="text-lg font-medium text-primary dark:text-slate-300 xl:text-xl">
                      Employees - Sites - Countries
                    </div>
                  </div>
                </div>
                
              </div>
              <div
                className={clsx([
                  "relative",
                  "before:content-[''] before:block before:absolute before:w-16 before:left-0 before:top-0 before:bottom-0 before:ml-10 before:mb-7 before:bg-gradient-to-r before:from-white before:via-white/80 before:to-transparent before:dark:from-darkmode-600",
                  "after:content-[''] after:block after:absolute after:w-16 after:right-0 after:top-0 after:bottom-0 after:mb-7 after:bg-gradient-to-l after:from-white after:via-white/80 after:to-transparent after:dark:from-darkmode-600",
                ])}
              >
                <ReportLineChart height={275} className="mt-6 -mb-6" />
              </div>
            </div>
          </div>
          {/* END: Employee distribution */}
          
          {/* BEGIN: Official Site */}
          <div className="col-span-12 mt-6 xl:col-span-14">
            <div className="items-center block h-10 intro-y sm:flex">
              <h2 className="mr-5 text-lg font-medium truncate">
                Official Sites
              </h2>
              <div className="relative mt-3 sm:ml-auto sm:mt-0 text-slate-500">
                <Lucide
                  icon="MapPin"
                  className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3"
                />
                <FormInput
                  type="text"
                  className="pl-10 sm:w-56 !box"
                  placeholder="Filter by city"
                />
              </div>
            </div>
            <div className="p-5 mt-12 intro-y box sm:mt-5">
              <div>
                250 Official sites in 21 countries, click the marker to see
                location details.
              </div>
              <LeafletMap className="h-[310px] mt-5 rounded-md bg-slate-200" />
            </div>
          </div>
          {/* END: Official site */}
        </div>
      </div>

      <div className="col-span-12 2xl:col-span-3">
        <div className="pb-10 -mb-10 2xl:border-l">
          <div className="grid grid-cols-12 2xl:pl-6 gap-x-6 2xl:gap-x-0 gap-y-6">

            {/* BEGIN: Assignment Tag */}
            <div className="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-8">
              <div className="flex items-center h-10 intro-x">
                <h2 className="mr-5 text-lg font-medium truncate">
                  Assignment Tags
                </h2>
              </div>
                <div className="flex items-center h-10 intro-x">
                  <a href="" className="ml-auto truncate text-primary">
                    Show More
                  </a>
                </div>
                <div className="mt-5 relative before:block before:absolute before:w-px before:h-[85%] before:bg-slate-200 before:dark:bg-darkmode-400 before:ml-5 before:mt-5">
                  {employeesTag.length > 0 ? (
                    employeesTag.map((employee, index) => (
                      <div key={index} className="relative flex items-center mb-3 intro-x">
                        <div className="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
                          <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                            <img alt="Profile" src={employee.image ? employee.image : imageUrl} />
                          </div>
                        </div>
                        <div className="flex-1 px-5 py-3 ml-4 box zoom-in">
                          <div className="flex items-center">
                            <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                            <div className="ml-auto text-xs text-slate-500">{employee.currentSite?.country}</div>
                            <div className="w-10 h-10 ml-1 overflow-hidden rounded-full image-fit">
                              <img alt="Profile" src={employee.currentSite?.image ? employee.currentSite.image : imageUrl} />
                            </div>
                          </div>
                          <div className="mt-1 text-slate-500">
                            Currently located at{" "}
                            <a className="text-primary" href="">
                              {`${employee.currentSite?.name} - ${employee.currentSite?.location}` || "Unknown"}
                            </a>{" "}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center mb-3 intro-x">
                      <div className="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
                        <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                          <img alt="Default" src={imageUrl} />
                        </div>
                      </div>
                      <div className="flex-1 px-5 py-3 ml-4 box zoom-in">
                        <div className="font-medium">No employees is Tagged.</div>
                      </div>
                    </div>
                  )}
                </div>
            </div>
            {/* END: Assignment Tag */}

          {/* BEGIN:Assignment Ending */}
          <div className="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-8">
                <div className="flex items-center h-10 intro-y">
                  <h2 className="mr-5 text-lg font-medium truncate">
                    Assignment Ending soon
                  </h2>
                  <a href="" className="ml-auto truncate text-primary">
                    Show More
                  </a>
                </div>
                <div className="p-5 mt-5 intro-y box">
                  <div className="mt-3">
                    <ReportPieChart height={213} />
                  </div>
                  <div className="mx-auto mt-8 w-52 sm:w-auto">
                  <div className="flex items-center">
                    <div className="w-2 h-2 mr-3 rounded-full bg-primary"></div>
                    <span className="truncate">Urgent (1-3 days)</span> 
                    <span className="ml-auto font-medium">{urgentPercent}%</span>
                  </div>
                  <div className="flex items-center mt-4">
                    <div className="w-2 h-2 mr-3 rounded-full bg-pending"></div>
                    <span className="truncate">Warning (4-7 days)</span> 
                    <span className="ml-auto font-medium">{warningPercent}%</span>
                  </div>
                  <div className="flex items-center mt-4">
                    <div className="w-2 h-2 mr-3 rounded-full bg-warning"></div>
                    <span className="truncate">Normal (7 days)</span> 
                    <span className="ml-auto font-medium">{normalPercent}%</span>
                  </div>
                </div>

                </div>
          </div>
          {/* END: Assignment Ending */}

          {/* BEGIN: Historical Assignment */}
          <div className="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-8">
            <div className="flex items-center h-10 intro-y">
              <h2 className="mr-5 text-lg font-medium truncate">
                Historical Assignment Report
              </h2>
              <a href="" className="ml-auto truncate text-primary">
                Show More
              </a>
            </div>
            <div className="p-5 mt-5 intro-y box">
              <div className="mt-3">
                <ReportDonutChart height={213} />
              </div>
              <div className="mx-auto mt-8 w-52 sm:w-auto">
                    <div className="flex items-center mt-4">
                      {/* <div className={`w-2 h-2 mr-3 rounded-full ${
                        index === 0 ? 'bg-primary' : 
                        index === 1 ? 'bg-pending' : 'bg-warning'
                      }`}></div> */}
                      <span className="truncate">test 1</span>
                      <span className="ml-auto font-medium">percent 1%</span>
                    </div>
              </div>
            </div>
          </div>
          {/* END: Historical Assignment */}
          
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
