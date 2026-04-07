import { OracleConfig } from '../store/useTrackStore';

export const OracleService = {
  async query(
    config: OracleConfig,
    prompt: string,
    context: string
  ): Promise<string> {
    if (!config.providerUrl || !config.apiKey) {
      throw new Error('Oracle configuration missing.');
    }

    const response = await fetch(`${config.providerUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: `You are the Oracle, an AI co-pilot for Space-Clocker. Help the user achieve their productivity goals by analyzing their reflections and tasks. Context: ${context}`,
          },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Oracle query failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },

  async getDailyDebrief(
    config: OracleConfig,
    tasks: any[],
    reflections: any[],
    stats: any
  ): Promise<string> {
    const prompt = `Analyze today's performance and provide a debrief.
Tasks: ${JSON.stringify(tasks)}
Reflections: ${JSON.stringify(reflections)}
Stats: ${JSON.stringify(stats)}
Based on the above, provide an insightful review and guidance for tomorrow.`;

    return this.query(config, prompt, JSON.stringify({ tasks, reflections, stats }));
  },

  async getSkillTrajectoryUpdate(
    config: OracleConfig,
    skills: any[],
    ambitions: any[]
  ): Promise<string> {
    const prompt = `Analyze the current skills and ambitions.
Skills: ${JSON.stringify(skills)}
Ambitions: ${JSON.stringify(ambitions)}
Provide a JSON-formatted response with an 'updates' array. Each item should have 'id', 'newRecommendation', and optionally 'suggestedTargetProficiency'. Keep recommendations concise and professional.`;

    return this.query(config, prompt, JSON.stringify({ skills, ambitions }));
  },
};
