import cloudinary from "cloudinary";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

export async function createProducts(req, res) {
  try {
    //1. get the data from the request
    const { name, description, price, stock, category } = req.body;

    //2. validate the data
    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({ message: "all fields are required" });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "at least one image is required" });
    }

    if (req.files.length > 3) {
      return res.status(400).json({ message: "maximum 3 images are allowed" });
    }

    const uploadPromises = req.files.map((file) => {
      return cloudinary.uploader.upload(file.path, {
        folder: "products",
      });
    });

    const uploadResults = await Promise.all(uploadPromises);

    const image_urls = uploadResults.map((result) => result.secure_url);

    //.create to the model inserts a new document into the database and returns the created document

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      images: image_urls,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("error in createProducts controller", error);
    res
      .status(500)
      .json({ message: "Internal server error in createProducts controller" });
  }
}

export async function getProducts(req, res) {
  try {
    //-1 means descending, most recently added product comes 1st
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("error in fetching prodcuts:", error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (stock) product.stock = parseInt(stock);
    if (category) product.category = category;

    //handle image update if new images are uploaded
    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res
          .status(400)
          .json({ message: "maximum 3 images are allowed" });
      }
      const uploadPromises = req.files.map((file) => {
        return cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
      });

      const uploadResults = await Promise.all(uploadPromises);
      const image_urls = uploadResults.map((result) => result.secure_url);
      product.images = image_urls;
    }

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.error("error in updating product:", error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItemSchema.product")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error in getAllOrders controller", error);
    res.status(500).json({ error: "internal server error" });
  }
}
export async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["pending", "shipped", "delivered"].includes(status)) {
      return res.status(400).json({ error: "not a valid status" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }

    order.status = status;

    if (status === "shipped" && !order.shippedAt) order.shippedAt = new Date();

    if (status === "delivered" && !order.deliveredAt)
      order.deliveredAt = new Date();

    await Order.save();
    res.status(200).json({ message: "order status saved successfully", order });
  } catch (error) {
    console.error("error in updateOrderStatus", error);
    res.status(500).json({ error: "internal server error" });
  }
}

export async function getAllCustomers(req, res) {
  try {
    const customers = await User.find().sort({ createdAt: -1 });

    res.status(200).json({ customers });
  } catch (error) {
    console.error("error in get all customers method", error);
    res.status(500).json({ error: "internal server error" });
  }
}
export async function getDashboardStats(req, res) {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    totalRevenue = totalRevenue[0] ? totalRevenue[0].total : 0;
    const totalCustomers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    res
      .status(200)
      .json({ totalOrders, totalRevenue, totalCustomers, totalProducts });
  } catch (error) {
    console.error("error in getdashboarstats", error);
    res.status(500).json({ error: "internal server error" });
  }
}
