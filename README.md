# NaiveForm

A modern, intuitive form builder inspired by Google Forms. Create surveys, questionnaires, feedback forms, and more with an easy-to-use drag-and-drop interface.

## ✨ Features

- **Intuitive Form Builder**: Drag-and-drop interface for creating forms quickly
- **Multiple Question Types**: Support for 6 question types including:
  - Short answer
  - Paragraph (long text)
  - Multiple choice
  - Checkboxes
  - Dropdown
  - Date picker
- **Form Management**: 
  - Create, edit, and duplicate forms
  - Real-time preview
  - Form templates for quick starts
  - Custom form slugs for clean URLs
- **Response Collection**:
  - Collect and view form responses
  - Export responses to CSV/Excel
  - Response analytics and summaries
  - Optional email collection
- **Form Settings**:
  - Limit one response per person
  - Set form close dates
  - Custom confirmation messages
  - Redirect after submission
- **Authentication**: Secure user authentication with Clerk
- **Real-time Updates**: Powered by Convex for instant synchronization

## 🏗️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TanStack Router** - Type-safe routing
- **Tailwind CSS 4** - Utility-first styling
- **dnd-kit** - Drag and drop functionality
- **React Hook Form + Zod** - Form validation

### Backend
- **Convex** - Backend-as-a-service with real-time capabilities
- **Clerk** - User authentication and management

### Monorepo Tools
- **Turborepo** - High-performance build system
- **Bun** - Fast JavaScript runtime and package manager

## 📁 Project Structure

```
naiveform/
├── apps/
│   ├── console/          # Main form builder application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── form-builder/   # Form editor components
│   │   │   │   └── ui/              # Reusable UI components
│   │   │   ├── routes/              # Application routes
│   │   │   └── lib/                 # Utilities and types
│   │   └── package.json
│   └── landing/          # Marketing/landing page (Next.js)
│       └── app/
├── packages/
│   ├── convex/           # Backend API and database schema
│   │   └── convex/
│   │       ├── forms.ts       # Form CRUD operations
│   │       └── schema.ts      # Database schema
│   └── design-system/    # Shared UI components
│       └── src/
│           ├── ui/            # UI component library
│           └── form/          # Form components
└── docs/
    └── PAGE_PLAN.md      # Application page structure

```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- Bun (recommended) or npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/naiveform.git
cd naiveform
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:

Create a `.env` file in `apps/console/` with:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_CONVEX_URL=your_convex_url
```

4. Start the development server:
```bash
bun dev
```

This will start:
- Console app at `http://localhost:5173`
- Landing page at `http://localhost:3000`
- Convex backend

## 📦 Available Scripts

```bash
# Start all apps in development mode
bun dev

# Build all apps for production
bun build

# Run linting
bun lint

# Format code
bun format

# Type checking
bun check-types
```

## 🏛️ Architecture

### Console App (Form Builder)

The main application where users create and manage forms:

- **Dashboard** (`/`) - View all forms, create new forms
- **Form Editor** (`/forms/:formId`) - Build and edit forms with drag-and-drop
- **Form Preview** (`/forms/:formId/preview`) - Preview form as respondents see it
- **Responses** (`/forms/:formId/responses`) - View and analyze form submissions
- **Settings** (`/forms/:formId/settings`) - Configure form options
- **Share** (`/forms/:formId/share`) - Get shareable links and embed codes
- **Templates** (`/templates`) - Browse and use form templates

### Data Model

**Forms Table**
- Form metadata (title, description)
- Questions array (with types, options, validation)
- Settings (email collection, response limits, etc.)
- User ownership (via Clerk)

**Responses Table**
- Form submissions
- Question answers (key-value pairs)
- Optional respondent email

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

[MIT License](LICENSE) - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Built with [Convex](https://convex.dev) for real-time backend
- Authentication by [Clerk](https://clerk.com)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com)

You can build a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)
