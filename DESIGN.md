# Happly — Sistema de diseño

Documento de referencia del diseño de la app **Happly – Conozcámonos**: tokens visuales, componentes, pantallas, animaciones y las decisiones que hay detrás. Todo lo descrito aquí está extraído del código actual (`src/`), no de un archivo de diseño externo.

---

## 1. Stack y fundamentos técnicos

| Capa | Herramienta | Notas |
|---|---|---|
| UI | React 19 + TypeScript | Componentes funcionales, sin librería de UI externa |
| Estilos | Tailwind CSS v4 (`@tailwindcss/vite`) | Utilidades inline sobre tokens `@theme` (`bg-brand`, `shadow-cta`…) |
| CSS global | [src/index.css](src/index.css) | Fondo degradado, radios/checkboxes personalizados, scrollbars |
| Animación | `motion` (Framer Motion v12) | Transiciones entre pasos, acordeones, toasts, indicador de tab, secuencia de la pantalla de progreso |
| 3D | `three` (Three.js 0.186) | Solo la copa que gira en la pantalla de felicitaciones ([ui/Trophy3D.tsx](src/components/ui/Trophy3D.tsx)); se descarga bajo demanda (`React.lazy`) |
| Sonido | Web Audio API | Efectos sintetizados en [src/lib/sfx.ts](src/lib/sfx.ts), sin archivos de audio |
| Iconos | `lucide-react` + SVG propios | Stroke 1.5–2.5 según jerarquía; medallas, copas y candados son SVG sólidos propios (§9) |
| Tipografía | Plus Jakarta Sans (Google Fonts) | Pesos 400/500/600/700/800 + itálica 400, cargada en [index.html](index.html) (el 800 se usa en las cifras de la pantalla de progreso) |
| Estado | Hook `useGamification` en `App` | Programa, puntos, racha, medallas y copa **en memoria** (sin backend ni persistencia; se reinicia al recargar) |
| Build | Vite 6, puerto 3000 | |

**Decisión:** los tokens viven en un bloque `@theme` en [src/index.css](src/index.css) (Tailwind v4). Cada color/sombra de este documento existe como utilidad (`bg-brand`, `text-gray-800`, `shadow-cta`, `border-brand/25`…). No hay `[#hex]` arbitrarios en los componentes; los únicos hex en TSX son los que van a JS (gradiente SVG del gauge, colores de la copa 3D, bordes de las medallas del ranking, keyframes de `motion`).

---

## 2. Principios de diseño

1. **Mobile‑first, con reflow en desktop.** Home vive en `max-w-md`/`max-w-lg` hasta `lg`; desde 1024 px pasa a `lg:max-w-5xl xl:max-w-6xl` con dos columnas: tarjeta de perfil fija a la izquierda (`360px`, `sticky top-6`) y tabs + contenido a la derecha; en Inicio las tarjetas de actividad e intención van lado a lado y felicidad/evolución ocupan las dos columnas. El cuestionario ensancha a `md:max-w-2xl → lg:3xl → xl:4xl` y desde `md` reordena: reglas en 2 tarjetas en fila con Sí/No a la izquierda y CTA a la derecha; intro de Fase 2 con ilustración a la izquierda y texto a la derecha; resultados con las 3 dimensiones en fila. El fondo del cuestionario es `.bg-form` (halos celeste/lavanda sobre base neutra con degradado a blanco); resultados va sobre blanco.
2. **Suave y cálido, no clínico.** Fondo lavanda muy claro con degradado, bordes redondeados grandes (16–28 px), sombras difusas de baja opacidad, sin líneas duras.
3. **Un solo color de marca.** El morado `#8774E1` hace todo el trabajo de acento: botones primarios, progreso, selección, links, tabs activas. Los demás colores son semánticos (éxito, error, pendiente) o neutros.
4. **Tarjetas blancas sobre fondo tintado.** Las superficies se separan del fondo por contraste blanco/lavanda, no por bordes marcados.
5. **Sin bordes en formularios.** Inputs y opciones de radio son bloques `gray-50` sin borde (destacan sobre el fondo blanco); el estado seleccionado se comunica con relleno lavanda + texto morado, y el foco con un anillo morado translúcido.
6. **Targets táctiles ≥ 56 px y sin saltos en móvil.** Toda opción de radio/checkbox y todo input tiene `min-h-[56px]` (reforzado globalmente en CSS con `:has()`). Los campos de texto usan **16 px** de fuente en todos los tamaños (iOS hace zoom al enfocar campos menores); los inputs ocultos con `sr-only` viven dentro de un contenedor `relative` para que el foco no desplace la página; botones, opciones y botonera llevan `touch-manipulation` (sin retardo de 300 ms ni doble‑tap‑zoom).
7. **Feedback inmediato y ligero.** Micro‑animaciones cortas (200–500 ms), toasts que desaparecen solos, auto‑avance en la Fase 2.
8. **Celebrar el avance, una cosa a la vez.** Tras cada actividad, la pantalla de progreso dirige la mirada en orden (porcentaje → barra del nivel → medalla → puntos → racha → copa) y acompaña cada paso con sonido. Lo ya logrado aparece quieto; solo se anima lo nuevo.
9. **Español informal y cercano (tuteo).** Tono de "compañero", emojis en los textos de resultados. Ortografía RAE: tildes (`Sí`, `Día`, `cuál`, `algún`, `conozcámonos`), minúscula tras coma en los títulos del header, fechas "18 de mayo de 2026" y horas "12:00 a. m." / "7:06 p. m.".

---

## 3. Tokens

### 3.1 Color

Regla: **una escala por familia**, definida en `@theme` ([src/index.css](src/index.css)). Ningún componente usa `[#hex]`; los únicos hex en TSX son los keyframes de `motion` (no interpola `var()`), documentados junto a su token.

#### Marca (`brand`)

| Token | Hex | Uso |
|---|---|---|
| `brand-50` | `#F3F1FF` | Inicio del degradado del body, bloque "intención guardada", hover del botón secundario |
| `brand-100` | `#EDE9FE` | Opción seleccionada, pills de navegación, track del scrollbar legal, glow ambiental, fondo de icono en modal |
| `brand-200` | `#D8CDFB` | Blob de la ilustración, borde del botón secundario, botón enviar, cinta clara de las medallas del ranking |
| `brand-300` | `#C9BFF5` | Hover del botón enviar |
| `brand` | `#8774E1` | CTA, barra de progreso, radio seleccionado, tab activa, links (incluido el del footer), base del fondo de la pantalla de progreso, cinta oscura de las medallas del ranking, color de copa de una estrategia |
| `brand-600` | `#7864D8` | Hover del CTA y de links, fondo de respaldo del avatar |
| `brand-900` | `#342475` | Título "Felicidad general" en Inicio, texto del botón crema, color de copa de una estrategia |

#### Grises (`gray`, sobrescribe la escala de Tailwind)

| Token | Hex | Uso |
|---|---|---|
| `gray-50` | `#F8F9FA` | Fondo de Inicio, fondo de inputs/textarea/opciones sin seleccionar, fondo de notas |
| `gray-100` | `#F3F4F6` | Hover de opciones, bordes suaves, divisores, track del gauge |
| `gray-200` | `#E5E5EA` | Bordes de tarjeta, track de progreso, botón deshabilitado, badge "Pendiente", borde del knob |
| `gray-300` | `#D1D1D6` | Borde punteado de medallas y copas por ganar |
| `gray-400` | `#9B9B9B` | Logo, placeholders, notas al pie, texto deshabilitado, borde de radio/checkbox, candado y copa por ganar |
| `gray-500` | `#7B7B7B` | Texto legal, footer, ejes del gráfico |
| `gray-600` | `#6B6B6B` | Iconos de cabecera de tarjeta, texto de "Pendiente" |
| `gray-700` | `#555555` | Párrafos descriptivos, número de la medalla de plata (ranking) |
| `gray-800` | `#4A4A4A` | Etiquetas de pregunta, texto de opciones, cuerpo en Inicio |
| `gray-900` | `#2D2D2D` | Texto base (`body`) y títulos |

#### Semánticos (`success` / `warning` / `danger`)

Cada familia tiene tres pasos: **100** fondo suave, **500** sólido, **700** texto sobre el fondo suave.

| Token | Hex | Uso |
|---|---|---|
| `success-100` / `success-700` | `#EAF8EE` / `#2D9F53` | Badges "Alto" y "Completada" |
| `success-500` | `#10B981` | Snackbar de éxito, icono "Completada", check del toast, icono WhatsApp activo, color de copa de una estrategia |
| `warning-100` / `warning-700` | `#FEF6E1` / `#9A7D2C` | Badge nivel "Medio", aviso de términos rechazados |
| `warning-200` | `#F6E7B8` | Borde del aviso de términos rechazados |
| `warning-500` / `warning-600` / `warning-800` | `#F5A623` / `#D48806` / `#AD6800` | Punto medio del gauge (500); `.gold-medal` de respaldo de la copa 3D (200→600); ícono de la medalla de nivel ganada y número de la medalla de oro (800) |
| `danger-100` / `danger-700` | `#FEECEC` / `#E04F4F` | Badges "Bajo" e "Incompleta" |
| `danger-500` | `#FF5A5F` | Icono "Incompleta", inicio del gauge, color de copa de una estrategia |

#### Acentos

| Token | Hex | Uso |
|---|---|---|
| `accent-teal` | `#48C6B6` | Puntos de nivel "Alto" en el gráfico de evolución, color de copa de una estrategia |
| `accent-yellow` | `#F8EEA6` | Mancha decorativa detrás del retrato (intro Fase 2) |
| `accent-sky` | `#BDE5F8` | Halo celeste del fondo de formularios (`.bg-form`) |
| `surface-form` | `#F7F8FC` | Reservado (la base de `.bg-form` pasó a blanco) |

#### Gamificación

| Token | Hex | Uso |
|---|---|---|
| `cream` | `#FFF3BF` | Cifras de la pantalla de progreso (porcentaje, puntos, racha), barras de nivel llenas, nivel activo, nombre de la estrategia ganada, botón `gold` ("Continuar"), pills de lo aprendido (al 20 %) |
| `locked` | `#6D5BBE` | Fondo de candados y barras bloqueadas sobre el lavanda de la pantalla de progreso |
| `medal` | `#FCD34D` | Fondo de la medalla de nivel ganada, anillo de avance de nivel en Logros, cara de la medalla de oro del ranking |
| `silver` | `#D5D9E0` | Cara de la medalla de plata del ranking (borde `#B8BEC9`) |
| `bronze` | `#E8A877` | Cara de la medalla de bronce del ranking (borde `#D18A55`, número `#8A4A1C`) |

**Colores por estrategia** ([src/lib/trophyColors.ts](src/lib/trophyColors.ts)): cada programa toma un color por orden — `accent-teal`, `success-500`, `brand`, `danger-500`, `brand-900` — que pinta su copa ganada (copa en el color, círculo en el mismo color al 12 % sobre blanco) y sus pills en Logros (`TROPHY_PILLS`, fondo 10–20 % + texto del mismo tono).

#### Gauge de resultados

Gradiente de 3 paradas sobre tokens: `danger-500 → warning-500 → success-500`; track `gray-100`, knob blanco con borde `gray-200`.

#### Neutros absolutos

`white` y `black` (este último sólo en el fondo del modal `bg-black/40` y en la sombra SVG del knob).

### 3.2 Tipografía

Fuente única: **Plus Jakarta Sans**, `antialiased`.

| Rol | Tamaño | Peso | Ejemplo |
|---|---|---|---|
| H1 cuestionario | 22 → 26 → 28 px | 700 | "Daniel, conozcámonos" |
| H1 resultados | 26 → 30 → 32 px | 800 | "Tus resultados" |
| Score gauge | 44 px | 800, `tabular-nums` | "3.4" |
| Stat grande (tarjeta perfil) | 28 px | 800, `tabular-nums` | "4", "50" |
| H2 sección | 18–20 px | 700 | "Mi felicidad actual" |
| H2 intro Fase 2 | 20 → 23 → 25 px | 700, color brand | |
| Título de tarjeta | 17 px | 700 | Acordeón Program |
| Pregunta / label | 16 → 17 → 18 px | 500, `#4A4A4A` | "¿Tienes pareja?" |
| Enunciado Fase 2 | 17 → 19 → 20 px | 500 | "En mi cotidianidad..." |
| Botón primario | 16 → 18 px | 600 | "Continuar" |
| Opción de radio | 15 → 16 px | 500 | |
| Inputs / textarea | 16 px fijo | 400 | evita el zoom automático de iOS |
| Cuerpo | 14.5 → 15 px | 400, `leading-relaxed` | |
| Texto secundario | 13–13.5 px | 400–500 | |
| Badge | 10–12.5 px | 700 | "Medio" |
| Texto legal / footer | 12–13.5 px | 400 | |
| Micro | 10–11.5 px | 600–700 | Tooltip, label "Tu compromiso guardado" |
| Porcentaje de progreso | 104 px (+ "%" a 50 px) | 800, `tabular-nums`, crema | "15%" |
| Título pantalla de progreso | 32 px | 800 | "¡Estás imparable!", "¡Felicitaciones!" |
| Cifra de tarjeta (progreso) | 26 px | 800, crema | "+25 pts", "5 días" |
| Nombre de estrategia ganada | 22 px | 800, crema | "Atención a lo que suma" |

**Decisión:** se usan tamaños arbitrarios en px (`text-[15px]`) en vez de la escala de Tailwind para reproducir fielmente el diseño original. `tracking-tight` en títulos y números; `leading-snug`/`leading-relaxed` en cuerpo.

### 3.3 Espaciado y layout

- Padding horizontal del contenedor: `px-4 sm:px-6 md:px-8`.
- Ancho máximo: Home `max-w-md sm:max-w-lg lg:max-w-5xl xl:max-w-6xl`; cuestionario `max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl`.
- Espaciado vertical entre preguntas: `space-y-7`; entre tarjetas: `space-y-4`; entre opciones: `space-y-3 / 3.5`.
- Padding de tarjetas: `p-5` (Home), `p-5 sm:p-6 md:p-7` (reglas), `p-4 sm:p-5` (resultados).
- Logo con 48 px de aire superior (`pt-12`) en el cuestionario.
- Botones: `py-3.5 sm:py-4 px-5 sm:px-9`, 16 → 18 px, `whitespace-nowrap` (en móvil el padding lateral baja para que Volver + Siguiente quepan en una fila incluso a 320 px).
- **Separación botón ↔ contenido anterior: 32 px en todas las pantallas** (`ButtonRow`, `mt-8`). La fila va como hermana del bloque `space-y-*`, nunca dentro, para que el margen no se sume. En reglas (desktop) la fila comparte línea con Sí/No (`md:mt-0`) y el hueco lo aporta el contenedor (`pt-3` + `space-y-5` = 32 px).

### 3.4 Radios de borde

| Token | Valor | Uso |
|---|---|---|
| `rounded-full` | 9999 px | Botones, pills, badges, avatares, barra de progreso |
| `rounded-3xl` | 24 px | Todas las tarjetas (`Card`), tarjeta de perfil morada, modales |
| `rounded-2xl` | 16 px | Opciones de radio, inputs, dropdown, toasts, bloques internos |
| `rounded-xl` | 12 px | Bloque de aviso en modal de términos |
| `0.375rem` | 6 px | Checkbox personalizado |

### 3.5 Sombras

| Nombre | Valor | Uso |
|---|---|---|
| `shadow-cta` | `0 4px 14px rgba(135,116,225,0.35)` | CTA morado |
| Tarjeta perfil | `shadow-lg shadow-brand/20` | Tarjeta morada |
| `shadow-card` | `0 4px 20px rgba(0,0,0,0.03)` | Todas las tarjetas blancas (`Card`) |
| Snackbar | `shadow-xl shadow-success-900/15` | |
| Micro | `shadow-xs`, `shadow-2xs` | Pills, badges, botón enviar |
| Ninguna | `shadow-none` | Opciones de radio, inputs |

**Decisión:** las sombras van tintadas de morado (no negro) en superficies de marca para mantener la sensación cálida.

### 3.6 Bordes

- Tarjetas (`Card`): `border border-gray-100` (casi invisible).
- Separadores: `border-gray-100`, `divide-gray-100`.
- Botón secundario: `border-brand-200`.
- Formularios: **sin borde** (`border-none`).

---

## 4. CSS global ([src/index.css](src/index.css))

| Clase / regla | Qué hace |
|---|---|
| `body` | Degradado `brand-50 → gray-50`, `min-height: 100vh`, color `gray-900` |
| `@theme { … }` | Tokens: escalas `brand`, `gray` (sobrescribe Tailwind), `success`/`warning`/`danger`, acentos, fuente y sombras (§3) |
| `.bg-form` | Fondo de las pantallas de formulario (cuestionario y actividades): base **blanca**; sólo tres halos elípticos pegados al borde superior (`accent-sky` 80 % + `brand-200` 50 % en la esquina derecha, `brand-200` 30 % muy leve en la izquierda). El resto de la pantalla es blanco puro |
| `.focus-ring` | Anillo de foco morado sólo en `:focus-visible` (teclado) |
| `.custom-radio` | Radio nativo reemplazado: círculo 20 px, borde `#9CA3AF` 1.8 px, punto interior morado 10.4 px que escala de 0→1 en 120 ms |
| `.custom-checkbox` | Checkbox 21.6 px, radio 6 px, fondo morado al marcar con check blanco en CSS |
| `label:has(.custom-radio)` etc. | Fuerza `min-height: 56px` en cualquier contenedor de radio |
| `.custom-hide-native-scroll` | Oculta el scrollbar nativo (se usa con el scrollbar custom del texto legal) |
| `.custom-legal-scroll` | Scrollbar fino (6 px) morado sobre track `#EDE8F7` — fallback |
| `input[type="date"]::-webkit-calendar-picker-indicator` | Oculta el icono nativo para usar el `<Calendar>` de Lucide |
| `.bg-celebration` | Fondo de la pantalla de progreso: degradado vertical lavanda (`brand` mezclado al 86 % → 94 % con blanco) |
| `.hero-glow` | Luz blanca radial suave (22 % → 0) detrás del porcentaje, con pulso lento |
| `.hero-number` | Porcentaje en `cream`, plano (sin degradado ni sombra) |
| `.cream-capsule` | Relleno crema plano de las barras de nivel |
| `.dashed-locked` / `.track-locked` | Candado y barra bloqueados sobre lavanda: fondo `locked`, borde punteado blanco al 40 % |
| `.sunburst` | Rayos blancos al 30 % (`repeating-conic-gradient` 9°/24°) con máscara radial; gira detrás de la copa |
| `.gold-medal` | Degradado dorado `warning-200 → warning-600`; solo como respaldo si no hay WebGL para la copa 3D |

**Decisión:** el foco por ratón no muestra anillo (fidelidad visual), pero `:focus-visible` (teclado) sí dibuja un anillo morado translúcido en radios, checkboxes y en todo elemento con `.focus-ring`.

---

## 5. Componentes

### 5.1 Primitivos (`src/components/ui/`)

| Componente | Archivo | API |
|---|---|---|
| `Button` | [ui/Button.tsx](src/components/ui/Button.tsx) | `variant`: `primary` \| `secondary` \| `ghost` \| `gold` (`pill` disponible, sin uso actual); `size`: `lg` (pasos) \| `md` (Home, modales). Soporta `disabled`. `gold` = fondo `cream`, texto `brand-900`, sombra morada suave; se usa en "Continuar" de la pantalla de progreso. |
| `RadioOption` | [ui/RadioOption.tsx](src/components/ui/RadioOption.tsx) | Tarjeta seleccionable (`<motion.label>`): `name`, `value`, `checked`, `onChange`, `label`, `centerOnMobile`; acepta props de `motion` (animación de parpadeo en Fase 2). |
| `BackButton` | [ui/BackButton.tsx](src/components/ui/BackButton.tsx) | `Button` secundario con flecha `ArrowLeft` + "Volver"; usado en Step1–3 y en las preguntas de Fase 2. |
| `NextButton` | [ui/NextButton.tsx](src/components/ui/NextButton.tsx) | `Button` primario `type="submit"` con "Siguiente" + `ArrowRight`; acepta `disabled`. Usado en Step1, Step2 y preguntas 1–9 de Fase 2. |
| `ButtonRow` | [ui/ButtonRow.tsx](src/components/ui/ButtonRow.tsx) | Fila de acciones de pantalla: `mt-8 flex flex-nowrap gap-3 sm:gap-3.5`, `align` start/center. **Nunca apila**: con 2+ botones cada uno toma `flex-1` en móvil (mitad de la fila) y desde `sm` vuelve a su ancho natural; un botón solo conserva su ancho. Usada en Step1–3, Fase 2 (intro y preguntas), resultados, actividades, reglas y pantalla de error. |
| `Card` | [ui/Card.tsx](src/components/ui/Card.tsx) | Superficie única `bg-white rounded-3xl border border-gray-100 shadow-card` (exportada como `CARD_SURFACE`); `flush` quita el padding. Sin variantes. |
| `LevelBadge` / `StatusBadge` | [ui/Badge.tsx](src/components/ui/Badge.tsx) | Nivel Alto/Medio/Bajo (`size` sm/md) y estado Pendiente/Completada/Incompleta. `getLevel(score)` vive en [lib/levels.ts](src/lib/levels.ts). |
| `Avatar` | [ui/Avatar.tsx](src/components/ui/Avatar.tsx) | Foto circular; sin `src` muestra el vector predeterminado (`UserRound` en `brand` sobre `brand-100`). Usado en la tarjeta de perfil (con lápiz para cambiar la foto) y en el Ranking. |
| `Toast` | [ui/Toast.tsx](src/components/ui/Toast.tsx) | `message` (null oculta), `variant`: `dark` \| `success` \| `danger`, `onClose`. `success`/`danger` comparten forma de banner (icono en círculo `white/25` + ✕); `danger` es `bg-danger-500`, icono `TriangleAlert`, `role="alert"`/`aria-live="assertive"`. |
| `Modal` | [ui/Modal.tsx](src/components/ui/Modal.tsx) | `isOpen`, `onClose`, `labelledBy`, `size` sm/lg. `role="dialog"`, `aria-modal`, Escape, clic fuera, trap de foco y devolución del foco. |
| `MoodPicker` | [ui/MoodPicker.tsx](src/components/ui/MoodPicker.tsx) | Selector de ánimo de 5 caras (`Frown` → `Laugh`) dentro de un `fieldset`; compartido por la actividad del onboarding y la del dashboard. |
| `LevelMedal` | [ui/LevelMedal.tsx](src/components/ui/LevelMedal.tsx) | Medalla de nivel. `earned`, `size` sm/md/lg (28/32/56 px), `tone` `light` (tarjetas blancas) \| `dark` (pantalla de progreso), `pulse` (rebote al desbloquearse). Ganada: círculo `medal` + ícono medalla (iconsax) en `warning-800`. Por ganar: `light` = círculo `gray-50` con borde punteado `gray-300` y candado `gray-400`; `dark` = `.dashed-locked` con candado `brand-100`. Exporta `LockIcon` y `BADGE_ICON`. |
| `TrophyBadge` | [ui/TrophyBadge.tsx](src/components/ui/TrophyBadge.tsx) | Copa de programa. `earned`, `size` sm/lg (36/56 px), `color` (color de la estrategia). Ganada: copa sólida en `color` sobre círculo de ese color al 12 %, sin borde. Por ganar: igual que la medalla por ganar (círculo punteado gris + copa gris). |
| `MedalIcon` | [ui/MedalIcon.tsx](src/components/ui/MedalIcon.tsx) | Medalla del ranking para los puestos 1–3 (`place`). SVG 32×40: dos tiras de cinta inclinadas (`brand` y `brand-200`) que apenas asoman, y moneda plana con borde oscuro + cara clara de oro/plata/bronce y el número en el centro. |
| `Trophy3D` | [ui/Trophy3D.tsx](src/components/ui/Trophy3D.tsx) | Copa dorada 3D (Three.js) que gira. `active` (empieza a girar), `onReady` (avisa cuando ya compiló). Ver §7.1. Export por defecto para `React.lazy`. |

Las clases de referencia de cada primitivo:

#### Botón primario
```
py-3.5 sm:py-4 px-5 sm:px-9 rounded-full bg-brand text-white font-semibold text-[16px] sm:text-[18px] whitespace-nowrap
shadow-cta hover:bg-brand-600 active:scale-[0.98] transition-all
```
- Deshabilitado: `bg-gray-200 text-gray-400 cursor-not-allowed shadow-none`.
- Textos: "Continuar", "Siguiente" (con `ArrowRight`, componente `NextButton`), "Terminar", "Empezar", "Entendido", "Enviar" (con `Send`, actividades).

#### Botón secundario (outline)
```
py-3.5 sm:py-4 px-5 sm:px-9 rounded-full border border-brand-200 bg-white text-brand font-semibold
hover:bg-brand-50/50 active:scale-[0.98]
```
- Texto: "Volver" precedido de `ArrowLeft` (componente `BackButton`). Siempre va a la izquierda del primario dentro de un `ButtonRow`.

#### Botón compacto (Home)
`px-6 py-2.5 rounded-full text-[14px] font-semibold bg-brand` ("Realizar actividad"): abre la pantalla de actividad (`ActivityDetailScreen`).

#### Botón crema (pantalla de progreso)
`Button variant="gold"`: `bg-cream text-brand-900`, sombra `rgba(52,36,117,0.25)`, `hover:brightness-95`. Texto "Continuar" + `ArrowRight`.

#### Botonera flotante (`FloatingNav`)
`fixed bottom-5 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border-gray-100 rounded-full shadow-xl shadow-brand/10 p-1.5`. Siete botones circulares con icono Lucide; el activo va `bg-brand text-white shadow-cta`, el resto `text-gray-500` con hover `brand-50`. Destinos: Términos (paso 0), Datos personales (paso 1), Test de felicidad (paso 4), Resultados (paso 15), Actividades (paso 16), Pantallas de error (`TriangleAlert`), Inicio. Botones `w-10` en móvil / `w-11` desde `sm`. Sustituye a las antiguas pills "Volver a la pantalla de inicio" / "Tomar cuestionario / editar". El `main` lleva `pb-28` y los toasts suben a `bottom-24` para no chocar con ella.

#### Pill de filtro (toggle)
- Activo: `border border-brand text-brand bg-brand/5 font-semibold`.
- Inactivo: `border border-gray-200 text-gray-600 bg-white hover:bg-gray-50`.

#### Opción de radio (tarjeta seleccionable)
```
min-h-[56px] rounded-2xl px-4 py-3.5 flex items-center gap-3.5 cursor-pointer transition-all
seleccionado: bg-brand-100 + texto text-brand font-medium
no seleccionado: bg-gray-50 hover:bg-gray-100 + texto gris
```
Contiene `<input class="custom-radio">` + label. Variantes: Sí/No en fila (`flex gap-2.5 max-w-xs`), género en `grid-cols-3`, opciones largas apiladas (`space-y-3.5`).

#### Input de texto / número / fecha
```
w-full min-h-[56px] bg-gray-50 border-none rounded-2xl px-5 text-[15px] sm:text-[16px] text-gray-700
placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30
```
El de fecha lleva un botón absoluto con `<Calendar>` que dispara `showPicker()`.

#### Badge de nivel
`px-2.5 py-0.5 rounded-full font-semibold text-[11–12.5px]` con los pares bg/text de la tabla semántica (Alto/Medio/Bajo).

#### Badge de estado (Program)
`inline-flex px-3 py-0.5 rounded-full text-xs` — misma fórmula que el badge de nivel (fondo 100 + texto 700): Pendiente `gray-200/gray-600`, Completada `success-100/success-700`, Incompleta `danger-100/danger-700`.

#### Tarjeta blanca
`bg-white rounded-3xl p-5 border border-gray-100 shadow-card` — la misma en Inicio, Programa, Ranking, reglas, caja legal y resultados.

#### Toast / Snackbar
- Toast genérico (Home): `fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/95 text-white px-5 py-3 rounded-2xl backdrop-blur-md` con check verde; desaparece a los 3.5 s.
- Snackbar de éxito (App): `bg-success-500 text-white px-5 py-3.5 rounded-2xl` con icono check en círculo `bg-white/25` y botón ✕; se muestra 4.5 s al llegar al paso 4.
- Banner de error: misma forma en `bg-danger-500` con `TriangleAlert`; texto "Algo salió mal. Intenta de nuevo por favor". Persistente hasta cerrarlo (no desaparece solo).

#### Modal
`fixed inset-0 z-50 bg-black/40 backdrop-blur-xs` + panel `bg-white rounded-3xl p-6 shadow-xl max-w-xs|lg`.

#### Barra de progreso
Altura única `h-2` (8 px) en todas las barras. Track `bg-gray-200 rounded-full` + relleno `bg-brand` con `transition-all duration-500` (cuestionario); `bg-brand-100` + `bg-brand` (Felicidad general); `bg-white/30` + `bg-white` sobre la tarjeta de perfil morada (muestra el progreso real del programa). Excepción: las barras de nivel de la pantalla de progreso miden `h-3` (12 px), con `.track-locked` + `.cream-capsule`.

#### Anillo de avance de nivel (Logros)
Círculo SVG de 62 px alrededor de la `LevelMedal lg`: trazo `medal` de 6 px con puntas redondeadas, arranca arriba y se llena en el sentido del reloj (`pathLength` = actividades hechas / mínimo para la medalla). La parte que falta deja ver el borde punteado del círculo. Se anima al abrir Logros (900 ms, +100 ms por nivel). Sin avance no se dibuja.

### 5.2 Componentes de archivo

| Componente | Archivo | Responsabilidad | Detalles visuales clave |
|---|---|---|---|
| `App` | [src/App.tsx](src/App.tsx) | Máquina de estados: `viewMode` (`home` \| `survey` \| `errors`) y `currentStep` (0–16, constantes en `STEP`). `renderStep()` con `switch`; `goToStep()` registra la dirección (1/−1) que alimenta las variantes de transición. Instancia `useGamification()` y guarda el resultado de la actividad para mostrar `ActivityCelebrationFlow` (en Home y al cerrar el cuestionario). | Fondo blanco cuando `currentStep === 15`. Contenedor `max-w-lg → 2xl`. |
| `HapplyLogo` | [src/components/HapplyLogo.tsx](src/components/HapplyLogo.tsx) | Logo SVG inline (wordmark "Happly®" con sonrisa), `fill="currentColor"`. `className` solo para posición. | **Tamaño y color únicos** fijados en el componente: `h-9 sm:h-11` (36 → 44 px) y `text-gray-400`, iguales en Home, cuestionario, actividades y pantallas de error. |
| `Header` | [src/components/Header.tsx](src/components/Header.tsx) | Logo + título dinámico `"{nombre}, {sufijo}"` + barra de progreso. | Sufijos: paso 0 "conoce las reglas", 1–3 "conozcámonos", 4–14 "cuéntanos más de ti" (minúscula tras la coma), 15 "Tus resultados" (centrado, sin barra). Progreso: 33/66/100 % en Fase 1, `n/10` en Fase 2, vacío en paso 4. |
| `FloatingNav` | [src/components/FloatingNav.tsx](src/components/FloatingNav.tsx) | Botonera flotante de 7 destinos; recibe `active` y `onNavigate`. `App` traduce el destino a `viewMode`/`currentStep`. | Ver §5.1. |
| `Footer` | [src/components/Footer.tsx](src/components/Footer.tsx) | Copyright + link a términos. Acepta `className`. | `text-xs text-gray-500`, link `text-brand`, `border-t border-gray-100/80`. Usado en App y HomeScreen. |
| `StepRules` | [src/components/StepRules.tsx](src/components/StepRules.tsx) | Paso 0: precauciones, confidencialidad, política de datos con scroll y pregunta Sí/No. | Dos `Card` con icono Lucide (`Eye`, `BadgeCheck`, stroke 1.5), en `md:grid-cols-2`; fila final `md:flex justify-between` con Sí/No a la izquierda y "Continuar" a la derecha. Caja legal (`Card` de `h-44/52/56`) con **scrollbar custom siempre visible** (track `#EDE8F7`, thumb morado, calculado en JS). Aviso ámbar si responde "No". |
| `Step1` | [src/components/Step1.tsx](src/components/Step1.tsx) | Datos demográficos: género (3 cols), fecha, pareja, profesión, hijos. | Input numérico estrecho `w-24 sm:w-28`. |
| `Step2` | [src/components/Step2.tsx](src/components/Step2.tsx) | 4 preguntas Sí/No + preferencia laboral (radio apilado). | Helper `renderYesNoQuestion`. |
| `Step3` | [src/components/Step3.tsx](src/components/Step3.tsx) | Preferencia laboral (3 opciones). Botón "Terminar". | Botones a 32 px del contenido (`ButtonRow`), ya no anclados abajo. |
| `StepPhase2Intro` | [src/components/StepPhase2Intro.tsx](src/components/StepPhase2Intro.tsx) | Ilustración + instrucciones para la Fase 2. | Desde `md`: ilustración a la izquierda (`shrink-0`) y título + bullets a la derecha; nota y "Empezar" debajo a todo el ancho. Composición: blob lavanda orgánico (`rounded-[48%_52%_45%_55%/…]`) + acento amarillo rotado + retrato circular recortado. Título en color brand. Bullets con puntos `w-1.5 h-1.5 bg-gray-500`. |
| `StepPhase2Question` | [src/components/StepPhase2Question.tsx](src/components/StepPhase2Question.tsx) | Pregunta genérica de Fase 2 (10 bloques de 4 afirmaciones). | **Auto‑avance** 520 ms tras seleccionar, con animación de "parpadeo" (`scale` y `backgroundColor` en keyframes). Botón submit deshabilitado hasta responder. |
| `ResultsSummary` | [src/components/ResultsSummary.tsx](src/components/ResultsSummary.tsx) | Paso 15: gauge SVG, texto general expandible, 3 tarjetas de sub‑dimensión, modal de confirmación. | Gauge: arco de 260° (140°→400°), r=85, stroke 8, gradiente `danger-500 → warning-500 → success-500`, knob blanco con `feDropShadow`. Score y knob animados con `requestAnimationFrame` + easeOutCubic (1.3 s). "Leer más/menos" con altura animada + crossfade (`ExpandableText`) y chevron rotando 180°. |
| `ActivityStep` | [src/components/ActivityStep.tsx](src/components/ActivityStep.tsx) | Paso 16: única actividad de muestra al cierre del cuestionario (datos en [src/data/activities.ts](src/data/activities.ts); conserva el texto "Actividad 1 de 4"). Guarda `{ text, mood }` en `formData.activityAnswers`; al enviarla completa la actividad real "de hoy" y abre la pantalla de progreso. | "Actividad N de 4" (16–17 px semibold) + fecha límite (13 px `gray-500`); título 26→32 px bold en `brand`; descripción `gray-700`; `textarea` `gray-50` sin borde (blanca al enfocar) (`min-h-[112px]` en móvil, `56px` en desktop); escala de ánimo con 5 caras Lucide (`Frown`, `Annoyed`, `Meh`, `Smile`, `Laugh`, 36 px) con etiquetas "Muy mal" / "Muy bien" en los extremos, seleccionada en `brand`; botón `Enviar` (con icono `Send`) deshabilitado hasta tener texto y ánimo. Header solo con logo. |
| `ActivityDetailScreen` | [src/components/ActivityDetailScreen.tsx](src/components/ActivityDetailScreen.tsx) | Pantalla de actividad del dashboard (overlay `fixed inset-0 z-50 bg-form`). La abren tanto "Realizar actividad" de Inicio como la fila accionable de Programa. **"Enviar" es el único punto que completa una actividad.** | Mismo diseño que `ActivityStep`: día + fecha, título `brand`, descripción, textarea, `MoodPicker`, botón `Enviar` deshabilitado hasta tener texto y ánimo; botón ✕ para cerrar. |
| `ActivityCelebrationFlow` | [src/components/ActivityCelebrationFlow.tsx](src/components/ActivityCelebrationFlow.tsx) | Pantalla de progreso tras enviar una actividad. Ver §6.4. | `SummaryScreen` interno; `WinBlock` ("Aprendiste:" + estrategia + pills); `useCountUp` para cifras animadas. |
| `HappinessChart` | [src/components/HappinessChart.tsx](src/components/HappinessChart.tsx) | Gráfico SVG mes a mes (30 May → 30 Ago): eje Y fijo (Alto/Medio/Bajo/Muy bajo) y área desplazable horizontalmente con `snap-x` por mes (cada mes ocupa 140 px, así en móvil se navega con swipe). Recibe `points` y `seriesKey` (reanima al cambiar de filtro). | Guías punteadas `gray-200`; línea `brand` 2 px dibujada con `pathLength`; puntos r=7 con halo r=14 al 18 %, coloreados por nivel (`accent-teal` Alto, `warning-500` Medio, `danger-500` Bajo) y entrada en cascada (spring, 120 ms entre puntos); `<title>` con valor y nivel. |
| `HomeScreen` | [src/components/HomeScreen.tsx](src/components/HomeScreen.tsx) | Dashboard post‑cuestionario con tabs. Recibe `gamification` y `onCelebrate`. | Ver §6.1. |
| `ProgramTab` | [src/components/ProgramTab.tsx](src/components/ProgramTab.tsx) | Acordeón programa → nivel → actividad: el programa activo (`CURRENT_PROGRAM`) más los programas de ejemplo (`OTHER_PROGRAMS`), con `Collapsible` y `ActivityRow` internos. | `Card flush`. Cabecera del programa con `TrophyBadge sm` + chevron; fila de nivel con "Nivel N", "hechas/total" y `LevelMedal sm`. Actividades de la más reciente (arriba) a la más antigua; icono de estado (`Clock` gris, `CheckCircle2` verde, `XCircle` rojo); solo la actividad "de hoy" muestra "Realizar actividad". Altura animada con `motion` (`height: 0 → auto`, 200 ms). |
| `AchievementsTab` | [src/components/AchievementsTab.tsx](src/components/AchievementsTab.tsx) | Card "Programa actual" + card "Historial de copas ganadas". | **Programa actual:** 4 `LevelMedal lg` con su anillo de avance (§5.1) y "Nivel N" (`brand` semibold si está ganado, `gray-400` si no); debajo, si la copa no está ganada, `TrophyBadge` bloqueada + nombre del programa + "N medallas para ganar esta copa". **Historial:** por copa ganada, `TrophyBadge lg` en su color, título 15 px bold, "Aprendiste: …", pills de las habilidades de cada nivel (`trophyPillClass`, `flex-wrap`) y fecha "Completado el …" al final. Constantes de ejemplo: `EXAMPLE_LEVELS_REACHED`, `EXAMPLE_LEVEL_PROGRESS` (§12). |
| `LeaderboardTab` | [src/components/LeaderboardTab.tsx](src/components/LeaderboardTab.tsx) | Ranking: 6 usuarios de ejemplo + el usuario real con sus puntos, ordenados por puntos en cada render. Sin título (la tab ya lo nombra). | `MedalIcon` para los puestos 1–3, número para el resto. Fila: rank + `Avatar` + nombre + "N PTS". El usuario real va como "Nombre (Tú)" en `brand` con `ring-2 ring-brand/40`. |
| `LoadErrorScreen` | [src/components/LoadErrorScreen.tsx](src/components/LoadErrorScreen.tsx) | Pantalla de error: no cargó la primera parte de "Conozcámonos". Segunda de la secuencia `ERROR_SCREENS`. Fuera del flujo normal. | `Header` real del paso 1 (título + progreso 33 %), esqueleto de 4 preguntas (`gray-100` para etiquetas, `gray-50` para campos, `aria-hidden`) y `Toast` `danger` persistente; sin botones en el fondo. |
| `SuspendedActivityScreen` | [src/components/SuspendedActivityScreen.tsx](src/components/SuspendedActivityScreen.tsx) | Pantalla de error "Actividad suspendida" (máximo de intentos alcanzado). Primera de la secuencia `ERROR_SCREENS` en `App`, accesible desde el botón "Pantallas de error" de la botonera; no está ligada a ninguna lógica de negocio. | Fondo `.bg-form`, logo arriba, `Card` centrada vertical y horizontalmente (`role="alert"`): círculo `brand-100` de 112–128 px con `AlarmClock` en `brand`, título 24→28 px bold `brand-900`, párrafo `gray-700`, botón `Cerrar` (`Button` md). |
| `TermsModal` | [src/components/TermsModal.tsx](src/components/TermsModal.tsx) | Modal de términos y condiciones. | Icono `ShieldCheck` en cuadrado `bg-brand-100 rounded-2xl`, aviso con `Lock`, 3 secciones con `FileText`. `max-h-[90vh] overflow-y-auto`. |

---

## 6. Pantallas y flujo

```
Home (dashboard) ◀──── FloatingNav (7 atajos) ────▶ Cuestionario
                                              └── Pantallas de error (secuencia; "Cerrar" pasa a la siguiente y la última vuelve a Home)
                                              │
   paso 0  Reglas y política ─── acepta ──▶ paso 1  Datos personales   (33 %)
                                              paso 2  Contexto / apoyo  (66 %)
                                              paso 3  Preferencia       (100 %) ── "Terminar"
                                              paso 4  Intro Fase 2  ◀── snackbar verde 4.5 s
                                              pasos 5–14  Preguntas 1–10 (auto‑avance, 10–100 %)
                                              paso 15 Resultados (fondo blanco) ── "Entendido"
                                                        └─ modal: Ir a Home / Permanecer / Reiniciar
                                              paso 16  Actividad de muestra (texto + ánimo) ── "Enviar" ─┐
                                                                                                   ▼
Home ── "Realizar actividad" (Inicio o Programa) ──▶ ActivityDetailScreen ── "Enviar" ──▶ Pantalla de progreso
                                                                                     └─ (demo) pantalla de la copa ──▶ Home
```

### 6.1 Home

Orden vertical en móvil (en `lg+` el punto 3 vive en un `aside` sticky a la izquierda y del 4 en adelante en la columna derecha):

1. Logo centrado (mismo tamaño que en el resto de pantallas: `h-9 sm:h-11`).
3. **Tarjeta de perfil morada** (`bg-brand rounded-3xl p-5 sm:p-6`): `Avatar` 40 px con borde `white/60` y botón lápiz para subir una foto (vector predeterminado si no hay), nombre 17 px semibold, "Progreso general N %" (progreso real del programa, ver §6.5) con barra blanca animada, dropdown de notificaciones (Mail/WhatsApp, `bg-white/20 backdrop-blur-xs`), grid 3 stats (`bg-white/20 rounded-2xl border-white/10`): Racha, Puntos, Ánimo. Un círculo `bg-white/10 blur-xl` en la esquina como brillo decorativo.
4. **Tabs** Inicio / Programa / Logros / Ranking (`justify-between` en móvil, `lg:justify-start lg:gap-10` en desktop): `text-[14px] sm:text-[15px]`, activa en morado semibold con subrayado `h-[2.5px]` animado por `layoutId="activeTabIndicator"`.
5. Contenido de la tab:
   - **Inicio:** tarjeta "Tu actividad de hoy" (icono `ClipboardCheck`, día + título + fecha de la única actividad accionable del programa; "Realizar actividad" abre `ActivityDetailScreen`; al terminar el programa muestra "¡Completaste todas las actividades de este programa! 🎉"); tarjeta "Mi intención para esta semana" (input gris `bg-gray-100` + botón enviar lavanda; al guardar muestra bloque `bg-brand-50 border-brand/20` con la cita en itálica, +10 pts); sección "Mi felicidad actual": `Card` "Felicidad general" (título `brand-900`, badge de nivel + score 30 px en `brand`, barra de progreso `brand` sobre `brand-100` al `score/4`) y debajo tres `Card` en `grid-cols-3 gap-3`, una por dimensión, centradas (nombre, score 24 px, badge); sección "Evolución de mi felicidad" (4 pills de filtro con `flex-wrap` + `HappinessChart`).
   - **Programa:** ver `ProgramTab`.
   - **Logros:** ver `AchievementsTab`.
   - **Ranking:** ver `LeaderboardTab`.
6. Toast oscuro (feedback de acciones).
7. Footer.

Además: glow ambiental en la esquina superior derecha (`w-72 sm:w-96 bg-gradient-to-bl from-brand-100/60 … blur-3xl`).

**Decisión:** todo el copy está en español (tabs Inicio / Programa / Logros / Ranking, "Tu actividad de hoy", "Realizar actividad", "Racha", "Puntos", "Ánimo"). Los ids internos de las tabs siguen en inglés (`Home`, `Program`…) para no romper `initialTab`.

### 6.2 Cuestionario (pasos 0–14)

- `Header` con logo, título y barra de progreso.
- Contenido del paso con transición horizontal.
- Botonera: `Volver` (outline) + primario, alineados a la izquierda, `pt-4 sm:pt-6`.
- `Footer`.

### 6.3 Resultados (paso 15)

Fondo blanco puro (rompe el degradado para que el gauge destaque), header centrado, gauge, párrafo, "Conformado por:", 3 `Card` (apiladas en móvil, `md:grid-cols-3` en desktop), nota al pie en gris pequeño, botón "Entendido" centrado.

### 6.4 Pantalla de progreso (tras enviar una actividad)

Overlay `fixed inset-0 z-50` con `.bg-celebration`, texto blanco y columna centrada `max-w-md`. De arriba abajo:

1. Botón de sonido (esquina superior derecha, círculo `brand-900/40`, `Volume2`/`VolumeX`).
2. Título 32 px "¡Estás imparable!" y subtítulo "Estás aprendiendo a {lo que enseña el nivel}" (frase `learning` del nivel de la actividad recién hecha, p. ej. "agradecer").
3. Porcentaje del programa (104 px, crema) con `.hero-glow` y 9 estrellas de fondo titilando (blancas y crema).
4. Fila de 4 niveles: `LevelMedal md dark` + barra de nivel (`h-3`) + "Nivel N" (crema si está ganado).
5. Dos tarjetas `bg-white/15 border-white/20 rounded-2xl`: **Puntos** ("+25 pts") y **Racha** ("5 días"), etiqueta 12 px en mayúsculas, cifra 26 px crema; sin íconos.
6. Botón crema "Continuar →" abajo.

**Secuencia (una cosa a la vez):** el porcentaje cuenta de 0 al valor (0.9 s) → la barra del nivel de la actividad llena solo su tramo nuevo (lo previo ya está pintado) → al llegar casi al 100 % la medalla se desbloquea en ese mismo instante (rebote + sonido) → 450 ms después aparece y cuenta la tarjeta de puntos → aparece y cuenta la de racha. Los niveles y medallas ya ganados antes de la actividad aparecen quietos.

**Pantalla de la copa** (caso 100 %, cuando se gana el programa): se ve igual que la anterior hasta el final de la secuencia; entonces el 100 % se desvanece, el bloque central crece de 130 a 210 px (el resto del contenido se reacomoda), aparece la copa 3D girando sobre un `.sunburst` que rota (28 s por vuelta), el título cambia a "¡Felicitaciones!" y la fila de niveles se reemplaza por el bloque **"Aprendiste:"** (17 px semibold) + nombre de la estrategia (22 px extrabold, crema) + pills de las habilidades de cada nivel (`bg-cream/20 border-cream/35 text-cream`), centrado. Con `WIN_REPLACES_LEVELS = false` el bloque vuelve a ir bajo el título y los niveles se mantienen.

Mientras el programa real no se haya ganado, después de la primera pantalla se muestra una **pantalla de ejemplo** de la copa (niveles 1–3 ya ganados, nivel 4 completo menos su última actividad) para poder revisar ese caso.

### 6.5 Reglas de gamificación ([src/lib/useGamification.ts](src/lib/useGamification.ts))

| Concepto | Regla |
|---|---|
| Programa | 4 niveles × 5 actividades ([src/data/program.ts](src/data/program.ts)). Solo una actividad es "de hoy" (`actionable`) a la vez; al completarla se habilita la siguiente. |
| Puntos | +25 por actividad, +10 por guardar la intención semanal. El usuario real aparece en el Ranking con sus puntos. |
| Medalla de nivel | Se gana al completar el mínimo de actividades del nivel (`medalMin`: 3, 4, 2 y 5 en el programa actual). Cada nivel define su habilidad (`skillWord`: Autocompasión, Fortalezas, Celebración, Gratitud) y su frase (`learning`). |
| Copa del programa | Se gana con ≥ 3 de las 4 medallas. Guarda la fecha ("Completado el …") y pasa al historial de Logros con lo aprendido. |
| Progreso general | Actividades completadas / total del programa; marca 100 % en cuanto se gana la copa. |
| Barra de nivel | `min(hechas / medalMin, 1)`; la misma cuenta alimenta el anillo de avance en Logros. |
| Racha | Sube con cada día con actividad; 1 día sin actividad no la rompe; 2 días seguidos sin actividad la reinician. Los días se simulan con un contador en memoria (`simDay`). |

---

## 7. Animación, movimiento y sonido

| Contexto | Implementación | Duración / easing |
|---|---|---|
| Cambio de paso (todo el cuestionario) | Variantes direccionales con `custom={direction}` en `AnimatePresence`: al avanzar la nueva entra desde la derecha (+40 px) y la actual sale por la izquierda; al retroceder, al revés | 280 ms, cubic‑bezier(0.25, 0.1, 0.25, 1) |
| Entrada a resultados | `opacity` + `scale: 0.96 → 1` | 280 ms, misma curva |
| Selección opción Fase 2 | keyframes `scale [1,1.02,0.99,1.01,1]` + `backgroundColor` lavanda pulsante | 450 ms easeInOut; luego `onNext` a 520 ms |
| Tap en opción | `whileTap={{ scale: 0.985 }}` | — |
| Barra de progreso | CSS `transition-all duration-500 ease-out` | 500 ms |
| Barra de perfil (Home) | `motion` `width: 0 → 30%` | 800 ms easeOut |
| Gauge + score | `requestAnimationFrame`, easeOutCubic | 1300 ms |
| Acordeones (Program) | `height: 0 → auto`, `opacity` | 200 ms |
| "Leer más" | Altura del contenedor animada entre las dos versiones medidas (`useLayoutEffect` + `ResizeObserver`) mientras los textos hacen crossfade de opacidad (0.25 s sale / 0.35 s entra con 0.1 s de retardo) | 450 ms, cubic‑bezier(0.04, 0.62, 0.23, 0.98) |
| Chevron "Leer más" | `rotate: 0 → 180` | 350 ms, misma curva |
| Indicador de tab | `layoutId` compartido | spring por defecto |
| Gráfico de evolución | Línea con `pathLength: 0 → 1` (700 ms) y puntos `scale: 0 → 1` en cascada | spring damping 18, stiffness 280, +120 ms por punto |
| Dropdown notificaciones | `opacity` + `y: 6 → 0` | por defecto |
| Toasts / snackbar | `opacity`, `y: 30 → 0`, `scale: 0.95 → 1` | spring damping 25, stiffness 350 |
| Botones | `active:scale-[0.98]` / `active:scale-95`, `transition-all` | ~150–200 ms |
| Radio/checkbox | CSS `transform: scale(0→1)` del punto | 120 ms |
| Porcentaje / puntos / racha (progreso) | `useCountUp` (`animate` de `motion`) | 0.9 / 0.6 / 0.7 s, cubic‑bezier(0.22, 1, 0.36, 1) |
| Barra de nivel (progreso) | `width: anterior → nuevo` | 0.9 s, misma curva |
| Medalla desbloqueada | `scale [1, 1.35, 1]` | 350 ms |
| Tarjetas de puntos y racha | `scale 0.3 → 1` | spring damping 13, stiffness 300 |
| Estrellas de fondo | `scale`, `opacity`, `rotate` en bucle | 2.4 s, desfasadas |
| Copa 3D | Entra con `scale 0.4 → 1` (spring) y un giro rápido que frena hasta 0.9 rad/s | ver §7.1 |
| Sunburst | `rotate 0 → 360` en bucle | 28 s lineal |
| Anillo de nivel (Logros) | `pathLength 0 → avance` | 900 ms, +100 ms por nivel |
| Pills "Aprendiste" | `scale 0.7 → 1` en cascada | spring, +80 ms por pill |

**Decisión:** fuera de la pantalla de progreso ninguna animación supera 1.3 s y la mayoría queda por debajo de 300 ms para que la app se sienta ágil. Se usa `mode="wait"` en los pasos para evitar que dos pantallas coexistan. La pantalla de progreso es la excepción deliberada: su secuencia completa dura unos 4 s porque es el momento de celebración.

### 7.1 Copa 3D ([ui/Trophy3D.tsx](src/components/ui/Trophy3D.tsx))

- **Modelo procedural** (sin archivos 3D): cuenco ancho torneado con spline, reborde grueso (toro), asas en tubo que terminan en un rizo, collar, pie que se afina y base gruesa, y una estrella redondeada en relieve en ambas caras, curvada para abrazar el cuenco.
- **Material:** `MeshStandardMaterial` mate tipo juguete, amarillo dorado claro `#FFD650` (estrella `#F5B92A`). Luces: hemisférica cálida + principal + contraluz; `NeutralToneMapping`, exposición 1.08.
- **Rendimiento:** la librería se precarga mientras se ve la primera pantalla; la copa se construye y compila oculta al entrar a la pantalla de la copa, y la secuencia espera su `onReady` para no tener tirones a mitad. Resolución máxima 2×.
- **Giro:** impulso inicial que decae (`0.9·t + 4.5·(1 − e^(−2t))` rad) más un leve vaivén vertical. Con `prefers-reduced-motion` queda quieta. Sin WebGL muestra una copa plana (`Trophy` sobre `.gold-medal`).

### 7.2 Sonido ([src/lib/sfx.ts](src/lib/sfx.ts))

Efectos sintetizados con Web Audio; el botón de sonido silencia todo y se recuerda en `localStorage` (`happly-sound-muted`).

| Efecto | Cuándo | Cómo suena |
|---|---|---|
| `fanfare` | Al abrir la pantalla de progreso | Golpe grave, carrerilla de metales y acorde mayor grande con eco y platillo |
| `sweep` | Mientras carga el porcentaje | Tono que sube con la misma curva que la animación y cierra con un "ding" |
| `tick` | Cada cifra que cambia en los contadores | Clic corto que sube de tono con el avance |
| `pop` | Al aparecer cada tarjeta | Burbuja ascendente |
| `chime` | Al desbloquear una medalla | Arpegio brillante de 4 notas |
| `trophy` | Al aparecer la copa | "Sha" corto (metales + platillo) y, tras una micro pausa, "shaaannn": acorde grande con bombo, platillo y destellos |
| `click` | "Continuar" y reactivar el sonido | Clic suave |

---

## 8. Estados interactivos

| Elemento | Reposo | Hover | Activo/Seleccionado | Deshabilitado |
|---|---|---|---|---|
| Botón primario | morado + sombra morada | `#7864D8` | `scale 0.98` | gris `#E5E2EE` / texto `#A29EAF`, sin sombra |
| Botón secundario | blanco, borde `#D5CEF9`, texto morado | `bg-brand-50/50` | `scale 0.98` | — |
| Opción radio | `gray-50`, texto gris | `bg-gray-50/80` | `bg-brand-100`, texto morado 500 | — |
| Input | `gray-50` | — | fondo blanco + `ring-2 ring-brand/30` (focus) | — |
| Tab | gris 700, peso 500 | gris 900 | morado, peso 600, subrayado | — |
| Pill filtro | borde gris, texto gris | `bg-gray-50` | borde + texto morado, `bg-brand/5` | — |
| Fila acordeón | blanco | `bg-gray-50/50–70` | — | — |
| Stat box (perfil) | `bg-white/20` | `bg-white/25` | — | — |
| Link | morado / azul | `underline` o tono más oscuro | — | — |

---

## 9. Iconografía

- Librería: `lucide-react`.
- Tamaños: 14 px (`w-3.5`) en pills, 16 px (`w-4`) en listas, 20 px (`w-5`) en cabeceras de tarjeta, 24 px (`w-6`) en tarjetas de reglas, 28–40 px en estados vacíos.
- Stroke: `1.5` para iconos ilustrativos grandes, `1.8` para cabeceras, `2–2.5` para chevrons y checks (más contraste).
- Iconos propios en SVG: logo Happly, WhatsApp (path oficial), sobre de correo, medalla de nivel (ícono "medal" de iconsax), candado sólido, copa sólida y medalla del ranking.
- **Medallas y copas:** íconos sólidos (sin contorno) que ocupan siempre la mitad de su círculo (`BADGE_ICON = w-1/2 h-1/2`), en todos los tamaños. Ganado = color; por ganar = círculo `gray-50` con borde punteado `gray-300` e ícono `gray-400`.
- Emojis en texto de resultados y toasts (🎉 🌟 🏆 ⭐️).

---

## 10. Accesibilidad (estado actual)

- ✅ `<fieldset>`/`<legend>` en grupos de radio; `<label htmlFor>` en inputs; `aria-label` en botones solo‑icono y en el logo.
- ✅ Targets ≥ 56 px en formularios.
- ✅ `alt` descriptivo en imágenes.
- ✅ Anillo de foco visible con teclado (`:focus-visible`) en radios, checkboxes, botones, tabs, pills y acordeones (`.focus-ring`).
- ✅ Modales con `role="dialog"`, `aria-modal`, `aria-labelledby`, Escape, clic fuera, trap de foco y devolución del foco al cerrar; scroll del body bloqueado.
- ✅ Barras de progreso con `role="progressbar"` + `aria-valuenow`; tabs con `role="tab"`/`aria-selected`; acordeones con `aria-expanded`; toasts con `role="status"`; aviso de términos rechazados con `role="alert"`.
- ✅ Medallas, copas y anillos con `role="img"` y `aria-label` ("Medalla ganada", "Copa bloqueada", "Medalla de oro, puesto 1"…); el porcentaje de la pantalla de progreso es un `progressbar`.
- ✅ Botón para silenciar los sonidos con `aria-pressed`; la copa 3D respeta `prefers-reduced-motion`.
- ⚠️ Contraste bajo en algunos textos secundarios (`gray-400`, `gray-400` sobre blanco) y en `text-white/90` sobre morado.
- ⚠️ Las demás animaciones de la pantalla de progreso (contadores, estrellas, sunburst) no respetan `prefers-reduced-motion`.
- ⚠️ El auto‑avance de la Fase 2 no es cancelable por teclado más allá de pulsar "Volver".

---

## 11. Decisiones de diseño y trade‑offs

1. **Fidelidad al mockup con tokens.** Se conservan tamaños exactos (`text-[13.5px]`, `top-[68px]`) para reproducir el diseño de origen, pero colores y sombras pasan por `@theme` y los patrones repetidos viven en `ui/`. El botón primario se define una sola vez en `Button`.
2. **Auto‑avance en la Fase 2.** Reduce fricción en 10 preguntas seguidas. Se mantiene el botón "Siguiente" como salida explícita y "Volver" cancela el timer.
3. **Snackbar solo al cerrar la Fase 1.** Un único momento de celebración a mitad del flujo, con color verde (fuera de la paleta de marca) para que destaque.
4. **Resultados sobre fondo blanco.** El gauge multicolor y las tarjetas con borde morado se leen mejor sin el degradado lavanda.
5. **Scrollbar custom en el texto legal.** Se oculta el nativo y se dibuja uno siempre visible para que sea evidente que hay más texto que leer antes de aceptar.
6. **Una sola superficie de tarjeta.** Antes había cuatro (Home con sombra, Programa/Ranking con borde más fuerte y radio 16 px, resultados con borde morado, reglas sin sombra). Ahora todas comparten `CARD_SURFACE`; lo que las diferencia es el contenido, no el contenedor. La tarjeta de perfil morada y las capas flotantes (modal, dropdown, toast) son las únicas excepciones deliberadas.
7. **Datos de demo hardcodeados** (nombre "Daniel", scores 3.4, fechas de mayo 2026; el progreso, los puntos y la racha ya salen del estado de gamificación). El cálculo real de scores solo existe en `ResultsSummary` (promedios por dimensión: Gratificación = Q2,5,8; Disfrute = Q1,4,7,9,10; Sentido = Q3,6; escala 1–4; umbrales Alto ≥ 3.5, Medio ≥ 2.5).
8. **Un solo idioma (español)** en toda la app (ver §6.1).
9. **Gamificación sin castigo.** La medalla pide un mínimo de actividades (no todas) y la copa 3 de 4 medallas; la racha perdona un día. El objetivo es motivar, no exigir perfección.
10. **Un único punto de cierre de actividad.** Inicio, Programa y el onboarding llevan a la misma pantalla de actividad, y su botón "Enviar" es lo único que completa una actividad y dispara la celebración.
11. **Lo ya logrado no se vuelve a animar.** Barras y medallas anteriores aparecen quietas; solo se anima el avance de la actividad recién hecha, para que la atención vaya a lo nuevo.
12. **Copa 3D procedural.** Se modela con código (Three.js) en vez de usar un archivo, para que gire de verdad y pese poco; es una aproximación a la referencia de diseño, no una copia exacta.
13. **Una escala por familia de color.** Se fusionaron 13 variantes de morado en 7 pasos, tres escalas de gris (`gray-*` de Tailwind, `ink-*`, `black`) en una sola, y los verdes/ámbar/rojos de Tailwind (`emerald`, `amber`) con los semánticos propios. Cambios visibles: el link del footer pasa de azul a morado, el gradiente del gauge tiene 3 paradas en vez de 5, el `#333333` del body pasa a `gray-900`.

---

## 12. Deuda y oportunidades

Saldado (octubre 2026): sistema de gamificación (medallas, copa, racha, puntos, ranking con el usuario real), pantalla de progreso con sonido y copa 3D, medallas y copas unificadas en todas las pantallas.

Saldado (septiembre 2026): tokens en `@theme`, paleta unificada en una escala por familia, primitivos en `ui/`, componentes legacy eliminados, copy en español, foco accesible y modales semánticos, typo de resultados, `Footer` reutilizado.

Pendiente:

- Contraste de `gray-400` sobre blanco y de `text-white/90` sobre morado (AA en texto pequeño).
- Todo el estado de gamificación vive en memoria: se pierde al recargar. Falta persistencia/backend.
- Datos de ejemplo hardcodeados: `OTHER_PROGRAMS` (programas y copas de muestra), `BASE_LEADERBOARD` (6 usuarios "Nombre", 200 pts), scores de felicidad.
- Ajustes solo para revisión, a quitar antes de producción: la pantalla de ejemplo de la copa tras la primera pantalla de progreso (`trophyCase` en `ActivityCelebrationFlow`), `EXAMPLE_LEVELS_REACHED` y `EXAMPLE_LEVEL_PROGRESS` en `AchievementsTab` (muestran el nivel 1 ganado y el nivel 2 al 30 % aunque el estado real sea otro, por lo que Logros y Programa no coinciden).
- Prueba de diseño activa: `WIN_REPLACES_LEVELS` (el bloque "Aprendiste" reemplaza la fila de niveles en la pantalla de la copa).
- Campo sin uso: `medalCelebrated` en `DashboardWeek`.
- Los sonidos no se pueden previsualizar fuera del navegador; afinar volumen y duración con pruebas reales.
- El auto‑avance de la Fase 2 podría respetar `prefers-reduced-motion` y ofrecer cancelación por teclado.
- Los keyframes de parpadeo de la Fase 2 duplican `brand-100`/`brand-200` en JS porque `motion` no interpola `var()`.
