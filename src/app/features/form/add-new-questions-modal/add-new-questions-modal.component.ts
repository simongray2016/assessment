import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EAnswerFormat} from "src/app/core/enums/answer-format.enum";
import {TuiButtonModule, TuiDialogContext, TuiErrorModule} from "@taiga-ui/core";
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';
import {IQuestion} from "src/app/core/interfaces/question.interface";
import {
  TuiCheckboxLabeledModule,
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiSelectModule
} from "@taiga-ui/kit";
import {TuiDestroyService} from '@taiga-ui/cdk';
import {takeUntil} from "rxjs";

@Component({
  selector: 'app-add-new-questions-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TuiSelectModule, TuiDataListWrapperModule, TuiInputModule, TuiErrorModule, TuiFieldErrorPipeModule, TuiButtonModule, TuiCheckboxLabeledModule],
  templateUrl: './add-new-questions-modal.component.html',
  styleUrls: ['./add-new-questions-modal.component.scss'],
  providers: [TuiDestroyService]
})
export class AddNewQuestionsModalComponent implements OnInit {
  private readonly destroy$ = inject(TuiDestroyService, {self: true});
  private readonly context = inject<TuiDialogContext<IQuestion>>(POLYMORPHEUS_CONTEXT);
  readonly answerFormats = Object.values(EAnswerFormat);

  EAnswerFormat = EAnswerFormat;

  form = new FormGroup({
    question: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    answerFormat: new FormControl(EAnswerFormat.Paragraph, {nonNullable: true}),
    answerOptions: new FormArray<FormControl<string>>([]),
    otherOptions: new FormControl(false, {nonNullable: true}),
    isRequired: new FormControl(false, {nonNullable: true}),
  });

  ngOnInit() {
    this.answerFormatChanged();
  }

  answerFormatChanged() {
    this.form.controls.answerFormat.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((answerFormat) => {
      if (answerFormat === EAnswerFormat.CheckboxList) {
        this.addAnswerOption();
      } else {
        this.form.controls.answerOptions.clear();
      }
    });
  }

  addAnswerOption() {
    this.form.controls.answerOptions.push(new FormControl('', {nonNullable: true, validators: [Validators.required]}));
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.context.completeWith(this.form.getRawValue());
    }
  }
}
