/** @type {import('next').NextConfig} */

require('dotenv').config();
const webpack = require('webpack');

// ✅ Filtra automáticamente todas las variables NEXT_PUBLIC_
const getNextPublicEnvVars = () => {
  return Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_'));
};

const nextConfig = {
  webpack: config => {
    config.plugins.push(new webpack.EnvironmentPlugin(getNextPublicEnvVars()));
    return config;
  },
  reactStrictMode: false,
  compiler: {
    removeConsole:
      process.env.NEXT_PUBLIC_ENVIRONMENT?.toUpperCase() !== 'DEV' &&
      process.env.NEXT_PUBLIC_ENVIRONMENT?.toUpperCase() !== 'CERT',
  },
  // Sin basePath (DEC-001B, resuelve D-02 de preparacion-tecnica-visual.md):
  // el arquetipo traia '/seguridad' heredado de otro microfrontend; el plan
  // de DecPat define rutas sin prefijo (/, /inicio, /mi-declaracion/[paso]).
  // Si el despliegue real necesita un prefijo, se define aqui cuando se
  // conozca — no se inventa uno ahora.
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
