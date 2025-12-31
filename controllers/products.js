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

export const createProduct = async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.description ||
      !req.body.price ||
      !req.body.category ||
      !req.body.stock
    ) {
      return res.status(409).json({
        error: "Product with this name already exists",
      });
    }

    const mongoConn = req.mongoConn;
    const productsCollection = mongoConn.collection("products");

    const newProduct = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      totalOrdersCount: req.body.totalOrdersCount || 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await productsCollection.insertOne(newProduct);
    const product = await productsCollection.findOne({ _id: result.insertedId });

    return res
      .status(201)
      .json({ message: `Created product with _id: ${product._id}` });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: "Product with this name already exists",
      });
    }
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const mongoConn = req.mongoConn;
    const productsCollection = mongoConn.collection("products");
    let query = {};

    if (req.query.category) {
      query.category = req.query.category;
    }

    const productArr = await productsCollection.find(query).toArray();
    res.status(200).json({ message: "success", data: productArr });
  } catch (error) {
    res.status(500).json({ message: "error: " + error.message, data: null });
  }
};

// --------- New function: getProduct ---------
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const mongoConn = req.mongoConn;
    const productsCollection = mongoConn.collection("products");
    const product = await productsCollection.findOne({ _id: new ObjectId(id) });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "success", data: product });
  } catch (error) {
    res.status(500).json({ message: "error: " + error.message, data: null });
  }
};



// export const getProduct = async (req, res) => {
//     const mongoConn = req.mongoConn;
//     const productsCollection = mongoConn.collection("products")

//     const productsArr = await productsCollection.find(query).toArray()
// }


