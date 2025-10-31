import NextAuth from "next-auth";
import Email from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/utils/db";
import { Resend } from "resend";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not set");
}

if (!process.env.NEXTAUTH_URL) {
  throw new Error("NEXTAUTH_URL is not set");
}

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  
  
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === "production",
  basePath: "/api/auth",
  
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  
  providers: [
    Email({
      server: {
        host: "smtp.resend.com",
        port: 465,
        secure: true,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY,
        },
      },
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      maxAge: 24 * 60 * 60,
      
      async sendVerificationRequest({
        identifier: email,
        url,
        provider: { from },
      }) {
        try {
          const { host } = new URL(url);
          
          console.log("📧 Sending email to:", email);
          console.log("🔗 Link:", url);
          
          const { error } = await resend.emails.send({
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
                <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px;">
                  <h1 style="color: #667eea; margin-top: 0;">Sign in to Invoice Platform</h1>
                  
                  <p style="color: #666; font-size: 16px; line-height: 1.6;">
                    Click below to sign in. This link expires in 24 hours.
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
                  
                  <p style="color: #999; font-size: 12px;">
                    If you didn't request this, ignore this email.
                  </p>
                </div>
              </body>
              </html>
            `,
          });
          
          if (error) {
            console.error("❌ Resend error:", error);
            throw new Error(`Resend error: ${error.message}`);
          }
          
          console.log("✅ Email sent");
        } catch (error) {
          console.error("❌ Failed:", error);
          throw error;
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

