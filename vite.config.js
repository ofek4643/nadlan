import { defineConfig} from "vite";
import react from "@vitejs/plugin-react";

export default () => {
  return defineConfig({
    root: "./client",
    plugins: [react()],
    server: {
      proxy: {
        "/api" : {
          target: "https://nadlan-lxn4.onrender.com",
          changeOrigin: true
        }
      }
    },
  });
};
