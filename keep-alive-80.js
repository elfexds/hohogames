#!/usr/bin/env node
/**
 * Keep-alive wrapper for HoHo Games public server on port 80.
 * Automatically restarts if it crashes. Listens on all interfaces (0.0.0.0).
 * Persistent 24/7 with infinite restart attempts.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 80;
let serverProcess;
let restartCount = 0;

function startServer() {
	const timestamp = new Date().toISOString();
	console.log(`[${timestamp}] [keep-alive-public] Starting HoHo Games server on 0.0.0.0:${PORT}...`);
	
	serverProcess = spawn('python3', ['-m', 'http.server', '--bind', '0.0.0.0', PORT.toString()], {
		cwd: __dirname,
		stdio: 'inherit',
	});

	serverProcess.on('error', (err) => {
		const timestamp = new Date().toISOString();
		console.error(`[${timestamp}] [keep-alive-public] Server spawn error:`, err);
	});

	serverProcess.on('exit', (code, signal) => {
		const timestamp = new Date().toISOString();
		console.log(`[${timestamp}] [keep-alive-public] Server exited with code ${code}, signal ${signal}`);
		restartCount++;
		
		const delay = Math.min(1000 * restartCount, 10000);
		console.log(`[${timestamp}] [keep-alive-public] Restarting in ${delay}ms (attempt ${restartCount})`);
		setTimeout(startServer, delay);
	});
}

// Reset restart count every 60 seconds (keeps count from growing too much)
setInterval(() => {
	if (restartCount > 0) {
		const timestamp = new Date().toISOString();
		console.log(`[${timestamp}] [keep-alive-public] Resetting restart counter from ${restartCount}`);
		restartCount = 0;
	}
}, 60000);

// Handle signals gracefully
process.on('SIGINT', () => {
	const timestamp = new Date().toISOString();
	console.log(`\n[${timestamp}] [keep-alive-public] Received SIGINT, shutting down gracefully...`);
	if (serverProcess) {
		serverProcess.kill('SIGTERM');
	}
	process.exit(0);
});

process.on('SIGTERM', () => {
	const timestamp = new Date().toISOString();
	console.log(`[${timestamp}] [keep-alive-public] Received SIGTERM, shutting down gracefully...`);
	if (serverProcess) {
		serverProcess.kill('SIGTERM');
	}
	process.exit(0);
});

const timestamp = new Date().toISOString();
console.log(`[${timestamp}] [keep-alive-public] Starting HoHo Games public keep-alive wrapper on port ${PORT}`);
console.log(`[${timestamp}] [keep-alive-public] Server will be accessible at: http://0.0.0.0:${PORT}`);
startServer();
