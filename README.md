# Dele Parfum — Sitio Web

Storefront estático de decants de fragancias de lujo. Construido con Astro, CSS vanilla y JS vanilla.

---

## Levantar el servidor local

```bash
cd deleparfum_1
npm install
npm run dev
```

Abre en `http://localhost:4321`

## Build de producción

```bash
npm run build    # genera dist/
npm run preview  # previsualiza el build
```

---

## Antes de publicar — 3 cosas imprescindibles

### 1. Logo

Copiá tu archivo de logo en:

```
public/assets/logo.png
```

Si el logo tiene fondo transparente (PNG), se verá perfecto sobre el fondo negro.
Si usás otro formato (SVG, WebP), actualizá las dos referencias en `src/pages/index.astro`:

```html
<img src="/assets/logo.png" ...>
```

### 2. Fotos de los productos

Copiá las imágenes a `public/assets/products/` con estos nombres exactos:

| Producto                      | Nombre de archivo                      |
|-------------------------------|----------------------------------------|
| Afnan 9PM                     | `afnan-9pm.jpg`                        |
| Lattafa Khamrah               | `lattafa-khamrah.jpg`                  |
| Club de Nuit Intense Man EDT  | `club-de-nuit-intense-man-edt.jpg`     |
| Lattafa Asad Yara             | `lattafa-asad-yara.jpg`                |
| Lattafa Asad Yara Candy       | `lattafa-asad-yara-candy.jpg`          |
| Lattafa Honor and Glory       | `lattafa-honor-and-glory.jpg`          |
| French Avenue Liquid Brun     | `french-avenue-liquid-brun.jpg`        |

Recomendación: imágenes en formato portrait (3:4), mínimo 600×800px.
Mientras no haya imagen, las cards muestran el texto *"Imagen próximamente"*.

### 3. Número de WhatsApp

El número actual en `src/pages/index.astro` es:

```js
const WA_NUMBER = '5491139399189';
```

Si cambiás de número: reemplazá ese string con el formato internacional sin `+` ni espacios.
Ejemplo: `+54 9 11 1234-5678` → `5491112345678`

---

## Cómo agregar o modificar productos

Editá el array `products` en el frontmatter de `src/pages/index.astro`:

```js
{
  name:       'Nombre del perfume',
  slug:       'nombre-del-perfume',      // usado para buscar la imagen
  descriptor: 'Familia · Subfamilia',    // ej. 'Oriental · Especiado'
  p10:        9000,                      // precio 10ml en ARS (sin puntos)
  p20:        16000,                     // precio 20ml en ARS
},
```

---

## Estructura de archivos

```
deleparfum_1/
├── src/
│   ├── pages/
│   │   └── index.astro          ← página principal + datos del catálogo
│   ├── styles/
│   │   └── global.css           ← todos los estilos (tokens, secciones)
│   └── scripts/
│       └── scroll-effects.js    ← partículas, parallax, scroll reveal
├── public/
│   ├── favicon.svg
│   └── assets/
│       ├── logo.png             ← (agregar)
│       └── products/
│           └── *.jpg            ← (agregar)
├── astro.config.mjs
├── package.json
└── README.md
```

---

## Scroll effects

Los efectos respetan `prefers-reduced-motion`. En dispositivos con esa preferencia activa, las animaciones se desactivan y el contenido aparece directamente.
