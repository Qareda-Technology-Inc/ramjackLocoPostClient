import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User } from "@/types/auth";
import api from "@/api/axios";
import { LoadingTag } from "@/components/Loading";
import Button from "@/components/Base/Button";
import { FormInput, FormLabel, FormTextarea } from "@/components/Base/Form";
import imageUrl from '@/assets/images/logoSingle.png';
import Lucide from "@/components/Base/Lucide";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import Notification from "@/components/Base/Notification";
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

function Main() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    identityNo: "",
    position: "",
    contactInfo: {
      phone: "",
      email: "",
      address: ""
    },
    socialMedia: {
      facebook: "",
      twitter: "",
      linkedin: ""
    },
    image: null as File | null
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${userId}`);
        setUser(response.data);
        setFormData({
          ...formData,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          identityNo: response.data.identityNo,
          position: response.data.position,
          contactInfo: {
            phone: response.data.contactInfo.phone || "",
            email: response.data.contactInfo.email,
            address: response.data.contactInfo.address || ""
          },
          socialMedia: response.data.socialMedia || {
            facebook: "",
            twitter: "",
            linkedin: ""
          }
        });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    const notificationId = type === 'success' ? 
      '#success-notification-content' : 
      '#failed-notification-content';
    
    const notificationEl = document.querySelector(notificationId);
    if (notificationEl) {
      const clonedEl = notificationEl.cloneNode(true) as HTMLElement;
      clonedEl.classList.remove('hidden');
      
      const messageEl = clonedEl.querySelector('.text-slate-500');
      if (messageEl) {
        messageEl.textContent = message;
      }
      
      Toastify({
        node: clonedEl,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        className: "toastify-content",
      }).showToast();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Only append image if it exists
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      // Add other form fields as strings
      formDataToSend.append('firstName', formData.firstName || '');
      formDataToSend.append('lastName', formData.lastName || '');

      // Convert objects to strings before appending
      const contactInfoString = JSON.stringify({
        phone: formData.contactInfo.phone || '',
        email: formData.contactInfo.email || '',
        address: formData.contactInfo.address || ''
      });
      formDataToSend.append('contactInfo', contactInfoString);

      const socialMediaString = JSON.stringify({
        facebook: formData.socialMedia.facebook || '',
        twitter: formData.socialMedia.twitter || '',
        linkedin: formData.socialMedia.linkedin || ''
      });
      formDataToSend.append('socialMedia', socialMediaString);

      // Log the data being sent
      console.log('Sending form data:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        contactInfo: contactInfoString,
        socialMedia: socialMediaString
      });

      const response = await api.patch(`/users/${userId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        showNotification('success', 'Profile updated successfully');
        setTimeout(() => {
          navigate(`/profile/${userId}`);
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Error updating profile';
      showNotification('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingTag />;

  return (
    <div className="grid grid-cols-12 gap-6 mt-8">
      <div className="col-span-12 lg:col-span-10 lg:col-start-2">
        <div className="intro-y box">
          <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
            <h2 className="font-medium text-base mr-auto">Edit Profile</h2>
          </div>
          <Tab.Group>
            <div className="p-5">
              <Tab.List className="nav-tabs flex flex-wrap mb-5">
                <Tab className={({ selected }) =>
                  clsx('py-2 px-4 rounded-md mr-2', {
                    'bg-primary text-white': selected,
                    'hover:bg-slate-100': !selected,
                  })
                }>
                  Basic Info
                </Tab>
                <Tab className={({ selected }) =>
                  clsx('py-2 px-4 rounded-md mr-2', {
                    'bg-primary text-white': selected,
                    'hover:bg-slate-100': !selected,
                  })
                }>
                  Contact & Social
                </Tab>
              </Tab.List>
              <form onSubmit={handleSubmit}>
                <Tab.Panels>
                  <Tab.Panel>
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12 text-center">
                        <div className="w-24 h-24 mx-auto relative">
                          <img
                            src={imagePreview || user?.image || imageUrl}
                            alt="Profile"
                            className="rounded-full w-full h-full object-cover"
                          />
                          <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-primary-focus">
                            <Lucide icon="Camera" className="w-4 h-4" />
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="col-span-12 sm:col-span-6">
                        <FormLabel>First Name</FormLabel>
                        <FormInput
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                      </div>
                      <div className="col-span-12 sm:col-span-6">
                        <FormLabel>Last Name</FormLabel>
                        <FormInput
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                      </div>
                      <div className="col-span-12 sm:col-span-6">
                        <FormLabel>Identity Number</FormLabel>
                        <FormInput
                          type="text"
                          value={formData.identityNo}
                          disabled
                          className="bg-slate-100 cursor-not-allowed"
                        />
                      </div>
                      <div className="col-span-12 sm:col-span-6">
                        <FormLabel>Position</FormLabel>
                        <FormInput
                          type="text"
                          value={formData.position}
                          disabled
                          className="bg-slate-100 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </Tab.Panel>

                  <Tab.Panel>
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12">
                        <FormLabel>Email</FormLabel>
                        <FormInput
                          type="email"
                          value={formData.contactInfo.email}
                          onChange={(e) => setFormData({
                            ...formData,
                            contactInfo: {...formData.contactInfo, email: e.target.value}
                          })}
                        />
                      </div>
                      <div className="col-span-12 sm:col-span-6">
                        <FormLabel>Phone</FormLabel>
                        <FormInput
                          type="text"
                          value={formData.contactInfo.phone}
                          onChange={(e) => setFormData({
                            ...formData,
                            contactInfo: {...formData.contactInfo, phone: e.target.value}
                          })}
                        />
                      </div>
                      <div className="col-span-12">
                        <FormLabel>Address</FormLabel>
                        <FormTextarea
                          value={formData.contactInfo.address}
                          onChange={(e) => setFormData({
                            ...formData,
                            contactInfo: {...formData.contactInfo, address: e.target.value}
                          })}
                        />
                      </div>
                      <div className="col-span-12">
                        <FormLabel>Facebook</FormLabel>
                        <FormInput
                          type="text"
                          value={formData.socialMedia.facebook}
                          onChange={(e) => setFormData({
                            ...formData,
                            socialMedia: {...formData.socialMedia, facebook: e.target.value}
                          })}
                        />
                      </div>
                      <div className="col-span-12">
                        <FormLabel>Twitter</FormLabel>
                        <FormInput
                          type="text"
                          value={formData.socialMedia.twitter}
                          onChange={(e) => setFormData({
                            ...formData,
                            socialMedia: {...formData.socialMedia, twitter: e.target.value}
                          })}
                        />
                      </div>
                      <div className="col-span-12">
                        <FormLabel>LinkedIn</FormLabel>
                        <FormInput
                          type="text"
                          value={formData.socialMedia.linkedin}
                          onChange={(e) => setFormData({
                            ...formData,
                            socialMedia: {...formData.socialMedia, linkedin: e.target.value}
                          })}
                        />
                      </div>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
                <div className="flex justify-end gap-2 mt-5">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => navigate(`/profile/${userId}`)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </Tab.Group>
        </div>
      </div>
      <Notification id="success-notification-content" className="hidden">
        <div className="font-medium text-success">Success</div>
        <div className="text-slate-500 mt-1">
          Profile updated successfully
        </div>
      </Notification>

      <Notification id="failed-notification-content" className="hidden">
        <div className="font-medium text-danger">Error</div>
        <div className="text-slate-500 mt-1">
          Failed to update profile
        </div>
      </Notification>
    </div>
  );
}

export default Main;