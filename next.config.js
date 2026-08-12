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
  basePath: '/seguridad',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
