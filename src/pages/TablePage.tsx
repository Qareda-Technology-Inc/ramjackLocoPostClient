import React, { useEffect, useState } from "react";
import Table from "@/components/Base/Table";
import api from "@/api/axios";
import { Task } from "@/types/task";
import {LoadingTag} from "@/components/Loading";

const TablePage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks/"); // Adjust the API endpoint as necessary
        setTasks(response.data);
      } catch (err) {
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <LoadingTag />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-full mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Tasks</h1>
      <div className="overflow-x-auto">
        <Table className="min-w-full border border-gray-300 table-auto">
          <Table.Thead variant="light">
            <Table.Tr>
              <Table.Th>Task Title</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>KPI Description</Table.Th>
              <Table.Th>Target</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tasks.map((task) => (
              <Table.Tr key={task._id}>
                <Table.Td>{task.name}</Table.Td>
                <Table.Td>{task.description}</Table.Td>
                <Table.Td>{task.kpi?.description}</Table.Td>
                <Table.Td>{task.kpi?.targetValue}%</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </div>
  );
};

export default TablePage;
