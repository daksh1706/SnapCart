import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        // Change 'email' to 'user'
        user: process.env.EMAIL, 
        // Ensure this is an "App Password", not your login password
        pass: process.env.PASS 
    },
});

export const sendMail = async (to: string, subject: string, html: string) => {
    try {
        await transporter.sendMail({
            from: `"SnapCart" <${process.env.EMAIL}>`,
            to,
            subject,
            html
        });
    } catch (error) {
        console.error("Nodemailer Error:", error);
        throw new Error("Failed to send email");
    }
};