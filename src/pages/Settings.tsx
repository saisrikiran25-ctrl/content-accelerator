import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Building2,
  Mail,
  Briefcase,
  Sparkles,
  Moon,
  Sun,
  Bell,
  Save,
  LogOut,
  Trash2,
  ArrowRight,
  Check,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { VerticalType } from '@/types/database';
import { cn } from '@/lib/utils';

const verticalOptions = [
  { value: 'legal', label: 'Legal' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'tech', label: 'Technology' },
  { value: 'accounting', label: 'Accounting' },
  { value: 'finance', label: 'Finance' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'custom', label: 'Custom' },
];

export default function Settings() {
  const { profile, updateProfile, createProfile, isLoading } = useProfile();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [vertical, setVertical] = useState<VerticalType>('custom');
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Preferences state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  // Delete account state
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Brand voice state
  const [activeBrandVoice, setActiveBrandVoice] = useState<any>(null);

  // Load initial data
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setCompanyName(profile.company_name || '');
      setVertical(profile.vertical);
      setIsDirty(false);
    }
  }, [profile]);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  // Load active brand voice
  useEffect(() => {
    if (user?.id) {
      loadActiveBrandVoice();
    }
  }, [user?.id]);

  const loadActiveBrandVoice = async () => {
    try {
      const { data, error } = await supabase
        .from('brand_voices')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      setActiveBrandVoice(data);
    } catch (error) {
      console.error('Error loading brand voice:', error);
    }
  };

  // Track form changes
  useEffect(() => {
    if (profile) {
      const hasChanges =
        displayName !== (profile.display_name || '') ||
        companyName !== (profile.company_name || '') ||
        vertical !== profile.vertical;
      setIsDirty(hasChanges);
    }
  }, [displayName, companyName, vertical, profile]);

  const handleSave = async () => {
    // Validation
    if (displayName.trim().length < 2 || displayName.trim().length > 50) {
      toast.error('Display name must be between 2 and 50 characters');
      return;
    }

    if (companyName.trim().length > 100) {
      toast.error('Company name must be less than 100 characters');
      return;
    }

    setIsSaving(true);
    try {
      const profileData = {
        display_name: displayName.trim(),
        company_name: companyName.trim() || null,
        vertical,
      };

      // Check if profile exists, if not create it
      if (profile) {
        await updateProfile.mutateAsync(profileData);
      } else {
        await createProfile.mutateAsync(profileData);
      }

      toast.success('Settings saved successfully!', {
        duration: 3000,
        icon: <Check className="h-4 w-4" />,
      });
      setIsDirty(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleThemeToggle = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    toast.success(`Switched to ${newTheme} mode`);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    setIsDeleting(true);
    try {
      // Delete all user data from related tables first
      // This is safe because RLS policies ensure users can only delete their own data
      
      // Delete brand voices
      await supabase.from('brand_voices').delete().eq('user_id', user?.id);
      
      // Delete content pieces
      await supabase.from('content_pieces').delete().eq('user_id', user?.id);
      
      // Delete content briefs
      await supabase.from('content_briefs').delete().eq('user_id', user?.id);
      
      // Delete profile
      await supabase.from('profiles').delete().eq('user_id', user?.id);
      
      // Finally, delete the auth user
      // Note: This requires proper RLS policies and may need additional backend support
      const { error } = await supabase.rpc('delete_user');
      
      if (error) {
        console.error('Error deleting account:', error);
        // If RPC function doesn't exist, just sign out
        toast.warning('Account data cleared. Please contact support to complete deletion.');
        await signOut();
        navigate('/auth');
        return;
      }

      toast.success('Account deleted successfully');
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account. Please contact support.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading settings...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and content preferences.
          </p>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Account Settings
              </CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-sm font-medium">
                  Display Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="John Doe"
                  className="focus-visible:ring-2 focus-visible:ring-primary/20"
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground">
                  {displayName.length}/50 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-medium">
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Corporation"
                  className="focus-visible:ring-2 focus-visible:ring-primary/20"
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">Optional</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="pl-10 bg-secondary/50 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vertical" className="text-sm font-medium">
                  Industry Vertical <span className="text-destructive">*</span>
                </Label>
                <Select value={vertical} onValueChange={(value) => setVertical(value as VerticalType)}>
                  <SelectTrigger id="vertical" className="focus:ring-2 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {verticalOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose the industry that best matches your business
                </p>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleSave}
                  disabled={!isDirty || isSaving}
                  className={cn(
                    'transition-all duration-200',
                    isDirty && 'hover:scale-105'
                  )}
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Brand Voice Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Brand Voice
              </CardTitle>
              <CardDescription>Manage your AI writing style</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeBrandVoice ? (
                <>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Active Profile: {activeBrandVoice.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Currently in use for content generation
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Formality</span>
                        <span className="font-medium text-foreground">
                          {activeBrandVoice.formality}%
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${activeBrandVoice.formality}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Complexity</span>
                        <span className="font-medium text-foreground">
                          {activeBrandVoice.complexity}%
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${activeBrandVoice.complexity}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Warmth</span>
                        <span className="font-medium text-foreground">
                          {activeBrandVoice.warmth}%
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${activeBrandVoice.warmth}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className="font-medium text-foreground">
                          {activeBrandVoice.confidence}%
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${activeBrandVoice.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center bg-secondary/30 rounded-lg border border-dashed border-border">
                  <Briefcase className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No active brand voice profile
                  </p>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full group"
                onClick={() => navigate('/brand-voice')}
              >
                Manage Brand Voice Profiles
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Preferences
              </CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Theme</Label>
                  <p className="text-xs text-muted-foreground">
                    Choose your preferred color scheme
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleThemeToggle('light')}
                    className="gap-2"
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleThemeToggle('dark')}
                    className="gap-2"
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-border">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications" className="text-sm font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Receive updates and alerts via email
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between py-2 border-t border-border">
                <div className="space-y-0.5">
                  <Label htmlFor="autoSave" className="text-sm font-medium">
                    Auto-save
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically save your work
                  </p>
                </div>
                <Switch
                  id="autoSave"
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-destructive/50 bg-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-destructive">
                <Trash2 className="h-4 w-4" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions that affect your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="group"
                >
                  <LogOut className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Sign Out
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription className="space-y-3">
                        <p className="text-destructive font-medium">
                          This action cannot be undone. All your content, brand voices,
                          and data will be permanently deleted.
                        </p>
                        <p>
                          Type <span className="font-mono font-bold">DELETE</span> to
                          confirm:
                        </p>
                        <Input
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          placeholder="Type DELETE to confirm"
                          className="font-mono"
                        />
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setDeleteConfirmation('')}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        {isDeleting ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Deleting...
                          </>
                        ) : (
                          'Delete Account'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
