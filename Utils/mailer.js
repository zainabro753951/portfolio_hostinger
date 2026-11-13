import nodemailer from "nodemailer";

// ─── SMTP Configuration ─────────────────────────────

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE !== "false",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── Reusable Email Function ─────────────────────────

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
  fromName = "Support Team",
  replyTo,
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${process.env.EMAIL_USER}>`,
      to,
      ...(replyTo ? { replyTo } : {}),
      subject,
      html,
      text,
    });

    // ─── Successful Email Log ────────────────────────

    console.log("\n");
    console.log("╔══════════════════════════════════════════════╗");
    console.log("║          EMAIL SENT SUCCESSFULLY             ║");
    console.log("╠══════════════════════════════════════════════╣");
    console.log(`║ From      : ${fromName}`);
    console.log(`║ To        : ${to}`);
    console.log(`║ Reply To  : ${replyTo || "Not specified"}`);
    console.log(`║ Subject   : ${subject}`);
    console.log(`║ Message ID: ${info.messageId}`);
    console.log(`║ Response  : ${info.response}`);
    console.log("║ Status    : SUCCESS");
    console.log("╚══════════════════════════════════════════════╝");
    console.log("\n");

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error) {
    // ─── Failed Email Log ────────────────────────────

    console.error("\n");
    console.error("╔══════════════════════════════════════════════╗");
    console.error("║              EMAIL SENDING FAILED            ║");
    console.error("╠══════════════════════════════════════════════╣");
    console.error(`║ To      : ${to}`);
    console.error(`║ Subject : ${subject}`);
    console.error(`║ Error   : ${error.message}`);
    console.error(`║ Code    : ${error.code || "UNKNOWN"}`);
    console.error("║ Status  : FAILED");
    console.error("╚══════════════════════════════════════════════╝");
    console.error("\n");

    throw error;
  }
};

export default transporter;
