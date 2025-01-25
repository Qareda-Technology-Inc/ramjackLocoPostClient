import { useEffect, useState } from "react";
import Button from "@/components/Base/Button";
import { FormInput } from "@/components/Base/Form";
import Progress from "@/components/Base/Progress";
import Lucide from "@/components/Base/Lucide";
import Tippy from "@/components/Base/Tippy";
import api from "@/api/axios";
import { User } from "@/types/auth";
import imageUrl from '@/assets/images/logoSingle.png';
import { useNavigate } from "react-router-dom";
import { LoadingTag } from "@/components/Loading";
import { Menu } from "@/components/Base/Headless";

function Main() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<boolean>(false)

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/users/list", {
          headers: {
              Authorization: `Bearer ${token}`
            }
          });
        setUsers(data);
        setLoading(false)
      } catch (error) {
        console.error(error);
        setLoading(false)
      }
    };

    fetchUsers();
  }, [token]);

  const handleAddUser = () => {
    navigate("/add-employee");
  };

  const viewEmployee = (user: User) => {
    navigate(`/profile/${user._id}`);
  };

  const editEmployee = (userId: string) => {
    navigate(`/edit-employee/${userId}`);
  };

  const handleStatusChange = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
      await api.patch(`/users/${userId}/status`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update the local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  return (
    <> {
      loading ? (
        <LoadingTag />
      ) : (
        <>
          <h2 className="mt-10 text-lg font-medium intro-y">Employee List</h2>
          <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
              <Button variant="primary" className="mr-2 shadow-md" onClick={handleAddUser}>
                Add New User
              </Button>
              <div className="hidden mx-auto md:block text-slate-500">
                Showing list of employees
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
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 col-span-12">
              {filteredUsers ? (
                filteredUsers.map((user, id) => (
                  <div key={id} className="col-span-1 intro-y">
                    <div className={`box ${user.status === 'BLOCKED' ? 'opacity-75' : ''}`}>
                      <div className="flex flex-col items-center p-5 border-b lg:flex-row border-slate-200/60 dark:border-darkmode-400">
                        <div className="w-24 h-24 lg:w-12 lg:h-12 image-fit lg:mr-1">
                          <img
                            alt="Qaretech Innovative"
                            className="rounded-full"
                            src={user.image ? user.image : imageUrl}
                          />
                        </div>
                        <div className="mt-3 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                          <a href="#" className="text-lg font-bold" onClick={() => viewEmployee(user)}>
                            {user.firstName} {user.lastName}
                          </a>
                          <div className="text-slate-500 text-xs mt-0.5">
                            {user.position}
                          </div>
                        </div>
                        <div className="flex mt-3 lg:ml-0 lg:justify-end lg:mt-0">
                          <div className="flex -ml-2">
                            <Tippy content="Facebook">
                              <a
                                href="#"
                                className="flex items-center justify-center w-8 h-8 ml-2 border rounded-full dark:border-darkmode-400 text-slate-400 zoom-in"
                              >
                                <Lucide icon="Facebook" className="w-3 h-3 fill-current" />
                              </a>
                            </Tippy>
                            <Tippy content="Twitter">
                              <a
                                href="#"
                                className="flex items-center justify-center w-8 h-8 ml-2 border rounded-full dark:border-darkmode-400 text-slate-400 zoom-in"
                              >
                                <Lucide icon="Twitter" className="w-3 h-3 fill-current" />
                              </a>
                            </Tippy>
                            <Tippy content="LinkedIn">
                              <a
                                href="#"
                                className="flex items-center justify-center w-8 h-8 ml-2 border rounded-full dark:border-darkmode-400 text-slate-400 zoom-in"
                              >
                                <Lucide icon="Linkedin" className="w-3 h-3 fill-current" />
                              </a>
                            </Tippy>
                          </div>
                          <Menu>
                            <Menu.Button as={Button} variant="outline-secondary" className="px-2 py-1 ml-2">
                              <Lucide icon="MoreVertical" className="w-4 h-4" />
                            </Menu.Button>
                            <Menu.Items className="w-40">
                              <Menu.Item onClick={() => viewEmployee(user)}>
                                <Lucide icon="User" className="w-4 h-4 mr-2" /> View Profile
                              </Menu.Item>
                              <Menu.Item onClick={() => editEmployee(user._id)}>
                                <Lucide icon="Pencil" className="w-4 h-4 mr-2" /> Edit
                              </Menu.Item>
                              <Menu.Item
                                onClick={() => handleStatusChange(user._id, user.status)}
                                className={user.status === 'ACTIVE' ? 'text-danger' : 'text-success'}
                              >
                                <Lucide 
                                  icon={user.status === 'ACTIVE' ? 'UserX' : 'UserCheck'} 
                                  className="w-4 h-4 mr-2" 
                                />
                                {user.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                              </Menu.Item>
                            </Menu.Items>
                          </Menu>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-center p-5 lg:flex-nowrap">
                        <div className="w-full mb-4 mr-auto lg:w-1/2 lg:mb-0">
                          <div className="flex text-xs text-slate-500">
                            <div className="mr-auto">Status</div>
                            <div className={user.status === 'ACTIVE' ? 'text-success' : 'text-danger'}>
                              {user.status}
                            </div>
                          </div>
                          <Progress className="h-1 mt-2">
                            <Progress.Bar
                              className={`w-full ${user.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'}`}
                              role="progressbar"
                              aria-valuenow={100}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            />
                          </Progress>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline-secondary"
                            className="px-2 py-1"
                            onClick={() => viewEmployee(user)}
                          >
                            Profile
                          </Button>
                          <Button
                            variant="outline-primary"
                            className="px-2 py-1"
                            onClick={() => editEmployee(user._id)}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-12 text-center text-gray-500">No employees found</div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Main;
