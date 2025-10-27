# TradeBinder Frontend

Frontend application for TradeBinder, a platform for buying and selling Magic: The Gathering cards.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Technologies

- **React 19** with TypeScript
- **Material-UI** for UI components
- **Tailwind CSS** for custom styling
- **React Router** for navigation
- **Axios** for API communication
- **Context API** for state management

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run serve`

Starts a production server to serve the built React app.\
This is used for deployment on Railway and other platforms.

### `npm run deploy`

Builds the app and starts the production server.\
This command runs `build` followed by `serve`.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_API_TIMEOUT=10000
REACT_APP_ENV=development
REACT_APP_NAME=TradeBinder
REACT_APP_VERSION=1.0.0
```

For production, update `REACT_APP_API_URL` with your deployed backend URL.

## Deployment on Railway

This project is configured for deployment on [Railway](https://railway.app/).

### Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. Your project must be pushed to a Git repository (GitHub, GitLab, etc.)

### Deployment Steps

1. **Install Railway CLI** (optional, for local testing):
   ```bash
   npm i -g @railway/cli
   ```

2. **Connect to Railway**:
   - Go to [railway.app](https://railway.app) and sign in
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose this repository

3. **Configure Environment Variables**:
   - In the Railway dashboard, go to your project
   - Click on "Variables"
   - Add the following variables:
     ```
     REACT_APP_API_URL=https://your-backend-url.railway.app/api
     REACT_APP_API_TIMEOUT=10000
     REACT_APP_ENV=production
     REACT_APP_NAME=TradeBinder
     REACT_APP_VERSION=1.0.0
     ```
   - Update `REACT_APP_API_URL` with your actual backend URL

4. **Deploy**:
   - Railway will automatically detect the Node.js project
   - The build process will run automatically
   - Your app will be deployed and available at a `.railway.app` URL

### How It Works

The deployment process:
1. Railway detects the `railway.toml` configuration file
2. Uses Nixpacks to build the project
3. Runs `npm install` to install dependencies
4. Runs `npm run build` to build the React app
5. Runs `npm run serve` to start the Express server
6. The Express server serves the static files and handles client-side routing

### Custom Domain

To use a custom domain:
1. In Railway dashboard, go to your project
2. Click on "Settings"
3. Click "Add Custom Domain"
4. Follow the instructions to configure your DNS

### Monitoring and Logs

- View deployment logs in the Railway dashboard
- Monitor resource usage and performance
- Set up alerts for deployment failures

## Project Structure

```
/src
├── /components      # Reusable components
│   ├── /common      # Common components (Button, Input, Modal)
│   ├── /features    # Feature-specific components
│   └── /layout      # Layout components (Header, Footer)
├── /context         # Context API providers
├── /hooks           # Custom React hooks
├── /pages           # Page components
├── /services        # API services
├── /types           # TypeScript type definitions
└── /utils           # Utility functions
```

## Learn More

- [React documentation](https://reactjs.org/)
- [Material-UI documentation](https://mui.com/)
- [Tailwind CSS documentation](https://tailwindcss.com/)
- [React Router documentation](https://reactrouter.com/)
- [Railway documentation](https://docs.railway.app/)
