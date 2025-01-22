import express from "express";
import { CosmosClient } from "@azure/cosmos";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

// Reply to GET http://localhost:3001/

const cosmosClient = new CosmosClient({
    endpoint: process.env.COSMOS_DB_ENDPOINT || "https://cosmosfleetdb.documents.azure.com:443/",
    key: process.env.COSMOS_DB_KEY || "0Ub5IadbE0i8lsZymi3obVSgfLVjufot1vjYRhwuGzlho7gVRk7jJMGlbchb2ANxP55tFAPeEbqHACDbBd6sjw==",
});

const databaseId = "container-fleet";
const containerId = "cosmos-fleet";

app.use(cors()); 

// API route to return data
app.get("/data", async (req, res) => {
    try {
        const container = cosmosClient.database(databaseId).container(containerId);
        const { resources } = await container.items.query("SELECT * FROM c").fetchAll();
        res.json(resources);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}/data`));


// Command to install necessary packages:
// npm install
// npm init -y
// npm install express
// npm install cors
// npm install express @azure/cosmos
// npm install dotenv



// node server.js