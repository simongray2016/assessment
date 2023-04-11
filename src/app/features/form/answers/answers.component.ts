import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AnswerService} from "src/app/core/services/answer.service";
import {EAnswerFormat} from 'src/app/core/enums/answer-format.enum';
import {TuiButtonModule} from "@taiga-ui/core";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'app-answers',
  standalone: true,
  imports: [CommonModule, TuiButtonModule, RouterModule],
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.scss']
})
export class AnswersComponent {
  readonly answers$ = inject(AnswerService).answers$;
  EAnswerFormat = EAnswerFormat;
}
