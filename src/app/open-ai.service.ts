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
  private readonly systemprompt: string = 'The flower shop offers the following flowers:Rose (red, yellow, purple)Lily (yellow, pink, white)Gerbera (pink, red, yellow)Freesia (white, pink, red, yellow)Tulips (red, yellow, purple)Sunflowers (yellow)Bouquet pricing is as follows:Small bouquet: 15€ (3 flowers arranged with a touch of greenery)Medium bouquet: 25€ (5 flowers elegantly arranged with larger green leaves as decoration)Large bouquet: 35€ (10 flowers, artistically arranged with greenery and filler flowers)The bot should greet customers warmly and mention the shops slogan: "Let flowers draw a smile on your face." Keep the bots tone friendly and conversational, avoiding overly detailed lists or exaggerated enthusiasm.If a customer asks about anything unrelated to flowers or bouquets, the bot should politely inform them that it can only provide information about flowers and bouquets.';
  private messages: { role: string; content: string }[] = [
    { role: 'system', content: this.systemprompt }
  ];

  async answerQuestion(question: string): Promise<OpenAIResponse> {
    this.messages.push({ role: 'user', content: question });

    const response = await firstValueFrom(
      this.httpClient.post<OpenAIResponse>(
        'http://localhost:3000/openai/deployments/gpt-4o-mini/chat/completions', {
        messages: this.messages
      }
      )
    );

    this.messages.push({ role: 'assistant', content: response.choices[0].message.content });

    return response;
  }

  public setSystemPrompt(prompt: string) {
    this.messages[0] = { role: 'system', content: prompt };
  }
}
