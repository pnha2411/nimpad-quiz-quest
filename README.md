# Nimpad

Nimpad is an **on‑chain, token‑gated learning platform** built atop the [Citrea](https://citrea.xyz) ecosystem. It enables users to learn about Citrea, Bitcoin Layer 2, DeFi, and BtcFi through interactive quizzes, AI chat, and NFT badge achievements. All progress, rewards, and claims are managed on-chain, leveraging Citrea's EVM compatibility and security.

---

## Project Info

**URL**: https://lovable.dev/projects/b8389a57-f29e-4fc0-836d-66c86f89cc70

---

## Features

- **Token-Gated Learning:** Access quizzes and content by connecting your wallet.
- **On-Chain Rewards:** Earn points and claim tokens on any supported EVM network.
- **NFT Badges:** Mint achievement badges as NFTs to showcase your progress.
- **AI Chatbot:** Get instant answers about Citrea, DeFi, and Bitcoin Layer 2.
- **Citrea Ecosystem:** Built to demonstrate and leverage Citrea's ZK rollup and EVM compatibility.

---

## Repository Structure

```
.
├── public/                     # Static assets (favicon, robots.txt, etc.)
├── src/
│   ├── App.tsx                 # Main React app entry
│   ├── main.tsx                # Vite entry point
│   ├── components/             # UI components (TokenClaiming, NFTBadges, AIChatbot, etc.)
│   ├── hooks/                  # Custom React hooks (wallet, quiz, etc.)
│   ├── integrations/
│   │   └── supabase/           # Supabase integration (client, types)
│   ├── lib/                    # Utility libraries and helpers
│   ├── pages/                  # Page-level components (Index, etc.)
│   └── ...                     # Styles, types, etc.
├── supabase/                   # Supabase config
├── package.json                # Project dependencies and scripts
├── tsconfig*.json              # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS config
├── vite.config.ts              # Vite config
└── README.md                   # Project documentation (this file)
```

---

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b8389a57-f29e-4fc0-836d-66c86f89cc70) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

---

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

---

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b8389a57-f29e-4fc0-836d-66c86f89cc70) and click on Share -> Publish.

---

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
