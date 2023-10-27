/** @type {import('next').NextConfig} */
// error Error: Invalid src prop (https://files.edgestore.dev/s022ux7wppj6zc6j/publicFiles/_public/6793980d-9aef-46be-a1e9-4ce9e13a6f42.jpg) on `next/image`, hostname "files.edgestore.dev" is not configured under images in your `next.config.js`
// See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
      },
    ],
  },
};
