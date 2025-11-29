// src/app/providers.tsx (NEW FILE)
'use client';

import { Provider } from 'react-redux';
import { store } from '../store/store';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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
      {/* MUI Provider with custom theme */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Auth Provider will go here later */}
        {children}
      </ThemeProvider>
    </Provider>
  );
}