# Welcome to your AI Studio project

## Installation Guide

### Prerequisites
- Node.js 18+ - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm 9+ (comes with Node.js)
- Git

### Step-by-Step Installation

1. Clone the repository
```sh
git clone https://github.com/yourusername/friendly-coder.git
cd friendly-coder
```

2. Make the installation script executable
```sh
chmod +x src/scripts/install.sh
```

3. Run the installation script
```sh
./src/scripts/install.sh
```

4. Set up your environment variables
Create a `.env` file in the root directory with:
```sh
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Start the development server
```sh
npm run dev
```

6. Visit http://localhost:8080 in your browser

### Troubleshooting

If you encounter any issues:

1. Make sure you're using the correct Node.js version:
```sh
node --version  # Should be 18+
npm --version   # Should be 9+
```

2. Try cleaning the installation:
```sh
rm -rf node_modules package-lock.json
npm install
```

3. Verify all required files are present:
- vite.config.ts
- tsconfig.json
- src/main.tsx
- src/App.tsx
- src/index.css

## Project Structure

```
friendly-coder/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── utils/         # Utility functions
│   ├── hooks/         # Custom React hooks
│   └── integrations/  # Third-party integrations
├── public/            # Static assets
└── ...configuration files
```

## Technologies Used

This project is built with:
- Vite 5.4+
- TypeScript 5.5+
- React 18.3+
- shadcn/ui
- Tailwind CSS 3.4+
- Supabase
- Tanstack Query 5.56+

## Development

The development server will start on http://localhost:8080

## Deployment

You can deploy this project in several ways:

1. Using AI Studio's built-in deployment feature
2. Manual deployment to platforms like Netlify, Vercel, or GitHub Pages

## Support

If you encounter any issues, please:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed properly

For more information, visit our [documentation](https://docs.aistudio.dev/).