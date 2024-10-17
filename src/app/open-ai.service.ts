import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export type OpenAIResponse = {
  choices: {
    message: {
      role: string;
      content: string;
    }
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  }
};

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private httpClient = inject(HttpClient);
  private systemContent: { role: string; content: string }[] = [];
  private userContent: { role: string; content: string }[] = [];

  answerQuestion(question: string): Promise<OpenAIResponse> {
    return firstValueFrom(
      this.httpClient.post<OpenAIResponse>(
        'http://localhost:3000/openai/deployments/gpt-4o-mini/chat/completions', {
          // add all the system content and the user content to the messages
          messages: [...this.systemContent, ...this.userContent, { role: 'user', content: question }]
      }
      )
    );
  }

  // Function to set a custom system prompt
  public setSystemPrompt(prompt: string) {
    this.systemContent = [{ role: 'system', content: prompt }];
  }

  public addMessage(userContent: string, systemContent: string) {
    this.systemContent.push({ role: 'system', content: systemContent });
    this.userContent.push({ role: 'user', content: userContent });
  }
}
