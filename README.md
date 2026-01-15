# ClinicFlow SaaS 🏥

![Status](https://img.shields.io/badge/Status-Waiting_for_Future_Development-yellow?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-React_|_Capacitor_|_Tailwind-blue?style=for-the-badge)

**ClinicFlow** is a comprehensive healthcare management platform designed to seamlessly connect patients with specialists in Tunisia. This repository contains the complete source code for both the **Web Platform** and the **Native Mobile Application**.

> ⚠️ **Note**: This project is currently in an MVP state and is **Waiting for Future Development**. It serves as a solid foundation for a scalable SaaS healthcare solution.

---

## 📱 Mobile App Experience

*Native Android experience powered by Capacitor.*

<https://github.com/user-attachments/assets/placeholder-for-mobile-video>
*(See `media/mobile-demo.mp4` for the full recording)*

**Key Features:**

- **True Native Feel**: Edge-to-edge layout, transparent system bars, and safe-area compliance.
- **Side Drawer Navigation**: Smooth, native-like navigation menu.
- **Smart Routing**: Skips marketing pages to land directly on authentication/dashboard.
- **Performance**: Optimized for speed with instant transitions.

## 💻 Web Platform

*Modern, responsive patient & doctor portal.*

<https://github.com/user-attachments/assets/placeholder-for-web-video>
*(See `media/web-demo.mp4` for the full recording)*

**Key Features:**

- **Doctor Portal**: Dashboard for managing appointments, patients, and availability.
- **Booking System**: Real-time appointment scheduling.
- **Modern UI**: Built with Shadcn UI and Tailwind CSS for a premium aesthetic.

---

## 🏗️ Project Structure

This monorepo is organized into two main applications:

\`\`\`
ClinicFlow-SaaS/
├── mobile/     # 📱 Android Application (React + Capacitor)
├── web/        # 💻 Web Platform (React + Vite)
└── media/      # 📸 Demo videos and assets
\`\`\`

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Android Studio (for mobile deployment)

### 1. Web Platform

\`\`\`bash
cd web
npm install
npm run dev
\`\`\`

### 2. Mobile Application

\`\`\`bash
cd mobile
npm install
npm run build
npx cap sync
npx cap open android
\`\`\`

---

## 🛠️ Tech Stack

### Core

- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix Primitives)
- **Icons**: Lucide React

### Mobile Specific

- **Runtime**: Capacitor 6
- **Plugins**: `@capacitor/status-bar`, `@capacitor/navigation-bar` (Native configurations)
- **Platform**: Android (optimized for edge-to-edge)

---

## 🔮 Future Development Roadmap

This project is primed for the following enhancements:

- [ ] Backend integration (Supabase/Firebase) finalization.
- [ ] Push Notifications implementation.
- [ ] iOS platform adjustments.
- [ ] Advanced telemedicine features (Video consultations).

---

*Developed with ❤️ for the future of healthcare.*
