import { Routes } from '@angular/router';

export const FORM_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'builder',
    pathMatch: 'full',
  },
  {
    path: 'builder',
    loadComponent: () =>
      import('./builder/builder.component').then((m) => m.BuilderComponent),
  },
  {
    path: 'answers',
    loadComponent: () =>
      import('./answers/answers.component').then((m) => m.AnswersComponent),
  },
];
