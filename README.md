# Shared Components

## Overview

This document provides a comprehensive overview of the reusable UI components identified across the Taskly application screens. The goal is to establish a clear reference for developers to ensure consistent design, avoid duplication, and streamline UI development.

---

## Shared Components

| #   | Component       | Description                                                                    | Used In                                                 | Screenshot                                     |
| --- | --------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------- | ---------------------------------------------- |
| 1   | Navbar / Header | Top application navigation displaying user profile                             | All authenticated pages (`/project`, `/project/[id]/*`) | ![Navbar](./screenshots/navbar.png)            |
| 2   | Sidebar         | Main desktop navigation layout with active project selector                    | All authenticated pages (`/project`, `/project/[id]/*`) | ![Sidebar](./screenshots/sidebar.png)          |
| 3   | MobileNav       | Bottom tab bar navigation optimized for small viewports                        | Mobile viewports on authenticated pages                 | ![MobileNav](./screenshots/mobile-nav.png)     |
| 4   | Button          | Standard action button supporting primary, secondary, and destructive variants | Auth forms, Project Listing, Modals, Empty/Error states | ![Button](./screenshots/button.png)            |
| 5   | Input           | Form input field with validation, icon support, and error states               | Login, Register, Add Project Modal                      | ![Input](./screenshots/input.png)              |
| 6   | Typography      | Text rendering component enforcing design system typography hierarchy          | Global application-wide text elements                   | ![Typography](./screenshots/typography.png)    |
| 7   | Icon            | Centralized SVG icon renderer for UI icons                                     | Sidebar, Navbar, Project Cards, Buttons                 | ![Icon](./screenshots/icon.png)                |
| 8   | ProjectCard     | Reusable card displaying individual project overview and quick links           | Project Listing page                                    | ![ProjectCard](./screenshots/project-card.png) |
| 9   | Pagination      | Footer page navigation controls                                                | Project Listing page                                    | ![Pagination](./screenshots/pagination.png)    |

---

## Component Breakdown & Reusability Details

### 1. Navbar & Sidebar

- **Why Reusable:** Provides the core layout frame across all authenticated views. The Sidebar dynamically adapts based on the active project route (`/project/[id]`).
- **Variants:** Expanded and Collapsed states for the Sidebar.

### 2. Button

- **Why Reusable:** Ensures consistent padding, focus states, and color hierarchy for all user interactions.
- **Variants:** Primary, Secondary, ghost.
- **sizes:** default, sm, lg.

### 3. Input

- **Why Reusable:** Encapsulates label placement, helper text, and React Hook Form / Zod error state formatting.
- **Variants:** Text, Password (with toggle visibility).

### 4. ProjectCard

- **Why Reusable:** Encapsulates project metadata rendering (Name, Description, Created Date, Quick navigation links) to keep the project grid clean and modular.
