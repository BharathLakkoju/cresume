# Design System Strategy: The Monolith & The Void

## 1. Overview & Creative North Star: "Precision Brutalism"
The Creative North Star for this design system is **Precision Brutalism**. While traditional minimalism often feels "empty," Precision Brutalism feels "intentional." It treats the UI not as a website, but as a high-end physical instrument—a monochromatic dashboard of absolute clarity.

To break the "SaaS template" look, we move away from rigid, boxed-in grids. Instead, we utilize **intentional asymmetry** and **tonal layering**. Elements should feel as though they are carved out of a single block of stone or layered like sheets of premium vellum. We use high-contrast typography scales (e.g., pairing a massive `display-lg` headline with a tiny, tracked-out `label-sm`) to create an editorial, high-fashion feel for a technical AI product.

---

## 2. Colors & Tonal Architecture
This system operates on a strict grayscale foundation. Value is used to communicate hierarchy, not just decoration.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. Structural boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section sits directly against a `surface` background. This creates a "soft edge" that feels more premium and integrated than a hard stroke.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials. Use the following tiers to define depth:
- **Base Layer:** `surface` (#f9f9f9) for the primary canvas.
- **Secondary Sectioning:** `surface-container-low` (#f3f3f3) for sidebar or secondary content.
- **Interactive Cards:** `surface-container-lowest` (#ffffff) to make content "pop" against the gray base.
- **Active Overlays:** `surface-container-highest` (#e2e2e2) for elements requiring immediate attention.

### The "Glass & Gradient" Rule
To prevent a "flat" appearance, floating elements (modals, dropdowns) must use **Glassmorphism**. Apply semi-transparent `surface` colors with a `backdrop-blur` of 12px-20px. 
*Signature Polish:* Main CTAs should not be flat hex codes. Use a subtle linear gradient from `primary` (#000000) to `primary-container` (#3b3b3b) to provide a "machined" metallic sheen.

---

## 3. Typography: The Editorial Voice
We use **Inter** as the primary typeface. The goal is to maximize the contrast between "The Data" and "The Interface."

- **The Display Scale:** Use `display-lg` (3.5rem) for hero moments and AI scores. It should feel authoritative.
- **The Label Scale:** Use `label-sm` (0.6875rem) with `letter-spacing: 0.05em` and `text-transform: uppercase` for metadata and small captions. This creates a technical, high-precision aesthetic.
- **The Narrative:** Headlines (`headline-lg`) should use a tighter `line-height` (1.1) to look like a printed magazine, while body text (`body-lg`) maintains a generous `line-height` (1.6) for readability.

---

## 4. Elevation & Depth: Tonal Layering
We avoid the "Material Design" look by replacing traditional shadows with **Tonal Layering**.

- **The Layering Principle:** Depth is achieved by "stacking" tiers. Place a `surface-container-lowest` card on a `surface-container-low` background. The subtle 2% difference in hex value is enough for the human eye to perceive a "lift" without visual clutter.
- **Ambient Shadows:** If a floating effect is required (e.g., a floating Action Button), use a shadow with a 40px blur at 4% opacity, using the `on-surface` color (#1a1c1c). It should look like a soft atmospheric glow, not a "drop shadow."
- **The "Ghost Border" Fallback:** If accessibility requires a border, use the `outline-variant` (#c6c6c6) at **15% opacity**. A 100% opaque border is considered a "design failure" in this system.

---

## 5. Components: Functional Minimalism

### Buttons
- **Primary:** Black (`primary`) to White (`on-primary`) text. No border. Use `lg` (0.5rem) roundedness.
- **Secondary:** Transparent background with a "Ghost Border."
- **States:** On hover, the primary button should shift slightly to `primary-fixed` (#5e5e5e) with a smooth 200ms transition.

### Minimalist Forms & Inputs
- **Input Fields:** Remove the bottom border or full box. Use a `surface-container-low` background with a `md` (0.375rem) radius. On focus, transition the background to `surface-container-lowest` (#ffffff).
- **Error States:** Use `error` (#ba1a1a) only for the text label, not the entire box. A subtle `error_container` tint can be applied to the background.

### Sleek Progress Bars (The "Precision" Bar)
- **Track:** `surface-container-highest` (#e2e2e2).
- **Indicator:** `primary` (#000000).
- **Style:** Height should be thin (4px/0.175rem) to maintain elegance. For resume scores, use a "stepped" progress bar to indicate AI processing stages.

### Cards & Lists
- **Rule:** Never use divider lines. 
- **Execution:** Use vertical whitespace from the Spacing Scale (e.g., `spacing-8`) or a subtle background shift (`surface` to `surface-container-low`) to separate list items.

---

## 6. Motion & Framer Motion Integration
Motion is the "soul" of this design system. It should feel fluid and expensive.

- **The Scroll Reveal:** Use `viewport` triggers in Framer Motion to fade elements in from `y: 20` to `y: 0`. Use an `easeOut` duration of 0.8s.
- **Parallax Layers:** As the user scrolls through a resume analysis, background "glass" containers should move at 0.95x speed relative to the text, creating a sense of three-dimensional depth.
- **Micro-interactions:** When an AI evaluation completes, the progress bar should "pulse" using a `scale: [1, 1.02, 1]` keyframe animation with a `duration: 0.4`.

---

## 7. Do's and Don'ts

| Do | Don't |
| :--- | :--- |
| **Do** use `spacing-16` (5.5rem) for major section breathing room. | **Don't** use standard 16px/24px padding for everything. |
| **Do** use `on-surface-variant` (#474747) for secondary text. | **Don't** use 100% black for long-form body text. |
| **Do** create hierarchy through font size and weight contrast. | **Don't** use more than two different gray shades in one small component. |
| **Do** use `full` (9999px) roundedness for Chips and Badges. | **Don't** use "pills" for buttons; keep buttons at `lg` (0.5rem). |
| **Do** treat "Empty States" as an editorial opportunity. | **Don't** just show a "No Data" message. |