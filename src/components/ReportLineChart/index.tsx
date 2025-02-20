import Chart from "@/components/Base/Chart";
import { useEffect, useState, useMemo } from "react";
import { ChartData, ChartOptions } from "chart.js/auto";
import { getColor } from "@/utils/colors";
import { selectColorScheme } from "@/stores/colorSchemeSlice";
import { selectDarkMode } from "@/stores/darkModeSlice";
import { useAppSelector } from "@/stores/hooks";
import api from "@/api/axios";
import { Site } from "@/types/site";
import { Menu } from "@/components/Base/Headless";
import Button  from "@/components/Base/Button";
import Lucide  from "@/components/Base/Lucide";

interface MainProps extends React.ComponentPropsWithoutRef<"canvas"> {
  width?: number | "auto";
  height?: number | "auto";
}

function Main({ width = "auto", height = "auto", className = "" }: MainProps) {
  const [siteData, setSiteData] = useState<Site[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/sites/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSiteData(response.data);
      } catch (error) {
        console.error("Error Fetching Data", error);
      }
    };
    fetchData();
  }, [token]);

  const filteredData = useMemo(() => {
    if (filterType === "site") {
      return siteData;
    } else if (filterType === "country") {
      return siteData.reduce<Record<string, number>>((acc, site) => {
        const country = site.country || "Unknown";
        acc[country] = (acc[country] || 0) + site.employees.length;
        return acc;
      }, {});
    }
    return siteData;
  }, [siteData, filterType]);

  const labels = filterType === "country" ? Object.keys(filteredData) : siteData.map(site => site.name);
  const employeeCounts = filterType === "country" ? Object.values(filteredData) : siteData.map(site => site.employees.length);

  const colorScheme = useAppSelector(selectColorScheme);
  const darkMode = useAppSelector(selectDarkMode);

  const data: ChartData = useMemo(() => ({
    labels: labels,
    datasets: [
      {
        label: "Employees",
        data: employeeCounts,
        borderWidth: 2,
        borderColor: colorScheme ? getColor("primary", 0.8) : "",
        backgroundColor: "transparent",
        pointBorderColor: "transparent",
        tension: 0.4,
      },
    ],
  }), [labels, employeeCounts, colorScheme]);

  const options: ChartOptions = useMemo(() => ({
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { font: { size: 12 }, color: getColor("slate.500", 0.8) },
        grid: { display: false },
        border: { display: false },
      },
      y: {
        ticks: {
          font: { size: 12 },
          color: getColor("slate.500", 0.8),
          callback: (value) => value,
        },
        grid: { color: darkMode ? getColor("slate.500", 0.3) : getColor("slate.300") },
        border: { dash: [2, 2], display: false },
      },
    },
  }), [colorScheme, darkMode]);

  return (
    <div>
      <div className="mb-4 flex gap-4 justify-center">
        <Menu>
          <Menu.Button as={Button} variant="outline-secondary" className="font-normal w-40">
            Filter by {filterType === "site" ? "Site" : "Country"}
            <Lucide icon="ChevronDown" className="w-4 h-4 ml-2" />
          </Menu.Button>
          <Menu.Items className="w-40 h-32 overflow-y-auto">
            <Menu.Item onClick={() => setFilterType("site")}>
              By Site
            </Menu.Item>
            <Menu.Item onClick={() => setFilterType("country")}>
              By Country
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
      <Chart
        type="line"
        width={width}
        height={height}
        data={data}
        options={options}
        className={className}
      />
    </div>
  );
}

export default Main;