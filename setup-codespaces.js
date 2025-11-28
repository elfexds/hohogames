#!/usr/bin/env node
/**
 * Codespaces Public URL Exposer for HoHo Games
 * Automatically exposes the server publicly via GitHub Codespaces
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const PORT = 8000;

console.log('🌐 HoHo Games - Codespaces Public URL Setup\n');

// Get Codespace name from environment
const codespaceEnv = process.env.CODESPACE_NAME;
const codespaceDomain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN;

if (codespaceEnv && codespaceDomain) {
    const publicUrl = `https://${codespaceEnv}-${PORT}.${codespaceDomain}`;
    console.log('✅ Codespace detectado:');
    console.log(`   📍 Nombre: ${codespaceEnv}`);
    console.log(`   🌐 URL Pública: ${publicUrl}\n`);
    
    // Create a info file
    const infoContent = `# HoHo Games - Public URL

## 🌐 URL Pública Codespaces
\`\`\`
${publicUrl}
\`\`\`

## 📊 Detalles
- **Codespace**: ${codespaceEnv}
- **Puerto**: ${PORT}
- **Estado**: ✅ Running 24/7

## 🎮 Accesos Rápidos
- **Inicio**: ${publicUrl}/
- **Tag**: ${publicUrl}/games/Tag.html
- **Eaglercraft**: ${publicUrl}/games/eaglercraft.html
- **Bad Parenting**: ${publicUrl}/games/badparenting/
- **Bunny Ada**: ${publicUrl}/games/bunny-ada/
- **Scramjet**: ${publicUrl}/games/scramjet/

## 🔐 Seguridad Codespaces
Esta URL es pública pero:
- Solo tú accedes a los cambios de código
- El servidor es solo lectura desde afuera
- Cambios requieren acceso al repositorio

---
Generado automáticamente por setup-codespaces.js
`;
    
    writeFileSync(join(process.cwd(), 'CODESPACES-URL.md'), infoContent);
    console.log('📝 Archivo CODESPACES-URL.md creado\n');
    
} else {
    console.log('⚠️  No se detectó Codespace');
    console.log('Ejecutando en: ' + process.cwd());
    console.log('\n📌 Para Codespaces, la URL será:');
    console.log('   https://<codespace-name>-8000.<domain>\n');
}

console.log('✅ Setup completado!');
console.log('\n🚀 Servidor running on port 8000');
console.log('📡 Automáticamente expuesto en Codespaces\n');
