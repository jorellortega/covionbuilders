"use client";
import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Loader2, Save, Key, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AISetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string;
}

// Available OpenAI models
const OPENAI_MODELS = [
  { value: 'gpt-4o', label: 'GPT-4o (Latest, Recommended)' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Faster, Cost-effective)' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Fastest, Cheapest)' },
];

export default function AISettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isCEO, setIsCEO] = useState(false);
  const [settings, setSettings] = useState<AISetting[]>([]);
  const [visibleKeys, setVisibleKeys] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    async function checkAccess() {
      const supabase = createSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        router.push('/login');
        return;
      }

      // Check if user is CEO
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (userData?.role !== 'ceo') {
        toast.error('Access denied. CEO role required.');
        router.push('/');
        return;
      }

      setIsCEO(true);
      await fetchSettings();
      setLoading(false);
    }
    checkAccess();
  }, [router]);

  async function fetchSettings() {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from('ai_settings')
      .select('*')
      .order('setting_key');

    if (error) {
      console.error('Error fetching AI settings:', error);
      toast.error('Failed to load AI settings');
    } else {
      setSettings(data || []);
    }
  }

  function handleSettingChange(key: string, value: string) {
    setSettings(prev => 
      prev.map(setting => 
        setting.setting_key === key 
          ? { ...setting, setting_value: value }
          : setting
      )
    );
  }

  function toggleVisibility(key: string) {
    setVisibleKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }

  function maskApiKey(key: string): string {
    if (!key || key.length < 8) return key;
    return key.slice(0, 4) + '•'.repeat(Math.max(key.length - 8, 4)) + key.slice(-4);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const supabase = createSupabaseBrowserClient();
      
      // Update each setting
      for (const setting of settings) {
        const { error } = await supabase
          .from('ai_settings')
          .update({ setting_value: setting.setting_value })
          .eq('setting_key', setting.setting_key);

        if (error) {
          console.error(`Error updating ${setting.setting_key}:`, error);
          toast.error(`Failed to update ${setting.setting_key}`);
          setSaving(false);
          return;
        }
      }

      toast.success('AI settings saved successfully!');
    } catch (err: any) {
      console.error('Error saving AI settings:', err);
      toast.error('Failed to save AI settings');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="dark flex min-h-screen flex-col bg-black">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!isCEO) {
    return null;
  }

  return (
    <div className="dark flex min-h-screen flex-col bg-black">
      <Header />
      <div className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">AI Settings</h1>
            <p className="text-muted-foreground">
              Manage API keys and configuration for AI features
            </p>
          </div>

          <Card className="bg-[#141414] border-border/40">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys & Configuration
              </CardTitle>
              <CardDescription>
                Store and manage your AI service API keys. These will be used for AI-powered features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {settings.map((setting) => {
                const isVisible = visibleKeys[setting.setting_key];
                const isApiKey = setting.setting_key.includes('api_key');
                const isModelSetting = setting.setting_key === 'openai_model' || setting.setting_key === 'anthropic_model';
                
                return (
                  <div key={setting.id} className="space-y-2">
                    <Label htmlFor={setting.setting_key} className="text-white">
                      {setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      {setting.description && (
                        <span className="block text-sm text-muted-foreground font-normal mt-1">
                          {setting.description}
                        </span>
                      )}
                    </Label>
                    {isModelSetting && setting.setting_key === 'openai_model' ? (
                      <Select
                        value={setting.setting_value || 'gpt-4'}
                        onValueChange={(value) => handleSettingChange(setting.setting_key, value)}
                      >
                        <SelectTrigger className="bg-black/30 text-white border-border/40">
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a1a] border-border/40">
                          {OPENAI_MODELS.map((model) => (
                            <SelectItem 
                              key={model.value} 
                              value={model.value}
                              className="text-white focus:bg-emerald-500/20 focus:text-emerald-400"
                            >
                              {model.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="relative">
                        <Input
                          id={setting.setting_key}
                          type={isApiKey && !isVisible ? 'password' : 'text'}
                          value={setting.setting_value}
                          onChange={(e) => handleSettingChange(setting.setting_key, e.target.value)}
                          className="bg-black/30 text-white pr-10"
                          placeholder={`Enter ${setting.setting_key.replace(/_/g, ' ')}`}
                        />
                        {isApiKey && (
                          <button
                            type="button"
                            onClick={() => toggleVisibility(setting.setting_key)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                          >
                            {isVisible ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    )}
                    {isApiKey && setting.setting_value && !isVisible && (
                      <p className="text-xs text-muted-foreground">
                        Preview: {maskApiKey(setting.setting_value)}
                      </p>
                    )}
                  </div>
                );
              })}

              <div className="flex items-center gap-4 pt-4 border-t border-border/40">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={fetchSettings}
                  disabled={saving}
                  className="border-border/40 text-white hover:bg-[#1a1a1a]"
                >
                  Reset Changes
                </Button>
              </div>

              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div className="text-sm text-blue-300">
                    <p className="font-semibold mb-1">Security Note</p>
                    <p className="text-blue-200/80">
                      API keys are stored securely in the database and are only accessible to CEO users. 
                      Never share your API keys or commit them to version control.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Future AI Features Info */}
          <Card className="bg-[#141414] border-border/40 mt-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                Upcoming Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                These API keys will be used to power AI features such as:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>AI prompt window for generating content</li>
                <li>Automated responses and suggestions</li>
                <li>Content generation and optimization</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}

