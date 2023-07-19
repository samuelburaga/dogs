import { FirstComponent } from "./components/first/first.component";
import { SecondComponent } from "./components/second/second.component";
import { DogsListComponent } from "./components/dogs-list/dogs-list.component";
import { BreedComponent } from "./components/breed/breed.component";

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
	{ path: "", redirectTo: "dogs-list", pathMatch: "full" },
	{ path: "dogs-list-component", component: DogsListComponent },
	{ path: "first-component", component: FirstComponent },
	{ path: "second-component", component: SecondComponent },
	{ path: "breed/:name", component: BreedComponent },
	{ path: "**", redirectTo: "dogs-list" },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
