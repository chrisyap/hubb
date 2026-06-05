# Hubb

A lightweight, friendly CMS and community management platform built for volunteer-run organisations — P&C associations, sports clubs, local community groups.

> **Status:** v1 in development · White-label template

## Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Hosting | Vercel |
| Database + Auth | Firebase (Firestore + Firebase Auth) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Payments (future) | Stripe |

## Quick Start

### Prerequisites

- Node.js 18+
- A Firebase project (free Spark plan works)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd hubb
npm install
```

### 2. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable **Authentication** → Sign-in methods:
   - Google (enable)
   - Email/Password (enable)
4. Create **Firestore Database** (start in test mode, apply rules later)

### 3. Get your Firebase config

From Firebase Console → Project Settings → General → Your apps → Web app:

```
apiKey: "AIza...",
authDomain: "your-project.firebaseapp.com",
projectId: "your-project",
storageBucket: "your-project.appspot.com",
messagingSenderId: "...",
appId: "1:..."
```

### 4. Create a service account

Firebase Console → Project Settings → Service Accounts → Generate new private key. Download the JSON file.

### 5. Set environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:

```env
# From Firebase web app config
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=1:...

# Paste the full service account JSON here
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}

# Or point to the downloaded file
# FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/service-account.json

# Org name shown in the admin UI
NEXT_PUBLIC_ORG_NAME=My Community
```

### 6. Deploy Firestore Security Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

Alternatively, copy the contents of `firestore.rules` into the Firebase Console → Firestore → Rules tab.

### 7. Run locally

```bash
npm run dev
```

Visit http://localhost:3000 — sign in with Google or email/password. The first user to sign up becomes an admin and the org is created automatically.

### 8. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your repo to GitHub
2. Import into Vercel
3. Add all `NEXT_PUBLIC_FIREBASE_*` and `FIREBASE_SERVICE_ACCOUNT_JSON` env vars
4. Deploy

## Project Structure

```
hubb/
├── app/
│   ├── admin/              # Admin CMS UI (behind auth)
│   │   ├── dashboard/      # Dashboard with stats
│   │   ├── events/         # Event management
│   │   ├── news/           # News & announcements
│   │   ├── programs/       # Programs management
│   │   ├── members/        # Member directory
│   │   ├── documents/      # Document management
│   │   └── settings/       # Org settings + branding
│   ├── api/                # Next.js API routes
│   │   ├── content/        # Generic CRUD for all content types
│   │   ├── setup/          # First-time org setup
│   │   ├── users/          # User profiles
│   │   └── org/            # Org settings
│   ├── components/
│   │   └── ui/             # shadcn/ui components
│   ├── lib/                # Shared utilities
│   ├── login/              # Auth page
│   ├── auth-context.tsx    # Firebase Auth context
│   └── providers.tsx       # Theme provider
├── firestore.rules         # Firestore security rules
└── .env.example            # Env var template
```

## Content Types

| Collection | Description | Public? |
|---|---|---|
| `events` | Community events with date, location, capacity | Yes |
| `news` | Announcements and updates | Yes |
| `programs` | Ongoing programs and activities | Yes |
| `members` | Community members linked to auth | No |
| `documents` | Uploaded files (PDFs, etc.) | Conditionally |
| `pages` | Static pages (About, Contact) | Yes |
| `committee_members` | Org committee / team | Yes |
| `sponsors` | Community partners | Yes |
| `orgs` | Org settings (name, colors, domain) | Admin only |

## White-label Usage

Each deployment of Hubb is a standalone Firebase project. To create a new instance for a different org:

1. Clone this repo
2. Create a new Firebase project
3. Set the `NEXT_PUBLIC_FIREBASE_*` env vars
4. Deploy to its own Vercel project

No code changes needed — all org-specific data (name, branding, content) lives in Firestore.

## License

MIT — built by [lab.radical](https://labradical.com.au)
