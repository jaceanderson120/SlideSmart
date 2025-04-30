## Getting Started

First, make sure you have Node installed [https://nodejs.org/en/download](https://nodejs.org/en/download). Once installed, run `npm install` to install all necessary dependencies to run this project.

Next, run the development server with the command `npm run dev`.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

*Important Note: Please see the section below on environments, or some features will not work.*

## Extra Information

Here is some other starter information from the original documentation from the initial Next.js project:
You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Managing Environments & Env Vars

### Getting Env Vars

*Note: Please contact Brayden Pettigrew for assistance with the information below.*

To start, there are *two* different environments that we deal with. One is the **production** environment. This is basically the website that users actually visit and it has its own database. There is also the **development/preview** environment. This is where we do local development and testing to ensure everything works properly before moving it to production.

You can pull environment variables from Vercel using the following command:

```bash
vercel env pull .env --environment=preview --git-branch dev
```

The above command will pull the necessary environment variables into a file in the root directory of the project called `.env`.

*Note: The `npm run dev` command will use the environment variables from the `.env` file. Anything done here is separate from the production website.*

### Builds for Different Environments

When you run the command `vercel`, it will create a preview build with the development environment variables, regardless of the branch you are on, but it will not appear on production.

When you run the command `vercel --prod`, it will automatically create and push a build to production, regardless of the branch you are on, so **be careful**.

The table below summarizes that:

| Command              | Branch | Deploys To | Uses Env Vars | URL Format                         |
|----------------------|--------|------------|---------------|-------------------------------------|
| `vercel`             | main   | Preview    | Preview       | `main.project-name.vercel.app`     |
| `vercel`             | dev    | Preview    | Preview       | `dev.project-name.vercel.app`      |
| `vercel --prod`      | any    | Production | Production    | `project-name.vercel.app` or custom |

*Note: Stripe is disabled in both local (npm run dev) and preview (vercel) environments. Google authentication is disabled in preview (vercel) environments. These services are only fully functional in production.*
