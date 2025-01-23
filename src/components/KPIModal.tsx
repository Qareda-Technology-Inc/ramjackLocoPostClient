import React from 'react';
import Button from "@/components/Base/Button";

interface KPIModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (data: any) => void; // Define the type of data you expect
}

const KPIModal: React.FC<KPIModalProps> = ({ isOpen, onRequestClose, onSubmit }) => {
  const [formData, setFormData] = React.useState({ kpiValue: '' }); // Adjust based on your form fields

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onRequestClose(); // Close the modal after submission
  };

  if (!isOpen) return null; // Do not render the modal if it's not open

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Submit KPI</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2">KPI Value:</label>
            <input
              type="text"
              name="kpiValue"
              value={formData.kpiValue}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button type="button" onClick={onRequestClose} className="mr-2">
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KPIModal; 