
# UX/UI Design Template for Vibe Coding Tools

**Version:** 1.0  
**Format:** JSON-like Pseudocode for easy parsing  
**Purpose:** Help Vibe Coding Tools implement good UX/UI design practices that are **responsive**, **theme-aware**, and **developer-friendly**.

---

## 1. PROJECT METADATA (Editable)
```json
{
  "projectName": "MyApp",
  "version": "1.0.0",
  "author": "YourName",
  "themePreference": "auto",
  "defaultFont": "Inter, sans-serif"
}
```

---

## 2. FILE STRUCTURE (Instruction for Vibe Coding Tools)
```
/ui/
├── components/         
│   ├── Button.jsx
│   ├── InputField.jsx
│   └── Card.jsx
├── layouts/            
│   ├── DefaultLayout.jsx
│   └── ResponsiveGrid.jsx
├── pages/              
│   ├── Home.jsx
│   └── Settings.jsx
├── styles/             
│   ├── lightTheme.css
│   ├── darkTheme.css
│   └── global.css
└── utils/
    └── themeManager.js
```

**Naming Convention:** Use `PascalCase` for components and layouts, `kebab-case` for files and folders, and `camelCase` for variables and functions.

---

## 3. RESPONSIVE DESIGN BREAKPOINTS
```json
{
  "breakpoints": {
    "mobile": "0px - 767px",
    "tablet": "768px - 1023px",
    "desktop": "1024px and up"
  }
}
```

---

## 4. THEME DESIGN (Editable)
```json
{
  "themes": {
    "light": {
      "background": "#FFFFFF",
      "text": "#111111",
      "accent": "#2563EB"
    },
    "dark": {
      "background": "#1F2937",
      "text": "#F9FAFB",
      "accent": "#3B82F6"
    }
  }
}
```

---

## 5. COMPONENT STYLE TEMPLATE (Editable)
```json
{
  "component": "Button",
  "style": {
    "padding": "10px 20px",
    "borderRadius": "6px",
    "backgroundColor": "accent",
    "textColor": "text",
    "hoverEffect": true
  }
}
```

---

## 6. INPUT FIELD TEMPLATE (Editable)
```json
{
  "component": "InputField",
  "style": {
    "padding": "12px",
    "border": "1px solid #DDD",
    "borderRadius": "4px",
    "placeholderText": "Enter text"
  },
  "validations": ["required", "length"]
}
```

---

## 7. PAGE STRUCTURE & ROUTES (Editable)
```json
{
  "pages": [
    {
      "name": "Home",
      "route": "/",
      "layout": "DefaultLayout",
      "components": ["Header", "HeroSection", "Footer"],
      "editable": true
    },
    {
      "name": "Settings",
      "route": "/settings",
      "layout": "DefaultLayout",
      "components": ["Sidebar", "FormSection", "SaveButton"],
      "editable": true
    }
  ]
}
```

---

## 8. USER INTERACTION RULES
```json
{
  "accessibility": {
    "supportsKeyboard": true,
    "ariaLabels": true,
    "minContrastRatio": "4.5:1"
  },
  "interactions": {
    "animations": "minimal",
    "loadingIndicators": "spinner or skeleton"
  }
}
```

---

## 9. INSTRUCTIONS TO VIBE CODING TOOLS

- **Render responsive layout** using `ResponsiveGrid.jsx`.
- **Apply theme** from `themePreference` and load from `/styles/`.
- **Use reusable components** from `/components/`.
- **Bind user-defined styles** from `[Editable]` flags.
- **Follow file structure** for modular design.
- **Autogenerate ARIA roles** for accessibility.
- **Font and colors** use `global.css` and active theme.

---

## 10. FUTURE EXTENSION (Optional)
```json
{
  "supportsMultilingual": true,
  "dynamicFormBuilder": true,
  "customThemes": true
}
```
