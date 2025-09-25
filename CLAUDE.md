# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based web application for the 전라남도교육청 2030 수업 축제 (Jeollanam-do Office of Education 2030 Class Festival). The application provides information about educational programs, class schedules, festival details, and contact information.

## Architecture

### Application Structure
- **App.tsx**: Main application component with tab-based navigation
- **components/**: All React components organized by feature
  - Main feature components: About2030, ClassSchedule, FestivalInfo, ContactUs, Navigation
  - UI components: `components/ui/` - shadcn/ui component library
  - Utility components: SearchFilters, QRCodeModal, ClassCard, ClassListItem
  - Custom components: ImageWithFallback for image handling
- **styles/**: Global CSS with Tailwind configuration and design tokens
- **guidelines/**: Contains design system guidelines (currently template)

### Key Components
- **Navigation**: Tab-based navigation system
- **ClassSchedule**: Complex component with filtering, search, and data management
- **About2030**: Static content about the 2030 classroom initiative
- **ImageWithFallback**: Custom image component with fallback handling

### Styling System
- Uses Tailwind CSS with custom design tokens
- CSS variables for theming (light/dark mode support)
- shadcn/ui component library for consistent UI
- Korean typography and design patterns

### Data Management
- Class scheduling data with status calculation (upcoming/ongoing/completed)
- Date utilities for time-based filtering
- Local state management with React hooks

## Development Notes

### Technology Stack
- React with TypeScript
- Tailwind CSS for styling
- shadcn/ui for UI components
- Lucide React for icons

### No Build System Configuration Found
This appears to be a Figma Make-generated project without standard build tooling configuration files (package.json, vite.config, etc.). Development commands are not available in the repository.

### Korean Language Support
The application is primarily in Korean and includes Korean educational terminology and cultural context.