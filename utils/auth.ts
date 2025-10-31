import NextAuth from "next-auth";
import Email from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/utils/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === "production",
  basePath: "/api/auth",
  
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
          pass: process.env.RESEND_API_KEY || "",
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
          
          console.log("📧 Email sent to:", email);
          console.log("🔗 Callback URL:", url);
          
          const { error } = await resend.emails.send({
            from: from || "onboarding@resend.dev",
            to: email,
            subject: `Sign in to ${host}`,
            html: `
              <!DOCTYPE html>
              <html>
              <body style="font-family: Arial; margin: 0; padding: 20px; background: #f4f4f4;">
                <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px;">
                  <h1 style="color: #667eea;">Sign in to Invoice Platform</h1>
                  
                  <p style="color: #666; font-size: 16px;">
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
                  
                  <p style="color: #999; font-size: 14px;">
                    Or copy and paste this link:<br/>
                    <code style="word-break: break-all; font-size: 12px;">
                      ${url}
                    </code>
                  </p>
                  
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                  
                  <p style="color: #999; font-size: 12px;">
                    If you didn't request this, ignore this email.
                  </p>
                </div>
              </body>
              </html>
            `,
          });
          
          if (error) {
            throw new Error(`Resend: ${error.message}`);
          }
          
          console.log("✅ Email sent successfully");
        } catch (error) {
          console.error("❌ Email failed:", error);
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
    // ✅ Redirect to dashboard after verification
    async redirect({ url, baseUrl }) {
      console.log("🔄 Redirect callback:", { url, baseUrl });
      
      // If url starts with /, it's an internal path - allow it
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      
      // If it's same origin, allow it
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      
      // ✅ Default: always go to dashboard after login
      return `${baseUrl}/dashboard`;
    },
    
    async signIn({ user, account, email, profile }) {
      console.log("✅ Sign in successful for:", user?.email);
      return true;
    },
    
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  
  events: {
    async signIn({ user }) {
      console.log("👤 User signed in:", user?.email);
    },
  },
  
  debug: true,
});

