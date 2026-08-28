const { Kafka } = require("kafkajs");
const { createTrainerProfile, deleteTrainerProfile } = require("../models/trainerProfile.model");
const { createCustomerProfile, deleteCustomerProfile } = require("../models/customerProfile.model");

const kafka = new Kafka({
  clientId: "profile-service",
  brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
});

const consumer = kafka.consumer({ groupId: "profile-service-group" });

async function startConsumer() {
  try {
    await consumer.connect();
    console.log("Profile Service connected to Kafka Broker");

    // 1. Add the new subscription
    await consumer.subscribe({ topic: "trainer_creation", fromBeginning: true });
    await consumer.subscribe({ topic: "customer_creation", fromBeginning: true });
    await consumer.subscribe({ topic: "deleted_users", fromBeginning: true }); 

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const payload = JSON.parse(message.value.toString());
        
        console.log(`Received event on ${topic} for ID: ${payload.id}`);

        try {
          if (topic === "trainer_creation") {
            await createTrainerProfile(payload);
          } else if (topic === "customer_creation") {
            await createCustomerProfile(payload);
          } else if (topic === "deleted_users") {
            // 2. Fire deletes against both tables. 
            // It safely deletes the record where the ID matches and ignores the other.
            await deleteTrainerProfile(payload.id);
            await deleteCustomerProfile(payload.id);
            console.log(`Successfully removed profile for ID: ${payload.id}`);
          }
        } catch (dbError) {
          console.error(`Failed DB operation on ${topic} for ${payload.id}:`, dbError);
        }
      },
    });
  } catch (error) {
    console.error("Failed to start Kafka consumer:", error);
    process.exit(1);
  }
}

module.exports = { startConsumer };