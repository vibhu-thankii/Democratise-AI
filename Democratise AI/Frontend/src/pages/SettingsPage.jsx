import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { create } from 'zustand';
import { Home, FolderKanban, Puzzle, Database, GraduationCap, Settings, LogIn, LogOut, Menu, X, Sun, Moon, Trash2, Settings2, Eye, Plus, CheckCircle, XCircle, Info, Loader2, AlertTriangle, Filter, SortAsc, SortDesc } from 'lucide-react'; // Added Filter, SortAsc, SortDesc
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx'; // FIXED: Added .jsx extension and relative path
import Button  from '../components/ui/Button.jsx'; // FIXED: Added .jsx extension and relative path
import useStore from '../store/store.js'; // FIXED: Added .js extension and relative path
import {Input} from '../components/ui/Input.jsx'; // Added Input
import {Label} from '../components/ui/Label.jsx'; // Added Label

/**
 * Settings page component.

// =======================================================================
// --- File: src/pages/SettingsPage.jsx ---
// =======================================================================
/**
 * Settings page component for user preferences and account management.
 */
function SettingsPage() {
  // Global state selectors (optimized to select primitives/stable refs)
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const userNameFromStore = useStore((state) => state.user?.name); // Select primitive
  const userEmailFromStore = useStore((state) => state.user?.email); // Select primitive
  const addNotification = useStore((state) => state.addNotification);

  // Local state for form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // State for loading indicators
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);

  // Effect to initialize/update local state when user data from store changes
  useEffect(() => {
      setName(userNameFromStore || '');
      setEmail(userEmailFromStore || '');
  }, [userNameFromStore, userEmailFromStore]); // Depend on stable primitives

  // --- Handlers ---
  const handleProfileUpdate = async (e) => { e.preventDefault(); setIsProfileSaving(true); console.log("Simulating profile update:", { name, email }); addNotification({ message: "Saving profile...", type: 'info', duration: 2000 }); await new Promise(resolve => setTimeout(resolve, 1500)); addNotification({ message: "Profile updated successfully (simulated).", type: 'success' }); setIsProfileSaving(false); };
  const handlePasswordChange = async (e) => { e.preventDefault(); if (!currentPassword || !newPassword || !confirmNewPassword) { addNotification({ message: "Please fill all password fields.", type: 'error' }); return; } if (newPassword !== confirmNewPassword) { addNotification({ message: "New passwords do not match.", type: 'error' }); return; } if (newPassword.length < 6) { addNotification({ message: "New password must be at least 6 characters.", type: 'error' }); return; } setIsPasswordChanging(true); addNotification({ message: "Changing password...", type: 'info', duration: 2000 }); console.log("Simulating password change..."); await new Promise(resolve => setTimeout(resolve, 1500)); addNotification({ message: "Password changed successfully (simulated).", type: 'success' }); setCurrentPassword(''); setNewPassword(''); setConfirmNewPassword(''); setIsPasswordChanging(false); };
  const handleDeleteAccount = () => { if (window.confirm("Are you absolutely sure you want to delete your account? This action is irreversible.")) { addNotification({ message: "Simulating account deletion...", type: 'info' }); setTimeout(() => { useStore.getState().logout(); addNotification({ message: "Account deleted (simulated). You have been logged out.", type: 'success' }); }, 1500); } };

  return (
     <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <Card>
            <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between"> <p>Theme</p> <Button onClick={toggleTheme} variant="outline"> Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode </Button> </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Account</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                 <form onSubmit={handleProfileUpdate} className="space-y-4">
                     <h3 className="text-md font-semibold border-b pb-2 dark:border-slate-700">Profile Information</h3>
                     <div className="space-y-2"> <Label htmlFor="profile-name">Name</Label> <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" disabled={isProfileSaving} /> </div>
                     <div className="space-y-2"> <Label htmlFor="profile-email">Email</Label> <Input id="profile-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" disabled={isProfileSaving} required /> </div>
                     <div className="flex justify-end"> <Button type="submit" disabled={isProfileSaving}> {isProfileSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {isProfileSaving ? 'Saving...' : 'Save Profile'} </Button> </div>
                 </form>
                 <form onSubmit={handlePasswordChange} className="space-y-4 pt-6 border-t dark:border-slate-700">
                      <h3 className="text-md font-semibold border-b pb-2 dark:border-slate-700">Change Password</h3>
                     <div className="space-y-2"> <Label htmlFor="current-password">Current Password</Label> <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required disabled={isPasswordChanging} /> </div>
                     <div className="space-y-2"> <Label htmlFor="new-password">New Password</Label> <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required disabled={isPasswordChanging} /> </div>
                      <div className="space-y-2"> <Label htmlFor="confirm-new-password">Confirm New Password</Label> <Input id="confirm-new-password" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required disabled={isPasswordChanging} /> </div>
                      <div className="flex justify-end"> <Button type="submit" disabled={isPasswordChanging}> {isPasswordChanging && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {isPasswordChanging ? 'Changing...' : 'Change Password'} </Button> </div>
                 </form>
                 <div className="pt-6 border-t border-red-300 dark:border-red-700">
                     <h3 className="text-md font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3">Deleting your account is permanent and cannot be undone.</p>
                     <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>Delete Account</Button>
                 </div>
            </CardContent>
        </Card>
    </div>
  );
}
export default SettingsPage; // In real file