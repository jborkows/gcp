module.exports = {
  distDir: '../.next',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    if( process.env.NEXT_PUBLIC_MODE == 'production'){
      return []
    }
    
    return [
      {
        source: "/helloworld",
        destination: `http://localhost:${process.env.RECIPES_PORT}`,
      },

      {
        source: "/hello",
        destination: 'http://localhost:8080/',
      },
    ]
  },
}
