import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OpenAIService } from '../open-ai.service';
import { MarkdownModule } from 'ngx-markdown';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-answer-question',
  standalone: true,
  imports: [FormsModule, MarkdownModule, CommonModule, RouterModule],
  templateUrl: './answer-question.component.html',
  styleUrl: './answer-question.component.css'
})
export class AnswerQuestionComponent {
  question = signal('');
  turnCount = signal(0);
  conversationEnded = signal(false);

  questionsAndAnwers = signal<{ question: string, answer: string }[]>([]);

  private readonly openAiService = inject(OpenAIService);

  async answerQuestion() {
    if (this.turnCount() >= 20) {
      this.conversationEnded.set(true);
      return;
    }
    const currentQuestion = this.question();

    const response = await this.openAiService.answerQuestion(currentQuestion);

    this.questionsAndAnwers.update(qa => [...qa, { question: currentQuestion, answer: response.choices[0].message.content }]);

    this.turnCount.update(count => count + 1);
    this.question.set('');
  }

  startOver() {
    this.question.set('');
    this.turnCount.set(0);
    this.conversationEnded.set(false);
    this.questionsAndAnwers.set([]);
  }
}
