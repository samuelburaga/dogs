import { FirstComponent } from "./components/first/first.component";
import { SecondComponent } from "./components/second/second.component";

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
	{ path: "first-component", component: FirstComponent },
	{ path: "second-component", component: SecondComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
