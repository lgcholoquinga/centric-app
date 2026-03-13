# CentricApp

SPA desarrollada en **Angular 21** con componentes standalone, signals y Vitest para pruebas. Simula un sistema bancario básico con gestión de clientes, cuentas, movimientos y reportes.

---

## Stack

| Capa            | Tecnología                               |
| --------------- | ---------------------------------------- |
| Framework       | Angular 21 (standalone, OnPush, signals) |
| Estilos         | SCSS + variables globales                |
| Formularios     | Reactive Forms                           |
| HTTP / Mock API | HttpClient + json-server                 |
| PDF             | jsPDF + jspdf-autotable                  |
| Tests           | Vitest                                   |
| Package manager | Bun                                      |
| Linting         | ESLint + Angular ESLint + Stylelint      |
| Formato         | Prettier                                 |
| Git hooks       | Husky + lint-staged + commitlint         |

---

## Módulos

- **Clientes** — CRUD completo con búsqueda y debounce de 300 ms
- **Cuentas** — CRUD vinculado a clientes (ahorro / corriente)
- **Movimientos** — Registro de depósitos y retiros con cálculo automático de saldo
- **Reportes** — Vista filtrable por cliente y rango de fechas con descarga en PDF

---

## Levantar el ambiente

### Requisitos previos

- [Bun](https://bun.sh/) ≥ 1.3
- [Node.js](https://nodejs.org/) ≥ 20

### 1. Instalar dependencias

```bash
bun install
```

### 2. Iniciar el mock API (json-server)

```bash
bun run server
```

Queda disponible en `http://localhost:3000`. Endpoints: `/clients`, `/accounts`, `/movements`.

### 3. Iniciar la aplicación

```bash
bun start
```

Abre el navegador en `http://localhost:4200`.

> Ambos procesos deben correr en paralelo (dos terminales).

---

## Comandos disponibles

```bash
bun start           # Servidor de desarrollo (http://localhost:4200)
bun run server      # Mock API con json-server (http://localhost:3000)
bun run build       # Build de producción
bun test            # Ejecutar tests con Vitest
bun run lint        # ESLint
bun run stylelint   # Stylelint para SCSS
bun run format      # Formatear con Prettier
```

### Correr un test específico

```bash
bunx ng test --include="src/app/path/to/file.spec.ts"
```

---

## Estructura del proyecto

```
src/
├── app/
│   ├── features/
│   │   ├── client/        # Módulo clientes
│   │   ├── account/       # Módulo cuentas
│   │   ├── movement/      # Módulo movimientos
│   │   ├── report/        # Módulo reportes
│   │   └── layout/        # Dashboard y sidebar
│   └── shared/
│       ├── components/    # Button, Table, Search, Sidebar
│       ├── interfaces/    # Tipos compartidos
│       ├── services/      # PdfService (global)
│       └── stores/        # MenuStore (global)
├── assets/scss/           # Variables, mixins y estilos globales
└── environments/          # Configuración por entorno
```
