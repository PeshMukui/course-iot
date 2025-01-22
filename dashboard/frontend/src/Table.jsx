import React, { useEffect, useState } from "react";

function Display() {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState("");
    const [sortColumn, setSortColumn] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

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

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortOrder("asc");
        }
    };

    const filteredData = data.filter((item) => {
        const searchText = filter.trim().toLowerCase();
        if (!searchText) return true;

        return (
            item.device_id?.toLowerCase().includes(searchText) ||
            item.temperature?.toString().includes(searchText) ||
            item.humidity?.toString().includes(searchText) ||
            item.timestamp?.toLowerCase().includes(searchText)
        );
    });

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortColumn) return 0;

        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (sortOrder === "asc") {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const getSortIndicator = (column) => {
        if (sortColumn !== column) return "";
        return sortOrder === "asc" ? " ▲" : " ▼";
    };

    return (
        <div>
            <h1>Telemetry Dashboard</h1>
            <input
                type="text"
                placeholder="Filter by any field..."
                value={filter}
                onChange={handleFilterChange}
            />
            <table>
                <thead>
                    <tr>
                        <th
                            className={`sortable ${sortColumn === "device_id" ? `sorted-${sortOrder}` : ""}`}
                            onClick={() => handleSort("device_id")}
                        >
                            Device ID{getSortIndicator("device_id")}
                        </th>
                        <th
                            className={`sortable ${sortColumn === "temperature" ? `sorted-${sortOrder}` : ""}`}
                            onClick={() => handleSort("temperature")}
                        >
                            Temperature{getSortIndicator("temperature")}
                        </th>
                        <th
                            className={`sortable ${sortColumn === "humidity" ? `sorted-${sortOrder}` : ""}`}
                            onClick={() => handleSort("humidity")}
                        >
                            Humidity{getSortIndicator("humidity")}
                        </th>
                        <th
                            className={`sortable ${sortColumn === "timestamp" ? `sorted-${sortOrder}` : ""}`}
                            onClick={() => handleSort("timestamp")}
                        >
                            Timestamp{getSortIndicator("timestamp")}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((item, index) => (
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
    );
}
<button onClick={() => navigateTo('chart-screen')}> View Charts</button>

export default Display;
