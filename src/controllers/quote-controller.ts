import { Request, Response } from "express";
import { Quotation } from "../models/quotation-model";

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
