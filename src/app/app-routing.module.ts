import { FirstComponent } from "./components/first/first.component";
import { SecondComponent } from "./components/second/second.component";
import { DogsListComponent } from "./components/dogs-list/dogs-list.component";

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
	{ path: "dogs-list-component", component: DogsListComponent },
	{ path: "first-component", component: FirstComponent },
	{ path: "second-component", component: SecondComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
