# SellAgent Frontend

Enterprise-grade React frontend for the SellAgent Autonomous Revenue Engine.

## Philosophy

This frontend is built like a **banking console**, not a SaaS dashboard.

**Design Principles:**
- Boring = Trusted
- No animations, no emojis, no chat bubbles
- Professional, explanatory tone
- Read-mostly interface
- Backend truth is final authority

## Tech Stack

- **React 18+**
- **Bootstrap 5** (no custom UI libraries)
- **React Router** for navigation
- **Axios** for API calls
- **Environment-based configuration**

## Project Structure

```
src/
├── api/                    # API modules
│   ├── httpClient.js       # Axios wrapper with auth
│   ├── auth.api.js
│   ├── dashboard.api.js
│   └── leads.api.js
├── auth/                   # Authentication
│   ├── Login.jsx
│   └── ProtectedRoute.jsx
├── components/             # Reusable components
│   ├── Layout/
│   │   ├── AppLayout.jsx
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx
│   └── Common/
│       ├── StatusBadge.jsx
│       ├── Loader.jsx
│       ├── EmptyState.jsx
│       └── ErrorBox.jsx
├── pages/                  # Page components
│   └── Dashboard.jsx
├── utils/                  # Utilities
│   ├── constants.js
│   └── formatters.js
├── config/                 # Configuration
│   └── env.js
├── App.jsx
└── main.jsx
```

## Environment Variables

Create `.env` file:

```bash
VITE_API_BASE_URL=http://localhost:3002
VITE_APP_ENV=development
VITE_APP_NAME=SellAgent
```

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Features

### Authentication
- Email + Password only
- JWT-based auth
- Role-based access control (OWNER, ADMIN, VIEWER, SUPER_ADMIN)

### Dashboard
- Execution status (RUNNING/PAUSED)
- Meetings booked
- Replies received
- Active leads
- Credits remaining
- Usage summary

### Design Rules
- Bootstrap components only
- Neutral colors (grays, blacks, whites)
- No custom animations
- Professional copy tone
- Explanatory messages

## Deployment

**Frontend:** `app.sellagent.ai`  
**Backend:** `api.sellagent.ai`

Update `.env` for production:

```bash
VITE_API_BASE_URL=https://api.sellagent.ai
VITE_APP_ENV=production
```

## Development Guidelines

1. **No hardcoded URLs** - Use `env.js` for all configuration
2. **Bootstrap only** - No custom UI libraries
3. **Read-mostly** - Frontend displays backend truth
4. **Role-based UI** - Hide restricted features based on user role
5. **Error handling** - Graceful degradation with retry options
6. **Professional tone** - Calm, explanatory copy

## Status

**Phase 1 Complete:**
-   Project structure
-   Environment configuration
-   HTTP client with auth
-   Login component
-   Protected routes
-   App layout (Header + Sidebar)
-   Dashboard page
-   Common components (Loader, ErrorBox, StatusBadge, EmptyState)
-   Utilities (formatters, constants)

**Next Phase:**
- [ ] Leads list and detail pages
- [ ] Meetings module
- [ ] Logs/audit viewer
- [ ] Billing page
- [ ] Settings page
- [ ] Super Admin panel

---

**This frontend makes clients feel: "This system is careful with my brand."**
# sell-agent-frontend
