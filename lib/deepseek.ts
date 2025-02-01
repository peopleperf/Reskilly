interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface CompletionRequest {
  model: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: string };
}

interface CompletionResponse {
  id: string;
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class DeepSeekClient {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string, baseURL: string = 'https://api.deepseek.com') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  async analyze(prompt: string): Promise<string> {
    try {
      const completion = await this.createChatCompletion({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are an expert AI job impact analyst. Provide detailed, actionable analysis with specific metrics, timelines, and recommendations. Always return valid JSON matching the requested structure exactly. Do not include any markdown formatting or additional text."
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
        response_format: { type: "json_object" }
      });

      const analysisText = completion.choices[0]?.message?.content;
      if (!analysisText) {
        throw new Error("No analysis was generated");
      }

      // Validate that the response is valid JSON
      try {
        JSON.parse(analysisText);
      } catch (e) {
        throw new Error("Invalid JSON response from API");
      }

      return analysisText;
    } catch (error) {
      console.error("Analysis failed:", error);
      throw error;
    }
  }

  async createChatCompletion(request: CompletionRequest): Promise<CompletionResponse> {
    try {
      const response = await fetch(`${this.baseURL}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Validate response structure
      if (!data.choices?.[0]?.message?.content) {
        throw new Error("Invalid API response structure");
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }
} 