import React, { useEffect, useState } from 'react';
import api from '@/api/axios';
import { Assignment } from '@/types/assignment';
import Button from '@/components/Base/Button';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';
import ShowMessage from '@/components/ShowMessage';
import Calendar from '@/components/Calendar';
import { useNavigate } from 'react-router-dom';

const Main: React.FC = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const token = localStorage.getItem('token');

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/assignments/assigned-user/${user?._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetched assignments:', data);
      setAssignments(data);
    } catch (error) {
      console.error(error);
      ShowMessage({
        message: 'Error fetching assignments',
        isSuccess: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [user?._id]);

  const handleViewDetails = (assignment: Assignment) => {
     // Make sure all required data is present
    if (!assignment.employee || !assignment.site) {
      console.error("Missing assignment data:", assignment);
      return;
    }
    
    navigate(`/view-assignment/${assignment._id}`, { 
      state: { 
        assignment: {
          ...assignment,
          startDate: assignment.startDate,
          endDate: assignment.endDate,
          employee: {
            ...assignment.employee,
            firstName: assignment.employee.firstName,
            lastName: assignment.employee.lastName,
            identityNo: assignment.employee.identityNo,
            role: assignment.employee.role
          },
          site: {
            ...assignment.site,
            name: assignment.site.name,
            location: assignment.site.location,
            country: assignment.site.country
          }
        } 
      } 
    });
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md intro-y">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">All Assignments</h1>
      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 intro-x mb-10">
          {assignments.length > 0 ? (
            assignments.map((assignment) => (
              <div key={assignment._id} className="border rounded-lg p-4 hover:shadow-lg transition duration-200 bg-white">
                <h2 className="text-xl font-semibold text-blue-500">{assignment.site.name} Site - {assignment.site.country}</h2>
                <p className="text-gray-600">
                  Starting From: {new Date(assignment.startDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-gray-600">
                  Ending At: {new Date(assignment.endDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <Button variant="primary" onClick={() => handleViewDetails(assignment)} className="mt-4">
                  View Details
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No assignments available.</p>
          )}
        </div>
      )}
      <Calendar assignments={assignments} />
    </div>
  );
};

export default Main; 