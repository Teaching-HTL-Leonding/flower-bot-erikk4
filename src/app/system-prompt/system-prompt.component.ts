import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OpenAIService } from '../open-ai.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-system-prompt',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './system-prompt.component.html',
  styleUrl: './system-prompt.component.css'
})
export class SystemPromptComponent {
  prompt = signal('');

  private readonly openAiService = inject(OpenAIService);

  savePrompt() {
    this.openAiService.setSystemPrompt(this.prompt());
  }
}
