## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Getting Started Part 2

The backend code is currently located in /backend/utility.py. To run this code, you will first need to follow these steps:

- **Note:** You must have python installed to perform these steps.

1. Create a virtual environment by running this command: `python -m venv venv`

2. Activate the virtual environment: `venv\Scripts\activate` on Windows OR `source venv/bin/activate` on macOS/Linux

3. Install the necessary packages that are listed in `requirements.txt`: `pip install -r requirements.txt`

4. You can now locally host the backend code by running `python backend/utility.py` from the root directory of this project

5. When you are done, run the command `deactivate` to deactivate the virtual environment. Repeat steps 2-5 the next time you want to run the development server.

## Prototype Release Dates

1. Prototype 1 - 10/13 - Commit ID: f0f76575c2a5a674af19ca2e9f47207b89d46d24
