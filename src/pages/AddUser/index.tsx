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
      password: yup.string().required().min(6),
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
      const formData = {
        firstName: getValues("firstName"),
        lastName: getValues("lastName"),
        position: getValues("position"),
        identityNo: getValues("identityNo"),
        password: getValues("password"),
        role: getValues("role"),
        contactInfo: {
          phone: getValues("contactInfo.phone"),
          email: getValues("contactInfo.email"),
        },
        image: image,
      };

      try {
        setLoading(true);
        const response = await api.post("users/add", formData);
        
        const successElements = document.querySelectorAll("#success-notification-content");
        if (successElements.length > 0) {
          const successEl = successElements[0].cloneNode(true) as HTMLElement;
          successEl.classList.remove("hidden");

          const successMessage = response.data.message || "Registration success!";
          const messageElement = successEl.querySelector('.font-medium');
          if (messageElement) {
            messageElement.textContent = successMessage;
          }

          Toastify({
            node: successEl,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
          }).showToast();

          reset(); // Clear form inputs
          navigate('/employees')
        }
      } catch (error: unknown) {
        console.error("Registration error:", error);
        const notificationElements = document.querySelectorAll("#failed-notification-content");
        if (notificationElements.length > 0) {
          const failedEl = notificationElements[0].cloneNode(true) as HTMLElement;
          failedEl.classList.remove("hidden");

          let errorMessage = "An unexpected error occurred. Please try again.";
          if (isAxiosError(error)) {
            errorMessage = error.response?.data?.error || errorMessage;
          }

          const messageElement = failedEl.querySelector('.font-medium');
          if (messageElement) {
            messageElement.textContent = errorMessage;
          }

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
        setLoading(false)
      }
    }
  };

  return (
    <> {loading ? (
      <LoadingTag />
    ) : (
      <div className="grid grid-cols-1 gap-6 mt-5">
        <div className="col-span-12 intro-y lg:col-span-6">
          <div className="p-5">
            <form className="validate-form" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="input-form intro-y">
                  <FormLabel htmlFor="firstName" className="flex flex-col">
                    First Name
                    <span className="mt-1 text-xs text-slate-500">
                      Required, at least 2 characters
                    </span>
                  </FormLabel>
                  <FormInput
                    {...register("firstName")}
                    id="firstName"
                    type="text"
                    className={clsx({ "border-danger": errors.firstName })}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <div className="mt-2 text-danger">
                      {typeof errors.firstName.message === "string" &&
                        errors.firstName.message}
                    </div>
                  )}
                </div>

                <div className="input-form intro-y">
                  <FormLabel htmlFor="lastName" className="flex flex-col">
                    Last Name
                    <span className="mt-1 text-xs text-slate-500">
                      Required, at least 2 characters
                    </span>
                  </FormLabel>
                  <FormInput
                    {...register("lastName")}
                    id="lastName"
                    type="text"
                    className={clsx({ "border-danger": errors.lastName })}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <div className="mt-2 text-danger">
                      {typeof errors.lastName.message === "string" &&
                        errors.lastName.message}
                    </div>
                  )}
                </div>

                <div className="input-form intro-y">
                  <FormLabel htmlFor="position" className="flex flex-col">
                    Position
                    <span className="mt-1 text-xs text-slate-500">
                      Required
                    </span>
                  </FormLabel>
                  <FormInput
                    {...register("position")}
                    id="position"
                    type="text"
                    className={clsx({ "border-danger": errors.position })}
                    placeholder="Onsite Engineer"
                  />
                  {errors.position && (
                    <div className="mt-2 text-danger">
                      {typeof errors.position.message === "string" &&
                        errors.position.message}
                    </div>
                  )}
                </div>

                <div className="input-form intro-y">
                  <FormLabel htmlFor="identityNo" className="flex flex-col">
                    Identity Number
                    <span className="mt-1 text-xs text-slate-500">
                      Required
                    </span>
                  </FormLabel>
                  <FormInput
                    {...register("identityNo")}
                    id="identityNo"
                    type="text"
                    className={clsx({ "border-danger": errors.identityNo })}
                    placeholder="12345"
                  />
                  {errors.identityNo && (
                    <div className="mt-2 text-danger">
                      {typeof errors.identityNo.message === "string" &&
                        errors.identityNo.message}
                    </div>
                  )}
                </div>

                <div className="input-form intro-y">
                  <FormLabel htmlFor="password" className="flex flex-col">
                    Password
                    <span className="mt-1 text-xs text-slate-500">
                      Required, at least 6 characters
                    </span>
                  </FormLabel>
                  <FormInput
                    {...register("password")}
                    id="password"
                    type="password"
                    className={clsx({ "border-danger": errors.password })}
                    placeholder="password"
                  />
                  {errors.password && (
                    <div className="mt-2 text-danger">
                      {typeof errors.password.message === "string" &&
                        errors.password.message}
                    </div>
                  )}
                </div>

                <div className="input-form intro-y">
                  <FormLabel htmlFor="contactInfo.email" className="flex flex-col">
                    Email
                    <span className="mt-1 text-xs text-slate-500">
                      Required, email address format
                    </span>
                  </FormLabel>
                  <FormInput
                    {...register("contactInfo.email")}
                    id="contactInfo.email"
                    type="email"
                    className={clsx({ "border-danger": errors.contactInfo?.email })}
                    placeholder="john@example.com"
                  />
                  {errors.contactInfo?.email && (
                    <div className="mt-2 text-danger">
                      {typeof errors.contactInfo.email.message === "string" &&
                        errors.contactInfo.email.message}
                    </div>
                  )}
                </div>

                <div className="input-form intro-y">
                  <FormLabel htmlFor="contactInfo.phone" className="flex flex-col">
                    Phone
                    <span className="mt-1 text-xs text-slate-500">
                      Required, at least 10 characters
                    </span>
                  </FormLabel>
                  <FormInput
                    {...register("contactInfo.phone")}
                    id="contactInfo.phone"
                    type="text"
                    className={clsx({ "border-danger": errors.contactInfo?.phone })}
                    placeholder="0541269874"
                  />
                  {errors.contactInfo?.phone && (
                    <div className="mt-2 text-danger">
                      {typeof errors.contactInfo.phone.message === "string" &&
                        errors.contactInfo.phone.message}
                    </div>
                  )}
                </div>

                <div className="input-form intro-y">
                  <FormLabel htmlFor="role" className="flex flex-col">
                    Role
                    <span className="mt-1 text-xs text-slate-500">
                      Required
                    </span>
                  </FormLabel>
                  <select
                    {...register("role")}
                    id="role"
                    className={clsx("mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-600", { "border-danger": errors.role })}
                  >
                    {roles.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <div className="mt-2 text-danger">
                      {typeof errors.role.message === "string" && errors.role.message}
                    </div>
                  )}
                </div>

                <div className="input-form intro-y">
                  <FormLabel htmlFor="image" className="flex flex-col">
                    Employee Profile Pic
                  </FormLabel>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="border rounded-md px-4 py-2"
                  />
                  <img src={image} alt="" className="rounded-full w-20 h-20"/>
                  <div className="absolute p-2 mb-1 mr-1 rounded-full bg-primary top-28 left-6">
                  <Lucide icon="Camera" className="w-4 h-4 text-white" />
                </div>                  
                </div>
              </div>

              <Button className="mt-10" type="submit">
                Register
              </Button>
            </form>
            
          </div>
        </div>
      </div>
    ) }

      <Notification id="success-notification-content" className="hidden">
        <div className="font-medium">Registration success!</div>
      </Notification>
      <Notification id="failed-notification-content" className="hidden">
        <div className="font-medium">Registration failed!</div>
      </Notification>
    </>
  );
}

export default Main;
