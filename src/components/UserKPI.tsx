import React, { useEffect, useState } from 'react';
import api from '@/api/axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";

const UserKPI: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [kpiData, setKpiData] = useState<any[]>([]); // Adjust the type based on your KPI data structure
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        const { data } = await api.get(`/kpi/user/${user?._id}`); // Adjust the endpoint as needed
        setKpiData(data);
      } catch (error) {
        console.error("Error fetching KPI data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchKPIData();
    }
  }, [user]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Your KPI</h2>
      {kpiData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kpiData.map((kpi) => (
            <div key={kpi.id} className="border rounded-lg p-4 bg-white shadow">
              <h3 className="text-lg font-semibold">{kpi.title}</h3>
              <p className="text-gray-600">Value: {kpi.value}</p>
              <p className="text-gray-600">Date: {new Date(kpi.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No KPI data available.</p>
      )}
    </div>
  );
};

export default UserKPI; 