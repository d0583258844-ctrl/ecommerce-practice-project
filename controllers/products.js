// export const createProduct = async (req, res) => {
//   try {
//     if (
//       !req.body.name ||
//       !req.body.description ||
//       !req.body.price ||
//       !req.body.category ||
//       !req.body.stock
//     ) {
//         return res.status(409).json({
//         error: "Product with this name already exists",
//       });
//     }

//       const mongoConn = req.mongoConn;
//       const productsCollection = mongoConn.collection("products");

//       const newProduct = {
//         name: req.body.name ,
//         description: req.body.description,
//         price: req.body.price,
//         category: req.body.category,
//         stock: req.body.stock,
//         totalOrdersCount: req.body.totalOrdersCount || 0,
//         created_at: new Date(),
//         updated_at: new Date(),
//       };

//       const result = await productsCollection.insertOne(newProduct);

//       const product = await productsCollection.findOne({_id: result.insertedId});
//       return res
//         .status(201)
//         .json({ message: `Created product with _id: ${product._id}` });

//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(409).json({
//         error: "Product with this name already exists",
//       });
//     }
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// export const getAllProducts = async (req, res) => {
//   try {
//     const mongoConn = req.mongoConn;
//     const productsCollection = mongoConn.collection("products");
//     let query = {};
//     const productArr = await productsCollection.find(query).toArray();
//     res.status(200).json({ message: "success", data: productArr });
//   } catch (error) {
//     res.status(500).json({ message: "error: " + error.message, data: null });
//   }
// };


import { ObjectId } from "mongodb";

export const createOrder = async (req, res) => {
  try {
    const { productId, quantity, customerName } = req.body;

    if (!productId || !quantity || !customerName) {
      return res.status(400).json({ error: "Missing fields" });
    }

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid productId format" });
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
      { $inc: { totalOrdersCount: 1 } }
    );

    const newOrder = {
      id: result.insertId,
      productId,
      quantity,
      customerName,
      totalPrice,
      orderDate: new Date()
    };

    res.status(201).json({ status: 201, data: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: error.message });
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

    res.status(200).json({ status: 200, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const sqlConn = req.sqlConn;
    const [rows] = await sqlConn.execute("SELECT * FROM orders WHERE id = ?", [orderId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ status: 200, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, error: error.message });
  }
};



// export const getProduct = async (req, res) => {
//     const mongoConn = req.mongoConn;
//     const productsCollection = mongoConn.collection("products")

//     const productsArr = await productsCollection.find(query).toArray()
// }


