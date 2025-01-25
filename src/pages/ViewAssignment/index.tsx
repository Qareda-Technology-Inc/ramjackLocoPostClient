import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { Assignment } from "@/types/assignment";
import { LoadingTag } from "@/components/Loading";
import { useState, useEffect } from "react";
import api from "@/api/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import NotifyMessage from "@/components/NotifyMessage";

const calculateProgress = (startDate: string | Date, endDate: string | Date) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  
  const total = end - start;
  const elapsed = now - start;
  const progress = Math.max(0, Math.min(100, (elapsed / total) * 100));
  
  return progress;
};

const calculateTimeRemaining = (endDate: string | Date) => {
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  const remaining = end - now;

  if (remaining <= 0) return { days: 0, hours: 0, minutes: 0 };

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes };
};

const getAssignmentStatus = (startDate: string | Date, endDate: string | Date) => {
  if (!startDate || !endDate) return { label: 'Unknown', color: 'secondary' };
  
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  const progress = calculateProgress(startDate, endDate);
  
  if (now < start) return { label: 'Not Started', color: 'warning' };
  if (now > end) return { label: 'Completed', color: 'success' };
  if (progress < 25) return { label: 'Just Started', color: 'info' };
  if (progress > 75) return { label: 'Ending Soon', color: 'warning' };
  return { label: 'In Progress', color: 'primary' };
};

const Main = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState<Assignment | null>(
    location.state?.assignment || null
  );
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [timeRemaining, setTimeRemaining] = useState(() => 
    assignment ? calculateTimeRemaining(assignment.endDate) : { days: 0, hours: 0, minutes: 0 }
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [completionDate, setCompletionDate] = useState<string>('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      if (!assignment && id) {
        try {
          setLoading(true);
          const { data } = await api.get(`/assignments/${id}`);
          setAssignment(data);
          console.log("Assignment Data:", data);
        } catch (error) {
          console.error("Error fetching assignment:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAssignment();
  }, [id, assignment]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get('/tasks');
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    if (!assignment) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(assignment.endDate));
    }, 60000);

    return () => clearInterval(timer);
  }, [assignment]);

  if (loading) return <LoadingTag />;

  if (!assignment) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-medium text-slate-600">Assignment not found</h2>
          <Button 
            variant="primary" 
            className="mt-4"
            onClick={() => navigate('/view-assign')}
          >
            <Lucide icon="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to Assignments
          </Button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    try {
      if (user?.role === "ADMIN") {
        navigate('/view-assign');
      } else {
        navigate('/assignments');
      }
    } catch (error) {
      console.error("Error navigating back:", error);
    }
  };

  const handleSubmitTaskAssignment = async () => {
    try {
      await api.put(`/assignments/add-task/${id}`, {
        taskId: selectedTask,
        assignmentId: id,
        isCompleted: false,
        completionDate,
      });
      setNotification({ message: "Task assignment submitted successfully!", type: 'success' });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting task assignment:", error);
      setNotification({ message: "Error submitting task assignment.", type: 'error' });
    }
  };

  return (
    <div className="mt-5 px-4 sm:px-6 lg:px-8">
      {notification && <NotifyMessage message={notification.message} type={notification.type} />}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl font-medium text-slate-900 dark:text-slate-100">Assignment Details</h2>
          <p className="mt-1 text-sm text-slate-500">Employee Assignment Information</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline-secondary"
            onClick={() => handleBack()}
            className="w-full sm:w-auto"
          >
            <Lucide icon="ArrowLeft" className="w-4 h-4 mr-2" />
            Back
          </Button>
          {user?.role === "ADMIN" && (
            <Button 
              variant="primary"
              onClick={() => navigate(`/edit-assignment/${assignment._id}`)}
              className="w-full sm:w-auto"
            >
              <Lucide icon="PenSquare" className="w-4 h-4 mr-2" />
              Edit Assignment
            </Button>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Employee Details Card */}
        <div className="box p-5 bg-white dark:bg-darkmode-600 rounded-lg shadow">
          <div className="flex items-center border-b pb-5 mb-5 border-slate-200/60 dark:border-darkmode-400">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
              <Lucide icon="User" className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium">Employee Information</h3>
              <p className="text-slate-500 text-sm">Assigned Personnel Details</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-slate-500">Full Name</div>
              <p className="mt-1 text-base font-medium">
                {assignment.employee.firstName} {assignment.employee.lastName}
              </p>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Identity No</div>
              <p className="mt-1 text-base">{assignment.employee.identityNo}</p>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Role</div>
              <div className="mt-1">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                  {assignment.employee.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Site Details Card */}
        <div className="box p-5 bg-white dark:bg-darkmode-600 rounded-lg shadow">
          <div className="flex items-center border-b pb-5 mb-5 border-slate-200/60 dark:border-darkmode-400">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-success/10 text-success">
              <Lucide icon="MapPin" className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium">Site Information</h3>
              <p className="text-slate-500 text-sm">Assignment Location Details</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-slate-500">Site Name</div>
              <p className="mt-1 text-base font-medium">{assignment.site.name}</p>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Location</div>
              <p className="mt-1 text-base">{assignment.site.location}</p>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Country</div>
              <p className="mt-1 text-base">{assignment.site.country}</p>
            </div>
          </div>
        </div>

        {/* Assignment Period Card - Full Width */}
        <div className="lg:col-span-2 box p-5 bg-white dark:bg-darkmode-600 rounded-lg shadow">
          <div className="flex items-center border-b pb-5 mb-5 border-slate-200/60 dark:border-darkmode-400">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-warning/10 text-warning">
              <Lucide icon="Calendar" className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium">Assignment Period</h3>
              <p className="text-slate-500 text-sm">Duration of Assignment</p>
            </div>
          </div>

          {/* Timeline Progress */}
          <div className="mb-8">
            <div className="relative pt-8">
              <div className="h-2 bg-slate-100 rounded-full">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress(assignment.startDate, assignment.endDate)}%` }}
                />
              </div>
              <div className="absolute left-0 -top-0">
                <div className="text-xs font-medium mb-1 text-slate-500">Start</div>
                <div className="w-4 h-4 bg-primary rounded-full" />
              </div>
              <div className="absolute right-0 -top-0">
                <div className="text-xs font-medium mb-1 text-slate-500">End</div>
                <div className="w-4 h-4 bg-primary rounded-full" />
              </div>
            </div>
          </div>

          {/* Date Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-darkmode-400">
              <div className="text-sm font-medium text-slate-500 mb-1">Start Date</div>
              <p className="text-base font-medium">
                {new Date(assignment.startDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-darkmode-400">
              <div className="text-sm font-medium text-slate-500 mb-1">End Date</div>
              <p className="text-base font-medium">
                {new Date(assignment.endDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Time Remaining Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-primary/5 transform transition-all hover:scale-105">
              <div className="text-3xl font-bold text-primary mb-1 animate-fade-in">
                {timeRemaining.days}
              </div>
              <div className="text-xs text-slate-500">Days</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/5 transform transition-all hover:scale-105">
              <div className="text-3xl font-bold text-primary mb-1 animate-fade-in">
                {timeRemaining.hours}
              </div>
              <div className="text-xs text-slate-500">Hours</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/5 transform transition-all hover:scale-105">
              <div className="text-3xl font-bold text-primary mb-1 animate-fade-in">
                {timeRemaining.minutes}
              </div>
              <div className="text-xs text-slate-500">Minutes</div>
            </div>
          </div>

          {/* Assignment Status with dynamic color */}
          <div className="mt-6 text-center">
            {(() => {
              const status = getAssignmentStatus(assignment.startDate, assignment.endDate);
              return (
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${status.color}/10 text-${status.color}`}>
                  <Lucide icon="CheckCircle" className="w-4 h-4 mr-2" />
                  {status.label}
                </div>
              );
            })()}
          </div>

          {/* Submit Task Assignment Button */}
          {user?.role === "ADMIN" && (
            <div className="flex items-center justify-center flex-row gap-4 mt-6">
              <Button
                variant="outline-secondary"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center"
              >
                <Lucide icon="PlusCircle" className="w-4 h-4 mr-2" />
                Assign Task Assignment
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Simple Modal for Task Assignment Submission */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Submit Task Assignment</h2>
            <div>
              <label className="block mb-2">Select Task:</label>
              <select
                value={selectedTask || ""}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="border rounded p-2 w-full"
                required
              >
                <option value="" disabled>Select a task</option>
                {tasks.map(task => (
                  <option key={task._id} value={task._id}>
                    {task.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="block mb-2">Completion Date:</label>
              <input
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                className="border rounded p-2 w-full"
                required
              />
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline-secondary" onClick={() => setIsModalOpen(false)} className="mr-2">
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmitTaskAssignment}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main; 