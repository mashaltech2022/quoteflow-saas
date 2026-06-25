import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, subject, customerName, type, number, total, dueDate, items, businessName, businessEmail, businessPhone } = body

    const itemsHtml = items && items.length > 0
      ? items.map((item: { description: string; quantity: number; rate: number; amount: number }) => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.description}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">AED ${item.rate.toFixed(2)}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">AED ${item.amount.toFixed(2)}</td>
          </tr>
        `).join("")
      : `<tr><td style="padding: 10px;" colspan="4">Services - AED ${total}</td></tr>`

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        
        <div style="background: #1f2937; color: white; padding: 30px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">${businessName || "QuoteFlow"}</h1>
          <p style="margin: 5px 0 0; color: #9ca3af;">${type === "invoice" ? "Tax Invoice" : "Quotation"}</p>
        </div>

        <div style="background: #f3f4f6; padding: 20px;">
          <h2 style="margin: 0; color: #1f2937;">${number}</h2>
          ${dueDate ? `<p style="margin: 5px 0 0; color: #6b7280;">${type === "invoice" ? "Due Date" : "Expiry Date"}: <strong>${dueDate}</strong></p>` : ""}
        </div>

        <div style="background: white; padding: 20px; border: 1px solid #e5e7eb;">
          <p>Dear <strong>${customerName}</strong>,</p>
          <p>${type === "invoice" 
            ? `Please find your invoice <strong>${number}</strong> attached. Total amount due is <strong>AED ${total}</strong>.`
            : `Please find your quotation <strong>${number}</strong>. Total amount is <strong>AED ${total}</strong>.`
          }</p>
        </div>

        <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #1f2937; color: white;">
                <th style="padding: 10px; text-align: left;">Description</th>
                <th style="padding: 10px; text-align: right;">Qty</th>
                <th style="padding: 10px; text-align: right;">Rate</th>
                <th style="padding: 10px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="text-align: right; margin-top: 20px; padding-top: 10px; border-top: 2px solid #1f2937;">
            <p style="font-size: 18px; font-weight: bold; margin: 0;">Total: AED ${total}</p>
          </div>
        </div>

        <div style="background: #1f2937; color: white; padding: 20px; border-radius: 0 0 12px 12px; text-align: center;">
          <p style="margin: 0; color: #9ca3af; font-size: 14px;">${businessName || "QuoteFlow"}</p>
          ${businessEmail ? `<p style="margin: 5px 0 0; color: #9ca3af; font-size: 12px;">${businessEmail}</p>` : ""}
          ${businessPhone ? `<p style="margin: 5px 0 0; color: #9ca3af; font-size: 12px;">${businessPhone}</p>` : ""}
        </div>

      </body>
      </html>
    `

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [to],
      subject: subject || `${type === "invoice" ? "Invoice" : "Quotation"} ${number}`,
      html
    })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Email send nahi hua" }, { status: 500 })
  }
}