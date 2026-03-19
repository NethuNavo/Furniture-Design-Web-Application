# Furniture Design Web Application

## Overview

The **Furniture Design Web Application** is an interactive web-based system developed as part of the *PUSL3122 HCI, Computer Graphics, and Visualisation* coursework. The application enables users to design and visualise interior spaces by arranging furniture within customizable room layouts.

The system integrates **2D planning and 3D visualisation**, allowing users to explore how furniture fits within a room based on dimensions, layout, and colour schemes. The design follows key **Human-Computer Interaction (HCI) principles**, ensuring usability, clarity, and efficient interaction.

---

## Key Features

### User Features

* User authentication (Login / Signup)
* Profile management
* Create and manage room designs
* Save, edit, and delete designs

### Room Designer

* Define room size, shape, and colours
* Interactive **2D room planner**
* Drag-and-drop furniture placement
* Real-time layout updates
* **3D visualisation** of designed room

### Admin Panel

* Dashboard overview
* Furniture management
* User and design management
* Light/Dark mode support

### Public Pages

* Home page
* Shop page with product listings
* About and Contact pages

---

## Technologies Used

* **Frontend:** Next.js, React, TypeScript
* **Styling:** Tailwind CSS
* **3D Rendering:** React Three Fiber / Three.js
* **Backend / Data:** Prisma ORM
* **State Management:** React Context API
* **Other:** Local storage and API routes

---

## Project Structure

```
Furniture-Design-Web-Application/
│
├── app/                # Application routes (Next.js)
├── src/                # Core logic, components, hooks, utilities
├── prisma/             # Database schema and migrations
├── image/              # Image assets
├── data/               # Demo / mock data
├── components/         # Reusable UI components (if outside src)
├── README.md
└── package.json
```

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/NethuNavo/Furniture-Design-Web-Application.git
cd Furniture-Design-Web-Application
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory using `.env.example` as a reference.

### 4. Prisma Setup (if required)

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Run the Application

```bash
npm run dev
```

### 6. Open in Browser

```
http://localhost:3000
```

---

## HCI and Design Considerations

The system was developed following key **HCI principles**:

* **Consistency:** Uniform navigation and layout across pages
* **Visibility:** Clear visual feedback for user actions
* **User Control:** Easy editing, deleting, and modifying designs
* **Efficiency:** Drag-and-drop interactions for faster workflow
* **Learnability:** Simple UI for new users with minimal guidance

Low-fidelity and high-fidelity prototypes were created and iteratively improved based on feedback.

---

## Team Contributions

| Name                | Index Number | Contribution                                                                                                                                                                                                                           |
| ------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Methiwala Jayamani  | 10953046     | Implemented authentication system including login, signup, and user context. Developed profile page and saved designs interface. Focused on clean and user-friendly UI implementation. Designed high-fidelity landing page in Figma.   |
| Welikala Welikala   | 10952729     | Developed the core room designer including 2D planner, 3D visualisation, furniture placement, and design saving functionality. Implemented interaction logic and layout behaviour. Designed high-fidelity UI for main system features. |
| Kodippili Dinuradee | 10953513     | Built the admin panel including dashboard, furniture management, and user/design views. Implemented light/dark mode support. Designed admin interface layouts and interactions.                                                        |
| Waduge Fernanando   | 10952762     | Developed public-facing pages including home, shop, about, and contact pages. Implemented navigation, footer, and global styling. Created low-fidelity prototypes and contributed to overall design system in Figma.                   |

---

## Notes

* `node_modules`, `.next`, and environment files are excluded from the repository
* `.env.example` is provided for setup guidance
* Prisma migrations are included for database setup
* The application is designed to be modular and scalable

---

## Repository

GitHub Repository:
https://github.com/NethuNavo/Furniture-Design-Web-Application

---

## Coursework Context

This project was developed as part of the **PUSL3122 HCI, Computer Graphics, and Visualisation** module. The aim was to design and implement a usable software system applying **UI/UX design principles, computer graphics techniques, and user evaluation methods**.

---

## Future Improvements

* Enhanced real-time collaboration
* Advanced 3D rendering and lighting
* AI-based furniture recommendations
* Backend optimization and cloud deployment

---

## Credits

All external resources, assets, and references used in this project are acknowledged appropriately within the report.

---
