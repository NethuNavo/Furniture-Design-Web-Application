# Admin Panel & Data Management
### Nord Living — Furniture Room Designer

---

## My Contribution

I built the complete administrative interface for the Nord Living application. This includes the dashboard, furniture inventory management, user account management, design review system, and workspace settings — all with full light/dark mode support.

---

## What I Built

### 1. Admin Dashboard (`src/app/admin/page.tsx`)

The main landing page for the admin panel. When an admin logs in, they are redirected here automatically.

**What it shows:**
- 4 live stat cards pulled from real state:
  - Total furniture items in the catalog
  - Number of unique categories
  - Number of customer accounts
  - Number of admin accounts
- Quick action buttons to jump to Furniture, Designs, or Users
- Two info cards explaining core admin priorities and workspace personalization

**Key code:**
```tsx
const statCards = [
  { label: "Furniture Items", value: String(furniture.length), ... },
  { label: "Categories", value: String(new Set(furniture.map(i => i.category)).size), ... },
  { label: "Customer Accounts", value: String(accounts.filter(a => a.role === "customer").length), ... },
  { label: "Admin Accounts", value: String(accounts.filter(a => a.role === "admin").length), ... },
];
```
The values update live — if you add a furniture item, the stat card number changes immediately.

---

### 2. Furniture CRUD UI (`src/app/admin/furniture/page.tsx`)

A full create and delete interface for the furniture catalog.

**What it does:**
- Add new furniture with: name, category, material, color, price, and an image upload
- Image preview shown before saving using `URL.createObjectURL()`
- Custom category creation — admins can add new categories on the fly
- Delete any furniture item with a single click
- All items displayed in a scrollable table with image thumbnails

**Key code — image preview:**
```tsx
function handleImageChange(event) {
  const file = event.target.files?.[0];
  setImagePreview(URL.createObjectURL(file)); // live preview
}
```

**Key code — custom category:**
```tsx
function handleAddCategory() {
  const normalized = normalizeCategoryValue(newCategory); // e.g. "Living Room" → "living-room"
  setCreatedCategories(prev => [...prev, normalized]);
}
```

---

### 3. User Management (`src/app/admin/users/page.tsx`)

Manage all accounts in the system — both admin and customer roles.

**What it does:**
- Create new accounts (name, email, role: admin or customer)
- View all admin accounts and all customer accounts in separate lists
- Delete any account except the primary admin (`admin@nord.com` is protected)
- Role-based separation — admins and customers shown in different sections

**Protection logic:**
```tsx
{account.email === "admin@nord.com" ? (
  <span>Primary admin</span>  // cannot be deleted
) : (
  <button onClick={() => removeAccount(account.id)}>Delete</button>
)}
```

---

### 4. Designs Review (`src/app/admin/designs/page.tsx` + `AdminDesignsTable.tsx`)

Allows admins to view all room designs saved by customers.

**What it does:**
- Fetches saved designs from the database via Prisma (server component)
- Falls back to mock data if the database is not connected
- Displays: design title, user email, room dimensions, furniture item count, creation date, wall/floor color preview
- View button navigates to the 3D room preview for that design
- Delete button calls the `/api/designs` API to permanently remove a design
- Designs sorted by newest first

**Fallback pattern:**
```tsx
try {
  const rows = await prisma.savedDesign.findMany({ ... });
  designs = rows.map(row => ({ ... }));
} catch {
  designs = mockDesigns; // graceful fallback
  isMock = true;
}
```

---

### 5. Settings Page (`src/app/admin/settings/page.tsx`)

Admin account management and theme control.

**What it does:**
- View and edit the admin profile (name, email, avatar image)
- Upload a profile picture (converted to base64 and stored in state)
- Change password via a modal with show/hide password toggles
- Switch between light mode and dark mode
- Changes persist across page refreshes via localStorage

**Password change modal:**
- Validates current password before allowing change
- Confirms new password matches
- Enforces minimum 6 character length

---

### 6. AdminProvider (`src/components/admin/AdminProvider.tsx`)

The central state management system for the entire admin panel. Built using React Context.

**What it manages:**
- `furniture[]` — the full furniture catalog
- `accounts[]` — all user accounts (admin + customer)
- `theme` — "light" or "dark"

**Persistence:** All state is saved to `localStorage` automatically using `useEffect`, so data survives page refreshes.

```tsx
useEffect(() => {
  window.localStorage.setItem(ADMIN_STATE_KEY, JSON.stringify(state));
}, [state]);
```

**Default data:** Pre-loaded with the product catalog from `src/lib/products.ts` and 3 sample accounts.

**Exposed functions:**
| Function | What it does |
|---|---|
| `addFurniture()` | Adds item to catalog |
| `removeFurniture(id)` | Removes item by ID |
| `addAccount()` | Creates new user account |
| `updateAccount(id, patch)` | Updates any account field |
| `removeAccount(id)` | Deletes account |
| `setTheme()` | Switches light/dark mode |

---

### 7. Admin Sidebar (`src/components/admin/AdminSidebar.tsx`)

The persistent navigation panel on the left side of the admin layout.

**What it includes:**
- Nord Admin logo/branding
- Navigation links: Dashboard, Furniture, Designs, Users, Settings
- Active link highlighting based on current route
- Admin user profile card at the bottom (name, email, shield icon)
- Light/Dark mode toggle button
- Logout button (clears auth and redirects to home)

**Active link detection:**
```tsx
function isActive(href: string) {
  if (href === "/admin") return pathname === href; // exact match for dashboard
  return pathname.startsWith(href); // prefix match for sub-pages
}
```

---

### 8. StatCard Component (`src/components/admin/StatCard.tsx`)

Reusable card component used on the dashboard.

- Accepts: icon, colored icon box, label, value, growth text
- Automatically reads theme from `AdminProvider` context
- Renders differently in light vs dark mode

---

## Light / Dark Mode

Every admin component reads `theme` from `AdminProvider` and applies conditional Tailwind classes:

```tsx
const { theme } = useAdminPanel();
const isDark = theme === "dark";

className={isDark ? "bg-stone-900 text-stone-100" : "bg-white text-charcoal"}
```

The toggle is available in two places:
1. The sidebar bottom section (always visible)
2. The Settings page (explicit light/dark buttons)

Theme preference is saved to `localStorage` under the key `nord-admin-theme`.

---

## File Structure

```
src/
├── app/admin/
│   ├── page.tsx              ← Dashboard
│   ├── layout.tsx            ← Admin layout wrapper
│   ├── furniture/page.tsx    ← Furniture CRUD
│   ├── users/page.tsx        ← User management
│   ├── designs/page.tsx      ← Design review
│   └── settings/page.tsx     ← Settings + theme
│
└── components/admin/
    ├── AdminProvider.tsx      ← Global state (Context)
    ├── AdminSidebar.tsx       ← Navigation sidebar
    ├── AdminLayout.tsx        ← Layout shell
    ├── AdminHeader.tsx        ← Page title/subtitle
    ├── AdminGuard.tsx         ← Route protection
    ├── AdminDesignsTable.tsx  ← Designs table component
    ├── StatCard.tsx           ← Dashboard stat card
    └── QuickActionCard.tsx    ← Dashboard action card
```

---

## How to Access the Admin Panel

1. Run the project: `npm run dev` inside `furniture-room-designer/`
2. Go to `http://localhost:3000/login`
3. Log in with: `admin@nord.com` / `admin123`
4. You will be automatically redirected to `/admin`

---

## Technical Highlights

- **React Context + localStorage** for persistent state without a backend dependency
- **Server component** for designs page (fetches from DB on the server, falls back to mock data gracefully)
- **Role-based access control** — `AdminGuard` component blocks non-admin users
- **Image handling** — blob URLs for live preview, base64 for persistence
- **Fully theme-aware** — every component responds to light/dark toggle in real time
