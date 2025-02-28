import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email, subject, message } = await req.json();

    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'egecam000@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD, 
      },
    });

    // Email options
    const mailOptions = {
      from: email,
      to: 'egecam000@gmail.com',
      subject: `[Website Contact] ${subject}`,
      text: `From: ${email}\n\n${message}`,
      replyTo: email,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 