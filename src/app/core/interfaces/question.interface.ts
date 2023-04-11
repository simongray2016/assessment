import {EAnswerFormat} from "../enums/answer-format.enum";

export interface IQuestion {
  question: string;
  answerFormat: EAnswerFormat;
  answerOptions: string[];
  otherOptions: boolean;
  isRequired: boolean;
}
