export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/customers/:path*",
    "/quotations/:path*",
    "/invoices/:path*",
    "/settings/:path*",
  ],
}