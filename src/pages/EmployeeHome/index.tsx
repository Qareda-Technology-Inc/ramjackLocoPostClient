import { useEffect, useState } from "react";
import _ from "lodash";
import clsx from "clsx";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import Tippy from "@/components/Base/Tippy";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/stores/store';
import { User } from "@/types/auth";
import api from "@/api/axios";
import imageUrl from '@/assets/images/logoSingle.png';
import { LoadingTag } from "@/components/Loading";
import { Assignment } from "@/types/assignment";
import ShowMessage from "@/components/ShowMessage";
import { updateUser } from '@/stores/userSlice';
import { useNavigate } from 'react-router-dom';
import { Task, Tasks } from "@/types/task";

function Main() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [approvedAssignments, setApproved] = useState<Assignment[]>([]);
  const [tasks, setTask] = useState<Assignment[]>([]);
  const [countAssignments, setCountAssignments] = useState<number>(0);
  const [overallAssignment, setOverallTotalAssignment] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [hasNewAssignments, setHasNewAssignments] = useState<boolean>(false);
  const [isTasksModalOpen, setIsTasksModalOpen] = useState<boolean>(false);
  const [modalTasks, setModalTasks] = useState<Task[]>([]);

  const token = localStorage.getItem('token');

  const fetchUserData = async () => {
    try {
      const { data } = await api.get(`/users/${user?._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(updateUser(data));
      localStorage.setItem('user', JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  };

  const approveAssignment = async (assignmentId: string) => {
    try {
      await api.put(`/assignments/approve/${assignmentId}`, { 
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Remove the approved assignment from local state
      setApproved((prevApproved) => 
        prevApproved.filter(assignment => assignment._id !== assignmentId)
      );

      // Check if there are any remaining approved assignments
      if (approvedAssignments.length <= 1) {
        setHasNewAssignments(false); // Reset if no new assignments are left
      }

      setIsModalOpen(false);
      ShowMessage({
        message: 'Assignment approved successfully',
        isSuccess: true,
      }); 

      // Fetch updated assignments and user data
      await fetchAssignments(); // Fetch updated assignments
      await fetchUserData(); // Fetch updated user data

      console.log("Approved Assignments:", approvedAssignments);
      console.log("Has New Assignments:", hasNewAssignments);
    } catch (error) {
      console.error(error);
    }
  };
  
  const fetchAssigned = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/assignments/assigned-user/${user?._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Get the current date
      const now = new Date();

      // Filter assignments
      const unapprovedAssignments = data.filter((assignment: Assignment) => !assignment.isApproved);
      const siteAssignments = data.filter((assignment: Assignment) => 
        assignment.site._id === user?.currentSite?._id && 
        new Date(assignment.startDate) <= now // Check if the start date is in the past or today
      );

      // Set state for approved and site-specific assignments
      setApproved(unapprovedAssignments);
      setTask(siteAssignments);
      
      // Check if there are new assignments
      if (unapprovedAssignments.length > 0) {
        setHasNewAssignments(true);
      } else {
        setHasNewAssignments(false);
      }
      
      localStorage.setItem('assignments', JSON.stringify(data));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const { data } = await api.get('/assignments/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const totalAssignments = data.length;
      const countUserAssignments = user?.assignments?.length || 0;
      const assignmentPercentile = (countUserAssignments / totalAssignments) * 100;
      setCountAssignments(assignmentPercentile);
      setOverallTotalAssignment(totalAssignments);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/users/list', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const filteredEmployees = data.filter((employee: User) => employee.currentSite);
        setEmployees(filteredEmployees);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEmployees();
    fetchAssigned();
    fetchUserData();
    fetchAssignments();
  }, [token, user?._id, dispatch]);
  
  const openTasksModal = () => {
    setModalTasks(tasks as any);
    setIsTasksModalOpen(true);
  };

  const viewAllAssignments = () => {
    navigate('/my-assignments');
  };

  const totalTasks = tasks.reduce(
    (total, tasks) => total + tasks.tasks.length,
    0
  );

  return (
    <>
    {loading && <LoadingTag />}
      <div className="relative">
        <div className="grid grid-cols-12 gap-6">
          <div className="z-20 col-span-12 xl:col-span-9 2xl:col-span-9">
            <div className="mt-6 -mb-6 intro-y">
            </div>
            <div className="grid grid-cols-12 mb-3 mt-14 sm:gap-10 intro-y">
              <div className="relative col-span-12 py-6 text-center sm:col-span-6 md:col-span-4 sm:pl-5 md:pl-0 lg:pl-5 sm:text-left">
                <div className="-mb-1 text-sm font-medium 2xl:text-base">
                  Hi {user?.firstName} {user?.lastName},{" "}
                  <span className="font-normal text-slate-600 dark:text-slate-300">
                    Welcome Back!
                  </span>
                </div>
                <div className="flex items-center justify-center text-base leading-3 2xl:text-lg sm:justify-start text-slate-600 dark:text-slate-300 mt-14 2xl:mt-24">
                  My Total Assignments
                  <Tippy
                    as="div"
                    content="Your total assignments"
                  >
                    <Lucide
                      icon="AlertCircle"
                      className="w-5 h-5 ml-1.5 mt-0.5"
                    />
                  </Tippy>
                </div>
                <div className="mt-5 mb-3 2xl:flex">
                  <div className="flex items-center justify-center sm:justify-start">
                    <div className="relative pl-3 text-2xl font-medium leading-6 2xl:text-3xl 2xl:pl-4">
                      {user?.assignments?.length}
                    </div>
                    <a className="ml-4 text-slate-500 2xl:ml-16" href="">
                      <Lucide icon="RefreshCcw" className="w-4 h-4" />
                    </a>
                  </div>
                  <div className="mt-5 2xl:flex 2xl:justify-center 2xl:mt-0 2xl:-ml-20 2xl:w-14 2xl:flex-none 2xl:pl-2.5">
                    <Tippy
                      as="div"
                      className="inline-flex items-center px-2 py-1 text-xs font-medium text-white rounded-full cursor-pointer bg-success 2xl:text-sm 2xl:p-0 2xl:text-success 2xl:bg-transparent 2xl:flex 2xl:justify-center"
                      content={`${countAssignments.toFixed(2)}% Site assigned out of ${overallAssignment} Assignments`}
                    >
                      {countAssignments 
                        ? `${countAssignments.toFixed(2)}%`
                        : '0%'}
                      {countAssignments > 50 ? (
                      <Lucide icon="ChevronUp" className="w-4 h-4 ml-0.5" />
                      ) : (
                        <Lucide icon="ChevronDown" className="w-4 h-4 ml-0.5" />
                      )}
                    </Tippy>
                  </div>
                </div>
                <div className="text-slate-500">Last updated 1 hour ago</div>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => setIsModalOpen(true)}
                >
                  Approve Location
                  {hasNewAssignments && (
                    <span className="ml-2 text-yellow-400 text-lg font-bold animate-pulse">
                      New
                    </span>
                  )}
                </Button>
              </div>

              {/* Employees Location */}
              <div className="col-span-12 md:col-span-8 mt-3">
                <div className="flex items-center h-10 intro-x">
                  <h2 className="mr-5 text-lg font-medium truncate">Employees Location</h2>
                  <a href="" className="ml-auto truncate text-primary">
                    Show More
                  </a>
                </div>
                <div className="mt-5 relative before:block before:absolute before:w-px before:h-[85%] before:bg-slate-200 before:dark:bg-darkmode-400 before:ml-5 before:mt-5">
                  {employees.length > 0 ? (
                    employees.map((employee, index) => (
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
                        <div className="font-medium">No employees available.</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* End of Employee Location */}

            </div>
          </div>
        </div>
        {/* My Current Location */}
        <div className="top-0 right-0 z-30 grid w-full h-full grid-cols-12 gap-6 pb-6 -mt-8 xl:absolute xl:mt-0 xl:pb-0 xl:z-auto">
          <div className="z-30 col-span-12 xl:col-span-3 xl:col-start-10 xl:pb-16">
            <div className="flex flex-col h-full">
              <div className="p-5 mt-6 box bg-primary intro-x">
                <div className="flex flex-wrap gap-3">
                  <div className="mr-auto">
                    <div className="flex items-center leading-3 text-white text-opacity-70 dark:text-slate-300">
                      MY CURRENT LOCATION
                      <Tippy
                        as="div"
                        content="You are currently assigned here"
                      >
                        <Lucide icon="AlertCircle" className="w-4 h-4 ml-1.5" />
                      </Tippy>
                    </div>
                    <div className="text-white relative text-2xl font-medium leading-5 pl-4 mt-3.5 text-bold">
                    {user?.currentSite?.name || "Awaiting"}
                    </div>
                  </div>
                  <a
                    className="flex items-center justify-center w-12 h-12 text-white bg-white rounded-full dark:bg-darkmode-300 bg-opacity-20 hover:bg-opacity-30"
                    href=""
                  >
                    <Lucide icon="RefreshCcw" className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <div
                className={clsx([
                  "intro-x xl:min-h-0 relative mt-5",
                  "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']",
                ])}
              >
                {/* Task Card */}
                <div className="max-h-full xl:overflow-y-auto box">
                  <div className="top-0 px-5 pt-5 pb-6 xl:sticky">
                    <div className="flex items-center">
                      <div className="mr-5 text-lg font-medium truncate">
                        Tasks
                      </div>
                      <a
                        href=""
                        className="flex items-center ml-auto text-primary"
                      >
                        <Lucide icon="RefreshCcw" className="w-4 h-4 mr-3" />
                        Refresh
                      </a>
                    </div>
                  </div>

                  <div className="px-5 pb-5 relative">
                    <div className="grid grid-cols-12 gap-y-6">
                      <div className="col-span-12">
                        <div className="text-slate-500">Your Tasks</div>
                        <div className="mt-1.5 flex items-center">
                          <div className="text-lg">{totalTasks} Tasks</div>
                          <Tippy
                            as="div"
                            className="flex ml-2 text-xs font-medium cursor-pointer text-success"
                            content={`The Actual KPI target is ${tasks[0]?.tasks[0]?.task?.kpi?.actualValue}% `}
                          >
                            {tasks[0]?.tasks[0]?.task?.kpi?.targetValue}% 
                            <Lucide
                              icon="ChevronUp"
                              className="w-4 h-4 ml-0.5"
                            />
                            {tasks[0]?.tasks[0]?.task?.kpi?.targetValue ? `${"Target KPI"}` : "No KPI's"}
                          </Tippy>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline-secondary"
                        className={`relative justify-start col-span-12 mb-2 border-dashed border-slate-300 dark:border-darkmode-300 ${hasNewAssignments ? 'animate-glow' : ''}`}
                        onClick={openTasksModal}
                      >
                        <span className="mr-5 truncate">
                          View Current Tasks
                        </span>
                        <span className="w-8 h-8 absolute flex justify-center items-center right-0 top-0 bottom-0 my-auto ml-auto mr-0.5">
                          <Lucide icon="ArrowRight" className="w-4 h-4" />
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
                {/* End of Task Card */}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal for Assignments */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-gray-800">Approve Assignments</h2>
            <div className="mt-4">
              {approvedAssignments.length > 0 ? (
                approvedAssignments.map((assignment) => (
                  <div key={assignment._id} className="flex items-center mb-2 p-2 border-b border-gray-200">
                    <Lucide icon="FileText" className="w-5 h-5 text-gray-600 mr-2" />
                    <span className="text-gray-700">{assignment.site.name}</span>
                    <Button
                      variant="primary"
                      className="ml-auto"
                      onClick={() => approveAssignment(assignment._id)}
                    >
                      Approve
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No assignments available.</p>
              )}
            </div>
            <div className="flex justify-between mt-4">
              <Button
                variant="secondary"
                className="w-full mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => viewAllAssignments()}
              >
                View All Assignments
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Task Modal */}
      {isTasksModalOpen && (
        <div className="pt-10 fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 my-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Site Assignments</h2>
            <div className="mt-4 max-h-96 overflow-y-auto">
              {tasks.length > 0 ? (
                tasks.flatMap(assignment => assignment.tasks).map((task) => (
                  <div key={task._id} className="mb-4 p-4 border border-gray-300 rounded-lg shadow-sm bg-gradient-to-r from-blue-100 to-green-100">
                    <h3 className="text-md font-bold text-gray-700">Task Identity: {task?.task?.name}</h3>
                    <p className="text-gray-600">Description: {task?.task?.description}</p>
                    <p className="text-gray-600">Completion Date: {new Date(task?.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <div className="mt-2">
                      <h4 className="text-sm font-semibold text-gray-800">KPI Details:</h4>
                      <p className="text-gray-600">Description: {task?.task?.kpi?.description}</p>
                      <p className={`text-md font-bold ${task?.task?.kpi?.targetValue >= task?.task?.kpi?.actualValue ? 'text-green-600' : 'text-red-600'}`}>
                        Target Value: {task?.task?.kpi?.targetValue}
                      </p>
                      <p className={`text-md font-bold ${task?.task?.kpi?.actualValue >= task?.task?.kpi?.targetValue ? 'text-green-600' : 'text-red-600'}`}>
                        Actual Value: {task?.task?.kpi?.actualValue}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No tasks available.</p>
              )}
            </div>
            <div className="flex justify-between mt-4">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setIsTasksModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default Main;
