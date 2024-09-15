import puppeteer from "puppeteer";
import { IProduct } from "../models/product-model";

export const generatePDF = async (products: IProduct[]): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: "/usr/bin/chromium",
  });

  const page = await browser.newPage();

  const total = products.reduce((acc, itr) => acc + itr.total, 0);
  const gstTotal = products.reduce((acc, itr) => acc + itr.gst, 0);
  const grandTotal = total + gstTotal;
  const todayDate = new Date().toLocaleString();

  const htmlContent = `<!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
        <div style="width: 80%; margin: auto; padding: 20px;">
        
        <h2 style="text-align: center;"> Invoice Generator </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 16px;">
            <thead>
            <tr>
                <th style="border-bottom: 1px solid #ddd; padding: 8px; text-align: left;">Product</th>
                <th style="border-bottom: 1px solid #ddd; padding: 8px; text-align: left;">Qty</th>
                <th style="border-bottom: 1px solid #ddd; padding: 8px; text-align: left;">Rate</th>
                <th style="border-bottom: 1px solid #ddd; padding: 8px; text-align: left;">Total</th>
            </tr>
            </thead>
            <tbody>
            ${products
              .map(
                (product) => `
              <tr>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;">
                  ${product.name}
                </td>
                <td style="border-bottom: 1px solid #ddd; padding: 8px; color: #6C63FF;">
                  ${product.qty}
                </td>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;">
                  ${product.rate}
                </td>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;">
                  INR ${product.total}
                </td>
              </tr>
            `
              )
              .join("")}
            </tbody>
        </table>

        <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
            <table style="border-collapse: collapse; font-size: 16px;">
            <tr>
                <td style="padding: 8px;">Total</td>
                <td style="padding: 8px;">INR ${total}</td>
            </tr>
            <tr>
                <td style="padding: 8px;">GST</td>
                <td style="padding: 8px;">18%</td>
            </tr>
            <tr>
                <td style="padding: 8px; font-weight: bold;">Grand Total</td>
                <td style="padding: 8px; color: #6C63FF; font-weight: bold;">₹ ${grandTotal}</td>
            </tr>
            </table>
        </div>

        <div style="margin-bottom: 20px;">
            <strong>Valid until:</strong> ${todayDate}
        </div>

        <div style="background-color: #333; color: white; padding: 20px; border-radius: 30px; text-align: center; max-width: 80%; margin: 20px auto;">
            <strong>Terms and Conditions</strong>
            <p style="font-size: 12px; margin: 10px 0;"> We are happy to supply any further information you may need and trust that you call on us to fill your order, which will receive our prompt and careful attention. </p>
        </div>
        </div>
    </body>
    </html>`;

  await page.setContent(htmlContent);

  // Generate PDF as Uint8Array
  const pdfUint8Array = await page.pdf({ format: "A4" });

  // Convert Uint8Array to Buffer
  const pdfBuffer = Buffer.from(pdfUint8Array);

  await browser.close();

  return pdfBuffer;
};
