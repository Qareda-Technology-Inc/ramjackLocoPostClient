import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User } from "@/types/auth";
import api from "@/api/axios";
import { LoadingTag } from "@/components/Loading";
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import imageUrl from '@/assets/images/logoSingle.png';
import { Tab } from "@headlessui/react";
import clsx from "clsx";

function Main() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

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

  if (loading) return <LoadingTag />;
  if (!user) return <div className="text-center text-gray-500 py-8">User not found</div>;

  return (
    <div className="grid grid-cols-12 gap-6 mt-8">
      {/* Left Column - Profile Info */}
      <div className="col-span-12 lg:col-span-4 2xl:col-span-3">
        <div className="intro-y box p-5">
          <div className="relative flex flex-col items-center">
            <div className="image-fit w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                alt={`${user.firstName}'s profile`}
                className="rounded-full"
                src={user.image || imageUrl}
              />
            </div>
            <div className="mt-4 text-center">
              <h2 className="font-medium text-lg">{`${user.firstName} ${user.lastName}`}</h2>
              <div className="text-slate-500 mt-1">{user.position}</div>
              <div className={`text-xs mt-2 px-2 py-1 rounded-full inline-block
                ${user.status === 'ACTIVE' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                {user.status}
              </div>
            </div>
            <div className="mt-4 flex gap-2 w-full">
              <Button variant="primary" className="w-full" onClick={handleEditProfile}>
                <Lucide icon="Edit3" className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
              <Button variant="outline-secondary" className="w-full">
                <Lucide icon="MessageSquare" className="w-4 h-4 mr-2" /> Message
              </Button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t border-slate-200/60 dark:border-darkmode-400 mt-5 pt-5">
            <div className="flex flex-col gap-4">
              <div className="flex items-center">
                <Lucide icon="Mail" className="w-4 h-4 mr-2 text-slate-500" />
                <div className="truncate text-slate-600">{user.contactInfo.email}</div>
              </div>
              <div className="flex items-center">
                <Lucide icon="Phone" className="w-4 h-4 mr-2 text-slate-500" />
                <div className="truncate text-slate-600">{user.contactInfo.phone}</div>
              </div>
              <div className="flex items-center">
                <Lucide icon="Briefcase" className="w-4 h-4 mr-2 text-slate-500" />
                <div className="truncate text-slate-600">{user.position}</div>
              </div>
              <div className="flex items-center">
                <Lucide icon="Shield" className="w-4 h-4 mr-2 text-slate-500" />
                <div className="truncate text-slate-600">ID: {user.identityNo}</div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t border-slate-200/60 dark:border-darkmode-400 mt-5 pt-5">
            <div className="flex items-center justify-between mb-4">
              <div className="font-medium text-base">Social Media</div>
            </div>
            <div className="flex justify-center gap-3">
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
      </div>

      {/* Right Column - Tabs Content */}
      <div className="col-span-12 lg:col-span-8 2xl:col-span-9">
        <div className="intro-y box p-5">
          <Tab.Group>
            <Tab.List className="nav-tabs flex flex-wrap">
              <Tab className={({ selected }) =>
                clsx('py-2 px-4 rounded-md mr-2', {
                  'bg-primary text-white': selected,
                  'hover:bg-slate-100': !selected,
                })
              }>
                Overview
              </Tab>
              <Tab className={({ selected }) =>
                clsx('py-2 px-4 rounded-md mr-2', {
                  'bg-primary text-white': selected,
                  'hover:bg-slate-100': !selected,
                })
              }>
                Assignments
              </Tab>
              <Tab className={({ selected }) =>
                clsx('py-2 px-4 rounded-md mr-2', {
                  'bg-primary text-white': selected,
                  'hover:bg-slate-100': !selected,
                })
              }>
                Documents
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-5">
              <Tab.Panel>
                <div className="grid grid-cols-12 gap-6">
                  {/* Overview Stats */}
                  <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                    <div className="p-5 rounded-md bg-primary/10">
                      <div className="flex items-center gap-2">
                        <Lucide icon="Briefcase" className="w-12 h-12 text-primary" />
                        <div>
                          <div className="text-slate-500">Total Assignments</div>
                          <div className="text-2xl font-medium">{user.assignments?.length || 0}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Add more stats cards here */}
                </div>
              </Tab.Panel>
              
              <Tab.Panel>
                <div className="grid grid-cols-1 gap-4">
                  {user.assignments && user.assignments.length > 0 ? (
                    user.assignments.map((assignment: any, index: number) => (
                      <div key={index} 
                        className="bg-slate-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-base">{assignment.site?.name || 'Unknown Site'}</div>
                            <div className="text-slate-500 mt-1">
                              {new Date(assignment.startDate).toLocaleDateString()} - 
                              {assignment.endDate ? new Date(assignment.endDate).toLocaleDateString() : 'Present'}
                            </div>
                          </div>
                          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs">
                            {assignment.status}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500 text-center py-8 bg-slate-50 rounded-lg">
                      No assignment history available
                    </div>
                  )}
                </div>
              </Tab.Panel>

              <Tab.Panel>
                <div className="text-center py-8 bg-slate-50 rounded-lg">
                  <Lucide icon="File" className="w-16 h-16 mx-auto text-slate-300" />
                  <div className="mt-4 text-slate-500">No documents uploaded yet</div>
                  <Button variant="outline-primary" className="mt-4">
                    <Lucide icon="Upload" className="w-4 h-4 mr-2" /> Upload Documents
                  </Button>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}

export default Main; 