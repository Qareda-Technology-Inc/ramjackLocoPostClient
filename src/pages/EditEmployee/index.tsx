import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import { useParams } from 'react-router-dom';
import { FormInput, FormLabel } from '@/components/Base/Form';
import Toastify from 'toastify-js';

const Main = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    contactInfo: {
      email: '',
      phone: '',
    },
    identityNo: '',
    role: 'FIELD-TECHNICIAN',
    status: 'ACTIVE',
    position: '',
  });

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        setEmployee(response.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        showToast("Error fetching employee data.", "error");
      }
    };

    fetchEmployeeData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name in employee.contactInfo) {
      setEmployee({
        ...employee,
        contactInfo: { ...employee.contactInfo, [name]: value },
      });
    } else {
      setEmployee({ ...employee, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.put(`users/${id}/update`, employee);
      showToast(response.data.message || "Profile updated successfully!", "success");
    } catch (error) {
      console.error('Error updating employee profile:', error);
      showToast("Error updating employee profile.", "error");
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    const toastOptions = {
      text: message,
      duration: 3000,
      close: true,
      gravity: "top" as "top", // Explicitly defined as "top"
      position: "right" as "right", // Explicitly defined as "right"
      stopOnFocus: true,
      backgroundColor: type === 'success' ? "green" : "red",
    };

    Toastify(toastOptions).showToast();
  };

  return (
    <div className="grid grid-cols-1 gap-6 mt-5">
      <div className="col-span-12 intro-y lg:col-span-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Edit Profile</h2>
        <div className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4 intro-y">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="input-form intro-y">
                <FormLabel className="block text-sm font-medium text-gray-700">First Name</FormLabel>
                <FormInput
                  type="text"
                  name="firstName"
                  value={employee.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  placeholder="First Name"
                  required
                />
              </div> 

              <div className="input-form intro-y">
                <FormLabel className="block text-sm font-medium text-gray-700 flex flex-col">Last Name</FormLabel>
                <FormInput
                  type="text"
                  name="lastName"
                  value={employee.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  placeholder="Last Name"
                  required
                />
              </div>

              <div className="input-form intro-y">
                <FormLabel className="block text-sm font-medium text-gray-700">Email</FormLabel>
                <FormInput
                  type="email"
                  name="email"
                  value={employee.contactInfo.email}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  placeholder="Email"
                  required
                />
              </div>
              
              <div className="input-form intro-y">
                <FormLabel className="block text-sm font-medium text-gray-700">Phone</FormLabel>
                <FormInput
                  type="tel"
                  name="phone"
                  value={employee.contactInfo.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  placeholder="Phone"
                  required
                />
              </div>

              <div className="input-form intro-y">
                <FormLabel className="block text-sm font-medium text-gray-700">Identity No</FormLabel>
                <FormInput
                  type="text"
                  name="identityNo"
                  value={employee.identityNo}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  placeholder="Identity No"
                  required
                />
              </div>

              <div className="input-form intro-y">
                <FormLabel className="block text-sm font-medium text-gray-700">Role</FormLabel>
                <select
                  name="role"
                  value={employee.role}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  required
                >
                  <option value="FIELD-TECHNICIAN">Field Technician</option>
                  <option value="FIELD-ENGINEER">Field Engineer</option>
                  <option value="SUPERVISOR">Supervisor</option>
                  <option value="PRESIDENT">President</option>
                  <option value="SITE-REP">Site Rep</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="input-form intro-y">
                <FormLabel className="block text-sm font-medium text-gray-700">Status</FormLabel>
                <select
                  name="status"
                  value={employee.status}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  required
                >
                  <option value="ACTIVE">Active</option>
                  <option value="BLOCKED">Blocked</option>
                </select>
              </div>

              <div className="input-form intro-y">
                <FormLabel className="block text-sm font-medium text-gray-700">Position</FormLabel>
                <FormInput
                  type="text"
                  name="position"
                  value={employee.position}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  placeholder="Position"
                  required
                />
              </div>
            </div>
            <div className='flex justify-center'>
              <button
                type="submit"
                className="px-5 py-3 flex py-2 mt-4 text-white font-bold bg-orange-800 rounded-md hover:bg-orange-700 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Main;
