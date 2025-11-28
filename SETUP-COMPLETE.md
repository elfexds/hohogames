# 🎮 HoHo Games - Setup Completo

## ✅ Estado Actual

### Servidor
- **Puerto**: 8000
- **Status**: ✅ Running 24/7
- **Keep-alive**: ✅ Enabled (reinicia automáticamente)
- **Visibilidad**: 🌐 Public (0.0.0.0)

### Archivos creados
- `keep-alive-public-8000.js` - Servidor persistente
- `nginx.conf` - Configuración reverse proxy HTTPS
- `setup-https.sh` - Script instalación SSL
- `setup-codespaces.js` - Configuración Codespaces

---

## 🌐 Acceso a tu Servidor

### Opción 1: URL de Codespaces (RECOMENDADO)
GitHub Codespaces genera automáticamente una URL pública:

```
https://<codespace-name>-8000.app.github.dev
```

- Ve a tu pestaña "Ports" en Codespaces
- Haz clic en el puerto 8000
- Copia la URL pública generada

### Opción 2: Dominio Personalizado (hohogames.com)
Si deseas usar tu propio dominio:

1. **Apunta el dominio a tu IP**
   ```
   A record: hohogames.com → YOUR_IP
   ```

2. **Ejecuta el setup HTTPS**
   ```bash
   chmod +x setup-https.sh
   ./setup-https.sh
   ```

3. **Obtén certificado SSL**
   ```bash
   sudo certbot --nginx -d hohogames.com
   ```

---

## 🎮 Accesos Rápidos

### Vía Codespaces
- **Inicio**: `https://<codespace>.app.github.dev`
- **Tag**: `https://<codespace>.app.github.dev/games/Tag.html`
- **Eaglercraft**: `https://<codespace>.app.github.dev/games/eaglercraft.html`
- **Bad Parenting**: `https://<codespace>.app.github.dev/games/badparenting/`
- **Bunny Ada**: `https://<codespace>.app.github.dev/games/bunny-ada/`
- **Scramjet**: `https://<codespace>.app.github.dev/games/scramjet/`

### Vía Dominio Personalizado
- **Inicio**: `https://hohogames.com`
- **Tag**: `https://hohogames.com/games/Tag.html`
- etc...

---

## 🔧 Comandos Útiles

### Ver estado del servidor
```bash
ps aux | grep "keep-alive\|python"
netstat -tlnp | grep 8000
```

### Ver logs del servidor
```bash
# Buscar el proceso
ps aux | grep keep-alive
# Ver los logs
tail -f /var/log/hohogames.log
```

### Reiniciar servidor manualmente
```bash
pkill -f "keep-alive-public"
node keep-alive-public-8000.js &
```

### Instalar Nginx (si deseas HTTPS)
```bash
sudo apt-get update
sudo apt-get install -y nginx certbot python3-certbot-nginx
```

---

## 📊 Arquitectura

```
Opción 1: Codespaces (Simple)
┌─────────────────────────────────┐
│ GitHub Codespaces Public URL    │
│ https://<name>-8000.app.github.dev
└────────────────┬────────────────┘
                 │
         ┌───────▼────────┐
         │ Keep-alive     │
         │ (port 8000)    │
         └────────────────┘

Opción 2: Dominio Personalizado (Avanzado)
┌──────────────────────────┐
│ hohogames.com (HTTPS)    │
└────────┬─────────────────┘
         │
    ┌────▼──────────────┐
    │ Nginx Reverse     │
    │ Proxy (443)       │
    └────┬──────────────┘
         │ http:8000
    ┌────▼──────────────┐
    │ Keep-alive        │
    │ Python HTTP       │
    └───────────────────┘
```

---

## ✨ Resumen

✅ Servidor running 24/7  
✅ URL pública vía Codespaces  
✅ Configuración HTTPS lista (opcional)  
✅ Keep-alive con reinicio automático  
✅ Todos los juegos accesibles  

**Próximo paso**: Ve a Codespaces > Pestaña "Ports" > Copia URL puerto 8000

---

## 📞 Soporte

- **Servidor no responde**: Verifica `ps aux | grep keep-alive`
- **Quieres HTTPS propio**: Ejecuta `./setup-https.sh`
- **Problemas de acceso**: Asegúrate que Codespaces tenga puerto 8000 público
