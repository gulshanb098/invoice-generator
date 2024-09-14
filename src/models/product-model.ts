import mongoose from "mongoose";

export interface IProduct {
  name: string;
  qty: number;
  rate: number;
  gst: number;
  total: number;
}

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  rate: { type: Number, required: true },
  gst: { type: Number, required: false },
  total: { type: Number, required: false },
});

export const Product = mongoose.model<IProduct & mongoose.Document>(
  "product",
  productSchema
);
