'use client';

import { Provider } from 'react-redux';
import { store } from '../store/store';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from '@/context/AuthContext'; 
import { useAuthSession } from '@/hooks/useAuthSession';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0A66C2',
    },
    secondary: {
      main: '#222222',
    },
  },
  typography: {
    fontFamily: [
      '"Red Hat Display"',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function AuthInitializer({ children }: { children: React.ReactNode }) {
    const isSessionChecked = useAuthSession();
    return isSessionChecked ? <>{children}</> : null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <AuthInitializer>
            {children}
          </AuthInitializer>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}