import Razorpay from "razorpay"
import { NextResponse } from "next/server"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
  const { amount } = await req.json()

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // ₹ to paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    })

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}