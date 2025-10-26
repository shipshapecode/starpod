import { Checkout } from "@polar-sh/astro";

export const prerender = false;

export const GET = Checkout({
  accessToken: import.meta.env.POLAR_ACCESS_TOKEN,
  successUrl: import.meta.env.POLAR_SUCCESS_URL || 'https://whiskey.fm/sponsor/success',
  // Use sandbox for testing, production for live
  server: import.meta.env.PUBLIC_POLAR_SERVER || "production",
});
