import { FirstComponent } from "./components/first/first.component";
import { SecondComponent } from "./components/second/second.component";
import { DogsListComponent } from "./components/dogs-list/dogs-list.component";
import { BreedComponent } from "./components/breed/breed.component";

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
	{ path: "dogs-list-component", component: DogsListComponent },
	{ path: "breed/:name", component: BreedComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
