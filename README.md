# 🏎️ descalifica2-front 🏎️

# Trabajo Práctico para la cátedra Desarollo de Software en UTN FRRo

## 👥Integrantes

- 52818 - Barroso Bollero, Agustín
- 52962 - Taborda, Ignacio
- 52961 - Figueroa, Francisco Alejandro
- 52847 - Taborda, Santiago

**Cursado en:** ISI 303 2025.

## 📝 Descripción

Descalifica2 es un sitio web dedicado principalmente a la Fórmula 1, donde podrás consultar el calendario de carreras, acceder a información detallada sobre cada evento y mantenerte al día con las noticias sobre automovilismo. El objetivo del sitio es mantener informada a toda la comunidad interesada en el deporte, brindando las fechas de cada Gran Premio, dónde verlo en vivo, y datos sobre las escuderías participantes junto a sus pilotos, como los resultados de las carreras o el torneo. Los usuarios pueden crear un perfil personalizado, indicando su nombre, escuderías, circuitos y pilotos favoritos para adaptar su experiencia en la plataforma. Además, podrán participar en un foro donde intercambiar opiniones, debatir y compartir ideas con otros fanáticos de la Fórmula 1\.

## Instrucciones de instalación

1. **Usar la versión de node del proyecto:**

   ```bash
   fnm use --install-if-missing
   ```

2. **Variables de Entorno:**
   Crea un archivo `.env` con:

   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_GOOGLE_KEY=
   ```

   `VITE_GOOGLE_KEY` es el mismo ID de cliente usado en `GOOGLE_KEY` del backend.

3. **Instalar dependencias:**

   ```bash
   pnpm install
   ```

4. **Ejecutar el proyecto en desarrollo:**

   ```bash
   pnpm dev
   ```

   La app queda disponible en `http://localhost:5173`.

## ℹ️ Más información del proyecto

- Toda la documentación técnica y de instalación se encuentra en el proyecto principal [ Documentación del Proyecto ](https://github.com/GupCus/tpDSW/)
- **Nuestro proposal:** [tp/proposal.md](https://github.com/GupCus/tpDSW/blob/main/proposal.md)
- 🛠️ **Tecnologías:** React 18, TypeScript, Vite, Tailwind CSS 4, shadcn/ui (Radix), Axios, Google OAuth y Lucide (íconos).
- **Repo back:** [descalifica2-back](https://github.com/GupCus/descalifica2-back)
