import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publishableKey: "pk_test_dXNhYmxlLWRyYWdvbi05Mi5jbGVyay5hY2NvdW50cy5kZXYk",
  secretKey: "sk_test_XTdLPPC0IdNid7TSndCTQ9x8hPxVPIFaRVZnyplDnP"
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
