# Olive Startup House CRM

## Overview

This is a comprehensive CRM and property management platform for Olive Startup House, a co-living/co-working space operator. The application manages the full resident lifecycle from lead capture through onboarding, along with property management, community engagement, and financial tracking.

Key functional areas:
- Lead pipeline management with multi-channel source tracking
- Communication tracking across SMS, email, phone, video tours
- AI-powered screening and background checks
- Member onboarding workflows
- Property and room management with smart lock integration
- Community event planning and engagement
- Financial reporting and analytics

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Build Tool**: Vite with HMR support

The frontend follows a page-based architecture with shared components. Each major feature (leads, communication, screening, onboarding, properties, community, financials) has its own page component that fetches data via React Query and renders feature-specific card components.

### Backend Architecture
- **Framework**: Express 5 on Node.js
- **API Design**: RESTful JSON API with `/api` prefix
- **Validation**: Zod schemas for request validation
- **Database ORM**: Drizzle ORM with PostgreSQL dialect

The server uses a storage abstraction layer (`IStorage` interface) that defines all data operations. Currently implemented with in-memory storage but designed to swap to database persistence.

### Data Layer
- **Schema Definition**: Drizzle schema in `shared/schema.ts`
- **Schema Sharing**: Types and Zod schemas are shared between client and server via the `@shared` path alias
- **Migrations**: Drizzle Kit for database migrations (output to `./migrations`)

### Build System
- **Development**: Vite dev server with Express backend, HMR via custom setup
- **Production**: esbuild bundles server code, Vite builds client to `dist/public`
- **Dependency Bundling**: Selective bundling of server dependencies to optimize cold start

## External Dependencies

### Database
- PostgreSQL via `DATABASE_URL` environment variable
- Drizzle ORM for queries and migrations
- connect-pg-simple for session storage

### UI Framework
- Radix UI primitives (dialog, dropdown, tabs, etc.)
- shadcn/ui component patterns
- Lucide React for icons
- react-icons for brand icons (WhatsApp, Telegram)

### Data Handling
- TanStack React Query for API data fetching and caching
- Zod for runtime validation
- drizzle-zod for generating Zod schemas from Drizzle tables

### Styling
- Tailwind CSS with custom theme configuration
- CSS variables for dynamic theming
- Google Fonts (DM Sans, Fira Code, Geist Mono, Architects Daughter)

### Build Tools
- Vite with React plugin
- esbuild for server bundling
- TypeScript with strict mode