import Chart from "@/components/Base/Chart";
import { ChartData, ChartOptions } from "chart.js/auto";
import { getColor } from "@/utils/colors";
import { selectColorScheme } from "@/stores/colorSchemeSlice";
import { selectDarkMode } from "@/stores/darkModeSlice";
import { useAppSelector } from "@/stores/hooks";
import { useEffect, useState, useMemo } from "react";
import api from "@/api/axios";
import { Assignment } from "@/types/assignment";

interface MainProps extends React.ComponentPropsWithoutRef<"canvas"> {
  width?: number | "auto";
  height?: number | "auto";
}

function ReportPieChart({ width = "auto", height = "auto", className = "" }: MainProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get("/assignments/"); // 🔥 Replace with your API endpoint
        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments", error);
      }
    };
    fetchAssignments();
  }, []);

  // ✅ Native JavaScript function to calculate days difference
  const getDaysDifference = (dueDate: Date) => {
    const today = new Date();
    const due = new Date(dueDate); 
    const diffTime = due.getTime() - today.getTime(); 
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  // ✅ Categorize assignments
  const { urgent, warning, normal } = useMemo(() => {
    let urgent = 0, warning = 0, normal = 0;

    assignments.forEach((assignment: any) => {
      const daysLeft = getDaysDifference(assignment.endDate);

      if (daysLeft <= 3) urgent++;      // 🔴 High Priority (Urgent)
      else if (daysLeft <= 7) warning++; // 🟡 Medium Priority (Warning)
      else normal++;                     // 🔵 Low Priority (Normal)
    });

    return { urgent, warning, normal };
  }, [assignments]);

  const colorScheme = useAppSelector(selectColorScheme);
  const darkMode = useAppSelector(selectDarkMode);

  const chartColors = () => [
    getColor("danger", 1), // 🟡 Yellow (1-3 days)
    getColor("warning", 0.9), // 🔴 Red (4-7 days)
    getColor("primary", 0.9), // 🔵 Blue (>7 days)
  ];

  const data: ChartData = useMemo(() => ({
    labels: ["Urgent (1-3 days)", "Warning (4-7 days)", "Normal (>7 days)"],
    datasets: [
      {
        data: [urgent, warning, normal],
        backgroundColor: colorScheme ? chartColors() : "",
        hoverBackgroundColor: colorScheme ? chartColors() : "",
        borderWidth: 5,
        borderColor: darkMode ? getColor("darkmode.700") : getColor("white"),
      },
    ],
  }), [colorScheme, darkMode, urgent, warning, normal]);

  const options: ChartOptions = useMemo(() => ({
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  }), [colorScheme, darkMode]);

  return (
    <Chart
      type="pie"
      width={width}
      height={height}
      data={data}
      options={options}
      className={className}
    />
  );
}

export default ReportPieChart;
