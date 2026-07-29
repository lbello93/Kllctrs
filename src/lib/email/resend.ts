import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  otp: string,
  name?: string
) {
  const { error } = await resend.emails.send({
    from: "KLLCTRS <onboarding@kllctrs.com>",
    to: email,
    subject: "Verify your KLLCTRS account",

    html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
        <h2>Welcome${name ? `, ${name}` : ""}!</h2>

        <p>Your verification code is:</p>

        <h1 style="
            letter-spacing:8px;
            text-align:center;
            color:#5f2eea;
        ">
          ${otp}
        </h1>

        <p>
          This code expires in <strong>10 minutes</strong>.
        </p>

        <p>
          If you didn't create an account, you can ignore this email.
        </p>
      </div>
    `,
  });

  if (error) throw error;
}