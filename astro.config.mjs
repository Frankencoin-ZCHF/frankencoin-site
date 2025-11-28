// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
	site: process.env.SITE || 'https://frankencoin.com',

	server: {
		port: parseInt(process.env.SITE || '3000'),
		host: true,
		allowedHosts: ['frankencoin.com', 'dev.frankencoin.com'],
	},

	integrations: [sitemap()],

	vite: {
		plugins: [tailwindcss()],
	},

	adapter: node({
		mode: 'standalone',
	}),
});
