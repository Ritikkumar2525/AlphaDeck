import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: ["@langchain/core", "@langchain/google-genai", "@langchain/langgraph"],
};

export default nextConfig;
