/** @type {import('astro').AstroUserConfig} */
export default {
  output: 'static',
  site: 'https://spaghettisans.github.io',
  base: '/game-programmer-portfolio',
  devToolbar: { enabled: false },
  vite: { plugins: [{ name: 'static-portfolio-no-prebundle', configResolved(config) { config.optimizeDeps.include = []; config.optimizeDeps.noDiscovery = true; } }] }
};
