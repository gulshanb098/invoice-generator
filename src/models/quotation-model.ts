import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema({
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  date: { type: Date, default: Date.now },
  pdf: { type: Buffer },
});

export const Quotation = mongoose.model("quotation", quotationSchema);
