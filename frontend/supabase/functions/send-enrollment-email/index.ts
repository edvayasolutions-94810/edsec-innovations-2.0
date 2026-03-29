import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface EnrollmentRequest {
  name: string;
  email: string;
  phone: string;
  course: string;
  qualification?: string;
  message?: string;
  honeypot?: string;
}

const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateInput = (data: EnrollmentRequest): { valid: boolean; error?: string; sanitized?: EnrollmentRequest } => {
  const { name, email, phone, course, qualification, message, honeypot } = data;

  if (honeypot && honeypot.trim().length > 0) {
    return { valid: false, error: "honeypot" };
  }

  if (!name || typeof name !== 'string' || name.trim().length === 0) return { valid: false, error: "Name is required" };
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) return { valid: false, error: "Valid email is required" };
  if (!phone || typeof phone !== 'string' || phone.trim().length < 10) return { valid: false, error: "Valid phone number is required" };
  if (!course || typeof course !== 'string' || course.trim().length === 0) return { valid: false, error: "Course selection is required" };
  if (name.length > 100) return { valid: false, error: "Name too long" };
  if (email.length > 255) return { valid: false, error: "Email too long" };
  if (phone.length > 20) return { valid: false, error: "Phone too long" };
  if (message && message.length > 2000) return { valid: false, error: "Message too long" };

  return {
    valid: true,
    sanitized: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      course: course.trim(),
      qualification: qualification?.trim() || "",
      message: message?.trim() || "",
    }
  };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: EnrollmentRequest = await req.json();
    const validation = validateInput(requestData);

    if (!validation.valid) {
      if (validation.error === "honeypot") {
        return new Response(JSON.stringify({ success: true }), {
          status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { name, email, phone, course, qualification, message } = validation.sanitized!;

    // Save to database using service role
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: dbError } = await supabaseAdmin.from("student_enrollments").insert({
      name, email, phone, course, qualification, message,
    });

    if (dbError) {
      console.error("Database insert error:", dbError);
    }

    // Send notification email
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeCourse = escapeHtml(course);
    const safeQualification = escapeHtml(qualification || "Not provided");
    const safeMessage = escapeHtml(message || "No additional message");

    await resend.emails.send({
      from: "EDSEC Enrollment <onboarding@resend.dev>",
      to: ["edsecinnovations@gmail.com"],
      subject: `🎓 New Student Enrollment: ${safeName} - ${safeCourse}`,
      html: `
        <h2>🎓 New Student Enrollment</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name</td><td style="padding: 8px; border: 1px solid #ddd;">${safeName}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td><td style="padding: 8px; border: 1px solid #ddd;">${safeEmail}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td><td style="padding: 8px; border: 1px solid #ddd;">${safePhone}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Course</td><td style="padding: 8px; border: 1px solid #ddd;">${safeCourse}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Qualification</td><td style="padding: 8px; border: 1px solid #ddd;">${safeQualification}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Message</td><td style="padding: 8px; border: 1px solid #ddd;">${safeMessage}</td></tr>
        </table>
        <p style="margin-top: 16px; color: #666;">This enrollment was submitted from the EDSEC website.</p>
      `,
    });

    console.log("Enrollment email sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-enrollment-email:", error);
    return new Response(JSON.stringify({ error: "Failed to submit enrollment. Please try again." }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
