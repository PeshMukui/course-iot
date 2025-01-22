// require("dotenv").config(); // Load environment variables
const { EventHubProducerClient } = require("@azure/event-hubs");

connectionString = "Endpoint=sb://event-namespace-fleet.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=APCrxiv56p7TLyggg1/MPzoXXo7e7CTiO+AEhOnzLxY=";
eventHubName = "event-hub-fleet";

// const connectionString = process.env.EVENT_HUB_CONNECTION_STRING;
// const eventHubName = process.env.EVENT_HUB_NAME;

async function sendMessageToEventHub(producer) {
    console.log(`[${new Date().toISOString()}] Attempting to create an Event Hub message batch...`);

    const batch = await producer.createBatch();
    console.log(`[${new Date().toISOString()}] Batch created successfully.`);

    const eventData = {
        device_id: "my-new-device",
        temperature: 28.5,
        humidity: 55,
        timestamp: new Date().toISOString(),
    };

    console.log(`[${new Date().toISOString()}] Adding message to batch:`, eventData);
    const isAdded = batch.tryAdd({ body: eventData });

    if (!isAdded) {
        console.error(`[${new Date().toISOString()}] Failed to add message to batch. It might be too large.`);
        throw new Error("MessageTooLarge");
    }

    console.log(`[${new Date().toISOString()}] Message added to batch successfully.`);
    console.log(`[${new Date().toISOString()}] Sending batch to Event Hub...`);
    await producer.sendBatch(batch);
    console.log(`[${new Date().toISOString()}] Message batch sent successfully to Event Hub.`);
}

async function retryOperation(fn, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (err) {
            if (i === retries - 1 || !err.retryable) throw err;
            console.log(`Retrying after error: ${err.message}. Attempt ${i + 1}/${retries}`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
}

async function main() {
    console.log(`[${new Date().toISOString()}] Starting Event Hub message sender...`);
    const producer = new EventHubProducerClient(connectionString, eventHubName);

    process.on("SIGINT", async () => {
        console.log("Interrupt signal received. Closing Event Hub Producer Client...");
        await producer.close();
        console.log("Producer closed. Exiting...");
        process.exit();
    });

    try {
        console.log(`[${new Date().toISOString()}] Event Hub Producer Client created successfully.`);
        await retryOperation(() => sendMessageToEventHub(producer));
    } catch (err) {
        console.error(`[${new Date().toISOString()}] Error occurred while sending message to Event Hub:`, err);
    } finally {
        console.log(`[${new Date().toISOString()}] Closing Event Hub Producer Client...`);
        await producer.close();
        console.log(`[${new Date().toISOString()}] Event Hub Producer Client closed.`);
    }
}

main().catch((err) => {
    console.error(`[${new Date().toISOString()}] Unhandled error in script execution:`, err);
});

// npm install dotenv
