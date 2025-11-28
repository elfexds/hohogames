#!/usr/bin/env node
/**
 * Keep-alive wrapper for HoHo Games static server on port 8000.
 * Automatically restarts if it crashes.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8000;
let serverProcess;
let restartCount = 0;
const maxRestarts = 10;
const restartWindow = 60000; // 1 minute

function startServer() {
	console.log(`[keep-alive-8000] Starting HoHo Games server on port ${PORT}...`);
	
	serverProcess = spawn('python3', ['-m', 'http.server', PORT.toString()], {
		cwd: __dirname,
		stdio: 'inherit',
	});

	serverProcess.on('error', (err) => {
		console.error(`[keep-alive-8000] Server spawn error:`, err);
	});

	serverProcess.on('exit', (code, signal) => {
		console.log(`[keep-alive-8000] Server exited with code ${code}, signal ${signal}`);
		restartCount++;
		
		if (restartCount > maxRestarts) {
			console.error(`[keep-alive-8000] Too many restarts (${restartCount}). Giving up.`);
			process.exit(1);
		}

		const delay = Math.min(1000 * restartCount, 10000);
		console.log(`[keep-alive-8000] Restarting in ${delay}ms (attempt ${restartCount}/${maxRestarts})`);
		setTimeout(startServer, delay);
	});
}

// Reset restart count after the window passes
setInterval(() => {
	if (restartCount > 0) {
		console.log(`[keep-alive-8000] Resetting restart counter`);
		restartCount = 0;
	}
}, restartWindow);

// Handle signals
process.on('SIGINT', () => {
	console.log('\n[keep-alive-8000] Received SIGINT, shutting down gracefully...');
	if (serverProcess) {
		serverProcess.kill('SIGTERM');
	}
	process.exit(0);
});

process.on('SIGTERM', () => {
	console.log('[keep-alive-8000] Received SIGTERM, shutting down gracefully...');
	if (serverProcess) {
		serverProcess.kill('SIGTERM');
	}
	process.exit(0);
});

console.log(`[keep-alive-8000] Starting HoHo Games keep-alive wrapper on port ${PORT}`);
startServer();
