import express from "express";
import { getMongoDbConnection, initMongoDb } from "./utils/mongodb.js";
import { getMysqlConnection, initSqlDb } from "./utils/mysql.js";
import productsRoutes from "./routes/products.js"
import ordersRoutes from "./routes/orders.js";

const app = express();
const PORT = 8000;

app.use(express.json());

app.use(async (req, res, next) => {
  req.mongoConn = await getMongoDbConnection();
  req.sqlConn = await getMysqlConnection();
  next();
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use("/api/products",productsRoutes)

app.use("/api/orders", ordersRoutes);

app.listen(PORT, async () => {
  await initMongoDb();
  await initSqlDb();
  console.log(`Server is running on port ${PORT}...`);
});

