import {IQuestion} from "src/app/core/interfaces/question.interface";

export interface IAnswer extends IQuestion {
  answer: string;
  answers: string[];
}
