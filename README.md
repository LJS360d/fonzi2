# Fonzi2 - Discord Bot Framework

Fonzi2 is an incredibly simple and blazingly fast Discord bot framework built using TypeScript and Discord.js. It provides a structured architecture with automatic command registration, event handling, and OAuth2 server-side functionality.

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

Developing a robust and scalable Discord bot can be a daunting task, especially for beginners. Fonzi2 simplifies this process by providing a structured framework that takes care of the essential boilerplate code and common discord bot functionalities.

## Features

- Structured bot architecture with automatic command registration and event handling
- TypeScript support for type safety and code maintainability
- Cookie-session management for secure user sessions
- OAuth2 server-side functionality for user authentication and authorization
- Lightweight and extensible framework to adapt to various bot requirements

## Getting Started

### Prerequisites

Before you begin, ensure you have the following prerequisites installed:

- Node.js (>=18.12.1)
- npm (>=9.1.1)

### Installation

1. Clone or fork the Fonzi2 repository from GitHub:

2. Navigate into the project directory:

    ```bash
    cd fonzi2
    ```

3. Install the project dependencies:

    ```bash
    npm install
    ```

### Quick Start

1. Create a new application in the [Discord Developer Portal](https://discord.com/developers/applications).

2. Obtain the bot token from the Bot tab of your newly created application.

3. [Bot invite link] Generate an OAuth2 URL using the OAuth2 URL Generator in the Discord Developer Portal. Select the "bot" scope, for the bot invite link.

4. [ServerSide OAuth2] Generate an OAuth2 URL using the OAuth2 URL Generator in the Discord Developer Portal. Select the "identify" scope and `http://localhost:<port>/` as your redirect uri for development and **CHANGE `response_type` to `token`**.

    - For production: you will need to create a new OAuth2 url using the hostname of your deployment (ex. https://fonzi2.ljs360d.repl.co/ as the redirect uri), remember to **CHANGE `response_type` to `token`**.

5. Invite the bot to a server using the Bot invite link.

6. Create a `.env` file in the project root directory with the following properties:

    ```bash
    TOKEN=your-bot-token
    LOG_WEBHOOK=optional-webhook-url
    # ServerSide OAuth2 
    OAUTH2_URL=your-oauth2-url
    OWNER_IDS=your-owner-ids
    ```

6. Replace the placeholders with your actual values:

- `TOKEN`: The bot token obtained from the Discord Developer Portal.
- `LOG_WEBHOOK`: An optional webhook URL to receive bot logs.
- `OAUTH2_URL`: The generated OAuth2 URL, **CHANGE `response_type` to `token`**.
- `OWNER_IDS`: A comma-separated list of discord user IDs with administrative privileges.
    - User IDs are public and can be obtained by being in developer mode in discord and right clicking on a user, here they are used to access the admin dashboard after using the discord OAuth2 service, so you should add your account's User ID and whoever elses you would want to add as an admin for your bot.

7. Configure the bot intents in the `src\client\options.ts` file. Select only the necessary intents to improve bot efficiency and security.

8. Start the bot in development mode:

    ```bash
    npm run dev
    ```

This will start the bot and serverside in development mode, allowing you to test and debug your commands and functionalities.

## Contributing

I welcome contributions to the project. Feel free to open issues or submit pull requests with improvements or bug fixes.

### Todo List

- Implement pre-run .env validation
- Auto-register class decorators for interactions and events

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
   git clone https://github.com/your-username/your-bot.git
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
   # Production OAuth2 url
   OAUTH2_URL=your-oauth2-url
   OWNER_IDS=your-user-id,contributors-user-ids
   ```
6. Build the project and start the process
   ```bash
   npm run  
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
   - Just like with the `.env` you will need a `TOKEN` and a `LOG_WEBHOOK` secrets for the bot to work and the OAuth2 Secrets for the serverside dashboard
   - For this purpose there is an npm script that you should run before deployment: `npm run build:secret` that will parse your .env into a JSON file to be quickly inserted into the replit secrets, but remember to change the serverside OAuth2 url to the production one.  
3. Start the Bot
   - Click on the "Start" button in the toolbar
4. Keep the Repl Alive:
   - To ensure your bot runs continuously, use a service like [UptimeRobot](https://uptimerobot.com) to ping your Repl every few minutes.