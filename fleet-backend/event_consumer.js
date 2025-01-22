// // This script subscribes to an Event Hub to consume incoming messages.
// Script to read messages.
// // const { EventHubConsumerClient } = require("@azure/event-hubs");

// // module.exports = async function (context, eventHubMessages) {
// //     context.log(`Received message: ${JSON.stringify(eventHubMessages)}`);

// //     // Loop through each message (if batch processing is enabled)
// //     for (const message of eventHubMessages) {
// //         // Process message data (e.g., telemetry, device state changes)
// //         context.log(`Processing message from device: ${message.deviceId}`);
// //         context.log(`Telemetry Data: ${JSON.stringify(message)}`);

// //         // Example: Forward data to a frontend via HTTP or WebSocket
// //         // context.bindings.httpResponse = {
// //         //     body: `Received message from device ${message.deviceId}`,
// //         // };

// //         // Add any business logic here (e.g., storing data in Cosmos DB)
// //     }
// //     context.done();
// // };
// const { EventHubConsumerClient } = require("@azure/event-hubs");

// const connectionString = "Endpoint=sb://event-namespace-fleet.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=APCrxiv56p7TLyggg1/MPzoXXo7e7CTiO+AEhOnzLxY=";
// const eventHubName = "event-hub-fleet";
// const consumerGroup = "$Default"; // Default consumer group

// const consumerClient = new EventHubConsumerClient(consumerGroup, connectionString, eventHubName);

// // Function to process the messages
// async function processEventHubMessages(eventHubMessages) {
//     for (const message of eventHubMessages) {
//         console.log(`[${new Date().toISOString()}] Received message from device: ${message.deviceId}`);
//         console.log(`[${new Date().toISOString()}] Message data: ${JSON.stringify(message)}`);
//     }
// }

// // Function to start consuming messages from Event Hub
// async function startConsuming() {
//     console.log(`[${new Date().toISOString()}] Starting Event Hub Consumer...`);

//     const subscription = consumerClient.subscribe(
//         {
//             processEvents: async (events) => {
//                 console.log(`[${new Date().toISOString()}] Received ${events.length} messages from Event Hub.`);
//                 await processEventHubMessages(events); // Call function to process messages
//             },
//             processError: async (err) => {
//                 console.error(`[${new Date().toISOString()}] Error occurred while consuming Event Hub messages:`, err);
//             }
//         },
//         { startPosition: EventPosition.latest() } // Use EventPosition.latest() instead of "@latest"
//     );

//     process.on("SIGINT", async () => {
//         console.log("Interrupt signal received. Closing Event Hub Consumer Client...");
//         await consumerClient.close();
//         console.log("Consumer closed. Exiting...");
//         process.exit();
//     });
// }

// // Start consuming messages from Event Hub
// startConsuming().catch((err) => {
//     console.error(`[${new Date().toISOString()}] Unhandled error in Event Hub consumption:`, err);
// });

const { EventHubConsumerClient } = require("@azure/event-hubs");

// Use environment variables for sensitive information
const connectionString = process.env.EVENT_HUB_CONNECTION_STRING || "Endpoint=sb://event-namespace-fleet.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=APCrxiv56p7TLyggg1/MPzoXXo7e7CTiO+AEhOnzLxY=";
const eventHubName = process.env.EVENT_HUB_NAME || "event-hub-fleet";
const consumerGroup = "$Default"; // Default consumer group

async function main() {
    console.log("Starting to consume messages...");
    const consumerClient = new EventHubConsumerClient(consumerGroup, connectionString, eventHubName);

    // Graceful shutdown on termination signals
    const shutdownHandler = async () => {
        console.log("Shutting down gracefully...");
        await consumerClient.close();
        console.log("EventHubConsumerClient closed. Exiting...");
        process.exit(0);
    };

    process.on("SIGINT", shutdownHandler);
    process.on("SIGTERM", shutdownHandler);

    // Subscribe to events
    consumerClient.subscribe({
        processEvents: async (events, context) => {
            for (const event of events) {
                console.log("Received event:");
                console.log(JSON.stringify(event.body, null, 2));
                console.log(`Partition: ${context.partitionId}, Offset: ${event.offset}`);
            }
        },
        processError: async (err, context) => {
            console.error("Error receiving messages: ", err.message);
        },
    });
}

main().catch((err) => {
    console.error("Error in consuming messages: ", err.message);
});
