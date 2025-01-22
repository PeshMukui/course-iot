import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto"; // Automatically register Chart.js components
import './App.css';

function Dashboard() {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        fetch("http://localhost:3000/data")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => setData(data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    // Filtered data based on user input
    const filteredData = filter
        ? data.filter((item) =>
              Object.values(item).some((value) =>
                  String(value).toLowerCase().includes(filter.toLowerCase())
              )
          )
        : data;

    // Chart data for temperature
    const temperatureData = {
        labels: filteredData.slice(-30).map((item) => item.timestamp),
        datasets: [
            {
                label: "Temperature",
                data: filteredData.slice(-30).map((item) => item.temperature),
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
            },
        ],
    };

    // Chart data for humidity
    const humidityData = {
        labels: filteredData.slice(-30).map((item) => item.timestamp),
        datasets: [
            {
                label: "Humidity",
                data: filteredData.slice(-30).map((item) => item.humidity),
                backgroundColor: "rgba(153,102,255,0.4)",
                borderColor: "rgba(153,102,255,1)",
            },
        ],
    };

    return (
        <div className="dashboard">
            {/* Chart Section */}
            <div className="charts">
                <h2>Temperature Chart</h2>
                <Line data={temperatureData} />
                <h2>Humidity Chart</h2>
                <Bar data={humidityData} />
            </div>

            {/* Table Section */}
            <div className="table">
                <h2>Telemetry Data</h2>
                <input
                    type="text"
                    placeholder="Filter by any field..."
                    value={filter}
                    onChange={handleFilterChange}
                />
                <table>
                    <thead>
                        <tr>
                            <th>Device ID</th>
                            <th>Temperature</th>
                            <th>Humidity</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.device_id}</td>
                                <td>{item.temperature}</td>
                                <td>{item.humidity}</td>
                                <td>{item.timestamp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Dashboard;
