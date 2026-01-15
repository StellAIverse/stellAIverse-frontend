# stellAIverse-frontend

## Overview

**stellAIverse** is a beautiful, immersive web application that transforms how you create and interact with AI agents. Built with Next.js and Tailwind CSS, it features a stunning cosmic interface with a galaxy-style marketplace where you can browse, create, and deploy intelligent AI agents. Whether you're building custom agents to automate tasks, exploring community-created agents, or learning best practices in agent development, stellAIverse provides an intuitive platform with a visual experience that feels like exploring the stars.

The platform combines a powerful **agent creation wizard** (describe behavior → auto-generate basic contract + metadata), an interactive **chat interface** for agent interaction, a **portfolio dashboard** with performance stats, and an **educational mode** with tutorials on building smarter agents—all wrapped in a captivating cosmic UI theme with dark space backgrounds, glowing nebulae, and animated star constellations.

## Features

- 🧙 **Agent Creation Wizard**: Describe your agent's behavior and automatically generate basic contracts + metadata
- 🌌 **Galaxy Marketplace**: Browse and discover agents visualized as stars and planets
- 💬 **Agent Chat Interface**: Interact with your AI agents in real-time
- 📊 **Agent Portfolio**: Track your owned agents and view detailed performance statistics
- 🎓 **Educational Mode**: Learn best practices and tutorials for building smarter agents
- ✨ **Cosmic UI Theme**: Dark space aesthetic with glowing nebulae and animated constellations

## Requirements

- **Node.js**: v18 or higher
- **npm** or **yarn**: Package manager
- **Git**: Version control

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/StellAIverse/stellAIverse-frontend.git
cd stellAIverse-frontend
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory with the necessary environment variables:

```bash
cp .env.example .env.local  # if available, or create manually
```

Add the following (adjust based on your backend configuration):
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ENVIRONMENT=development
```

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

### 6. Run Tests

```bash
npm run test
```

### 7. Network Configuration

If running with a local backend, ensure:
- Frontend runs on `http://localhost:3000`
- Backend API runs on the configured `NEXT_PUBLIC_API_URL`
- CORS is properly configured if frontend and backend are on different domains

## Project Structure

```
stellAIverse-frontend/
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # Utility functions and helpers
├── styles/                 # Global styles and Tailwind config
├── public/                 # Static assets
├── .env.example           # Environment variables template
└── package.json           # Dependencies and scripts
```

## Helpful Links

- **[Documentation](./docs)** - Detailed guides and API documentation
- **[Contributing Guidelines](./CONTRIBUTING.md)** - How to contribute to the project
- **[Issues](https://github.com/StellAIverse/stellAIverse-frontend/issues)** - Report bugs or request features
- **[Discussions](https://github.com/StellAIverse/stellAIverse-frontend/discussions)** - Community discussions
- **[Next.js Documentation](https://nextjs.org/docs)** - Learn about Next.js
- **[Tailwind CSS Documentation](https://tailwindcss.com/docs)** - Style reference

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
