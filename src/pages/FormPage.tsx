import React from "react";
import { FormInput, FormLabel, FormHelp, FormCheck, FormSwitch } from "../components/Base/Form";

const FormPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sample Form</h1>
      <form>
        <div className="mb-4">
          <FormLabel htmlFor="name">Name</FormLabel>
          <FormInput id="name" placeholder="Enter your name" />
          <FormHelp>Your full name as it appears on your ID.</FormHelp>
        </div>
        
        <div className="mb-4">
          <FormLabel htmlFor="email">Email</FormLabel>
          <FormInput id="email" type="email" placeholder="Enter your email" />
          <FormHelp>We'll never share your email with anyone else.</FormHelp>
        </div>

        <div className="mb-4">
          <FormLabel htmlFor="subscribe">Subscribe to newsletter</FormLabel>
          <FormCheck>
            <FormCheck.Input id="subscribe" type="checkbox" />
            <FormCheck.Label htmlFor="subscribe">Yes, I want to receive updates.</FormCheck.Label>
          </FormCheck>
        </div>

        <div className="mb-4">
          <FormLabel htmlFor="terms">Accept Terms</FormLabel>
          <FormSwitch>
            <FormSwitch.Input id="terms" type="checkbox" />
            <FormSwitch.Label htmlFor="terms">I accept the terms and conditions.</FormSwitch.Label>
          </FormSwitch>
        </div>

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormPage; 