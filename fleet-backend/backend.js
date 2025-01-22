require("dotenv").config();
const { EventHubProducerClient } = require("@azure/event-hubs"); // Sends
const { CosmosClient } = require("@azure/cosmos");
const mqtt = require("mqtt");
const crypto = require("crypto");

const connectionString = "Endpoint=sb://event-namespace-fleet.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=APCrxiv56p7TLyggg1/MPzoXXo7e7CTiO+AEhOnzLxY=";
const eventHubName = "event-hub-fleet";

// Cosmos DB setup
const COSMOS_ENDPOINT = "https://cosmosfleetdb.documents.azure.com:443/";
const COSMOS_KEY = "0Ub5IadbE0i8lsZymi3obVSgfLVjufot1vjYRhwuGzlho7gVRk7jJMGlbchb2ANxP55tFAPeEbqHACDbBd6sjw==";
const DATABASE_ID = "container-fleet";
const CONTAINER_ID = "cosmos-fleet";

const cosmosClient = new CosmosClient({ endpoint: COSMOS_ENDPOINT, key: COSMOS_KEY });
let container;

// MQTT setup
const deviceId = "my-new-device";
const sasToken = "sr=fleet-iot-hub.azure-devices.net%2Fdevices%2Fmy-new-device&sig=i9MRa%2B%2BzRw%2FoDhMmnmy8dLm8tZ%2BMZWBT9uZTyLLKgSI%3D&se=1736947516";
const iotHubName = "fleet-iot-hub";

// Initialize Cosmos DB container
async function initializeCosmosDB() {
    const { database } = await cosmosClient.databases.createIfNotExists({ id: DATABASE_ID });
    const containerResponse = await database.containers.createIfNotExists({
        id: CONTAINER_ID,
        partitionKey: { paths: ["/device_id"] },
    });
    container = containerResponse.container;
    console.log("Cosmos DB initialized.");
}

function simulateDeviceTelemetry(deviceId) {
    const temperature = (Math.random() * (30 - 20) + 20).toFixed(2);
    const humidity = (Math.random() * (60 - 40) + 40).toFixed(2);
    return {
        device_id: deviceId,
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        timestamp: new Date().toISOString(),
    };
}

async function storeInCosmosDB(sensorData) {
    try {
        const { resource: createdItem } = await container.items.create(sensorData);
        console.log("Data stored in Cosmos DB:", createdItem);
    } catch (error) {
        console.error("Failed to store data in Cosmos DB:", error.message);
    }
}

function connectToMqttBroker(deviceId) {
    console.log("Connecting to MQTT broker...");
    const mqttBrokerUrl = "mqtt://localhost:1883";
    const mqttTopic = `devices/${deviceId}/messages/events/`;

    const client = mqtt.connect(mqttBrokerUrl, {
        clientId: deviceId,
        username: `${iotHubName}.azure-devices.net/${deviceId}/?api-version=2021-04-12`,
        password: sasToken,
        protocol: "mqtt",
        rejectUnauthorized: false,
    });

    client.on("connect", () => {
        console.log("Connected to MQTT broker.");
    });
    client.on("error", (err) => {
        console.error("MQTT Error:", err.message);
    });

    return client;
}

async function sendMessageToEventHub(producer, telemetry) {
    const batch = await producer.createBatch();
    const isAdded = batch.tryAdd({ body: telemetry });

    if (!isAdded) {
        throw new Error("MessageTooLarge");
    }

    await producer.sendBatch(batch);
    console.log("Message sent to Event Hub:", telemetry);
}

// Main function
async function main() {
    try {
        // Initialize Cosmos DB
        await initializeCosmosDB();

        // Connect to MQTT broker
        const mqttClient = connectToMqttBroker(deviceId);

        // Initialize Event Hub Producer
        const producer = new EventHubProducerClient(connectionString, eventHubName);

        // Clean up on exit
        process.on("SIGINT", async () => {
            console.log("Shutting down...");
            await producer.close();
            mqttClient.end();
            console.log("Resources closed. Exiting.");
            process.exit();
        });

        // Simulate and send telemetry
        while (true) {
            const telemetry = simulateDeviceTelemetry(deviceId);

            // Send to MQTT
            mqttClient.publish(`devices/${telemetry.device_id}/messages/events/`, JSON.stringify(telemetry), { qos: 1 }, (err) => {
                if (err) {
                    console.error("Failed to send MQTT message:", err.message);
                } else {
                    console.log("Telemetry sent to MQTT broker:", telemetry);
                }
            });

            // Send to Event Hub
            try {
                await sendMessageToEventHub(producer, telemetry);
            } catch (err) {
                console.error("Error sending to Event Hub:", err.message);
            }

            // Store in Cosmos DB
            await storeInCosmosDB(telemetry);

            console.log("Telemetry cycle completed. Waiting for 10 seconds...");
            await new Promise((resolve) => setTimeout(resolve, 10000));
        }
    } catch (error) {
        console.error("Error in main function:", error.message);
    }
}

main();
