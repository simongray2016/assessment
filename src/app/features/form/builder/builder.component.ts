import {Component, inject, Injector} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TuiButtonModule, TuiDialogService, TuiErrorModule, TuiLabelModule} from '@taiga-ui/core';
import {
  AddNewQuestionsModalComponent
} from "src/app/features/form/add-new-questions-modal/add-new-questions-modal.component";
import {PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import {IQuestion} from "src/app/core/interfaces/question.interface";
import {AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EAnswerFormat} from "src/app/core/enums/answer-format.enum";
import {TuiCheckboxLabeledModule, TuiCheckboxModule, TuiFieldErrorPipeModule, TuiTextAreaModule} from "@taiga-ui/kit";
import {AnswerService} from "src/app/core/services/answer.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-builder',
  standalone: true,
  imports: [CommonModule, TuiButtonModule, TuiTextAreaModule, ReactiveFormsModule, TuiErrorModule, TuiFieldErrorPipeModule, TuiLabelModule, TuiCheckboxModule, TuiCheckboxLabeledModule],
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
})
export class BuilderComponent {
  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(Injector);
  private readonly dialog = this.dialogs.open<IQuestion>(
    new PolymorpheusComponent(AddNewQuestionsModalComponent, this.injector),
    {
      size: 'l',
    }
  );
  private readonly answerService = inject(AnswerService);
  private readonly router = inject(Router);

  EAnswerFormat = EAnswerFormat

  formArray = new FormArray<FormGroup<{
    question: FormControl<string>;
    answerFormat: FormControl<EAnswerFormat>;
    answerOptions: FormArray<FormGroup<{
      answerOption: FormControl<string>;
      checked: FormControl<boolean>;
    }>>;
    answer: FormControl<string>;
    otherOptions: FormControl<boolean>;
    isRequired: FormControl<boolean>;
  }>>([]);

  showAddNewQuestionsModal() {
    this.dialog.subscribe({
      next: (question) => {
        this.addQuestion(question);
      },
    });
  }

  addQuestion(question: IQuestion) {
    const formGroup = new FormGroup({
      question: new FormControl(question.question, {nonNullable: true, validators: [Validators.required]}),
      answerFormat: new FormControl(question.answerFormat, {nonNullable: true}),
      answerOptions: new FormArray<FormGroup<{
        answerOption: FormControl<string>;
        checked: FormControl<boolean>;
      }>>(question.answerOptions.map((answerOption) => new FormGroup({
        answerOption: new FormControl(answerOption, {nonNullable: true}),
        checked: new FormControl(false, {nonNullable: true}),
      }))),
      answer: new FormControl('', {nonNullable: true}),
      otherOptions: new FormControl(question.otherOptions, {nonNullable: true}),
      isRequired: new FormControl(question.isRequired, {nonNullable: true}),
    });
    if (question.isRequired) {
      if (question.answerFormat === EAnswerFormat.Paragraph) {
        formGroup.controls.answer.setValidators([Validators.required]);
      } else {
        formGroup.controls.answerOptions.addValidators([this.validateChecklistRequired.bind(this)]);
      }
    }
    if (question.otherOptions) {
      formGroup.controls.answerOptions.push(new FormGroup({
        answerOption: new FormControl('Other', {nonNullable: true}),
        checked: new FormControl(false, {nonNullable: true}),
      }));
    }
    this.formArray.push(formGroup);
  }

  validateChecklistRequired(control: AbstractControl) {
    const checked = control.value.length && control.value.some((answerOption: { answerOption: string; checked: boolean }) => answerOption.checked);
    return checked ? null : {required: true};
  }

  reviewAnswers() {
    const answers = this.formArray.getRawValue().map((formGroup) => {
      return {
        question: formGroup.question,
        answerFormat: formGroup.answerFormat,
        answerOptions: formGroup.answerOptions.map((option) => option.answerOption),
        answers: formGroup.answerOptions.filter(option => option.checked).map((option) => option.answerOption),
        answer: formGroup.answer,
        otherOptions: formGroup.otherOptions,
        isRequired: formGroup.isRequired,
      };
    });
    this.answerService.saveAnswers(answers);
    this.router.navigateByUrl('/form/answers');
  }
}
