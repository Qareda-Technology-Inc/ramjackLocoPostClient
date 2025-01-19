import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { Assignment } from "@/types/assignment";
import { LoadingTag } from "@/components/Loading";
import { useState, useEffect } from "react";
import api from "@/api/axios";

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

function Main() {
  const location = useLocation();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState<Assignment | null>(
    location.state?.assignment || null
  );
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [timeRemaining, setTimeRemaining] = useState(() => 
    assignment ? calculateTimeRemaining(assignment.endDate) : { days: 0, hours: 0, minutes: 0 }
  );

  useEffect(() => {
    const fetchAssignment = async () => {
      if (!assignment && id) {
        try {
          setLoading(true);
          const { data } = await api.get(`/assignments/${id}`);
          setAssignment(data);
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
            <Lucide icon="arrow-left" className="w-4 h-4 mr-2" />
            Back to Assignments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl font-medium text-slate-900 dark:text-slate-100">Assignment Details</h2>
          <p className="mt-1 text-sm text-slate-500">Employee Assignment Information</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline-secondary"
            onClick={() => navigate('/view-assign')}
            className="w-full sm:w-auto"
          >
            <Lucide icon="arrow-left" className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button 
            variant="primary"
            onClick={() => navigate(`/edit-assignment/${assignment._id}`)}
            className="w-full sm:w-auto"
          >
            <Lucide icon="pen-square" className="w-4 h-4 mr-2" />
            Edit Assignment
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Employee Details Card */}
        <div className="box p-5 bg-white dark:bg-darkmode-600 rounded-lg shadow">
          <div className="flex items-center border-b pb-5 mb-5 border-slate-200/60 dark:border-darkmode-400">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
              <Lucide icon="user" className="w-5 h-5" />
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
              <Lucide icon="map-pin" className="w-5 h-5" />
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
              <Lucide icon="calendar" className="w-5 h-5" />
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
                  <Lucide icon="check-circle" className="w-4 h-4 mr-2" />
                  {status.label}
                </div>
              );
            })()}
          </div>

          {/* Export/Print Button */}
          <div className="mt-6 text-center">
            <Button
              variant="outline-secondary"
              onClick={() => window.print()}
              className="inline-flex items-center"
            >
              <Lucide icon="printer" className="w-4 h-4 mr-2" />
              Print Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main; 