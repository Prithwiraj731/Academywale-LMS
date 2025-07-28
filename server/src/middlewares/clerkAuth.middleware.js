const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const requireAuth = ClerkExpressRequireAuth({
  apiKey: process.env.CLERK_API_KEY,
  apiUrl: 'https://api.clerk.com',
  jwksUrl: 'https://clerk.academywale.com/.well-known/jwks.json',
  // Optionally, you can add other config options here
});

module.exports = requireAuth;
