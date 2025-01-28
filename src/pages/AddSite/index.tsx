import {
    FormLabel,
    FormInput,
  } from "@/components/Base/Form";
  import Button from "@/components/Base/Button";
  import Notification from "@/components/Base/Notification";
  import { useForm } from "react-hook-form";
  import Toastify from "toastify-js";
  import clsx from "clsx";
  import { yupResolver } from "@hookform/resolvers/yup";
  import * as yup from "yup";
  import React, { useState } from "react";
  import api from "@/api/axios";
import { Navigate, useNavigate } from "react-router-dom";
import Lucide from "@/components/Base/Lucide";
import { LoadingTag } from "@/components/Loading";
  
  function Main() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationType, setNotificationType] = useState<"success" | "error">("success");

    const handleNotification = (type: "success" | "error", message: string) => {
      setNotificationType(type);
      setNotificationMessage(message);
      setShowNotification(true);
    };

    const schema = yup
    .object({
    name: yup.string().required().min(2),
    description: yup.string(),
    location: yup.string().required(),
    country: yup.string().required(),
    image: yup.string().url(),
    active: yup.boolean(),
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

    const previewFiles = (file: any) => {
      const reader = new FileReader();
      reader.readAsDataURL(file)

      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      console.log("Result: ", image);
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
        handleNotification('error', 'Please check the form and try again.');
      } else {
        try {
          setLoading(true);
          const formData = {
            name: getValues("name"),
            description: getValues("description"),
            location: getValues("location"),
            country: getValues("country"),
            image: image,
            active: getValues("active") || true,
          };

          const response = await api.post("sites/add", formData);              
          handleNotification('success', response.data.message || "Site created successfully!");
          reset();
          setImageFile(null);
          setImageUrl("");
          navigate('/sites');
        } catch (error: any) {
          console.error("Registration error:", error);
          const errorMessage = error.response?.data?.message || "An unexpected error occurred. Please try again.";
          handleNotification('error', errorMessage);
        } finally {
          setLoading(false);
        }
      }
    };
  
  
  return (
    <> {loading ? (<LoadingTag />) : (
    
      <div className="grid grid-cols-1 gap-6 mt-5">
        <div className="col-span-12 intro-y lg:col-span-6">
          <div className="p-5">
            <form className="validate-form" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Site Name */}
                <div className="input-form">
                  <FormLabel htmlFor="name" className="flex flex-col">
                    Site Name
                    <span className="mt-1 text-xs text-slate-500">
                      Required, at least 4 characters
                    </span>
                  </FormLabel>
                  <FormInput
                    {...register("name")}
                    id="name"
                    type="text"
                    className={clsx({ "border-danger": errors.name })}
                    placeholder="Iduapriem"
                  />
                  {errors.name && (
                    <div className="mt-2 text-danger">
                      {typeof errors.name.message === "string" &&
                        errors.name.message}
                    </div>
                  )}
                </div>
  
                <div className="input-form">
                  <FormLabel htmlFor="description" className="flex flex-col">
                    Description
                    <span className="mt-1 text-xs text-slate-500">
                      Required, at least 5 characters
                    </span>
                  </FormLabel>
                  <FormInput
                    {...register("description")}
                    id="description"
                    type="text"
                    className={clsx({ "border-danger": errors.description })}
                    placeholder="Gold, metal"
                  />
                  {errors.description && (
                    <div className="mt-2 text-danger">
                      {typeof errors.description.message === "string" &&
                        errors.description.message}
                    </div>
                  )}
                </div>
  
                <div className="input-form">
                  <FormLabel htmlFor="location" className="flex flex-col">
                    Location
                    <span className="mt-1 text-xs text-slate-500">
                      Required
                    </span>
                  </FormLabel>
                  <FormInput
                    {...register("location")}
                    id="location"
                    type="text"
                    className={clsx({ "border-danger": errors.location })}
                    placeholder="Tarkwa"
                  />
                  {errors.location && (
                    <div className="mt-2 text-danger">
                      {typeof errors.location.message === "string" &&
                        errors.location.message}
                    </div>
                  )}
                </div>
  
                <div className="input-form">
                  <FormLabel htmlFor="country" className="flex flex-col">
                    Country
                    <span className="mt-1 text-xs text-slate-500">
                      Required
                    </span>
                  </FormLabel>
                  <FormInput
                    {...register("country")}
                    id="country"
                    type="text"
                    className={clsx({ "border-danger": errors.country })}
                    placeholder="Ghana"
                  />
                  {errors.country && (
                    <div className="mt-2 text-danger">
                      {typeof errors.country.message === "string" &&
                        errors.country.message}
                    </div>
                  )}
                </div>

                {/* Image Upload */}
                <div className="input-form intro-y">
                  <FormLabel htmlFor="image" className="flex flex-col">
                    Upload an image (Optional)
                  </FormLabel>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onFileChange as any}
                      className="border rounded-md px-4 py-2 w-full"
                    />
                    {image && (
                      <div className="mt-2 relative inline-block">
                        <img src={image} alt="" className="rounded-lg w-20 h-20 object-cover"/>
                        <div className="absolute p-2 -top-2 -right-2 rounded-full bg-primary">
                          <Lucide icon="Camera" className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Active */}
                <div className="input-form">
                  <FormLabel htmlFor="active" className="flex flex-col">
                    Active
                  </FormLabel>
                  <div className="flex items-center mt-2">
                    <input
                      {...register("active")}
                      id="active"
                      type="checkbox"
                      className="w-5 h-5 border rounded-md"
                    />
                    <span className="ml-2 text-sm text-slate-600">Enable this site</span>
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
        
    )}
  
      <Notification
        show={showNotification}
        type={notificationType}
        message={notificationMessage}
        onClose={() => setShowNotification(false)}
        duration={3000}
      />
    </>
  );
  
  }
  
  export default Main;