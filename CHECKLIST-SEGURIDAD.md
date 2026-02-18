# ✅ CHECKLIST PRE-COMMIT - Seguridad

Antes de subir tu proyecto a GitHub, **verifica PUNTO POR PUNTO**:

## 🔒 1. Variables de Entorno

- [ ] `.env` está en `.gitignore`
- [ ] `.env.example` existe y **NO** contiene datos reales
- [ ] `.env.example` tiene placeholders: `your_password_here`
- [ ] `docker-compose.yml` usa variables: `${POSTGRES_PASSWORD}`
- [ ] `application.yml` usa variables: `${DB_PASSWORD:changeme}`

### Verificar:
```bash
git status
# ❌ Si aparece ".env" → git rm --cached .env
# ✅ Si NO aparece ".env" → OK
```

---

## 🗄️ 2. Base de Datos

- [ ] No hay conexiones hardcodeadas en código
- [ ] Scripts SQL (`init.sql`) no contienen INSERT de datos sensibles
- [ ] No hay dumps de BD (.sql con datos reales)

---

## 🔐 3. Keycloak

- [ ] `app-realm.json` no contiene usuarios reales
- [ ] Verificar: `"users": []` debe estar vacío
- [ ] No hay credenciales de clientes privados (client_secret)
- [ ] Solo hay configuración de roles y clientes públicos

### Verificar:
```bash
cat keycloak/app-realm.json | grep "users"
# Debe mostrar: "users": []
```

---

## 📮 4. Postman

- [ ] Solo se sube `*.postman_collection.json`
- [ ] **NO** se sube `*.postman_environment.json`
- [ ] La colección no contiene tokens en Authorization

### Verificar:
```bash
ls postman/
# ✅ Debe haber: ProyectoRopa.postman_collection.json
# ❌ NO debe haber: *.postman_environment.json
```

---

## 📁 5. Build Outputs

- [ ] `**/target/` en `.gitignore`
- [ ] `*.jar` en `.gitignore`
- [ ] No hay carpetas `node_modules/` (si usas frontend)

### Verificar:
```bash
git status
# ❌ Si aparece "target/" o "*.jar" → Mal configurado
# ✅ Si NO aparecen → OK
```

---

## 🐳 6. Docker

- [ ] `docker-compose.yml` usa variables de entorno
- [ ] No hay contraseñas hardcodeadas (excepto defaults con `:-`)
- [ ] Los volúmenes de datos NO se suben (solo definiciones)

---

## 📝 7. Código Fuente

- [ ] No hay `System.out.println("PASSWORD: " + password)`
- [ ] No hay API keys hardcodeadas
- [ ] No hay TODOs con información sensible
- [ ] No hay comentarios con credenciales

### Buscar:
```bash
grep -r "password.*=" --include="*.java" --exclude-dir=target
grep -r "api.*key" --include="*.java" --exclude-dir=target
# No debería mostrar contraseñas reales
```

---

## 🌐 8. URLs

- [ ] No hay URLs de producción en código
- [ ] Solo URLs de desarrollo (localhost, nombres de Docker)

---

## 📖 9. README

- [ ] Tiene instrucciones de instalación
- [ ] Menciona `.env.example`
- [ ] Indica cómo obtener credenciales (sin darlas)
- [ ] Tiene arquitectura/diagrama

---

## 🚨 10. Historial de Git

- [ ] Si ya hiciste commits con `.env`, borrarlo del historial:

```bash
# ⚠️ PELIGRO: Reescribe historial
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

git push origin main --force
```

---

## ✅ VERIFICACIÓN FINAL

```bash
# 1. Ver qué se va a subir
git status

# 2. Ver diferencias
git diff

# 3. Ver archivos trackeados
git ls-files

# 4. Buscar ".env" en archivos trackeados
git ls-files | grep ".env"
# ✅ Solo debe mostrar: .env.example
# ❌ Si muestra ".env" → ERROR

# 5. Verificar .gitignore
cat .gitignore | grep -E "\.env|target|\.jar"
```

---

## 🎯 COMANDO SEGURO PARA COMMIT

```bash
# 1. Agregar archivos (respeta .gitignore)
git add .

# 2. Verificar QUÉ se agregó
git status

# 3. Si todo está OK
git commit -m "feat: Backend con Spring Boot, microservicios y OAuth2"

# 4. Push
git push origin main
```

---

## 🆘 SI YA SUBISTE DATOS SENSIBLES

### Opción 1: BFG Repo-Cleaner (más seguro)

```bash
# Instalar BFG
# Windows: choco install bfg
# Mac: brew install bfg

# Limpiar .env del historial
bfg --delete-files .env

# Limpiar contraseñas del historial
bfg --replace-text passwords.txt

# Forzar push
git push origin main --force
```

### Opción 2: Revertir todo

```bash
# Si es un repo nuevo, mejor borrarlo y empezar de cero
rm -rf .git
git init
# Configurar .gitignore ANTES de hacer commit
git add .
git commit -m "Initial commit (sin datos sensibles)"
```

---

## 📞 CONTACTOS DE EMERGENCIA

Si subiste credenciales de producción:

1. **Cambiar TODAS las contraseñas INMEDIATAMENTE**
2. Revocar tokens de APIs
3. Rotar secrets de Keycloak
4. Notificar al equipo

**GitHub NO permite borrar el historial completamente. Siempre queda en caché.**

---

## ✅ ESTÁ LISTO SI:

- [ ] `git status` NO muestra `.env`
- [ ] `git ls-files | grep "\.env$"` NO devuelve resultados
- [ ] `.env.example` tiene placeholders
- [ ] `keycloak/app-realm.json` tiene `"users": []`
- [ ] No hay `*.postman_environment.json`
- [ ] No hay `target/` ni `*.jar` en git status

**Si todas las casillas están marcadas → PODES SUBIR SEGURO** ✅
