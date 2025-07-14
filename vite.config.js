import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default ({ mode }) => {
  // טען את משתני הסביבה מהשורש
  const env = loadEnv(mode, path.resolve(__dirname, "."), "");

  return defineConfig({
    root: "./client",
    plugins: [react()],
    define: {
      // העבר רק את משתנה הסביבה שאתה צריך
      "import.meta.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL),
    },
  });
};
