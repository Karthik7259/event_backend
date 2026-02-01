import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
    productName: { type: String, required: true },
    productImage: { type: String },
    pricePerDay: { type: Number, required: true },
    quantity: { type: Number, required: true },
    days: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhone: { type: String },

    items: { type: [orderItemSchema], required: true },

    totalAmount: { type: Number, required: true },
    status: { type: String, default: "pending" },
    paymentStatus: { type: String, default: "unpaid" },
    adminNotes: { type: String, default: "" },

    eventDate: { type: Date },
    eventLocation: { type: String },
    deliveryAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    notes: { type: String },
  },
  { timestamps: true }
);

const OrderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default OrderModel;
