"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Loader2, Save, Sparkles, AlertCircle, Wand2, Infinity, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

interface CustomSection {
  id: string;
  title: string;
  content: string;
}

interface PromptSections {
  introduction: string;
  companyInfo: string;
  servicesPrimary: string;
  servicesAdditional: string;
  websiteFeatures: string;
  role: string;
  important: string;
  customSections: CustomSection[];
}

export default function AIInfoPage() {
  const [sections, setSections] = useState<PromptSections>({
    introduction: 'You are Infinito AI, the AI assistant for Covion Builders, a full-service construction company.',
    companyInfo: '',
    servicesPrimary: '',
    servicesAdditional: '',
    websiteFeatures: '',
    role: '',
    important: '',
    customSections: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [isCEO, setIsCEO] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    introduction: true,
    companyInfo: true,
    servicesPrimary: true,
    servicesAdditional: true,
    websiteFeatures: true,
    role: true,
    important: true,
  });
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadPrompt();
  }, []);

  const checkAuthAndLoadPrompt = async () => {
    const supabase = createSupabaseBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
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
      router.push('/dashboard');
      return;
    }

    setIsCEO(true);
    loadSystemPrompt();
  };

  const parsePromptIntoSections = (prompt: string): PromptSections => {
    const defaultSections: PromptSections = {
      introduction: 'You are Infinito AI, the AI assistant for Covion Builders, a full-service construction company.',
      companyInfo: '',
      servicesPrimary: '',
      servicesAdditional: '',
      websiteFeatures: '',
      role: '',
      important: '',
      customSections: [],
    };

    if (!prompt) return defaultSections;

    // Known section headers (all caps)
    const knownHeaders = [
      'COMPANY INFORMATION',
      'SERVICES OFFERED',
      'WEBSITE FEATURES',
      'YOUR ROLE',
      'IMPORTANT',
    ];

    // Split by section headers (all caps followed by colon)
    const introMatch = prompt.match(/^(.*?)(?=COMPANY INFORMATION:|$)/s);
    
    // Find all section headers in the prompt
    const sectionRegex = /\n\n([A-Z][A-Z\s]+):\s*([\s\S]*?)(?=\n\n[A-Z][A-Z\s]+:|$)/g;
    const allSections: Array<{ header: string; content: string; index: number }> = [];
    let match;
    
    while ((match = sectionRegex.exec(prompt)) !== null) {
      allSections.push({
        header: match[1].trim(),
        content: match[2].trim(),
        index: match.index,
      });
    }

    // Extract known sections
    const companyMatch = allSections.find(s => s.header === 'COMPANY INFORMATION');
    const servicesMatch = allSections.find(s => s.header === 'SERVICES OFFERED');
    const websiteMatch = allSections.find(s => s.header === 'WEBSITE FEATURES');
    const roleMatch = allSections.find(s => s.header === 'YOUR ROLE');
    const importantMatch = allSections.find(s => s.header === 'IMPORTANT');

    // Extract primary and additional services
    let servicesPrimary = '';
    let servicesAdditional = '';
    if (servicesMatch) {
      const servicesText = servicesMatch.content;
      const primaryMatch = servicesText.match(/Primary Construction Services:\s*([\s\S]*?)(?=Additional Services:|$)/);
      const additionalMatch = servicesText.match(/Additional Services:\s*([\s\S]*?)$/);
      servicesPrimary = primaryMatch ? primaryMatch[1].trim() : '';
      servicesAdditional = additionalMatch ? additionalMatch[1].trim() : '';
    }

    // Extract custom sections (any section header that's not in the known list)
    const customSections: CustomSection[] = [];
    let sectionIdCounter = 0;
    
    allSections.forEach((section) => {
      const header = section.header;
      
      // Check if it's not a known header
      if (!knownHeaders.includes(header) && 
          header !== 'Primary Construction Services' && 
          header !== 'Additional Services') {
        // Convert header back to title case (preserve original if it was mixed case)
        // Since we're storing in uppercase in the prompt, we'll convert to title case for display
        const title = header.split(' ').map(word => 
          word.charAt(0) + word.slice(1).toLowerCase()
        ).join(' ');
        
        customSections.push({
          id: `custom-${sectionIdCounter++}`,
          title: title,
          content: section.content,
        });
      }
    });

    return {
      introduction: introMatch ? introMatch[1].trim() : defaultSections.introduction,
      companyInfo: companyMatch?.content || '',
      servicesPrimary,
      servicesAdditional,
      websiteFeatures: websiteMatch?.content || '',
      role: roleMatch?.content || '',
      important: importantMatch?.content || '',
      customSections,
    };
  };

  const combineSectionsIntoPrompt = (sections: PromptSections): string => {
    let prompt = sections.introduction;
    
    if (sections.companyInfo) {
      prompt += '\n\nCOMPANY INFORMATION:\n' + sections.companyInfo;
    }
    
    if (sections.servicesPrimary || sections.servicesAdditional) {
      prompt += '\n\nSERVICES OFFERED:';
      if (sections.servicesPrimary) {
        prompt += '\nPrimary Construction Services:\n' + sections.servicesPrimary;
      }
      if (sections.servicesAdditional) {
        prompt += '\n\nAdditional Services:\n' + sections.servicesAdditional;
      }
    }
    
    if (sections.websiteFeatures) {
      prompt += '\n\nWEBSITE FEATURES:\n' + sections.websiteFeatures;
    }
    
    if (sections.role) {
      prompt += '\n\nYOUR ROLE:\n' + sections.role;
    }
    
    if (sections.important) {
      prompt += '\n\nIMPORTANT:\n' + sections.important;
    }
    
    // Add custom sections
    sections.customSections.forEach((customSection) => {
      if (customSection.title && customSection.content) {
        prompt += '\n\n' + customSection.title.toUpperCase() + ':\n' + customSection.content;
      }
    });
    
    return prompt.trim();
  };

  const loadSystemPrompt = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from('ai_settings')
        .select('setting_value')
        .eq('setting_key', 'system_prompt')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading system prompt:', error);
        toast.error('Failed to load system prompt');
      } else if (data?.setting_value) {
        const parsed = parsePromptIntoSections(data.setting_value);
        setSections(parsed);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to load system prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const fullPrompt = combineSectionsIntoPrompt(sections);
    
    if (!fullPrompt.trim()) {
      toast.error('System prompt cannot be empty');
      return;
    }

    setSaving(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase
        .from('ai_settings')
        .upsert({
          setting_key: 'system_prompt',
          setting_value: fullPrompt,
          description: 'The system prompt that defines how Infinito AI behaves and what information it knows',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'setting_key'
        });

      if (error) {
        throw error;
      }

      toast.success('System prompt saved successfully!');
    } catch (err: any) {
      console.error('Error saving system prompt:', err);
      toast.error('Failed to save system prompt');
    } finally {
      setSaving(false);
    }
  };

  const handleSectionChange = (key: keyof PromptSections, value: string) => {
    setSections(prev => ({ ...prev, [key]: value }));
  };

  const handleAddCustomSection = () => {
    const newSection: CustomSection = {
      id: `custom-${Date.now()}`,
      title: 'New Section',
      content: '',
    };
    setSections(prev => ({
      ...prev,
      customSections: [...prev.customSections, newSection],
    }));
    setExpandedSections(prev => ({ ...prev, [newSection.id]: true }));
  };

  const handleRemoveCustomSection = (id: string) => {
    setSections(prev => ({
      ...prev,
      customSections: prev.customSections.filter(section => section.id !== id),
    }));
    setExpandedSections(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const handleCustomSectionChange = (id: string, field: 'title' | 'content', value: string) => {
    setSections(prev => ({
      ...prev,
      customSections: prev.customSections.map(section =>
        section.id === id ? { ...section, [field]: value } : section
      ),
    }));
  };

  const handleGenerateWithAI = async (sectionKey?: keyof PromptSections) => {
    const fullPrompt = combineSectionsIntoPrompt(sections);
    const sectionToEnhance = sectionKey ? sections[sectionKey] : fullPrompt;
    
    if (!sectionToEnhance.trim()) {
      toast.error('Please provide some content to enhance');
      return;
    }

    setGenerating(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: apiKeyData } = await supabase
        .from('ai_settings')
        .select('setting_value')
        .eq('setting_key', 'openai_api_key')
        .single();

      if (!apiKeyData?.setting_value) {
        toast.error('OpenAI API key not configured. Please set it up first.');
        setGenerating(false);
        return;
      }

      const response = await fetch('/api/generate-ai-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPrompt: sectionKey ? sectionToEnhance : fullPrompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate prompt');
      }

      const data = await response.json();
      const enhanced = data.enhancedPrompt.trim();
      
      if (sectionKey) {
        // If enhancing a specific section, update just that section
        handleSectionChange(sectionKey, enhanced);
        toast.success(`${sectionKey} section enhanced with AI!`);
      } else {
        // If enhancing the whole prompt, re-parse it
        const parsed = parsePromptIntoSections(enhanced);
        setSections(parsed);
        toast.success('Prompt enhanced with AI!');
      }
    } catch (err: any) {
      console.error('Error generating prompt:', err);
      toast.error(err.message || 'Failed to generate prompt with AI');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="dark flex min-h-screen flex-col bg-black">
        <Header />
        <div className="flex-1 container mx-auto py-8 px-4 flex items-center justify-center">
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
      <div className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Infinity className="h-8 w-8 text-emerald-400" />
              <h1 className="text-4xl font-bold text-white">AI System Prompt Editor</h1>
            </div>
            <p className="text-muted-foreground">
              Edit different sections of the system prompt separately. All sections will be combined into one prompt when saved.
            </p>
          </div>

          <div className="space-y-6">
            {/* Introduction Section */}
            <Collapsible
              open={expandedSections.introduction}
              onOpenChange={(open) => setExpandedSections(prev => ({ ...prev, introduction: open }))}
            >
              <Card className="bg-[#141414] border-border/40">
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="cursor-pointer hover:bg-black/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Introduction</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          The AI's identity and basic introduction
                        </CardDescription>
                      </div>
                      {expandedSections.introduction ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <Textarea
                      value={sections.introduction}
                      onChange={(e) => handleSectionChange('introduction', e.target.value)}
                      className="min-h-[200px] bg-black/30 text-white border-border/40 font-mono text-sm"
                      placeholder="You are Infinito AI..."
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Company Information Section */}
            <Collapsible
              open={expandedSections.companyInfo}
              onOpenChange={(open) => setExpandedSections(prev => ({ ...prev, companyInfo: open }))}
            >
              <Card className="bg-[#141414] border-border/40">
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="cursor-pointer hover:bg-black/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Company Information</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Company name, contact details, tagline, etc.
                        </CardDescription>
                      </div>
                      {expandedSections.companyInfo ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <Textarea
                      value={sections.companyInfo}
                      onChange={(e) => handleSectionChange('companyInfo', e.target.value)}
                      className="min-h-[200px] bg-black/30 text-white border-border/40 font-mono text-sm"
                      placeholder="- Name: Covion Builders&#10;- Contact Email: ...&#10;- Phone: ..."
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Primary Services Section */}
            <Collapsible
              open={expandedSections.servicesPrimary}
              onOpenChange={(open) => setExpandedSections(prev => ({ ...prev, servicesPrimary: open }))}
            >
              <Card className="bg-[#141414] border-border/40">
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="cursor-pointer hover:bg-black/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Primary Construction Services</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Main services offered (one per line)
                        </CardDescription>
                      </div>
                      {expandedSections.servicesPrimary ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <Textarea
                      value={sections.servicesPrimary}
                      onChange={(e) => handleSectionChange('servicesPrimary', e.target.value)}
                      className="min-h-[200px] bg-black/30 text-white border-border/40 font-mono text-sm"
                      placeholder="- Concrete work&#10;- General Labor&#10;- Painting..."
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Additional Services Section */}
            <Collapsible
              open={expandedSections.servicesAdditional}
              onOpenChange={(open) => setExpandedSections(prev => ({ ...prev, servicesAdditional: open }))}
            >
              <Card className="bg-[#141414] border-border/40">
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="cursor-pointer hover:bg-black/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Additional Services</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Additional services and offerings (one per line)
                        </CardDescription>
                      </div>
                      {expandedSections.servicesAdditional ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <Textarea
                      value={sections.servicesAdditional}
                      onChange={(e) => handleSectionChange('servicesAdditional', e.target.value)}
                      className="min-h-[200px] bg-black/30 text-white border-border/40 font-mono text-sm"
                      placeholder="- Architectural Design&#10;- Construction Management..."
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Website Features Section */}
            <Collapsible
              open={expandedSections.websiteFeatures}
              onOpenChange={(open) => setExpandedSections(prev => ({ ...prev, websiteFeatures: open }))}
            >
              <Card className="bg-[#141414] border-border/40">
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="cursor-pointer hover:bg-black/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Website Features</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Information about website pages and features
                        </CardDescription>
                      </div>
                      {expandedSections.websiteFeatures ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <Textarea
                      value={sections.websiteFeatures}
                      onChange={(e) => handleSectionChange('websiteFeatures', e.target.value)}
                      className="min-h-[250px] bg-black/30 text-white border-border/40 font-mono text-sm"
                      placeholder="- Clients can request quotes at [Request a Quote](/quote)&#10;- Clients can make payments at [Make Payment](/payments)..."
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Role Section */}
            <Collapsible
              open={expandedSections.role}
              onOpenChange={(open) => setExpandedSections(prev => ({ ...prev, role: open }))}
            >
              <Card className="bg-[#141414] border-border/40">
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="cursor-pointer hover:bg-black/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">AI Role & Instructions</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          How the AI should behave and guide users
                        </CardDescription>
                      </div>
                      {expandedSections.role ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <Textarea
                      value={sections.role}
                      onChange={(e) => handleSectionChange('role', e.target.value)}
                      className="min-h-[250px] bg-black/30 text-white border-border/40 font-mono text-sm"
                      placeholder="- Help clients with questions...&#10;- Guide them on how to use website features..."
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Important Guidelines Section */}
            <Collapsible
              open={expandedSections.important}
              onOpenChange={(open) => setExpandedSections(prev => ({ ...prev, important: open }))}
            >
              <Card className="bg-[#141414] border-border/40">
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="cursor-pointer hover:bg-black/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Important Guidelines</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Critical rules and guidelines for the AI
                        </CardDescription>
                      </div>
                      {expandedSections.important ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <Textarea
                      value={sections.important}
                      onChange={(e) => handleSectionChange('important', e.target.value)}
                      className="min-h-[200px] bg-black/30 text-white border-border/40 font-mono text-sm"
                      placeholder="- Always maintain a professional tone&#10;- Never make up project details..."
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Custom Sections */}
            {sections.customSections.map((customSection) => (
              <Collapsible
                key={customSection.id}
                open={expandedSections[customSection.id]}
                onOpenChange={(open) => setExpandedSections(prev => ({ ...prev, [customSection.id]: open }))}
              >
                <Card className="bg-[#141414] border-border/40">
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between pr-10">
                      <CollapsibleTrigger className="flex-1 text-left cursor-pointer hover:bg-black/20 transition-colors -m-6 p-6 rounded-t-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-white">{customSection.title || 'Untitled Section'}</CardTitle>
                            <CardDescription className="text-muted-foreground">
                              Custom section
                            </CardDescription>
                          </div>
                          {expandedSections[customSection.id] ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </CollapsibleTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10 absolute top-6 right-6"
                        onClick={() => handleRemoveCustomSection(customSection.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-white mb-2 block">Section Title</label>
                        <Input
                          value={customSection.title}
                          onChange={(e) => handleCustomSectionChange(customSection.id, 'title', e.target.value)}
                          className="bg-black/30 text-white border-border/40"
                          placeholder="Section Title (will be converted to UPPERCASE in prompt)"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-white mb-2 block">Section Content</label>
                        <Textarea
                          value={customSection.content}
                          onChange={(e) => handleCustomSectionChange(customSection.id, 'content', e.target.value)}
                          className="min-h-[200px] bg-black/30 text-white border-border/40 font-mono text-sm"
                          placeholder="Enter section content here..."
                        />
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}

            {/* Add Section Button */}
            <Card className="bg-[#141414] border-border/40 border-dashed">
              <CardContent className="pt-6">
                <Button
                  onClick={handleAddCustomSection}
                  variant="outline"
                  className="w-full border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Section
                </Button>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="bg-[#141414] border-border/40">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white flex-1"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save All Sections
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleGenerateWithAI()}
                    disabled={generating}
                    variant="outline"
                    className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Enhance All with AI
                      </>
                    )}
                  </Button>
                </div>
                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-300">
                      <p className="font-semibold mb-1">How it works:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Edit each section individually - changes are saved locally as you type</li>
                        <li>When you click "Save All Sections", all sections are combined into one complete prompt</li>
                        <li>The combined prompt is what gets sent to OpenAI with every chat message</li>
                        <li>Use markdown format for links: <code className="bg-black/50 px-1 rounded">[Link Text](url)</code></li>
                        <li>Changes take effect immediately after saving</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
