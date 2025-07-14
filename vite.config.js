import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default ({ mode }) => {
  // טען את קובצי env מתיקיית האב (root)
  const env = loadEnv(mode, path.resolve(__dirname, "."), "");

  return defineConfig({
    root: "./client",
    plugins: [react()],
    define: {
      // העבר את משתני הסביבה לVite (לשימוש בקוד הלקוח)
      "process.env": env,
      "import.meta.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL),
    },
  });
};
