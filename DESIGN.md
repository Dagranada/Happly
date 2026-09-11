# Happly — Sistema de diseño

Documento de referencia del diseño de la app **Happly – Conozcámonos**: tokens visuales, componentes, pantallas, animaciones y las decisiones que hay detrás. Todo lo descrito aquí está extraído del código actual (`src/`), no de un archivo de diseño externo.

---

## 1. Stack y fundamentos técnicos

| Capa | Herramienta | Notas |
|---|---|---|
| UI | React 19 + TypeScript | Componentes funcionales, sin librería de UI externa |
| Estilos | Tailwind CSS v4 (`@tailwindcss/vite`) | Utilidades inline sobre tokens `@theme` (`bg-brand`, `shadow-cta`…) |
| CSS global | [src/index.css](src/index.css) | Fondo degradado, radios/checkboxes personalizados, scrollbars |
| Animación | `motion` (Framer Motion v12) | Transiciones entre pasos, acordeones, toasts, indicador de tab |
| Iconos | `lucide-react` | Stroke 1.5–2.5 según jerarquía |
| Tipografía | Plus Jakarta Sans (Google Fonts) | Pesos 400/500/600/700 + itálica 400, cargada en [index.html](index.html) |
| Build | Vite 6, puerto 3000 | |

**Decisión:** los tokens viven en un bloque `@theme` en [src/index.css](src/index.css) (Tailwind v4). Cada color/sombra de este documento existe como utilidad (`bg-brand`, `text-gray-800`, `shadow-cta`, `border-brand/25`…). No hay `[#hex]` arbitrarios en los componentes; los únicos hex en TSX son los que van a JS (gradiente SVG del gauge, medallas, keyframes de `motion`).

---

## 2. Principios de diseño

1. **Mobile‑first, con reflow en desktop.** Home vive en `max-w-md`/`max-w-lg` hasta `lg`; desde 1024 px pasa a `lg:max-w-5xl xl:max-w-6xl` con dos columnas: tarjeta de perfil fija a la izquierda (`360px`, `sticky top-6`) y tabs + contenido a la derecha; en Inicio las tarjetas de actividad e intención van lado a lado y felicidad/evolución ocupan las dos columnas; Logros pasa a 5 columnas de insignias. El cuestionario ensancha a `md:max-w-2xl → lg:3xl → xl:4xl` y desde `md` reordena: reglas en 2 tarjetas en fila con Sí/No a la izquierda y CTA a la derecha; intro de Fase 2 con ilustración a la izquierda y texto a la derecha; resultados con las 3 dimensiones en fila. Un brillo lavanda en la esquina superior derecha (`hidden md:block`) acompaña el desktop.
2. **Suave y cálido, no clínico.** Fondo lavanda muy claro con degradado, bordes redondeados grandes (16–28 px), sombras difusas de baja opacidad, sin líneas duras.
3. **Un solo color de marca.** El morado `#8774E1` hace todo el trabajo de acento: botones primarios, progreso, selección, links, tabs activas. Los demás colores son semánticos (éxito, error, pendiente) o neutros.
4. **Tarjetas blancas sobre fondo tintado.** Las superficies se separan del fondo por contraste blanco/lavanda, no por bordes marcados.
5. **Sin bordes en formularios.** Inputs y opciones de radio son bloques blancos sin borde; el estado seleccionado se comunica con relleno lavanda + texto morado, y el foco con un anillo morado translúcido.
6. **Targets táctiles ≥ 56 px.** Toda opción de radio/checkbox y todo input tiene `min-h-[56px]` (reforzado globalmente en CSS con `:has()`).
7. **Feedback inmediato y ligero.** Micro‑animaciones cortas (200–500 ms), toasts que desaparecen solos, auto‑avance en la Fase 2.
8. **Español informal y cercano (tuteo).** Tono de "compañero", emojis en los textos de resultados.

---

## 3. Tokens

### 3.1 Color

Regla: **una escala por familia**, definida en `@theme` ([src/index.css](src/index.css)). Ningún componente usa `[#hex]`; los únicos hex en TSX son los keyframes de `motion` (no interpola `var()`), documentados junto a su token.

#### Marca (`brand`)

| Token | Hex | Uso |
|---|---|---|
| `brand-50` | `#F3F1FF` | Inicio del degradado del body, bloque "intención guardada", hover del botón secundario |
| `brand-100` | `#EDE9FE` | Opción seleccionada, pills de navegación, track del scrollbar legal, glow ambiental, fondo de icono en modal |
| `brand-200` | `#D8CDFB` | Blob de la ilustración, borde del botón secundario, botón enviar |
| `brand-300` | `#C9BFF5` | Hover del botón enviar |
| `brand` | `#8774E1` | CTA, barra de progreso, radio seleccionado, tab activa, links (incluido el del footer) |
| `brand-600` | `#7864D8` | Hover del CTA y de links, fondo de respaldo del avatar |
| `brand-900` | `#342475` | Título "Felicidad general" en Inicio |

#### Grises (`gray`, sobrescribe la escala de Tailwind)

| Token | Hex | Uso |
|---|---|---|
| `gray-50` | `#F8F9FA` | Fondo de Inicio, fin del degradado del body, fondo de notas |
| `gray-100` | `#F3F4F6` | Bordes suaves, divisores, input de intención, track del gauge |
| `gray-200` | `#E5E5EA` | Bordes de tarjeta, track de progreso, botón deshabilitado, badge "Pendiente", borde del knob |
| `gray-300` | `#D1D1D6` | Reservado |
| `gray-400` | `#9B9B9B` | Logo, placeholders, notas al pie, texto deshabilitado, borde de radio/checkbox, medalla de plata |
| `gray-500` | `#7B7B7B` | Texto legal, footer, ejes del gráfico |
| `gray-600` | `#6B6B6B` | Iconos de cabecera de tarjeta, texto de "Pendiente" |
| `gray-700` | `#555555` | Párrafos descriptivos, cinta de la medalla de plata |
| `gray-800` | `#4A4A4A` | Etiquetas de pregunta, texto de opciones, cuerpo en Inicio |
| `gray-900` | `#2D2D2D` | Texto base (`body`) y títulos |

#### Semánticos (`success` / `warning` / `danger`)

Cada familia tiene tres pasos: **100** fondo suave, **500** sólido, **700** texto sobre el fondo suave.

| Token | Hex | Uso |
|---|---|---|
| `success-100` / `success-700` | `#EAF8EE` / `#2D9F53` | Badges "Alto" y "Completada" |
| `success-500` | `#10B981` | Snackbar de éxito, icono "Completada", botón "Actividad completada", check del toast, icono WhatsApp activo |
| `warning-100` / `warning-700` | `#FEF6E1` / `#9A7D2C` | Badge nivel "Medio", aviso de términos rechazados |
| `warning-200` | `#F6E7B8` | Borde del aviso de términos rechazados |
| `warning-500` / `warning-600` / `warning-800` | `#F5A623` / `#D48806` / `#AD6800` | Medallas oro (500/600) y bronce (600/800); punto medio del gauge; insignia desbloqueada en Logros (500) |
| `danger-100` / `danger-700` | `#FEECEC` / `#E04F4F` | Badges "Bajo" e "Incompleta" |
| `danger-500` | `#FF5A5F` | Icono "Incompleta", inicio del gauge |

#### Acentos

| Token | Hex | Uso |
|---|---|---|
| `accent-teal` | `#48C6B6` | Puntos de nivel "Alto" en el gráfico de evolución |
| `accent-yellow` | `#F8EEA6` | Mancha decorativa detrás del retrato (intro Fase 2) |

#### Gauge de resultados

Gradiente de 3 paradas sobre tokens: `danger-500 → warning-500 → success-500`; track `gray-100`, knob blanco con borde `gray-200`.

#### Neutros absolutos

`white` y `black` (este último sólo en el fondo del modal `bg-black/40` y en la sombra SVG del knob).

### 3.2 Tipografía

Fuente única: **Plus Jakarta Sans**, `antialiased`.

| Rol | Tamaño | Peso | Ejemplo |
|---|---|---|---|
| H1 cuestionario | 22 → 26 → 28 px | 700 | "Daniel, Conozcamonos" |
| H1 resultados | 26 → 30 → 32 px | 800 | "Tus resultados" |
| Score gauge | 44 px | 800, `tabular-nums` | "3.4" |
| Stat grande (tarjeta perfil) | 28 px | 800, `tabular-nums` | "4", "50" |
| H2 sección | 18–20 px | 700 | "Mi felicidad actual" |
| H2 intro Fase 2 | 20 → 23 → 25 px | 700, color brand | |
| Título de tarjeta | 17 px | 700 | Acordeón Program |
| Pregunta / label | 16 → 17 → 18 px | 500, `#4A4A4A` | "¿Tienes pareja?" |
| Enunciado Fase 2 | 17 → 19 → 20 px | 500 | "En mi cotidianidad..." |
| Botón primario | 17 → 18 px | 600 | "Continuar" |
| Opción de radio | 15 → 16 px | 500 | |
| Cuerpo | 14.5 → 15 px | 400, `leading-relaxed` | |
| Texto secundario | 13–13.5 px | 400–500 | |
| Badge | 10–12.5 px | 700 | "Medio" |
| Texto legal / footer | 12–13.5 px | 400 | |
| Micro | 10–11.5 px | 600–700 | Tooltip, label "Tu compromiso guardado" |

**Decisión:** se usan tamaños arbitrarios en px (`text-[15px]`) en vez de la escala de Tailwind para reproducir fielmente el diseño original. `tracking-tight` en títulos y números; `leading-snug`/`leading-relaxed` en cuerpo.

### 3.3 Espaciado y layout

- Padding horizontal del contenedor: `px-4 sm:px-6 md:px-8`.
- Ancho máximo: Home `max-w-md sm:max-w-lg lg:max-w-5xl xl:max-w-6xl`; cuestionario `max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl`.
- Espaciado vertical entre preguntas: `space-y-7`; entre tarjetas: `space-y-4`; entre opciones: `space-y-3 / 3.5`.
- Padding de tarjetas: `p-5` (Home), `p-5 sm:p-6 md:p-7` (reglas), `p-4 sm:p-5` (resultados).
- Logo con 48 px de aire superior (`pt-12`) en el cuestionario.
- Botones: `py-3.5 sm:py-4 px-9`.

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
| Micro | `shadow-xs`, `shadow-2xs` | Pills, badges, botón enviar, medallas |
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
| `.focus-ring` | Anillo de foco morado sólo en `:focus-visible` (teclado) |
| `.custom-radio` | Radio nativo reemplazado: círculo 20 px, borde `#9CA3AF` 1.8 px, punto interior morado 10.4 px que escala de 0→1 en 120 ms |
| `.custom-checkbox` | Checkbox 21.6 px, radio 6 px, fondo morado al marcar con check blanco en CSS |
| `label:has(.custom-radio)` etc. | Fuerza `min-height: 56px` en cualquier contenedor de radio |
| `.custom-hide-native-scroll` | Oculta el scrollbar nativo (se usa con el scrollbar custom del texto legal) |
| `.custom-legal-scroll` | Scrollbar fino (6 px) morado sobre track `#EDE8F7` — fallback |
| `input[type="date"]::-webkit-calendar-picker-indicator` | Oculta el icono nativo para usar el `<Calendar>` de Lucide |

**Decisión:** el foco por ratón no muestra anillo (fidelidad visual), pero `:focus-visible` (teclado) sí dibuja un anillo morado translúcido en radios, checkboxes y en todo elemento con `.focus-ring`.

---

## 5. Componentes

### 5.1 Primitivos (`src/components/ui/`)

| Componente | Archivo | API |
|---|---|---|
| `Button` | [ui/Button.tsx](src/components/ui/Button.tsx) | `variant`: `primary` \| `secondary` \| `ghost` (`pill` disponible, sin uso actual); `size`: `lg` (pasos) \| `md` (Home, modales). Soporta `disabled`. |
| `RadioOption` | [ui/RadioOption.tsx](src/components/ui/RadioOption.tsx) | Tarjeta seleccionable (`<motion.label>`): `name`, `value`, `checked`, `onChange`, `label`, `centerOnMobile`; acepta props de `motion` (animación de parpadeo en Fase 2). |
| `BackButton` | [ui/BackButton.tsx](src/components/ui/BackButton.tsx) | `Button` secundario con flecha `ArrowLeft` + "Volver"; usado en Step1–3 y en las preguntas de Fase 2. |
| `NextButton` | [ui/NextButton.tsx](src/components/ui/NextButton.tsx) | `Button` primario `type="submit"` con "Siguiente" + `ArrowRight`; acepta `disabled`. Usado en Step1, Step2 y preguntas 1–9 de Fase 2. |
| `Card` | [ui/Card.tsx](src/components/ui/Card.tsx) | Superficie única `bg-white rounded-3xl border border-gray-100 shadow-card` (exportada como `CARD_SURFACE`); `flush` quita el padding. Sin variantes. |
| `LevelBadge` / `StatusBadge` | [ui/Badge.tsx](src/components/ui/Badge.tsx) | Nivel Alto/Medio/Bajo (`size` sm/md) y estado Pendiente/Completada/Incompleta. `getLevel(score)` vive en [lib/levels.ts](src/lib/levels.ts). |
| `Avatar` | [ui/Avatar.tsx](src/components/ui/Avatar.tsx) | Foto circular; sin `src` muestra el vector predeterminado (`UserRound` en `brand` sobre `brand-100`). Usado en la tarjeta de perfil (con lápiz para cambiar la foto) y en el Ranking. |
| `Toast` | [ui/Toast.tsx](src/components/ui/Toast.tsx) | `message` (null oculta), `variant`: `dark` \| `success`, `onClose`. `role="status"`. |
| `Modal` | [ui/Modal.tsx](src/components/ui/Modal.tsx) | `isOpen`, `onClose`, `labelledBy`, `size` sm/lg. `role="dialog"`, `aria-modal`, Escape, clic fuera, trap de foco y devolución del foco. |

Las clases de referencia de cada primitivo:

#### Botón primario
```
py-3.5 sm:py-4 px-9 rounded-full bg-brand text-white font-semibold text-[17px] sm:text-[18px]
shadow-cta hover:bg-brand-600 active:scale-[0.98] transition-all
```
- Deshabilitado: `bg-gray-200 text-gray-400 cursor-not-allowed shadow-none`.
- Textos: "Continuar", "Siguiente" (con `ArrowRight`, componente `NextButton`), "Terminar", "Empezar", "Entendido", "Enviar" (con `Send`, actividades).

#### Botón secundario (outline)
```
py-3.5 sm:py-4 px-9 rounded-full border border-brand-200 bg-white text-brand font-semibold
hover:bg-brand-50/50 active:scale-[0.98]
```
- Texto: "Volver" precedido de `ArrowLeft` (componente `BackButton`). Siempre va a la izquierda del primario, `gap-3.5`.

#### Botón compacto (Home)
`px-6 py-2.5 rounded-full text-[14px] font-semibold bg-brand` → al completar cambia a `bg-success-500`.

#### Botonera flotante (`FloatingNav`)
`fixed bottom-5 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border-gray-100 rounded-full shadow-xl shadow-brand/10 p-1.5`. Seis botones circulares con icono Lucide; el activo va `bg-brand text-white shadow-cta`, el resto `text-gray-500` con hover `brand-50`. Destinos: Términos (paso 0), Datos personales (paso 1), Test de felicidad (paso 4), Resultados (paso 15), Actividades (paso 16), Inicio. Botones `w-10` en móvil / `w-11` desde `sm`. Sustituye a las antiguas pills "Volver a la pantalla de inicio" / "Tomar cuestionario / editar". El `main` lleva `pb-28` y los toasts suben a `bottom-24` para no chocar con ella.

#### Pill de filtro (toggle)
- Activo: `border border-brand text-brand bg-brand/5 font-semibold`.
- Inactivo: `border border-gray-200 text-gray-600 bg-white hover:bg-gray-50`.

#### Opción de radio (tarjeta seleccionable)
```
min-h-[56px] rounded-2xl px-4 py-3.5 flex items-center gap-3.5 cursor-pointer transition-all
seleccionado: bg-brand-100 + texto text-brand font-medium
no seleccionado: bg-white hover:bg-gray-50/80 + texto gris
```
Contiene `<input class="custom-radio">` + label. Variantes: Sí/No en fila (`flex gap-2.5 max-w-xs`), género en `grid-cols-3`, opciones largas apiladas (`space-y-3.5`).

#### Input de texto / número / fecha
```
w-full min-h-[56px] bg-white border-none rounded-2xl px-5 text-[15px] sm:text-[16px] text-gray-700
placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30
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

#### Modal
`fixed inset-0 z-50 bg-black/40 backdrop-blur-xs` + panel `bg-white rounded-3xl p-6 shadow-xl max-w-xs|lg`.

#### Barra de progreso
Altura única `h-2` (8 px) en todas las barras. Track `bg-gray-200 rounded-full` + relleno `bg-brand` con `transition-all duration-500` (cuestionario); `bg-brand-100` + `bg-brand` (Felicidad general); `bg-white/30` + `bg-white` sobre la tarjeta de perfil morada.

### 5.2 Componentes de archivo

| Componente | Archivo | Responsabilidad | Detalles visuales clave |
|---|---|---|---|
| `App` | [src/App.tsx](src/App.tsx) | Máquina de estados: `viewMode` (`home` \| `survey`) y `currentStep` (0–19, constantes en `STEP`). `renderStep()` con `switch`; `goToStep()` registra la dirección (1/−1) que alimenta las variantes de transición. | Fondo blanco cuando `currentStep === 15`. Contenedor `max-w-lg → 2xl`. |
| `HapplyLogo` | [src/components/HapplyLogo.tsx](src/components/HapplyLogo.tsx) | Logo SVG inline (wordmark "Happly®" con sonrisa), `fill="currentColor"`. Prop `className`. | Color vía clase de texto (`text-gray-400`). Alturas `h-8/9/11`. |
| `Header` | [src/components/Header.tsx](src/components/Header.tsx) | Logo + título dinámico `"{nombre}, {sufijo}"` + barra de progreso. | Sufijos: paso 0 "Conoce las reglas", 1–3 "Conozcamonos", 4–14 "midamos tu felicidad en el trabajo", 15 "Tus resultados" (centrado, sin barra). Progreso: 33/66/100 % en Fase 1, `n/10` en Fase 2, vacío en paso 4. |
| `FloatingNav` | [src/components/FloatingNav.tsx](src/components/FloatingNav.tsx) | Botonera flotante de 6 destinos; recibe `active` y `onNavigate`. `App` traduce el destino a `viewMode`/`currentStep`. | Ver §5.1. |
| `Footer` | [src/components/Footer.tsx](src/components/Footer.tsx) | Copyright + link a términos. Acepta `className`. | `text-xs text-gray-500`, link `text-brand`, `border-t border-gray-100/80`. Usado en App y HomeScreen. |
| `StepRules` | [src/components/StepRules.tsx](src/components/StepRules.tsx) | Paso 0: precauciones, confidencialidad, política de datos con scroll y pregunta Sí/No. | Dos `Card` con icono Lucide (`Eye`, `BadgeCheck`, stroke 1.5), en `md:grid-cols-2`; fila final `md:flex justify-between` con Sí/No a la izquierda y "Continuar" a la derecha. Caja legal (`Card` de `h-44/52/56`) con **scrollbar custom siempre visible** (track `#EDE8F7`, thumb morado, calculado en JS). Aviso ámbar si responde "No". |
| `Step1` | [src/components/Step1.tsx](src/components/Step1.tsx) | Datos demográficos: género (3 cols), fecha, pareja, profesión, hijos. | Input numérico estrecho `w-24 sm:w-28`. |
| `Step2` | [src/components/Step2.tsx](src/components/Step2.tsx) | 4 preguntas Sí/No + preferencia laboral (radio apilado). | Helper `renderYesNoQuestion`. |
| `Step3` | [src/components/Step3.tsx](src/components/Step3.tsx) | Preferencia laboral (3 opciones). Botón "Terminar". | Layout `flex-grow justify-between` para empujar los botones abajo. |
| `StepPhase2Intro` | [src/components/StepPhase2Intro.tsx](src/components/StepPhase2Intro.tsx) | Ilustración + instrucciones para la Fase 2. | Desde `md`: ilustración a la izquierda (`shrink-0`) y título + bullets a la derecha; nota y "Empezar" debajo a todo el ancho. Composición: blob lavanda orgánico (`rounded-[48%_52%_45%_55%/…]`) + acento amarillo rotado + retrato circular recortado. Título en color brand. Bullets con puntos `w-1.5 h-1.5 bg-gray-500`. |
| `StepPhase2Question` | [src/components/StepPhase2Question.tsx](src/components/StepPhase2Question.tsx) | Pregunta genérica de Fase 2 (10 bloques de 4 afirmaciones). | **Auto‑avance** 520 ms tras seleccionar, con animación de "parpadeo" (`scale` y `backgroundColor` en keyframes). Botón submit deshabilitado hasta responder. |
| `ResultsSummary` | [src/components/ResultsSummary.tsx](src/components/ResultsSummary.tsx) | Paso 15: gauge SVG, texto general expandible, 3 tarjetas de sub‑dimensión, modal de confirmación. | Gauge: arco de 260° (140°→400°), r=85, stroke 8, gradiente `danger-500 → warning-500 → success-500`, knob blanco con `feDropShadow`. Score y knob animados con `requestAnimationFrame` + easeOutCubic (1.3 s). "Leer más/menos" con altura animada + crossfade (`ExpandableText`) y chevron rotando 180°. |
| `ActivityStep` | [src/components/ActivityStep.tsx](src/components/ActivityStep.tsx) | Pasos 16–19: una actividad del programa por pantalla (datos en [src/data/activities.ts](src/data/activities.ts)). Guarda `{ text, mood }` en `formData.activityAnswers`. | "Actividad N de 4" (16–17 px semibold) + fecha límite (13 px `gray-500`); título 26→32 px bold en `brand`; descripción `gray-700`; `textarea` blanca sin borde (`min-h-[112px]` en móvil, `56px` en desktop); escala de ánimo con 5 caras Lucide (`Frown`, `Annoyed`, `Meh`, `Smile`, `Laugh`, 36 px) con etiquetas "Muy mal" / "Muy bien" en los extremos, seleccionada en `brand`; botón `Enviar` (con icono `Send`) deshabilitado hasta tener texto y ánimo. Header solo con logo. La última actividad lleva a Inicio. |
| `HappinessChart` | [src/components/HappinessChart.tsx](src/components/HappinessChart.tsx) | Gráfico SVG mes a mes (30 May → 30 Ago): eje Y fijo (Alto/Medio/Bajo/Muy bajo) y área desplazable horizontalmente con `snap-x` por mes (cada mes ocupa 140 px, así en móvil se navega con swipe). Recibe `points` y `seriesKey` (reanima al cambiar de filtro). | Guías punteadas `gray-200`; línea `brand` 2 px dibujada con `pathLength`; puntos r=7 con halo r=14 al 18 %, coloreados por nivel (`accent-teal` Alto, `warning-500` Medio, `danger-500` Bajo) y entrada en cascada (spring, 120 ms entre puntos); `<title>` con valor y nivel. |
| `HomeScreen` | [src/components/HomeScreen.tsx](src/components/HomeScreen.tsx) | Dashboard post‑cuestionario con tabs. | Ver §6.1. |
| `ProgramTab` | [src/components/ProgramTab.tsx](src/components/ProgramTab.tsx) | Acordeón de 3 niveles (programa → semana → actividad) generado desde `PROGRAMS` (datos), con `Collapsible` y `ActivityRow` internos. | `Card flush`. Chevrons stroke 2.5. Items con icono de estado (`Clock` gris, `CheckCircle2` verde, `XCircle` rojo). Altura animada con `motion` (`height: 0 → auto`, 200 ms). |
| `AchievementsTab` | [src/components/AchievementsTab.tsx](src/components/AchievementsTab.tsx) | Tarjeta de racha (3 stats, sin título) + tarjeta "Logros" de 25 insignias en `grid-cols-4`. Recibe `stats` y cada insignia decide `unlockedWhen(stats)`. | Stats en `gray-900`, 28 px extrabold, `divide-x`. Insignia bloqueada: círculo `w-14 sm:w-16`, `border-2 border-gray-100`, icono `gray-400`, etiqueta 12 px `gray-400` truncada. Desbloqueada: `bg-warning-500` sólido, icono blanco, `shadow-lg shadow-warning-500/30`, etiqueta `text-brand`. Contador "N logros desbloqueados" en `brand`. |
| `LeaderboardTab` | [src/components/LeaderboardTab.tsx](src/components/LeaderboardTab.tsx) | Ranking de 6 usuarios, sin título (la tab ya lo nombra). | `MedalBadge` para top 3 (círculo + cinta SVG con clases `bg-warning-*`/`fill-*`), número para el resto. Fila: rank + `Avatar` 40 px + nombre + "200 PTS". |
| `TermsModal` | [src/components/TermsModal.tsx](src/components/TermsModal.tsx) | Modal de términos y condiciones. | Icono `ShieldCheck` en cuadrado `bg-brand-100 rounded-2xl`, aviso con `Lock`, 3 secciones con `FileText`. `max-h-[90vh] overflow-y-auto`. |

---

## 6. Pantallas y flujo

```
Home (dashboard) ◀──── FloatingNav (6 atajos) ────▶ Cuestionario
                                              │
   paso 0  Reglas y política ─── acepta ──▶ paso 1  Datos personales   (33 %)
                                              paso 2  Contexto / apoyo  (66 %)
                                              paso 3  Preferencia       (100 %) ── "Terminar"
                                              paso 4  Intro Fase 2  ◀── snackbar verde 4.5 s
                                              pasos 5–14  Preguntas 1–10 (auto‑avance, 10–100 %)
                                              paso 15 Resultados (fondo blanco) ── "Entendido"
                                                        └─ modal: Ir a Home / Permanecer / Reiniciar
                                              pasos 16–19  Actividades 1–4 (texto + ánimo) ── última → Home
```

### 6.1 Home

Orden vertical en móvil (en `lg+` el punto 3 vive en un `aside` sticky a la izquierda y del 4 en adelante en la columna derecha):

1. Logo centrado (`h-8 sm:h-9`, `gray-400`).
3. **Tarjeta de perfil morada** (`bg-brand rounded-3xl p-5 sm:p-6`): `Avatar` 40 px con borde `white/60` y botón lápiz para subir una foto (vector predeterminado si no hay), nombre 17 px semibold, "Progreso general 30 %" con barra blanca animada (0→30 % en 0.8 s), dropdown de notificaciones (Mail/WhatsApp, `bg-white/20 backdrop-blur-xs`), grid 3 stats (`bg-white/20 rounded-2xl border-white/10`): Racha, Puntos, Ánimo. Un círculo `bg-white/10 blur-xl` en la esquina como brillo decorativo.
4. **Tabs** Inicio / Programa / Logros / Ranking (`justify-between` en móvil, `lg:justify-start lg:gap-10` en desktop): `text-[14px] sm:text-[15px]`, activa en morado semibold con subrayado `h-[2.5px]` animado por `layoutId="activeTabIndicator"`.
5. Contenido de la tab:
   - **Inicio:** tarjeta "Tu actividad de hoy" (icono `ClipboardCheck`, botón "Realizar actividad" → verde al completar, +25 pts, +1 streak); tarjeta "Mi intención para esta semana" (input gris `bg-gray-100` + botón enviar lavanda; al guardar muestra bloque `bg-brand-50 border-brand/20` con la cita en itálica, +10 pts); sección "Mi felicidad actual": `Card` "Felicidad general" (título `brand-900`, badge de nivel + score 30 px en `brand`, barra de progreso `brand` sobre `brand-100` al `score/4`) y debajo tres `Card` en `grid-cols-3 gap-3`, una por dimensión, centradas (nombre, score 24 px, badge); sección "Evolución de mi felicidad" (4 pills de filtro con `flex-wrap` + `HappinessChart`).
   - **Programa:** ver `ProgramTab`.
   - **Logros:** ver `AchievementsTab`. La mejor racha se guarda en `bestStreak` (máximo histórico de `streakCount`).
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

---

## 7. Animación y movimiento

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

**Decisión:** ninguna animación supera 1.3 s y la mayoría queda por debajo de 300 ms para que la app se sienta ágil. Se usa `mode="wait"` en los pasos para evitar que dos pantallas coexistan.

---

## 8. Estados interactivos

| Elemento | Reposo | Hover | Activo/Seleccionado | Deshabilitado |
|---|---|---|---|---|
| Botón primario | morado + sombra morada | `#7864D8` | `scale 0.98` | gris `#E5E2EE` / texto `#A29EAF`, sin sombra |
| Botón secundario | blanco, borde `#D5CEF9`, texto morado | `bg-brand-50/50` | `scale 0.98` | — |
| Opción radio | blanco, texto gris | `bg-gray-50/80` | `bg-brand-100`, texto morado 500 | — |
| Input | blanco | — | `ring-2 ring-brand/30` (focus) | — |
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
- Iconos propios en SVG: logo Happly, WhatsApp (path oficial), sobre de correo, cinta de medalla.
- Emojis en texto de resultados y toasts (🎉 🌟 🏆 ⭐️).

---

## 10. Accesibilidad (estado actual)

- ✅ `<fieldset>`/`<legend>` en grupos de radio; `<label htmlFor>` en inputs; `aria-label` en botones solo‑icono y en el logo.
- ✅ Targets ≥ 56 px en formularios.
- ✅ `alt` descriptivo en imágenes.
- ✅ Anillo de foco visible con teclado (`:focus-visible`) en radios, checkboxes, botones, tabs, pills y acordeones (`.focus-ring`).
- ✅ Modales con `role="dialog"`, `aria-modal`, `aria-labelledby`, Escape, clic fuera, trap de foco y devolución del foco al cerrar; scroll del body bloqueado.
- ✅ Barras de progreso con `role="progressbar"` + `aria-valuenow`; tabs con `role="tab"`/`aria-selected`; acordeones con `aria-expanded`; toasts con `role="status"`; aviso de términos rechazados con `role="alert"`.
- ⚠️ Contraste bajo en algunos textos secundarios (`gray-400`, `gray-400` sobre blanco) y en `text-white/90` sobre morado.
- ⚠️ El auto‑avance de la Fase 2 no es cancelable por teclado más allá de pulsar "Volver".

---

## 11. Decisiones de diseño y trade‑offs

1. **Fidelidad al mockup con tokens.** Se conservan tamaños exactos (`text-[13.5px]`, `top-[68px]`) para reproducir el diseño de origen, pero colores y sombras pasan por `@theme` y los patrones repetidos viven en `ui/`. El botón primario se define una sola vez en `Button`.
2. **Auto‑avance en la Fase 2.** Reduce fricción en 10 preguntas seguidas. Se mantiene el botón "Siguiente" como salida explícita y "Volver" cancela el timer.
3. **Snackbar solo al cerrar la Fase 1.** Un único momento de celebración a mitad del flujo, con color verde (fuera de la paleta de marca) para que destaque.
4. **Resultados sobre fondo blanco.** El gauge multicolor y las tarjetas con borde morado se leen mejor sin el degradado lavanda.
5. **Scrollbar custom en el texto legal.** Se oculta el nativo y se dibuja uno siempre visible para que sea evidente que hay más texto que leer antes de aceptar.
6. **Una sola superficie de tarjeta.** Antes había cuatro (Home con sombra, Programa/Ranking con borde más fuerte y radio 16 px, resultados con borde morado, reglas sin sombra). Ahora todas comparten `CARD_SURFACE`; lo que las diferencia es el contenido, no el contenedor. La tarjeta de perfil morada y las capas flotantes (modal, dropdown, toast) son las únicas excepciones deliberadas.
7. **Datos de demo hardcodeados** (nombre "Daniel", 30 % de progreso, scores 3.4, fechas de mayo 2026). El cálculo real de scores solo existe en `ResultsSummary` (promedios por dimensión: Gratificación = Q2,5,8; Disfrute = Q1,4,7,9,10; Sentido = Q3,6; escala 1–4; umbrales Alto ≥ 3.5, Medio ≥ 2.5).
8. **Un solo idioma (español)** en toda la app (ver §6.1).
9. **Una escala por familia de color.** Se fusionaron 13 variantes de morado en 7 pasos, tres escalas de gris (`gray-*` de Tailwind, `ink-*`, `black`) en una sola, y los verdes/ámbar/rojos de Tailwind (`emerald`, `amber`) con los semánticos propios. Cambios visibles: el link del footer pasa de azul a morado, el gradiente del gauge tiene 3 paradas en vez de 5, el `#333333` del body pasa a `gray-900`.

---

## 12. Deuda y oportunidades

Saldado (septiembre 2026): tokens en `@theme`, paleta unificada en una escala por familia, primitivos en `ui/`, componentes legacy eliminados, copy en español, foco accesible y modales semánticos, typo de resultados, `Footer` reutilizado.

Pendiente:

- Contraste de `gray-400` sobre blanco y de `text-white/90` sobre morado (AA en texto pequeño).
- Datos de demo (`DEMO` en `HomeScreen`, `PROGRAMS` en `ProgramTab`, `LEADERBOARD_DATA`) siguen hardcodeados; conectar a un origen real.
- El auto‑avance de la Fase 2 podría respetar `prefers-reduced-motion` y ofrecer cancelación por teclado.
- Los keyframes de parpadeo de la Fase 2 duplican `brand-100`/`brand-200` en JS porque `motion` no interpola `var()`.
