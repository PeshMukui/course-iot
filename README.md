# Fleet Management IoT Humidity Monitoring System

## Table of Contents
1. Description
2. System Overview
3. Business Problem and Solution
4. User Stories
5. Technologies Used
6. Project Architecture
7. Installation Instructions
8. Deployment Instructions
9. API Documentation
10. Testing
11. Further Enhancements

---

## Description
The Fleet Management IoT Monitoring System is an innovative solution that simulates an IoT system for monitoring the humidity and temperature levels inside logistics vehicles. This system ensures that perishable goods transported by fleet vehicles remain within safe environmental conditions.
By integrating an IoT device simulator with Azure services, we can replicate real-world environmental data, store it in the cloud, and present it on a dashboard to help fleet managers monitor and manage their fleet effectively. 

## System Overview
The system works by simulating environmental data (humidity and temperature) from vehicles in transit. The following components are involved:

* IoT Device Simulator: Simulates data for humidity and temperature at regular intervals.
* Azure Cloud Integration: Data is sent to Azure using the MQTT protocol and processed by Azure Event Grid for further analysis.
* Database Storage: The data is stored in Azure CosmosDB for fast retrieval.
* API Layer: An API provides access to this data, allowing frontend dashboards and external applications to pull recent data.
* Frontend Dashboard: Visualizes the data in real-time, with charts and graphs to monitor vehicle conditions.

---

## Business Problem and Solution
### Problem Statement
Industries reliant on temperature and humidity stability, such as logistics face high costs and logistical challenges when implementing IoT-based environmental monitoring. Traditional testing requires installing physical sensors across facilities or transport routes, which is time-intensive, costly, and impractical at the prototyping stage. This results in slower development cycles, higher initial investments, and limited flexibility during testing.

### Solution
The IoT Humidity and Temperature Simulator API creates a virtual environment that generates realistic environmental data. It allows organizations to:
1. Prototype and Validate: Test and refine monitoring systems before committing to physical installations.
2. Streamline Development: Ensure seamless integration of APIs, data processing, and storage solutions with simulated data.
3. Support Decision-Making: Provide developers, stakeholders, and operators with a clear understanding of system capabilities without risking operational environments or incurring hardware costs.

---

## Technologies Used

* Node.js: For backend development and handling API requests.
* React.js: For building the frontend dashboard and visualizing data.
* Azure Services: To host and manage cloud infrastructure, including Azure CosmosDB, Event Grid, and MQTT Broker.
* MQTT: For sending environmental data from the simulator to the cloud.
* Postman: For API testing and documentation.
* Docker: For containerizing applications and ensuring consistency across environments.

## Project Architecture
### High-Level Architecture
1. IoT Device Simulator:
* Generates random temperature and humidity values.
* Sends data to an MQTT broker.

2. MQTT Broker:
* Receives data from the simulator.
* Forwards data to Azure Event Grid for processing.

3. Azure Event Grid:
* Handles event routing to Azure functions and CosmosDB.

4. Azure CosmosDB:
* Stores environmental data for retrieval and analysis.

5. API Layer:
* Exposes endpoints to fetch the latest data from CosmosDB.
* Provides data in a structured format for the frontend dashboard.

6. Frontend Dashboard:
* React.js application that fetches data from the API.
* Displays the data in the form of charts, graphs, and tables.

---

## Installation Instructions
Follow these steps to set up the project locally:

###Prerequisites
* Node.js (version 14 or higher)
* Azure account with appropriate permissions (Event Grid, CosmosDB)
* Docker (optional, for containerization)
* MQTT broker (e.g., Mosquitto, AWS IoT)

---

### Backend Installation
1. Clone the repository:
2. Navigate to the fleet-backend folder:
   ```bash
   cd fleet-management-iot/backend
3. Install required dependencies:
    ```bash
    npm install
4. Start the backend server:
    ```bash
    node backend.js

### Frontend Installation
1. Navigate to the dashboard folder:
    ```bash
    cd dashboard
2. Install required  frontend (dashboard) dependencies:
    ```bash
    npm install
3. Start the frontend development server:
    ```bash
    npm run dev
4. Install required  backend (dashboard) dependencies:
    ```bash
    npm install
    npm init -y
    npm install express
    npm install cors
    npm install express @azure/cosmos
    npm install dotenv

3. Start the frontend development server:
    ```bash
    node server.js
    
### MQTT Broker Setup
1 .Install and configure an MQTT broker like Mosquitto or AWS IoT.
2. Update the configuration to allow the simulator to publish data.

### Azure Setup
1. Create an Azure CosmosDB instance.
2. Set up an Azure Event Grid subscription to forward events to a function or service that processes incoming data.

---

## Deployment Instructions

### Containerizing the Application:
Docker can be used to containerize both the backend and frontend services for consistent deployments across environments.

---

## API Documentation
### Base URL
http://localhost:3001/

### Endpoints
GET /data

* Description: Fetches the latest environmental data from CosmosDB.
* Response:
  ```json
  {
    "vehicleId": "12345",
    "temperature": 22.5,
    "humidity": 60,
    "timestamp": "2025-01-22T10:00:00Z"
  }

---

## User Stories
1. As a Fleet Manager, I want to monitor the humidity levels of my vehicles so that I can ensure the safe transport of perishable goods.
2. As a Logistics Coordinator, I want to monitor the condition in the truck so that I can take immediate corrective actions.
3. As a Developer, I want to simulate environmental data via the IoT device simulator API so that I can test the fleet management system without needing physical hardware.
4. As a Data Scientist, I want to analyze the data from the fleet’s vehicles to identify patterns and predict potential issues before they occur.
5. As a Stakeholder, I want to visualize the environmental data on a user-friendly dashboard so that I can understand the system’s performance and make informed decisions.

---

## Testing
* Unit Testing: Tests have been written for the backend logic using Jest.
* API Testing: API endpoints are tested using Postman. A collection is provided for easy testing.

---

## Future Enhancements
* Integration of real physical IoT sensors to replace the simulator.
* Implementation of predictive analytics using machine learning to predict potential environmental hazards.
* Real-time push notifications using Azure SignalR or WebSockets for fleet managers.

--- 

## Contact
For further inquiries, please contact me at:
Email: pomusina@edu.cdv.pl


