import React, { useEffect, useState } from 'react';
import api from '@/api/axios';
import { User } from '@/types/auth';
import { Site } from '@/types/site';
import { FormLabel } from '@/components/Base/Form';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import Toastify from "toastify-js";
import { AxiosError } from 'axios';
import Notification from "@/components/Base/Notification";
import { LoadingTag } from '@/components/Loading';

const Main: React.FC = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<User[]>([]);
    const [sites, setSites] = useState<Site[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    const [selectedSite, setSelectedSite] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationType, setNotificationType] = useState<"success" | "error">("success");
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await api.get('/users/list', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEmployees(response.data);
        };

        const fetchSites = async () => {
            const response = await api.get('/sites/list', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSites(response.data);
        };

        fetchUsers();
        fetchSites();
    }, [token]);

    const handleNotification = (type: "success" | "error", message: string) => {
        setNotificationType(type);
        setNotificationMessage(message);
        setShowNotification(true);
    };

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
            userId: selectedEmployee,
            siteId: selectedSite,
            startDate,
            endDate,
        };

        try {
            setLoading(true);
            const response = await api.post('/assignments/assignTo', assignmentData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            handleNotification('success', response.data.message || 'Assignment created successfully!');
            navigate('/view-assign');
        } catch (error: unknown) {
            console.error('Error assigning employee:', error);
            let errorMessage = "An error occurred during assignment.";
            if (error instanceof AxiosError && error.response) {
                errorMessage = error.response.data.message || "An error occurred.";
            }
            handleNotification('error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <LoadingTag />
            ) : (
                <div className="grid grid-cols-1 gap-6 mt-5">
                    <div className="col-span-12 intro-y lg:col-span-6">
                        <div className="p-5">
                            <h2 className="text-xl font-semibold mb-4">Assign Employee to Site</h2>
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
                                            <option key={employee._id} value={employee._id}>
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
                                            <option key={site._id} value={site._id}>
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
                                    {loading ? 'Assigning...' : 'Assign Employee'}
                                </button>
                            </div>
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
};

export default Main;
