import withAuth from "next-auth/middleware"

export default withAuth

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/customers/:path*",
    "/quotations/:path*",
    "/invoices/:path*",
    "/settings/:path*",
  ],
}