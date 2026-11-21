import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const VENDORS_FILE = path.join(__dirname, "vendors.json");
const ORDERS_FILE = path.join(__dirname, "orders.json");

if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
}

app.get("/", (req, res) => {
  res.json({ status: "LocoMrkt API is running", timestamp: new Date() });
});

app.get("/api/vendors", (req, res) => {
  try {
    if (!fs.existsSync(VENDORS_FILE)) return res.json([]);
    let vendors = JSON.parse(fs.readFileSync(VENDORS_FILE, "utf8"));
    const { category, search } = req.query;
    if (category && category !== "All") {
      vendors = vendors.filter((v) => v.category && v.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      vendors = vendors.filter(
        (v) =>
          (v.name && v.name.toLowerCase().includes(q)) ||
          (v.location && v.location.toLowerCase().includes(q)) ||
          (v.description && v.description.toLowerCase().includes(q))
      );
    }
    res.json(vendors);
  } catch (err) {
    console.error("GET /api/vendors error:", err);
    res.status(500).json({ error: "Failed to load vendors data" });
  }
});

app.post("/api/orders", (req, res) => {
  try {
    const { customerName, customerPhone, address, paymentMethod, items, totalAmount } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Order must contain at least one item" });
    }
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8"));
    const newOrder = {
      orderId: `LM-${Date.now()}`,
      customerName: customerName || "Guest Customer",
      customerPhone: customerPhone || "Not Provided",
      address: address || "Local Pickup",
      paymentMethod: paymentMethod || "COD",
      items,
      total: totalAmount,
      totalAmount,
      status: "Preparing Order",
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    orders.unshift(newOrder);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.error("POST /api/orders error:", err);
    res.status(500).json({ error: "Failed to process order" });
  }
});

app.get("/api/orders", (req, res) => {
  try {
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8"));
    res.json(orders);
  } catch (err) {
    console.error("GET /api/orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.patch("/api/orders/:orderId/status", (req, res) => {
  try {
    const { orderId } = req.params;
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8"));
    const idx = orders.findIndex((o) => o.orderId === orderId);
    if (idx === -1) {
      return res.status(404).json({ error: "Order not found" });
    }
    const flow = ["Preparing Order", "Out for Delivery", "Delivered"];
    const currentIdx = flow.indexOf(orders[idx].status);
    const nextStatus = flow[Math.min(currentIdx + 1, flow.length - 1)];
    orders[idx] = { ...orders[idx], status: nextStatus };
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    res.json({ message: "Order status updated", order: orders[idx] });
  } catch (err) {
    console.error("PATCH /api/orders/:orderId/status error:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

app.listen(PORT, () => {
  console.log(`LocoMrkt Backend running at http://localhost:${PORT}`);
});
