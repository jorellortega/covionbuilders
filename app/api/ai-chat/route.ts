import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get AI settings from database
    // Use service role key if available (bypasses RLS), otherwise use anon key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try to get settings using the database function (more secure)
    // If function doesn't exist, fallback to direct table access
    let settings: any[] | null = null;
    let settingsError: any = null;

    try {
      const { data: funcData, error: funcError } = await supabase.rpc('get_ai_settings');
      if (!funcError && funcData) {
        settings = funcData;
      } else {
        // Fallback to direct table access (requires service role or proper RLS)
        const result = await supabase
          .from('ai_settings')
          .select('setting_key, setting_value')
          .in('setting_key', ['openai_api_key', 'openai_model', 'anthropic_api_key', 'anthropic_model', 'system_prompt']);
        settings = result.data;
        settingsError = result.error;
      }
    } catch (err) {
      // If function doesn't exist, try direct access
      const result = await supabase
        .from('ai_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['openai_api_key', 'openai_model', 'anthropic_api_key', 'anthropic_model', 'system_prompt']);
      settings = result.data;
      settingsError = result.error;
    }

    if (settingsError) {
      console.error('Error fetching AI settings:', settingsError);
      return NextResponse.json(
        { error: 'Failed to load AI configuration' },
        { status: 500 }
      );
    }

    // Create settings map
    const settingsMap: { [key: string]: string } = {};
    settings?.forEach(setting => {
      settingsMap[setting.setting_key] = setting.setting_value;
    });

    // Check if OpenAI is configured
    const openaiKey = settingsMap['openai_api_key'];
    const openaiModel = settingsMap['openai_model'] || 'gpt-4';
    const systemPrompt = settingsMap['system_prompt'] || `You are Infinito AI, the AI assistant for Covion Builders, a full-service construction company.

COMPANY INFORMATION:
- Name: Covion Builders
- Contact Email: covionbuilders@gmail.com
- Phone: (951) 723-4052

YOUR ROLE:
- Help clients with questions about services, quotes, payments, project status, and general inquiries
- Be professional, friendly, and helpful
- When providing links, use markdown format: [Link Text](https://example.com)
- Direct clients to contact support at covionbuilders@gmail.com or (951) 723-4052 for specific project details`;

    if (!openaiKey || !openaiKey.trim()) {
      return NextResponse.json(
        { error: 'AI service is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    // Prepare messages for OpenAI
    const messages: any[] = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...(conversationHistory || []),
      {
        role: 'user',
        content: message
      }
    ];

    // Call OpenAI API
    try {
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: openaiModel,
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.json().catch(() => ({}));
        console.error('OpenAI API error:', errorData);
        return NextResponse.json(
          { error: 'Failed to get AI response. Please try again.' },
          { status: 500 }
        );
      }

      const data = await openaiResponse.json();
      const aiMessage = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

      return NextResponse.json({
        message: aiMessage,
        usage: data.usage
      });
    } catch (apiError: any) {
      console.error('OpenAI API call error:', apiError);
      return NextResponse.json(
        { error: 'Failed to connect to AI service. Please try again later.' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in AI chat API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

