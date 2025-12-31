import { MongoClient } from "mongodb";


const MONGO_URL =
  "mongodb://admin:password123@localhost:27018/ecommerce?authSource=admin";
const Database = "ecommerce";
const Collection = "products";

let mongoConn = null;
let mongocClient = null;

export async function initMongoDb() {
  try {
    mongocClient = new MongoClient(MONGO_URL);
    await mongocClient.connect();
    mongoConn = mongocClient.db(Database);

    const todosCollection = mongoConn.collection(Collection);

    await todosCollection.createIndex({ name: 1 }, { unique: true });

    console.log(
      "Database initialized and unique index created on 'name' field"
    );
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

export async function getMongoDbConnection() {
  if (!mongoConn) {
    if (!mongocClient) {
      mongocClient = new MongoClient(MONGO_URL);
      await mongocClient.connect();
    }
    mongoConn = mongocClient.db("ecommerce");
  }
  return mongoConn;
}

export async function closeConnection() {
  if (mongocClient) {
    await mongocClient.close();
    mongocClient = null;
    mongoConn = null;
  }
}
