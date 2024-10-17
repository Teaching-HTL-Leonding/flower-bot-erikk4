import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OpenAIService } from '../open-ai.service';
import { MarkdownModule } from 'ngx-markdown';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-answer-question',
  standalone: true,
  imports: [FormsModule, MarkdownModule, CommonModule],
  templateUrl: './answer-question.component.html',
  styleUrl: './answer-question.component.css'
})
export class AnswerQuestionComponent {
  question = signal('');
  answer = signal('');
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
    this.answer.set(response.choices[0].message.content);

    this.questionsAndAnwers.update(qa => [...qa, { question: currentQuestion, answer: this.answer() }]);
    this.openAiService.addMessage(this.question(), this.answer());

    this.turnCount.update(tc => tc + 1);
    this.question.set('');
  }

  startOver() {
    this.question.set('');
    this.answer.set('');
    this.turnCount.set(0);
    this.conversationEnded.set(false);
    this.questionsAndAnwers.set([]);
  }
}
