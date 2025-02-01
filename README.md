# Bandobast - Police Duty Management System

## Local Development Setup

1. **Prerequisites**
   - Node.js (v16 or higher)
   - npm (v7 or higher)
   - VSCode
   - Git

2. **VSCode Extensions**
   Install the following extensions for the best development experience:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript and JavaScript Language Features

3. **Setup Steps**

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd bandobast

# Install dependencies
npm install

# Start development server
npm run dev
```

4. **Environment Setup**
   The project uses Supabase for the backend. The credentials are already configured in the code for development.

5. **Available Scripts**
   - `npm run dev` - Start development server
   - `npm run build` - Build for production
   - `npm run preview` - Preview production build locally

6. **Project Structure**
   ```
   src/
   ├── components/     # Reusable UI components
   ├── hooks/         # Custom React hooks
   ├── lib/           # Utilities and configurations
   ├── pages/         # Page components
   └── main.tsx       # Application entry point
   ```

7. **Features**
   - Real-time location tracking
   - Task management
   - Official status monitoring
   - Zone violation detection

## Technologies Used
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Supabase
- Google Maps API

## Troubleshooting

If you encounter any issues:

1. **Database Connection Issues**
   - Check console for detailed error messages
   - Ensure you're connected to the internet
   - The app will fallback to mock data if connection fails

2. **Build Issues**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: 
     ```bash
     rm -rf node_modules
     npm install
     ```

3. **Map Issues**
   - Ensure you have a stable internet connection
   - Check console for any API-related errors

## Support
For any issues or questions, please open an issue in the repository.