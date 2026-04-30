# Agente: Acustega AI

Eres el agente experto del proyecto Acustega AI, la primera plataforma de consultoria acustica potenciada por inteligencia artificial en Latinoamerica.

## Proyecto

- Nombre: Acustega AI
- Dominio: acustega.com
- Repo: github.com/acustegayuxta/acustega
- Stack: Next.js (App Router), Tailwind CSS, Supabase (proyecto qlqrnrprtmvazulittwm), Vercel
- Carpeta local: ~/Desktop/acustega-app
- API de IA: Anthropic (Claude) via @anthropic-ai/sdk
- Editor: Cursor en Mac

## Identidad visual

- Fondo principal: #0D1117
- Cian acento: #00D4FF
- Ambar/dorado: #F59E0B
- Purpura: #8B5CF6
- Texto claro: #E5E7EB
- Logo: anillos concentricos animados con CSS keyframes

## Estructura de la app

- app/page.tsx — landing principal (actualmente redirige a lista de espera)
- app/asesor/page.tsx — chat con IA, 7 tipos de espacio (estudio de grabacion, home studio, iglesia/auditorio, restaurante/bar, sonido en vivo, oficina, instalacion industrial)
- app/api/asesor/route.ts — API route que conecta con Anthropic, contiene el system prompt completo
- app/reporte/page.tsx — generacion de reporte PDF con opciones de pago
- app/api/prompt-diseno/route.ts — genera prompt de diseno visual para Midjourney/DALL-E
- app/admin/ — panel admin protegido con password (variable ADMIN_PASSWORD), contiene cotizador y cuestionario de cliente

## Productos y precios

1. Reporte PDF acustico: $9.99 USD / $39.900 COP
2. Bundle Reporte + Prompt de diseno: $13.99 USD
3. Prompt de diseno acustico (upsell post-descarga): $4.99 USD

## Pasarelas de pago (geo-routing)

- Colombia: Wompi (tope actual $500.000 COP por zona de riesgo)
- Internacional: Stripe (reemplaza a Paddle que no aprobo el dominio)
- Deteccion de pais via fetch a https://ipapi.co/json/ campo country_code
- Si country_code === "CO" muestra Wompi, si no muestra Stripe

## System prompt del asesor

El asesor habla como un equipo de profesionales acusticos con 20 anios de experiencia (NO menciona a JJ Tellez por nombre). Usa tuteo, maximo 4 parrafos cortos, responde en el idioma del usuario. Flujo de diagnostico: pregunta una o dos cosas por turno, recopila dimensiones, materiales, pais/ciudad, problema principal, presupuesto. Reglas tecnicas: nunca recomendar espuma de huevo para aislamiento, aislamiento requiere masa + desacople + sellado, tratamiento requiere absorcion + difusion. Materiales por pais: Colombia (Rockwool en Homecenter, Gyplac, silicona), Venezuela (EPA, Makro), Mexico (Rockwool, Home Depot). Al final del diagnostico ofrece reporte a $9.99.

## Flujo del usuario

1. Entra a acustega.com → ve landing
2. Va a /asesor → selecciona tipo de espacio → chat con IA
3. IA hace diagnostico gratuito (pre-diagnostico conversacional)
4. Ofrece reporte completo → va a /reporte
5. Geo-routing detecta pais → muestra Wompi o Stripe
6. Pago del reporte ($9.99) o bundle ($13.99)
7. Si pago bundle: cuestionario de 8 preguntas cortas → genera prompt de diseno
8. Si solo reporte: post-descarga aparece upsell del prompt a $4.99

## Variables de entorno necesarias

- ANTHROPIC_API_KEY — clave de API de Anthropic
- ADMIN_PASSWORD — password del panel admin (acustega2026)
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY — Stripe publishable
- STRIPE_SECRET_KEY — Stripe secret
- NEXT_PUBLIC_STRIPE_PRICE_REPORT_ID — price ID del reporte $9.99
- NEXT_PUBLIC_STRIPE_PRICE_BUNDLE_ID — price ID del bundle $13.99
- NEXT_PUBLIC_STRIPE_PRICE_PROMPT_ID — price ID del prompt $4.99
- WOMPI_PUBLIC_KEY — llave publica de Wompi
- WOMPI_PRIVATE_KEY — llave privada de Wompi
- NEXT_PUBLIC_SUPABASE_URL — URL de Supabase
- NEXT_PUBLIC_SUPABASE_ANON_KEY — clave anonima de Supabase

## Reglas para el agente

- Siempre usa espaniol neutro para codigo y contenido visible al usuario
- No modifiques el system prompt del asesor sin confirmacion explicita
- No expongas API keys en el codigo ni en commits
- El admin siempre debe estar protegido con password
- Cualquier cambio en pasarela de pago requiere probar en local primero
- Al hacer deploy: git add . && git commit -m "descripcion" && git push origin main
- Vercel hace deploy automatico al push

## Pendientes prioritarios

- Integrar Stripe reemplazando Paddle en /reporte para pagos internacionales
- Cuestionario completo de 28 preguntas en /admin para reuniones con clientes
- Quitar la pagina de lista de espera y mostrar la landing real con acceso al asesor
- Casos de estudio que alimenten el prompt del asesor (Maluma, Yatra, Karol G, Feid, The Rude Boyz)
