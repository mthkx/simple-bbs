// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  srcDir: "src/",
  nitro: {
    preset: "aws-lambda",
    esbuild: {
      options: {
        target: "esnext",
      },
    },
  },
  vite: {
    build: {
      target: "esnext",
    },
  },
});
