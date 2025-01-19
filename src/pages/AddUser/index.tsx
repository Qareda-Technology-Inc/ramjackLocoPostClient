import {
  FormLabel,
  FormInput,
} from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Notification from "@/components/Base/Notification";
import Toastify from "toastify-js";
import clsx from "clsx";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "@/api/axios";
import { isAxiosError } from "axios";
import Lucide from "@/components/Base/Lucide";
import { useNavigate } from 'react-router-dom';
import { LoadingTag } from "@/components/Loading";

function Main() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const schema = yup
    .object({
      firstName: yup.string().required().min(2),
      lastName: yup.string().required().min(2),
      position: yup.string().required(),
      identityNo: yup.string().required(),
      role: yup.string().required(),
      contactInfo: yup.object({
        phone: yup.string().required().min(10),
        email: yup.string().required().email(),
      }),
      image: yup.string(),
    })
    .required();

  const {
    register,
    trigger,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const roles = [
    { value: "", label: "Select Role" },
    { value: "PRESIDENT", label: "Manager" },
    { value: "FIELD-ENGINEER", label: "Field Engineer" },
    { value: "FIELD-TECHNICIAN", label: "Field Technician" },
    { value: "ADMIN", label: "Admin" },
  ];

  const previewFiles = (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file)

    reader.onloadend = () => {
      setImage(reader.result as string)
    }
    console.log("Image", image)
  }

  const onFileChange = (event: { target: { files: React.SetStateAction<null>[]; }; }) => {
    const file = event.target.files[0]  
    setImageFile(file);
    previewFiles(file);
    };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await trigger();

    if (!result) {
      const notificationElements = document.querySelectorAll("#failed-notification-content");
      if (notificationElements.length > 0) {
        const failedEl = notificationElements[0].cloneNode(true) as HTMLElement;
        failedEl.classList.remove("hidden");
        Toastify({
          node: failedEl,
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true,
        }).showToast();
      }
    } else {
      try {
        setLoading(true);
        
        // Log the form data being sent
        const formData = {
          firstName: getValues("firstName"),
          lastName: getValues("lastName"),
          position: getValues("position"),
          identityNo: getValues("identityNo"),
          role: getValues("role"),
          contactInfo: {
            phone: getValues("contactInfo.phone"),
            email: getValues("contactInfo.email"),
          },
          image: image,
        };
        
        console.log('Submitting user data:', formData);

        const response = await api.post("users/add", formData);
        console.log('Server response:', response.data);

        if (response.data.success) {
          const successElements = document.querySelectorAll("#success-notification-content");
          if (successElements.length > 0) {
            const successEl = successElements[0].cloneNode(true) as HTMLElement;
            successEl.classList.remove("hidden");
            
            const messageElement = successEl.querySelector('.font-medium');
            if (messageElement) {
              messageElement.textContent = response.data.message || "User created successfully!";
            }

            Toastify({
              node: successEl,
              duration: 5000,
              newWindow: true,
              close: true,
              gravity: "top",
              position: "right",
              stopOnFocus: true,
            }).showToast();

            reset(); // Clear form inputs
            navigate('/employees');
          }
        }
      } catch (error: any) {
        console.error('Error creating user:', error);
        const errorMessage = error.response?.data?.message || 'Error creating user';
        
        const failedEl = document.querySelector("#failed-notification-content");
        if (failedEl) {
          const messageEl = failedEl.querySelector('.font-medium');
          if (messageEl) {
            messageEl.textContent = errorMessage;
          }
          
          Toastify({
            node: failedEl.cloneNode(true),
            duration: 5000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
          }).showToast();
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>{loading ? (
      <LoadingTag />
    ) : (
      <div className="flex justify-center items-start min-h-screen bg-gray-50/50 py-8">
        <div className="w-full max-w-5xl px-4">
          <div className="intro-y box bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
              <h2 className="font-medium text-2xl mr-auto">Add New Employee</h2>
            </div>

            {/* Form Container */}
            <div className="p-5 lg:p-8">
              <form className="validate-form" onSubmit={onSubmit}>
                {/* Profile Image Upload Section */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative w-32 h-32 mb-4">
                    <img 
                      src={image || '/src/assets/images/profile-pic.jpg'} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover border-4 border-primary/10"
                    />
                    <label className="absolute bottom-0 right-0 p-2 rounded-full bg-primary hover:bg-primary/80 cursor-pointer transition-colors">
                      <Lucide icon="Camera" className="w-5 h-5 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-slate-500 text-sm">Upload profile picture</p>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Basic Info Section */}
                  <div className="lg:col-span-3">
                    <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                  </div>

                  {/* First Name */}
                  <div className="input-form">
                    <FormLabel htmlFor="firstName" className="inline-block mb-2 font-medium">
                      First Name
                      <span className="text-danger">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("firstName")}
                      id="firstName"
                      type="text"
                      className={clsx(
                        "w-full rounded-lg transition-all",
                        { "border-danger": errors.firstName },
                        { "focus:border-primary": !errors.firstName }
                      )}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <div className="text-danger text-sm mt-1">
                        {typeof errors.firstName.message === "string" && errors.firstName.message}
                      </div>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="input-form">
                    <FormLabel htmlFor="lastName" className="inline-block mb-2 font-medium">
                      Last Name
                      <span className="text-danger">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("lastName")}
                      id="lastName"
                      type="text"
                      className={clsx(
                        "w-full rounded-lg transition-all",
                        { "border-danger": errors.lastName },
                        { "focus:border-primary": !errors.lastName }
                      )}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <div className="text-danger text-sm mt-1">
                        {typeof errors.lastName.message === "string" && errors.lastName.message}
                      </div>
                    )}
                  </div>

                  {/* Identity Number */}
                  <div className="input-form">
                    <FormLabel htmlFor="identityNo" className="inline-block mb-2 font-medium">
                      Identity Number
                      <span className="text-danger">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("identityNo")}
                      id="identityNo"
                      type="text"
                      className={clsx(
                        "w-full rounded-lg transition-all",
                        { "border-danger": errors.identityNo },
                        { "focus:border-primary": !errors.identityNo }
                      )}
                      placeholder="12345"
                    />
                    {errors.identityNo && (
                      <div className="text-danger text-sm mt-1">
                        {typeof errors.identityNo.message === "string" && errors.identityNo.message}
                      </div>
                    )}
                  </div>

                  {/* Contact Section */}
                  <div className="lg:col-span-3 mt-6">
                    <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                  </div>

                  {/* Email */}
                  <div className="input-form">
                    <FormLabel htmlFor="contactInfo.email" className="inline-block mb-2 font-medium">
                      Email Address
                      <span className="text-danger">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("contactInfo.email")}
                      id="contactInfo.email"
                      type="email"
                      className={clsx(
                        "w-full rounded-lg transition-all",
                        { "border-danger": errors.contactInfo?.email },
                        { "focus:border-primary": !errors.contactInfo?.email }
                      )}
                      placeholder="john@example.com"
                    />
                    {errors.contactInfo?.email && (
                      <div className="text-danger text-sm mt-1">
                        {typeof errors.contactInfo.email.message === "string" && errors.contactInfo.email.message}
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="input-form">
                    <FormLabel htmlFor="contactInfo.phone" className="inline-block mb-2 font-medium">
                      Phone Number
                      <span className="text-danger">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("contactInfo.phone")}
                      id="contactInfo.phone"
                      type="text"
                      className={clsx(
                        "w-full rounded-lg transition-all",
                        { "border-danger": errors.contactInfo?.phone },
                        { "focus:border-primary": !errors.contactInfo?.phone }
                      )}
                      placeholder="+233 541269874"
                    />
                    {errors.contactInfo?.phone && (
                      <div className="text-danger text-sm mt-1">
                        {typeof errors.contactInfo.phone.message === "string" && errors.contactInfo.phone.message}
                      </div>
                    )}
                  </div>

                  {/* Role & Position Section */}
                  <div className="lg:col-span-3 mt-6">
                    <h3 className="text-lg font-medium mb-4">Role & Position</h3>
                  </div>

                  {/* Role */}
                  <div className="input-form">
                    <FormLabel htmlFor="role" className="inline-block mb-2 font-medium">
                      Role
                      <span className="text-danger">*</span>
                    </FormLabel>
                    <select
                      {...register("role")}
                      id="role"
                      className={clsx(
                        "w-full rounded-lg border transition-all p-2",
                        { "border-danger": errors.role },
                        { "focus:border-primary": !errors.role }
                      )}
                    >
                      {roles.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.role && (
                      <div className="text-danger text-sm mt-1">
                        {typeof errors.role.message === "string" && errors.role.message}
                      </div>
                    )}
                  </div>

                  {/* Position */}
                  <div className="input-form">
                    <FormLabel htmlFor="position" className="inline-block mb-2 font-medium">
                      Position
                      <span className="text-danger">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("position")}
                      id="position"
                      type="text"
                      className={clsx(
                        "w-full rounded-lg transition-all",
                        { "border-danger": errors.position },
                        { "focus:border-primary": !errors.position }
                      )}
                      placeholder="Senior Engineer"
                    />
                    {errors.position && (
                      <div className="text-danger text-sm mt-1">
                        {typeof errors.position.message === "string" && errors.position.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-2 mt-8">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => navigate('/employees')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Create Employee
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )}

      {/* Notifications */}
      <Notification id="success-notification-content" className="hidden">
        <div className="font-medium text-success">Registration Successful!</div>
        <div className="text-slate-500 mt-1">
          User created successfully. Login credentials have been sent to their email.
        </div>
        <div className="text-slate-500 mt-1">
          Default password format: ID@firstname (lowercase)
        </div>
      </Notification>
      <Notification id="failed-notification-content" className="hidden">
        <div className="font-medium text-danger">Registration Failed</div>
        <div className="text-slate-500 mt-1">
          Please check the form and try again.
        </div>
      </Notification>
    </>
  );
}

export default Main;
