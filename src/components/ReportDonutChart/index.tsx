import { useEffect, useState, useMemo } from "react";
import Chart from "@/components/Base/Chart";
import { ChartData, ChartOptions } from "chart.js/auto";
import { getColor } from "@/utils/colors";
import { selectColorScheme } from "@/stores/colorSchemeSlice";
import { selectDarkMode } from "@/stores/darkModeSlice";
import { useAppSelector } from "@/stores/hooks";
import api from "@/api/axios"; // Assuming you have an Axios instance configured

interface Assignment {
  isApproved: boolean;
  isCompleted: boolean;
}

interface MainProps {
  readonly width?: number | "auto";
  readonly height?: number | "auto";
  readonly className?: string;
}

function Main({ width = "auto", height = "auto", className = "" }: Readonly<MainProps>) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const props = { width, height, className };
  const colorScheme = useAppSelector(selectColorScheme);
  const darkMode = useAppSelector(selectDarkMode);

  // Fetch assignments from API with authorization
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from local storage or state
        const response = await api.get("/assignments", {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token for authentication
          },
        });
        setAssignments(response.data);
        console.log("Data:", response.data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  // Calculate the number of assignments in each category
  const approved = assignments.filter((a) => a.isApproved).length;
  const completed = assignments.filter((a) => a.isCompleted).length;
  const pending = assignments.length - (approved + completed);

  const chartData = [pending, approved, completed];
  const chartColors = () => [
    getColor("pending", 0.9),
    getColor("primary", 0.9),
    getColor("success", 0.9),
  ];

  const data: ChartData = useMemo(() => {
    return {
      labels: ["Pending", "Approved", "Completed"],
      datasets: [
        {
          data: chartData,
          backgroundColor: colorScheme ? chartColors() : undefined,
          hoverBackgroundColor: colorScheme ? chartColors() : undefined,
          borderWidth: 5,
          borderColor: darkMode ? getColor("darkmode.700") : getColor("white"),
        },
      ],
    };
  }, [colorScheme, darkMode, assignments]);

  const options: ChartOptions = useMemo(() => {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      cutout: "80%",
    };
  }, [colorScheme, darkMode]);

  if (loading) return <p>Loading assignments...</p>;

  return (
    <Chart
      type="doughnut"
      width={props.width}
      height={props.height}
      data={data}
      options={options}
      className={props.className}
    />
  );
}

export default Main;
