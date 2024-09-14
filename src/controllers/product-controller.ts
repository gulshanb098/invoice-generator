import { Request, Response } from "express";
import { IProduct, Product } from "../models/product-model";
import { Quotation } from "../models/quotation-model";
import { generatePDF } from "../utils/generatePDF";

export const addProducts = async (req: Request, res: Response) => {
  const { products } = req.body;

  const modifiedProducts: IProduct[] = products.map((product: any) => {
    const total = product.rate * product.qty;
    const gst = (total * 18) / 100;
    return {
      ...product,
      gst,
      total,
    };
  });

  const newProducts = await Product.insertMany(modifiedProducts);

  const pdfBuffer = await generatePDF(newProducts);

  const quotation = new Quotation({
    products: newProducts.map((product: { _id: any }) => product._id),
    user: req.body.userId,
    pdf: pdfBuffer,
  });

  await quotation.save();

  res
    .status(201)
    .json({ message: "Quotation created", pdf: pdfBuffer.toString("base64") });
};

export const getAllInvoicePDFs = async (req: Request, res: Response) => {
  const userId = req.body.userId;

  try {
    const quotations = await Quotation.find({ user: userId })
      .populate("products")
      .exec();

    if (quotations.length === 0) {
      return res
        .status(404)
        .json({ message: "No quotations found for this user" });
    }

    // Prepare the list of PDFs with base64-encoded PDF data
    const pdfList = quotations.map((quotation) => {
      if (quotation && quotation.pdf) {
        return {
          id: quotation._id,
          date: quotation.date,
          products: quotation.products,
          downloadLink: `data:application/pdf;base64,${quotation.pdf.toString(
            "base64"
          )}`,
        };
      }
    });

    res.status(200).json({
      message: "Quotations fetched successfully",
      pdfList,
    });
  } catch (error) {
    console.error("Error in getAllInvoicePDFs:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
