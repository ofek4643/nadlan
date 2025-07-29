import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default ({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, "."), "");

  return defineConfig({
    root: "./client",
    plugins: [react()],
    server: {
      proxy: {
        "/api" : {
          target: "http://localhost:5000",
          // target: "https://nadlan-lxn4.onrender.com"
        }
      }
    },
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL),
    },
  });
};
