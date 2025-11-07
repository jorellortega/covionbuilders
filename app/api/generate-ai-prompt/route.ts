import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentPrompt } = body;

    if (!currentPrompt || !currentPrompt.trim()) {
      return NextResponse.json(
        { error: 'Current prompt is required' },
        { status: 400 }
      );
    }

    // Get AI settings from database
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get OpenAI API key
    let settings: any[] | null = null;
    try {
      const { data: funcData } = await supabase.rpc('get_ai_settings');
      if (funcData) {
        settings = funcData;
      } else {
        const result = await supabase
          .from('ai_settings')
          .select('setting_key, setting_value')
          .in('setting_key', ['openai_api_key', 'openai_model']);
        settings = result.data;
      }
    } catch (err) {
      const result = await supabase
        .from('ai_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['openai_api_key', 'openai_model']);
      settings = result.data;
    }

    const settingsMap: { [key: string]: string } = {};
    settings?.forEach(setting => {
      settingsMap[setting.setting_key] = setting.setting_value;
    });

    const openaiKey = settingsMap['openai_api_key'];
    const openaiModel = settingsMap['openai_model'] || 'gpt-4';

    if (!openaiKey || !openaiKey.trim()) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 503 }
      );
    }

    // Call OpenAI to enhance the prompt
    const enhancementPrompt = `You are helping to enhance a system prompt for an AI assistant for a construction company website.

Current system prompt:
${currentPrompt}

Please enhance and improve this system prompt by:
1. Making it more comprehensive and detailed
2. Ensuring all important information is included
3. Improving clarity and structure
4. Adding helpful instructions for formatting links in markdown: [text](url)
5. Making sure the AI knows to provide clickable links when mentioning website pages
6. Keeping the professional and helpful tone

Return ONLY the enhanced system prompt, without any additional commentary or explanation.`;

    try {
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: openaiModel,
          messages: [
            {
              role: 'system',
              content: 'You are an expert at writing clear, comprehensive system prompts for AI assistants. You always return only the enhanced prompt without any commentary.'
            },
            {
              role: 'user',
              content: enhancementPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.json().catch(() => ({}));
        console.error('OpenAI API error:', errorData);
        return NextResponse.json(
          { error: 'Failed to generate enhanced prompt' },
          { status: 500 }
        );
      }

      const data = await openaiResponse.json();
      const enhancedPrompt = data.choices[0]?.message?.content || currentPrompt;

      return NextResponse.json({
        enhancedPrompt: enhancedPrompt.trim()
      });
    } catch (apiError: any) {
      console.error('OpenAI API call error:', apiError);
      return NextResponse.json(
        { error: 'Failed to connect to AI service' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in generate AI prompt API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

