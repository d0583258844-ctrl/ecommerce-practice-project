import { ObjectId } from "mongodb";

export const createOrder = async (req, res) => {
  try {
    const { productId, quantity, customerName } = req.body;

    if (!productId || !quantity || !customerName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const mongoConn = req.mongoConn;
    const productsCollection = mongoConn.collection("products");

    const product = await productsCollection.findOne({ _id: new ObjectId(productId) });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const totalPrice = quantity * product.price;

    const sqlConn = req.sqlConn;
    const [result] = await sqlConn.execute(
      "INSERT INTO orders (productId, quantity, customerName, totalPrice) VALUES (?, ?, ?, ?)",
      [productId, quantity, customerName, totalPrice]
    );

    await productsCollection.updateOne(
      { _id: new ObjectId(productId) },
      { $inc: { totalOrdersCount: quantity }, $set: { updated_at: new Date() } }
    );

    res.status(201).json({ message: "Order created", orderId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const sqlConn = req.sqlConn;

    let query = "SELECT * FROM orders";
    const params = [];

    if (req.query.productId) {
      query += " WHERE productId = ?";
      params.push(req.query.productId);
    }

    const [rows] = await sqlConn.execute(query, params);
    res.status(200).json({ message: "success", data: rows });
  } catch (error) {
    res.status(500).json({ message: "error: " + error.message, data: null });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const sqlConn = req.sqlConn;

    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const [rows] = await sqlConn.execute("SELECT * FROM orders WHERE id = ?", [orderId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "success", data: rows[0] });
  } catch (error) {
    res.status(500).json({ message: "error: " + error.message, data: null });
  }
};
