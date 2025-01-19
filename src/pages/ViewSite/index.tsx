import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import { Site } from "@/types/site";
import imageUrl from '@/assets/images/logoSingle.png';
import Table from "@/components/Base/Table";
import { useEffect, useState } from "react";
import api from "@/api/axios";
import { LoadingTag } from "@/components/Loading";

function Main() {
  const location = useLocation();
  const navigate = useNavigate();
  const site = location.state?.site as Site;
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!site?._id) return;
      try {
        setLoading(true);
        const { data } = await api.get(`/sites/${site._id}/employees`);
        setEmployees(data.employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [site?._id]);

  if (!site) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-medium text-slate-600">Site not found</h2>
          <Button 
            variant="primary" 
            className="mt-4"
            onClick={() => navigate('/sites')}
          >
            <Lucide icon="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to Sites
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium">{site.name}</h2>
          <p className="text-slate-500">Site Details</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline-secondary"
            onClick={() => navigate('/sites')}
          >
            <Lucide icon="ArrowLeft" className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button 
            variant="primary"
            onClick={() => navigate(`/edit-site/${site._id}`)}
          >
            <Lucide icon="PenSquare" className="w-4 h-4 mr-2" />
            Edit Site
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-5 md:grid-cols-2">
        {/* Site Image */}
        <div className="p-5 box">
          <div className="mb-2 text-sm font-medium text-slate-500">Site Image</div>
          <img 
            src={site.image || imageUrl} 
            alt={site.name}
            className="w-full h-64 object-cover rounded-lg border"
          />
        </div>

        {/* Site Details */}
        <div className="p-5 box">
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-slate-500">Location</div>
              <p className="mt-1">{site.location}</p>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Country</div>
              <p className="mt-1">{site.country}</p>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Description</div>
              <p className="mt-1">{site.description || 'No description provided'}</p>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Status</div>
              <div className={`flex items-center mt-1 ${site.active ? 'text-success' : 'text-danger'}`}>
                <Lucide icon={site.active ? "CheckCircle" : "XCircle"} className="w-4 h-4 mr-2" />
                {site.active ? "Active" : "Inactive"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Employees Section */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-5">Assigned Employees</h3>
        {loading ? (
          <LoadingTag />
        ) : (
          <div className="box p-5">
            {employees.length > 0 ? (
              <Table className="border-spacing-y-[10px] border-separate">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="border-b-0 whitespace-nowrap">EMPLOYEE</Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">IDENTITY NO</Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">ROLE</Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">STATUS</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {employees.map((employee: any) => (
                    <Table.Tr key={employee._id}>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <div className="flex items-center">
                          <div className="font-medium whitespace-nowrap">
                            {employee.firstName} {employee.lastName}
                          </div>
                        </div>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {employee.identityNo}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {employee.role}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <div className={`flex items-center ${employee.status === 'ACTIVE' ? 'text-success' : 'text-danger'}`}>
                          <Lucide icon={employee.status === 'ACTIVE' ? "CheckCircle" : "XCircle"} className="w-4 h-4 mr-2" />
                          {employee.status}
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            ) : (
              <div className="text-center text-slate-500 py-4">
                <div className="flex flex-col items-center">
                  <Lucide icon="Users" className="w-16 h-16 text-slate-300" />
                  <p className="mt-2">No employees assigned to this site yet</p>
                  {/* Add assign button for admins */}
                  <Button 
                    variant="outline-primary"
                    className="mt-4"
                    onClick={() => navigate('/assign-employee')}
                  >
                    <Lucide icon="UserPlus" className="w-4 h-4 mr-2" />
                    Assign Employees
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Main; 