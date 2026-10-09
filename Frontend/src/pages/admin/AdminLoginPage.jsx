import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, KeyRound } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { setUser } from '../../slices/userSlice';
import api from '../../lib/axiosSetup';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter admin email');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/api/admin/login', {
        email: email.trim(),
        password: password.trim(),
        adminSecret: password.trim()
      });

      const { user, accessToken } = data.data || {};
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      if (user) {
        dispatch(setUser(user));
      }

      toast.success('🎉 Admin authorization verified!');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Admin login failed. Please check your credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = () => {
    setEmail('admin@skillhub.in');
    setPassword('SkillHubAdmin2026');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md border-border/60 bg-card/70 backdrop-blur-xl shadow-2xl relative z-10">
        <CardHeader className="text-center pb-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-indigo-500/25">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Admin Authorization</CardTitle>
          <CardDescription>
            Authenticate with system administrator credentials to access the management portal.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Administrator Email
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@skillhub.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold">
                  Admin Passkey / Secret
                </Label>
                <span className="text-[11px] text-muted-foreground">Default: SkillHubAdmin2026</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 cursor-pointer"
            >
              {loading ? (
                'Verifying...'
              ) : (
                <>
                  Access Admin Console <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </Button>
          </form>

          {/* Quick Demo Helper */}
          <div className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDemoAdmin}
              className="w-full text-xs border-dashed text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
              Fill Quick Admin Credentials
            </Button>
          </div>

          <div className="text-center pt-2">
            <a href="/" className="text-xs text-muted-foreground hover:text-foreground hover:underline">
              ← Return to SkillHub Marketplace
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
