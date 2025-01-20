import _ from "lodash";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User } from "@/types/auth";
import api from "@/api/axios";
import { LoadingTag } from "@/components/Loading";
import Button from "@/components/Base/Button";
import { FormInput } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import { Tab } from "@/components/Base/Headless";
import imageUrl from '@/assets/images/logoSingle.png';
import clsx from "clsx";

function Main() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const handleEditProfile = () => {
    navigate(`/edit-profile/${userId}`);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add password change logic here
  };

  if (loading) return <LoadingTag />;
  if (!user) return <div className="text-center text-gray-500 py-8">User not found</div>;

  return (
    <>
      <div className="flex items-center mt-8 intro-y">
        <h2 className="mr-auto text-lg font-medium">Profile</h2>
        <Button variant="primary" onClick={handleEditProfile}>
          <Lucide icon="Edit" className="w-4 h-4 mr-2" /> Edit Profile
        </Button>
      </div>
      <Tab.Group>
        {/* BEGIN: Profile Info */}
        <div className="px-5 pt-5 mt-5 intro-y box">
          <div className="flex flex-col pb-5 -mx-5 border-b lg:flex-row border-slate-200/60 dark:border-darkmode-400">
            <div className="flex items-center justify-center flex-1 px-5 lg:justify-start">
              <div className="relative flex-none w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 image-fit">
                <img
                  alt="Profile"
                  className="rounded-full"
                  src={user.image || imageUrl}
                />
              </div>
              <div className="ml-5">
                <div className="w-24 text-lg font-medium truncate sm:w-40 sm:whitespace-normal">
                  {`${user.firstName} ${user.lastName}`}
                </div>
                <div className="text-slate-500">{user.position}</div>
                <div className={`mt-2 px-2 py-1 rounded-full inline-block text-xs
                  ${user.status === 'ACTIVE' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                  {user.status}
                </div>
              </div>
            </div>
            <div className="flex-1 px-5 pt-5 mt-6 border-t border-l border-r lg:mt-0 border-slate-200/60 dark:border-darkmode-400 lg:border-t-0 lg:pt-0">
              <div className="font-medium text-center lg:text-left lg:mt-3">
                Contact Details
              </div>
              <div className="flex flex-col items-center justify-center mt-4 lg:items-start">
                <div className="flex items-center truncate sm:whitespace-normal">
                  <Lucide icon="Mail" className="w-4 h-4 mr-2" />
                  {user.contactInfo.email}
                </div>
                <div className="flex items-center mt-3 truncate sm:whitespace-normal">
                  <Lucide icon="Phone" className="w-4 h-4 mr-2" />
                  {user.contactInfo.phone}
                </div>
                <div className="flex items-center mt-3 truncate sm:whitespace-normal">
                  <Lucide icon="Shield" className="w-4 h-4 mr-2" />
                  ID: {user.identityNo}
                </div>
              </div>
            </div>
            <div className="flex-1 px-5 pt-5 mt-6 border-t lg:mt-0 lg:border-0 border-slate-200/60 dark:border-darkmode-400 lg:pt-0">
              <div className="font-medium text-center lg:text-left lg:mt-3">
                Social Media
              </div>
              <div className="flex justify-center gap-3 mt-4">
                <a href="#" className="transition transform hover:scale-110">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white">
                    <Lucide icon="Facebook" className="w-4 h-4" />
                  </div>
                </a>
                <a href="#" className="transition transform hover:scale-110">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white">
                    <Lucide icon="Twitter" className="w-4 h-4" />
                  </div>
                </a>
                <a href="#" className="transition transform hover:scale-110">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white">
                    <Lucide icon="Linkedin" className="w-4 h-4" />
                  </div>
                </a>
              </div>
            </div>
          </div>
          <Tab.List
            variant="link-tabs"
            className="flex-col justify-center text-center sm:flex-row lg:justify-start"
          >
            <Tab fullWidth={false}>
              <Tab.Button className="flex items-center py-4 cursor-pointer">
                <Lucide icon="Briefcase" className="w-4 h-4 mr-2" /> Assignments
              </Tab.Button>
            </Tab>
            <Tab fullWidth={false}>
              <Tab.Button className="flex items-center py-4 cursor-pointer">
                <Lucide icon="Lock" className="w-4 h-4 mr-2" /> Change Password
              </Tab.Button>
            </Tab>
          </Tab.List>
        </div>
        {/* END: Profile Info */}
        <Tab.Panels className="mt-5">
          <Tab.Panel>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-12 intro-y">
                <div className="box">
                  <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 className="font-medium text-base mr-auto">Assignment History</h2>
                  </div>
                  <div className="p-5">
                    {user.assignments && user.assignments.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {user.assignments.map((assignment: any, index: number) => (
                          <div key={index} 
                            className="bg-slate-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-base">{assignment.site?.name || 'Unknown Site'}</div>
                                <div className="text-slate-500 mt-1">
                                  {new Date(assignment.startDate).toLocaleDateString()} - 
                                  {assignment.endDate ? new Date(assignment.endDate).toLocaleDateString() : 'Present'}
                                </div>
                                <div className="text-slate-500 mt-1">
                                  Position: {assignment.position || user.position}
                                </div>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-xs
                                ${assignment.status === 'ACTIVE' ? 'bg-success/20 text-success' : 
                                assignment.status === 'PENDING' ? 'bg-warning/20 text-warning' : 
                                'bg-slate-100 text-slate-500'}`}>
                                {assignment.status}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-slate-500 py-8">
                        No assignments found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-8 intro-y">
                <div className="box">
                  <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <h2 className="font-medium text-base mr-auto">Change Password</h2>
                  </div>
                  <div className="p-5">
                    <form onSubmit={handlePasswordChange}>
                      <div className="mt-3">
                        <label className="form-label">Current Password</label>
                        <FormInput
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                        />
                      </div>
                      <div className="mt-3">
                        <label className="form-label">New Password</label>
                        <FormInput
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                        />
                      </div>
                      <div className="mt-3">
                        <label className="form-label">Confirm New Password</label>
                        <FormInput
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                        />
                      </div>
                      <Button type="submit" variant="primary" className="mt-4">
                        Change Password
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}

export default Main; 