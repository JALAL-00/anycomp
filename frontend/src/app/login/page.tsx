// src/app/login/page.tsx (FULL CORRECTED CODE)
'use client';

import React, { useState, useEffect } from 'react'; 
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { TextField, Button, Typography, Paper, CircularProgress, Link as MUILink } from '@mui/material'; 
import Link from 'next/link'; 
import { useAuth } from '@/context/AuthContext'; 

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Default values for Admin for fast testing
  const [email, setEmail] = useState('admin@stcomp.com'); 
  const [password, setPassword] = useState('AdminPassword123'); 
  const [localError, setLocalError] = useState<string | null>(null);

  // CORRECTED: Moved redirect logic to useEffect to run after render
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/specialists');
    }
  }, [isAuthenticated, router]); 

  // If already authenticated, show loading while redirecting
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-light">
          <CircularProgress />
          <Typography className='ml-4'>Redirecting...</Typography>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    try {
        await login(email, password); 
    } catch (err: any) {
        setLocalError(err || 'Login failed.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-light">
      <Paper className="p-8 shadow-2xl w-full max-w-md bg-white border border-zinc-100" sx={{ borderRadius: '12px' }}>
        
        <div className="text-center mb-8">
            <Typography variant="h4" className="font-bold text-primary-dark font-sans" sx={{ mb: 1 }}>
                ST COMP
            </Typography>
            <Typography variant="h6" className="text-text-primary font-medium">
                Admin Login {/* <-- CORRECT PAGE TITLE */}
            </Typography>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            variant="outlined"
            size="medium"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            size="medium"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />

          {(error || localError) && (
            <Typography color="error" className='text-sm font-medium'>
                Error: {localError || error}
            </Typography>
          )}
          
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            className="normal-case font-bold"
            sx={{
                height: '50px',
                bgcolor: '#0A66C2', // primary-blue
                '&:hover': { bgcolor: '#0D47A1' },
                borderRadius: '8px'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'} {/* <-- CORRECT BUTTON TEXT */}
          </Button>
        </form>
        
        <Typography variant="body2" align="center" sx={{ mt: 3, color: 'text-text-primary' }}>
            New User? {' '}
            <Link href="/register" passHref>
                <MUILink component="span" sx={{ cursor: 'pointer', color: '#0A66C2' }}>
                    Register here.
                </MUILink>
            </Link>
        </Typography>
      </Paper>
    </div>
  );
}