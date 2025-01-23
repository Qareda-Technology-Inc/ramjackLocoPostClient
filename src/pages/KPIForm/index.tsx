import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import Modal from '@/components/Base/Modal/Modal'; // Assuming you have a Modal component
import Toastify from "toastify-js";
import { KPI } from '@/types/kpi';
import { FormInput, FormLabel } from '@/components/Base/Form';
import FormPage from '../FormPage';
import TablePage from '../TablePage';

function Main() {
    const [kpi, setKPI] = useState<KPI>({
        description: '',
        targetValue: 0,
        actualValue: 0
    });

    const [task, setTask] = useState({
        name: '',
        description: '',
        kpi: '',
        isCompleted: false,
        comment: ''
    });

    const [kpis, setKpis] = useState<KPI[]>([]); // To store fetched KPIs
    const [isKpiModalOpen, setIsKpiModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    useEffect(() => {
        const fetchKpis = async () => {
            try {
                const response = await api.get('/kpis/'); // Adjust the endpoint as necessary
                setKpis(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching KPIs:", error);
            }
        };

        fetchKpis();
    }, []);

    const handleKPIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setKPI({ ...kpi, [name]: name === 'targetValue' || name === 'actualValue' ? Number(value) : value });
    };

    const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setTask({
            ...task,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleKpiSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await api.post('/kpis/', kpi); // Adjust the endpoint as necessary
            Toastify({
                text: "KPI created successfully!",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: { background: "blue" },
            }).showToast();
            setIsKpiModalOpen(false);
            setKPI({ description: '', targetValue: 0, actualValue: 0 }); // Reset form
        } catch (error) {
            console.error("Error creating KPI:", error);
            Toastify({
                text: "Error creating KPI.",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: { background: "red" },
            }).showToast();
        }
    };

    const handleTaskSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await api.post('/tasks/', task); // Adjust the endpoint as necessary
            Toastify({
                text: "Task created successfully!",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: { background: "blue" },
            }).showToast();
            setIsTaskModalOpen(false);
            setTask({ name: '', description: '', kpi: '', isCompleted: false, comment: '' }); // Reset form
        } catch (error) {
            console.error("Error creating Task:", error);
            Toastify({
                text: "Error creating Task.",
                duration: 3000,
                gravity: "top",
                position: "right",
                style: { background: "red" },
            }).showToast();
        }
    };

    return (
        <>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4 text-center">Manage KPIs and Tasks</h2>
            <div className="flex justify-between mb-4">
                <button onClick={() => setIsKpiModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Create KPI</button>
                <button onClick={() => setIsTaskModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Create Task</button>
            </div>

            {/* KPI Modal */}
            <Modal isOpen={isKpiModalOpen} onClose={() => setIsKpiModalOpen(false)}>
                <h3 className="text-xl font-semibold mb-4">KPI Form</h3>
                <form onSubmit={handleKpiSubmit}>
                    <div className="mb-4">
                        <FormLabel htmlFor="description" className="inline-block mb-2 font-medium">
                            Description
                            <span className="text-danger">*</span>
                        </FormLabel>
                        <FormInput
                            id="description"
                            type="text"
                            name="description"
                            value={kpi.description}
                            onChange={handleKPIChange}
                            required
                            className="w-full rounded-lg transition-all"
                            placeholder="Enter KPI description"
                        />
                    </div>
                    <div className="mb-4">
                        <FormLabel htmlFor="targetValue" className="inline-block mb-2 font-medium">
                            Target Value
                            <span className="text-danger">*</span>
                        </FormLabel>
                        <FormInput
                            id="targetValue"
                            type="number"
                            name="targetValue"
                            value={kpi.targetValue}
                            onChange={handleKPIChange}
                            required
                            className="w-full rounded-lg transition-all"
                            placeholder="Enter target value"
                        />
                    </div>
                    <div className="mb-4">
                        <FormLabel htmlFor="actualValue" className="inline-block mb-2 font-medium">
                            Actual Value
                            <span className="text-danger">*</span>
                        </FormLabel>
                        <FormInput
                            id="actualValue"
                            type="number"
                            name="actualValue"
                            value={kpi.actualValue}
                            onChange={handleKPIChange}
                            required
                            className="w-full rounded-lg transition-all"
                            placeholder="Enter actual value"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button type="submit" className="w-full mt-5 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-orange-300">Submit KPI</button>
                        <button type="button" onClick={() => setIsKpiModalOpen(false)} className="ml-2 w-full mt-5 px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400">Cancel</button>
                    </div>
                </form>
            </Modal>

            {/* Task Modal */}
            <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)}>
                <h3 className="text-xl font-semibold mb-4">Task Form</h3>
                <form onSubmit={handleTaskSubmit}>
                    <div className="mb-4">
                        <FormLabel htmlFor="name" className="inline-block mb-2 font-medium">
                            Name
                            <span className="text-danger">*</span>
                        </FormLabel>
                        <FormInput
                            id="name"
                            type="text"
                            name="name"
                            value={task.name}
                            onChange={handleTaskChange}
                            required
                            className="w-full rounded-lg transition-all"
                            placeholder="Enter task name"
                        />
                    </div>
                    <div className="mb-4">
                        <FormLabel htmlFor="description" className="inline-block mb-2 font-medium">
                            Description
                            <span className="text-danger">*</span>
                        </FormLabel>
                        <textarea
                            id="description"
                            name="description"
                            value={task.description}
                            onChange={handleTaskChange}
                            required
                            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-orange-600"
                            placeholder="Enter task description"
                        />
                    </div>
                    <div className="mb-4">
                        <FormLabel htmlFor="kpi" className="inline-block mb-2 font-medium">
                            KPI
                            <span className="text-danger">*</span>
                        </FormLabel>
                        <select
                            id="kpi"
                            name="kpi"
                            value={task.kpi}
                            onChange={handleTaskChange}
                            required
                            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-orange-600"
                        >
                            <option value="">Select a KPI</option>
                            {kpis.map((kpi) => (
                                <option key={kpi._id} value={kpi._id}>
                                    {kpi.description}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-between">
                        <button type="submit" className="w-full mt-5 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300">Submit Task</button>
                        <button type="button" onClick={() => setIsTaskModalOpen(false)} className="ml-2 w-full mt-5 px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400">Cancel</button>
                    </div>
                </form>
            </Modal>
            
        </div>
        <TablePage />
        </>
    );
}

export default Main;
