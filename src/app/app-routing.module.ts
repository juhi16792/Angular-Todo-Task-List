import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ArchiveComponent } from './components/archive/archive.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  {path: 'archive', component: ArchiveComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
