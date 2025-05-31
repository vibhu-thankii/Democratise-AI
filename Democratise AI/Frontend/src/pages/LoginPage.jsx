// File: src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button.jsx';
import {Input} from '../components/ui/Input.jsx';
import {Label} from '../components/ui/Label.jsx';
import useStore from '../store/store.js'; // Correct path assumed
import { api } from '../lib/api.js'; // Correct path assumed
import { Loader2 } from 'lucide-react';

function LoginPage() {
    // Select actions/state individually
    const loginUserInStore = useStore(state => state.login);
    const addNotification = useStore(state => state.addNotification);
    const setCurrentPage = useStore(state => state.setCurrentPage);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            addNotification({ message: 'Please enter email and password.', type: 'error' });
            return;
        }
        setIsLoading(true);
        console.log('Attempting login with:', email);

        // --- Call Backend API ---
        const result = await api.login(email, password); // Uses special form-data helper

        if (result.success && result.data.access_token) {
            localStorage.setItem('authToken', result.data.access_token);
            console.log('Login successful, token stored. Fetching user details...');

            const userResult = await api.get('/api/v1/auth/me'); // api.get uses the new token

            if (userResult.success && userResult.data) {
                loginUserInStore(userResult.data); // Update store with user data
                addNotification({ message: `Welcome back, ${userResult.data.name || 'User'}!`, type: 'success' });
                // Redirect will be handled by App.jsx effect reacting to state change
            } else {
                addNotification({ message: userResult.error || 'Login succeeded but failed to fetch user details. Please try again.', type: 'error' });
                localStorage.removeItem('authToken');
                console.error("Failed to fetch user after login:", userResult.error);
            }
        } else {
            addNotification({ message: result.error || 'Login failed. Please check your credentials.', type: 'error' });
            console.error("Login failed:", result.error);
        }
        // --- End API Call ---

        setIsLoading(false);
    };

    const handleSignUpClick = () => {
        setCurrentPage('signup');
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>Enter your email below to login to your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                required value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-start space-y-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Don't have an account?{' '}
                        <Button variant="link" className="p-0 h-auto" onClick={handleSignUpClick} disabled={isLoading}>
                            Sign up
                        </Button>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default LoginPage;