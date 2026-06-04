# Hubb Admin Dashboard

Generic admin dashboard template for Hubb - a community management platform.

## Features

- 🎨 **Dynamic Theming**: Light/dark mode + customizable brand colors
- 🔐 **Authentication**: Login flow with role-based access
- 📊 **Dashboard**: Overview with stats, upcoming events, and activity
- 📅 **Events Manager**: Create, edit, and manage community events
- 📰 **News & Announcements**: Post updates to keep members informed
- 🎯 **Programs Manager**: Showcase community programs and activities
- 👥 **Members Directory**: View and manage community members
- 📄 **Documents Manager**: Upload and manage member-only documents
- ⚙️ **Settings**: Org profile and brand color customization

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Default Login:**
- Email: Any email
- Password: Any password

### Build

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── admin/           # Admin dashboard routes
│   ├── page.tsx     # Dashboard
│   ├── events/      # Events manager
│   ├── news/        # News/announcements
│   ├── programs/    # Programs manager
│   ├── members/     # Members directory
│   ├── documents/   # Documents manager
│   └── settings/    # Settings with theme customization
├── login/           # Login page
├── components/      # Reusable components
│   ├── Sidebar.tsx
│   └── Header.tsx
├── providers.tsx    # Theme provider with light/dark mode + custom colors
├── auth-context.tsx # Authentication context
└── globals.css      # Global styles with CSS variables

public/             # Static assets
```

## Theming

The dashboard supports:
- **Light/Dark Mode Toggle**: Click the sun/moon icon in the header
- **Custom Brand Colors**: Change primary, accent, and secondary colors in Settings
- **CSS Variables**: Colors are stored as CSS variables and persist in localStorage

### Default Palette
- Primary: Forest Green (#1b5e41)
- Accent: Amber (#ffc107)  
- Secondary: Burnt Sienna (#813920)

## Fonts

- **Headings**: Fraunces (serif)
- **Body**: DM Sans (sans-serif)

Both imported from Google Fonts.

## Next Steps

1. **Connect to Supabase**: Replace mock auth and data with real API calls
2. **Build Public Site**: Create the public-facing community site
3. **Add Member Signup**: Implement member registration flow
4. **Deploy to Vercel**: Push to GitHub and deploy

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State**: React Context API + localStorage
- **Auth**: Mock (ready for Supabase integration)

## Notes

- All data is currently mocked with localStorage
- Auth is simplified for demo purposes
- Ready to integrate with Supabase for production
- Responsive design works on mobile, tablet, and desktop
