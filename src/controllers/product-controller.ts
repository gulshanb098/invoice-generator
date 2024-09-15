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

  res.status(200).json({
    message: "Added Products & Quotation Successfully",
    data: {
      date: quotation.date,
      products: modifiedProducts,
      downloadLink:
        quotation &&
        quotation.pdf &&
        `data:application/pdf;base64,${quotation.pdf.toString("base64")}`,
    },
  });
};
