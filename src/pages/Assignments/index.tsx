import { useState, useEffect } from "react";
import Button from "@/components/Base/Button";
import { FormInput } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import imageUrl from '@/assets/images/logoSingle.png';
import { useNavigate } from "react-router-dom";
import { Assignment } from "@/types/assignment";
import api from "@/api/axios";
import { Eye, Edit2, Trash2, Search, Plus } from "lucide-react";

// Function to calculate remaining time
const calculateRemainingTime = (endDate: string) => {
  const now = new Date().getTime();
  const targetDate = new Date(endDate).getTime();
  const remainingTime = targetDate - now;

  if (remainingTime <= 0) {
    return "Event has passed";
  }

  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

function Main() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Filter assignments based on search query
  const filteredAssignments = assignments.filter(assignment =>
    assignment?.employee?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment?.employee?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment?.site?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment?.site?.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment?.site?.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const { data } = await api.get("/assignments/", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAssignments(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAssignments();
  }, [token]);

  const handleAssign = () => {
    navigate("/assign-employee");
  };

  const viewAssignment = (assignment: Assignment) => {
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

  const editAssignment = (assignmentId: string) => {
    navigate(`/edit-assignment/${assignmentId}`);
  };

  const deleteAssignment = async (assignmentId: string) => {
    console.log("Assignment ID", assignmentId)
    // Prompt the user for confirmation before proceeding with the delete
    const isConfirmed = window.confirm("Are you sure you want to delete this assignment?");
  
    if (isConfirmed) {
      try {
        await api.delete(`/assignments/delete/${assignmentId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Fixed token format
          },
        });

        // Remove the deleted assignment from the state
        setAssignments((prevAssignments) => 
          prevAssignments.filter(assignment => assignment._id !== assignmentId)
        );

        // Optional: Notify the user that the assignment was deleted successfully
        alert("Assignment deleted successfully.");
      } catch (error) {
        console.error("Error Deleting Assignment", error);
        alert("An error occurred while deleting the assignment.");
      }
    } else {
      // Optional: Notify the user that the deletion was canceled
      alert("Deletion canceled.");
    }
  };

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Assignment Lists</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <Button variant="primary" className="mr-2 shadow-md" onClick={handleAssign}>
            <Lucide icon="plus" className="w-4 h-4 mr-2" />
            Assign New Employee
          </Button>
          <div className="hidden mx-auto md:block text-slate-500">
            Showing lists of Assignments and their locations
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <FormInput
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Lucide icon="search" className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
            </div>
          </div>
        </div>
        {/* BEGIN: assignments Layout */}
        {filteredAssignments.length === 0 ? (
          <div className="col-span-12 text-center">No assignments available.</div>
        ) : (
          filteredAssignments.map((assignment) => (
            <div key={assignment._id} className="col-span-12 intro-y md:col-span-6">
              <div className="box">
                <div className="flex flex-col items-center p-5 lg:flex-row">
                  <div className="w-24 h-24 lg:w-12 lg:h-12 image-fit lg:mr-1">
                    <img
                      alt="Employee"
                      className="rounded-full"
                      src={assignment.site.image ? assignment.site.image : imageUrl}
                    />
                  </div>
                  <div className="mt-3 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                    <a href="#" className="font-medium" onClick={() => viewAssignment(assignment)}>
                      {assignment?.site?.name} &gt; {assignment?.site?.location} &gt; {assignment?.site?.country} 
                    </a>
                    <div className="text-slate-500 text-xs mt-0.5">
                      {assignment.employee.firstName} {assignment.employee.lastName} {' '} &gt;
                      {new Date(assignment.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} {' - '}
                      {new Date(assignment.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="text-slate-500 text-xs mt-2">
                      <strong>Remaining Time: </strong>{calculateRemainingTime(assignment?.endDate.toString())}
                    </div>
                  </div>
                  <div className="flex mt-4 lg:mt-0">
                    <Button 
                      variant="primary" 
                      className="px-2 py-1 mr-2" 
                      onClick={() => viewAssignment(assignment)}
                    >
                      <Lucide icon="eye" className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      className="px-2 py-1 mr-2" 
                      onClick={() => editAssignment(assignment._id)}
                    >
                      <Lucide icon="edit-2" className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="danger" 
                      className="px-2 py-1" 
                      onClick={() => deleteAssignment(assignment._id)}
                    >
                      <Lucide icon="trash-2" className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        {/* END: assignments Layout */}
      </div>
    </>
  );
}

export default Main;
