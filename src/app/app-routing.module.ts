import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {HistoryComponent} from "./history/history.component";

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "dashboard", component: DashboardComponent},
  {path: "history", component: HistoryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
