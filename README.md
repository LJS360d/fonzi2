# Fonzi2 - Discord Bot Framework

Incredibly simple and blazingly fast Discord bot starter kit built using TypeScript and Discord.js.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
- [Contributing](#contributing)
- [Deployment](#deployment)
  - [Serverless](#serverless-replit)
  - [DEDI](#dedicated-server-pm2)

## Introduction

Fonzi2 is a Discord bot framework designed to simplify the development of any kind of discord bot. It provides a structured architecture with automatic command registration and event handling. <br>
A friendly reminder to never ask about Fonzi1.

## Features

- Structured bot architecture
- Automatic command registration
- Event handling for common Discord.js events
- TypeScript support

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (>= 16.20.2)
- npm (>= 8.10.1) or pnpm (>= 8.11.0)

### Installation

Clone or fork this repository and install dependencies:

```bash
npm install
# or
pnpm install
```

### Quick start

1. Create a new application in the [Discord developer portal](https://discord.com/developers/applications)

2. Get the **bot token** under the Bot tab for step 5

3. Generate the bot invite url under OAuth2 -> URL Generator, select at least the `bot` scope and the `permissions` you need for your bot

4. use the generated `invite link` to invite the bot to a server you can use for testing

5. Create a `.env` file in the project root with the following properties

   ```bash
   TOKEN=your-bot-token
   LOG_WEBHOOK=optional-webhook-url
   ```
6. In the `src\client\options.ts` file select the intents your bot needs.
    - It is recommended to **Only** select the necessary ones, this also applies for the invite link creation
7. Run the bot in development mode:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

## Contributing

Feel free to contribute to the project by opening issues or submitting pull requests.

### Todo List

- Implement .env validation
- Auto-register class decorators
- Add more optimized production build method/bundler

## Deployment

### Dedicated Server (PM2)

You can host your bot on a dedicated server using the [pm2 package](https://pm2.keymetrics.io).

1. Set up Node.js and npm on your server.
2. **Install PM2:**

   If you don't have PM2 installed on your server, install it globally:

   ```bash
   npm install pm2 -g
   ```

3. Clone your bot repository onto the server:

   ```bash
   git clone https://github.com/your-username/fonzi2.git
   cd fonzi2
   ```

4. Install dependencies:
   ```bash
   npm install
   ```
5. **Configure .env**
   ```bash
   TOKEN=your-bot-token
   LOG_WEBHOOK=optional-webhook-url
   ```
6. Start the process
   ```bash
   pm2 start npm --name "fonzi2" -- start
   ```
   - Replace "fonzi2" with your desired PM2 process name.
7. Monitor and Manage:

   - You can monitor your bot's logs and manage it with PM2 commands:

   ```bash
   # see pm2 logs
   pm2 logs fonzi2

   #stop the bot
   pm2 stop fonzi2

   #restart the bot
   pm2 restart fonzi2

   #view process information
   pm2 show fonzi2
   ```

### Serverless ([Replit](https://replit.com))

By far the simplest way to host a Discord bot for **free**, this approach is excellent for small to medium-sized applications with minimal resource requirements, but theres also premium options for more demanding apps.

1. Sign in to [Replit](https://replit.com) with GitHub.
   - Click on "Create repl" to create a new repl.
   - Click on "Import from GitHub" and select your bot repository.
2. **Setup secrets**
   - Instead of creating a `.env` file, on replit, you have to specify your environment variables in the **Secrets** tool
   - Just like with the `.env` you will need a `TOKEN` and a `LOG_WEBHOOK` secrets
3. Start the Bot
   - Click on the "Start" button in the toolbar
4. Keep the Repl Alive:
   - To ensure your bot runs continuously, use a service like [UptimeRobot](https://uptimerobot.com) to ping your Repl every few minutes.
