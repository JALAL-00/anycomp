// src/app/providers.tsx (FULL CORRECTED CODE)
'use client';

import { Provider } from 'react-redux';
import { store } from '../store/store';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// FIX: Changed to NAMED IMPORT { AuthProvider }
import { AuthProvider } from '@/context/AuthContext'; 


// Define the custom MUI Theme (MUI uses its own system, but we align colors)
const theme = createTheme({
  palette: {
    primary: {
      main: '#0A66C2', // primary-blue
    },
    secondary: {
      main: '#222222', // text-primary
    },
  },
  typography: {
    // Note: We use Tailwind for custom fonts, but MUI needs a fallback
    fontFamily: [
      '"Red Hat Display"',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Global component to provide all necessary contexts (Redux, MUI Theme, Auth)
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider> {/* AuthProvider is correctly placed here */}
          {children}
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}