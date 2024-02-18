# Fonzi2 - Discord Bot Framework
<p>
		<a href="https://discord.gg/tyrj7wte5b">
    <img src="https://img.shields.io/discord/1122938014637756486?color=5865F2&logo=discord&logoColor=white" alt="Discord server" />
    </a>
		<a href="https://www.npmjs.com/package/fonzi2">
    <img src="https://img.shields.io/npm/v/fonzi2.svg?maxAge=3600" alt="package version" />
    </a>
		<a href="https://www.npmjs.com/package/fonzi2">
    <img src="https://img.shields.io/npm/dt/fonzi2.svg?maxAge=3600" alt="npm downloads" />
    </a>
    <a href="https://github.com/LJS360d/fonzi2/actions">
    <img src="https://github.com/LJS360d/fonzi2/actions/workflows/build.yml/badge.svg" alt="Tests status" />
    </a>
	</p>
Fonzi2 is an incredibly simple and fast Discord bot framework focused on a better dev experience, built using TypeScript and Discord.js. It provides a structured architecture with automatic command registration, event handling, and OAuth2 server-side functionality.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Quick Start](#required-steps)
- [Contributing](#contributing)
- [Deployment](#deployment)
  - [Serverless](#serverless-replit)
  - [Dedicated Server](#dedicated-server-pm2)

## Introduction

Developing a robust and scalable Discord bot can be a daunting task, especially for beginners. Fonzi2 simplifies this process by providing a structured framework that takes care of the essential boilerplate code and common discord bot functionalities.

## Features

- Structured bot architecture with automatic command registration and event handling
- TypeScript support for type safety and code maintainability
- Cookie-session management for secure user sessions
- OAuth2 server-side functionality for user authentication and authorization
- Lightweight and extensible framework to adapt to various bot requirements
- Centralized on Discord API

## Getting Started
The package has been created and tested with **Node.js Version 18 and 20**.
<br>
**pnpm 8.15.3** was used as the package manager
<br>
I reccomend using nvm (Node Version Manager).

### Installation
   ```bash
   npm install fonzi2 discord.js 
   ```

### Other packages you should install
- for customizing the SSR
  ```bash
   npm install express ejs cookie-session
  ```

### Required steps

1. Create a new application in the [Discord Developer Portal](https://discord.com/developers/applications).

2. Obtain the bot token from the Bot tab of your newly created application.

3. [Invite link] Generate an OAuth2 URL using the OAuth2 URL Generator in the Discord Developer Portal.
   Select the `bot` scope and the permissions you need to generate the bot invite link.

4. [ServerSide OAuth2] Generate an OAuth2 URL using the OAuth2 URL Generator in the Discord Developer Portal. Select the "identify" scope and `http://localhost:<port>/login` as your redirect uri for development and **CHANGE `response_type` to `token`**.

   - For production: you will need to create a new OAuth2 url using the hostname of your deployment (ex. https://fonzi2.railway.app/login as the redirect uri), remember to **CHANGE `response_type` to `token`**.

## Contributing

I welcome contributions to the project. Feel free to open issues or submit pull requests with improvements or bug fixes.


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
   INVITE_LINK=bot-invite-link
   # Production OAuth2 url
   OAUTH2_URL=your-oauth2-url
   OWNER_IDS=your-user-id,contributors-user-ids
   ```
6. Build the project and start the process
   ```bash
   npm run build
   pm2 start npm --name "fonzi2" -- start
   ```
   - Replace "fonzi2" with your desired PM2 process name.
7. Monitor and Manage:

   ```bash
   # see pm2 logs
   pm2 logs fonzi2

   # stop the bot
   pm2 stop fonzi2

   # restart the bot
   pm2 restart fonzi2

   # view process information
   pm2 show fonzi2
   ```

### Serverless ([Railway](https://railway.app))

By far the simplest way to host a Discord bot for **free***, this approach is excellent for small to medium-sized applications with minimal resource requirements, but theres also premium options for more demanding apps.

1. Sign in to [Railway](https://railway.app) with GitHub.
   - Click on "Create project" to create a new project.
   - Select "Deploy from GitHub repo" and select your bot repository.
2. **Setup env**
   - **DO NOT** push the `.env` file to your repo as it contains sensible information about your bot that would become public, instead create **Service Variables** on railway, you can just copy and paste your existing `.env`, but make sure to change the necesarry variables to their production counterparts.

3. There is no step 3, you are done!
   - Whenever you push to the default branch in your repo railway will fetch the changes and redeploy the bot, it goes without saying that the bot will stay online 24/7 without any external needs
