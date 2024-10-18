import { useState, useEffect } from "react";
import Button from "@/components/Base/Button";
import { FormInput } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import imageUrl from '@/assets/images/logoSingle.png';
import { useNavigate } from "react-router-dom";
import { Assignment } from "@/types/assignment";
import api from "@/api/axios";

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
    navigate(`/view-employee/${assignment._id}`, { state: { assignment } });
  };

  const editAssignment = (assignmentId: string) => {
    navigate(`/edit-employee/${assignmentId}`);
  };

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Assignment Lists</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <Button variant="primary" className="mr-2 shadow-md" onClick={handleAssign}>
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
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
          </div>
        </div>
        {/* BEGIN: assignments Layout */}
        {filteredAssignments.map((assignment) => (
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
                </div>
                <div className="flex mt-4 lg:mt-0">
                  <Button variant="primary" className="px-2 py-1 mr-2" onClick={() => viewAssignment(assignment)}>
                    View
                  </Button>
                  <Button variant="outline-secondary" className="px-2 py-1" onClick={() => editAssignment(assignment._id)}>
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* END: assignments Layout */}
      </div>
    </>
  );
}

export default Main;
