import _ from "lodash";
import clsx from "clsx";
import { useRef, useState, useEffect } from "react";
import fakerData from "@/utils/faker";
import Button from "@/components/Base/Button";
import { FormInput, FormSelect } from "@/components/Base/Form";
import { TinySliderElement } from "@/components/Base/TinySlider";
import Lucide from "@/components/Base/Lucide";
import Tippy from "@/components/Base/Tippy";
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

function Main() {
  const token = localStorage.getItem("token");

  const [employees, setEmployees] = useState<User[]>([]);
  const [sites, setSites] = useState<Site[]>();
  const [assignments, setAssignments] = useState<Assignment[]>();
  const [approaching, setApproaching] = useState<User[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<number>(0);
  const [historicalData, setHistoricalData] = useState<Array<{year: string, percentage: number}>>([]);

  const [salesReportFilter, setSalesReportFilter] = useState<string>();
  const importantNotesRef = useRef<TinySliderElement>();
  const prevImportantNotes = () => {
    importantNotesRef.current?.tns.goTo("prev");
  };
  const nextImportantNotes = () => {
    importantNotesRef.current?.tns.goTo("next");
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeeResponse = await api.get("/users/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setEmployees(employeeResponse.data);

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

        // Get employees with approaching end dates
        const approachingResponse = await api.get("/assignments/approaching", {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { days: 30 } // Assignments ending in next 30 days
        });
        setApproaching(approachingResponse.data);

        // Calculate available employees (those without active assignments)
        const activeAssignments = assignmentResponse.data.filter(
          (assignment: Assignment) => assignment.status === 'ACTIVE'
        );
        const assignedEmployeeIds = new Set(activeAssignments.map((a: Assignment) => a.employeeId));
        const availableCount = employeeResponse.data.filter(
          (emp: User) => !assignedEmployeeIds.has(emp.id)
        ).length;
        setAvailableEmployees(availableCount);

        // Calculate historical assignment data
        if (assignmentResponse.data && assignmentResponse.data.length > 0) {
          const assignmentsByYear = assignmentResponse.data.reduce((acc: {[key: string]: number}, curr: Assignment) => {
            const year = new Date(curr.startDate).getFullYear().toString();
            acc[year] = (acc[year] || 0) + 1;
            return acc;
          }, {});
          
          const total = Object.values(assignmentsByYear).reduce((a, b) => a + b, 0);
          const historicalStats = Object.entries(assignmentsByYear)
            .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA)) // Sort by year descending
            .map(([year, count]) => ({
              year,
              percentage: Math.round((count / total) * 100)
            }))
            .slice(0, 3); // Only take the last 3 years
            
          setHistoricalData(historicalStats);
        } else {
          setHistoricalData([]); // Set empty array if no data
        }

      } catch (error) {
        console.error(error);
        setHistoricalData([]); // Set empty array on error
      }
    }
    fetchEmployees();
  }, [token])

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
                      {availableEmployees}
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
          <div className="col-span-12 mt-8 lg:col-span-8">
            <div className="items-center block h-10 intro-y sm:flex">
              <h2 className="mr-5 text-lg font-medium truncate">
                Employees distribution across sites
              </h2>
              <div className="relative mt-3 sm:ml-auto sm:mt-0 text-slate-500">
                <Lucide
                  icon="Calendar"
                  className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3"
                />
                <Litepicker
                  value={salesReportFilter}
                  onChange={(e) => {
                    setSalesReportFilter(e.target.value);
                  }}
                  options={{
                    autoApply: false,
                    singleMode: false,
                    numberOfColumns: 2,
                    numberOfMonths: 2,
                    showWeekNumbers: true,
                    dropdowns: {
                      minYear: 1990,
                      maxYear: null,
                      months: true,
                      years: true,
                    },
                  }}
                  className="pl-10 sm:w-56 !box"
                />
              </div>
            </div>
            <div className="p-5 mt-12 intro-y box sm:mt-5">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex">
                  <div>
                    <div className="text-lg font-medium text-primary dark:text-slate-300 xl:text-xl">
                      Countries
                    </div>
                    <div className="mt-0.5 text-slate-500">Sites</div>
                  </div>
                </div>
                <Menu className="mt-5 md:ml-auto md:mt-0">
                  <Menu.Button
                    as={Button}
                    variant="outline-secondary"
                    className="font-normal"
                  >
                    Filter by Country
                    <Lucide icon="ChevronDown" className="w-4 h-4 ml-2" />
                  </Menu.Button>
                  <Menu.Items className="w-40 h-32 overflow-y-auto">
                    <Menu.Item>Australia</Menu.Item>
                    <Menu.Item>Ghana</Menu.Item>
                    <Menu.Item>Guinea</Menu.Item>
                    <Menu.Item>Mali</Menu.Item>
                    <Menu.Item>Singapore</Menu.Item>
                  </Menu.Items>
                </Menu>
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
          
          {/* BEGIN: Historical Assignment */}
          <div className="col-span-12 mt-8 sm:col-span-6 lg:col-span-4">
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
                {historicalData.length === 0 ? (
                  <div className="text-center text-gray-500">No historical data available</div>
                ) : (
                  historicalData.map((stat, index) => (
                    <div className="flex items-center mt-4" key={stat.year}>
                      <div className={`w-2 h-2 mr-3 rounded-full ${
                        index === 0 ? 'bg-primary' : 
                        index === 1 ? 'bg-pending' : 'bg-warning'
                      }`}></div>
                      <span className="truncate">{stat.year}</span>
                      <span className="ml-auto font-medium">{stat.percentage}%</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* END: Historical Assignment */}
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
              <div className="mt-5">
                {approaching.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">No approaching assignments</div>
                ) : (
                  <>
                    {approaching.map((employee: User, index: number) => (
                      <div key={index} className="intro-x">
                        <div className="flex items-center px-5 py-3 mb-3 box zoom-in">
                          <div className="flex-none w-10 h-10 overflow-hidden rounded-full bg-slate-200 flex items-center justify-center">
                            <Lucide icon="User" className="w-5 h-5" />
                          </div>
                          <div className="ml-4 mr-auto">
                            <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                            <div className="text-slate-500 text-xs mt-0.5">
                              {new Date(employee.assignment?.endDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-warning">
                            Ending Soon
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                
                <a
                  href=""
                  className="block w-full py-3 text-center border border-dotted rounded-md intro-x border-slate-400 dark:border-darkmode-300 text-slate-500"
                >
                  View More
                </a>
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
                      <span className="truncate">2nd Quarter</span>
                      <span className="ml-auto font-medium">62%</span>
                    </div>
                    <div className="flex items-center mt-4">
                      <div className="w-2 h-2 mr-3 rounded-full bg-pending"></div>
                      <span className="truncate">December</span>
                      <span className="ml-auto font-medium">33%</span>
                    </div>
                    <div className="flex items-center mt-4">
                      <div className="w-2 h-2 mr-3 rounded-full bg-warning"></div>
                      <span className="truncate">January</span>
                      <span className="ml-auto font-medium">10%</span>
                    </div>
                  </div>
                </div>
              </div>
          {/* END: Assignment Ending */}
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
