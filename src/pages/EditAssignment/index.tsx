import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/api/axios';
import { User } from '@/types/auth';
import { Site } from '@/types/site';
import { FormLabel } from '@/components/Base/Form';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import Toastify from "toastify-js";
import { AxiosError } from 'axios';
import Notification from "@/components/Base/Notification";

const Main: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [employees, setEmployees] = useState<User[]>([]);
    const [sites, setSites] = useState<Site[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    const [selectedSite, setSelectedSite] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [assignment, setAssignment] = useState<any>(null); // Store fetched assignment
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Fetch Users
        const fetchUsers = async () => {
            const response = await api.get('/users/list', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEmployees(response.data);
        };

        // Fetch Sites
        const fetchSites = async () => {
            const response = await api.get('/sites/list', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSites(response.data);
        };

        // Fetch Assignment (if editing)
        const fetchAssignment = async () => {
            if (id) {
                try {
                    const response = await api.get(`/assignments/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setAssignment(response.data); // Set the assignment data
                    setSelectedEmployee(response.data.data.employee._id.toString());
                    setSelectedSite(response.data.data.site._id.toString()); // Ensure ObjectId is treated as a string
                    setStartDate(response.data.data.startDate.split('T')[0]); // Format start date
                    setEndDate(response.data.data.endDate.split('T')[0]); // Format end date
                } catch (error) {
                    console.error('Error fetching assignment:', error);
                }
            }
        };

        fetchUsers();
        fetchSites();
        fetchAssignment();

    }, [token, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (new Date(startDate) >= new Date(endDate)) {
            Toastify({
                text: "End date must be after start date.",
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                style: {
                    background: "red",
                    margin: "10px",
                    padding: "20px 40px 20px 20px",
                    borderRadius: "12px",
                    color: "#fff",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)", 
                },
                stopOnFocus: true,
            }).showToast();
            return;
        }

        const assignmentData = {
            employee: selectedEmployee,
            site: selectedSite,
            startDate,
            endDate,
        };

        setLoading(true);
        try {
            let response;
            if (id) {
                // Update existing assignment if id is available
                response = await api.put(`/assignments/update/${id}`, assignmentData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                // Create new assignment
                response = await api.post('/assignments/assignTo', assignmentData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            // Success notification
            const successElements = document.querySelectorAll("#success-notification-content");
            if (successElements.length > 0) {
                const successEl = successElements[0].cloneNode(true) as HTMLElement;
                successEl.classList.remove("hidden");

                const successMessage = response.data.message || "Operation successful!";
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
                    style:{
                        background: "green",
                    }
                }).showToast();
            }

            navigate('/view-assign');
        } catch (error: unknown) {
            console.error('Error assigning employee:', error);

            const errorElements = document.querySelectorAll("#failed-notification-content");
            if (errorElements.length > 0) {
                const errorEl = errorElements[0].cloneNode(true) as HTMLElement;
                errorEl.classList.remove("hidden");

                let errorMessage = "An error occurred during assignment.";
                if (error instanceof AxiosError && error.response) {
                    errorMessage = error.response.data.message || "An error occurred.";
                }

                const messageElement = errorEl.querySelector('.font-medium');
                if (messageElement) {
                    messageElement.textContent = errorMessage;
                }

                Toastify({
                    node: errorEl,
                    duration: 3000,
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
    };

    return (
        <>
        <div className="grid grid-cols-1 gap-6 mt-5">
            <div className="col-span-12 intro-y lg:col-span-6">
                <div className="p-5">
                    <h2 className="text-xl font-semibold mb-4">{id ? 'Edit Assignment' : 'Assign Employee to Site'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="input-form intro-y">
                            <FormLabel htmlFor="employee" className="flex flex-col">
                                Employee
                                <span className="mt-1 text-xs text-slate-500">Required</span>
                            </FormLabel>
                            <select
                                id="employee"
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                required
                                className={clsx("mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-600")}
                            >
                                <option value="">Select an employee</option>
                                {employees.map((employee) => (
                                    <option key={employee._id} value={employee._id.toString()}>
                                        {employee.firstName} {employee.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-form intro-y">
                            <FormLabel htmlFor="site" className="flex flex-col">
                                Site:
                                <span className="mt-1 text-xs text-slate-500">Required</span>
                            </FormLabel>
                            <select
                                id="site"
                                value={selectedSite}
                                onChange={(e) => setSelectedSite(e.target.value)}
                                required
                                className={clsx("mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-600")}
                            >
                                <option value="">Select a site</option>
                                {sites.map((site) => (
                                    <option key={site._id} value={site._id.toString()}>
                                        {site.country} &gt; {site.location} &gt; {site.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-form intro-y">
                            <FormLabel htmlFor="startDate" className="flex flex-col">
                                Start Date:
                                <span className="mt-1 text-xs text-slate-500">Required</span>
                            </FormLabel>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                                className={clsx("mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-600")}
                            />
                        </div>

                        <div className="input-form intro-y">
                            <FormLabel htmlFor="endDate" className="flex flex-col">
                                End Date:
                                <span className="mt-1 text-xs text-slate-500">Required</span>
                            </FormLabel>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                                className={clsx("mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-orange-600")}
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className={clsx("w-full mt-5 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring focus:ring-orange-300", {
                                'opacity-50 cursor-not-allowed': loading,
                            })}
                        >
                            {loading ? 'Assigning...' : id ? 'Update Assignment' : 'Assign Employee'}
                        </button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
        <Notification id="success-notification-content" className="hidden">
            <div className="font-medium">Registration success!</div>
        </Notification>
        <Notification id="failed-notification-content" className="hidden">
            <div className="font-medium">Registration failed!</div>
        </Notification>
        </>
    );
};

export default Main;
