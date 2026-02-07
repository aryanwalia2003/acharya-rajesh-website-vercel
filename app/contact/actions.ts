"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

type SubmitInquiryState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function submitInquiry(prevState: any, formData: FormData): Promise<SubmitInquiryState> {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;

  // Basic validation
  if (!name || name.trim().length < 2) {
    return { success: false, message: "Please enter a valid name." };
  }
  if (!phone || phone.trim().length < 10) {
    return { success: false, message: "Please enter a valid phone number." };
  }

  try {
    const sql = `
      INSERT INTO inquiries (name, phone, message)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;

    await query(sql, [name, phone, message]);

    return { 
      success: true, 
      message: "Dhanyawaad! Your inquiry has been sent successfully. We will contact you shortly." 
    };
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    return { success: false, message: "Something went wrong. Please try again or WhatsApp us directly." };
  }
}
