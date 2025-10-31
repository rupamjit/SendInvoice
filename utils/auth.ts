// import Nodemailer from "next-auth/providers/nodemailer";
// import NextAuth from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { db } from "./db";

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   adapter: PrismaAdapter(db),
//   providers: [
//     Nodemailer({
//       server: {
//         secure: false,
//         host: process.env.EMAIL_SERVER_HOST,
//         port: Number(process.env.EMAIL_SERVER_PORT),
//         auth: {
//           user: process.env.EMAIL_SERVER_USER,
//           pass: process.env.EMAIL_SERVER_PASSWORD,
//         },
//       },
//       from: process.env.EMAIL_FROM,
//     }),
//   ],
//   pages: {
//     verifyRequest: "/verify",
//   },
//   callbacks: {
//     async redirect({ url, baseUrl }) {
//       // Always send to dashboard after login
//       return `${baseUrl}/dashboard`;
//     },
//   },
// });


// auth.ts
import NextAuth from "next-auth";
import Email from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/utils/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  
  // ✅ Vercel settings
  trustHost: true,
  useSecureCookies: true,
  
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
  },
  
  providers: [
    Email({
      server: {
        host: "smtp.resend.com",
        port: 465,
        secure: true,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY!,
        },
      },
      from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
      
      // ✅ Custom email template
      async sendVerificationRequest({
        identifier: email,
        url,
        provider: { from },
        theme,
      }) {
        const { host } = new URL(url);
        
        const { data, error } = await resend.emails.send({
          from: from || "onboarding@resend.dev",
          to: email,
          subject: `Sign in to ${host}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
            </head>
            <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f4f4f4;">
              <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h1 style="color: #667eea; margin-top: 0;">Sign in to Invoice Platform</h1>
                
                <p style="color: #666; font-size: 16px; line-height: 1.6;">
                  Click the button below to sign in to your account. This link will expire in 24 hours.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${url}" 
                     style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 15px 40px;
                            text-decoration: none;
                            border-radius: 8px;
                            display: inline-block;
                            font-weight: bold;
                            font-size: 16px;">
                    Sign In
                  </a>
                </div>
                
                <p style="color: #999; font-size: 14px;">
                  Or copy this link:<br/>
                  <a href="${url}" style="color: #667eea; word-break: break-all;">${url}</a>
                </p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                
                <p style="color: #999; font-size: 12px; margin: 0;">
                  If you didn't request this email, you can safely ignore it.
                </p>
              </div>
            </body>
            </html>
          `,
        });
        
        if (error) {
          throw new Error(`Failed to send verification email: ${error.message}`);
        }
      },
    }),
  ],
  
  pages: {
    signIn: "/login",
    verifyRequest: "/verify",
    error: "/auth/error",
  },
  
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },
  
  debug: process.env.NODE_ENV === "development",
});
