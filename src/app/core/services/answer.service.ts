import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {IAnswer} from "src/app/core/interfaces/answer.interface";

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  private readonly _answers$ = new BehaviorSubject<IAnswer[]>([]);
  readonly answers$ = this._answers$.asObservable();

  saveAnswers(answers: IAnswer[]) {
    this._answers$.next(answers);
  }
}
