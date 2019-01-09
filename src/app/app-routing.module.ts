import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DrawingComponent } from './drawing/drawing.component';

const routes: Routes = [
  { path: '', redirectTo: 'drawing', pathMatch: 'full' },
  { path: 'drawing', component: DrawingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
