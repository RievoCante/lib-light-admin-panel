# Lib Light Admin Panel

Web-based admin panel for customer support to read and reply to messages from the Lib Light Flutter app https://github.com/RievoCante/lib-light.git.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** (build tool)
- **Firebase** (Firestore + Authentication)
- **Tailwind CSS** + **shadcn/ui**
- **TanStack Query** (state management)
- **React Router v6** (routing)

## Prerequisites

- Node.js 22+
- npm
- Firebase project with Firestore and Authentication enabled

## Setup

1. Clone the repository:
```bash
git clone https://github.com/RievoCante/lib-light-admin-panel.git
cd lib-light-admin-panel
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=lib-light
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start development server:
```bash
npm run dev
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run lint-format` - Run linting and formatting together

## Deployment

The project is configured for deployment on **Vercel**. The `vercel.json` file handles SPA routing.

## Features

- Real-time chat messaging
- User profile display with avatars
- Protected routes with Firebase Authentication
- Responsive 4-panel layout (desktop only)

## License

ISC

