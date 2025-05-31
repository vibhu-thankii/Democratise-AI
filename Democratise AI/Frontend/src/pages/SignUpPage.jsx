// File: src/pages/SignUpPage.jsx

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button.jsx';
import {Input} from '../components/ui/Input.jsx';
import {Label} from '../components/ui/Label.jsx';
import useStore from '../store/store.js'; // Correct path assumed
import { api } from '../lib/api.js'; // Import api helper
import { Loader2 } from 'lucide-react';

function SignUpPage() {
    // Select actions/state individually
    const addNotification = useStore(state => state.addNotification);
    const setCurrentPage = useStore(state => state.setCurrentPage);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        // Client-side validation
        if (!email || !password || !confirmPassword) {
            addNotification({ message: 'Please fill in all required fields.', type: 'error' });
            return;
        }
        if (password !== confirmPassword) {
            addNotification({ message: 'Passwords do not match.', type: 'error' });
            return;
        }
        // Match backend validation (e.g., min length)
        if (password.length < 8) { // Assuming min length is 8 from schema
            addNotification({ message: 'Password must be at least 8 characters long.', type: 'error' });
            return;
        }

        setIsLoading(true);
        console.log('Attempting sign up with:', name, email);

        // --- Call Backend API ---
        const result = await api.post('/api/v1/auth/signup', {
            name: name.trim() || email.split('@')[0] || 'New User', // Send name or derive default
            email: email,
            password: password
        }, { isAuthRequest: true }); // isAuthRequest prevents sending non-existent token

        if (result.success) {
            addNotification({ message: `Account created successfully for ${email}. Please log in.`, type: 'success' });
            setCurrentPage('login'); // Redirect user to login page
        } else {
            // Use error message from backend if available
            addNotification({ message: result.error || 'Sign up failed. Please try again.', type: 'error' });
            console.error("Signup failed:", result.error);
        }
        // --- End API Call ---

        setIsLoading(false);
    };

    const handleGoToLogin = () => {
        setCurrentPage('login');
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    <CardDescription>Create your account to get started.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name (Optional)</Label>
                            <Input
                                type="text"
                                id="name"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="signup-email">Email</Label>
                            <Input
                                type="email"
                                id="signup-email"
                                placeholder="m@example.com"
                                required value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="signup-password">Password</Label>
                            <Input
                                type="password"
                                id="signup-password"
                                placeholder="******"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input
                                type="password"
                                id="confirm-password"
                                placeholder="******"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-start space-y-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Already have an account?{' '}
                        <Button variant="link" className="p-0 h-auto" onClick={handleGoToLogin} disabled={isLoading}>
                            Login
                        </Button>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default SignUpPage;