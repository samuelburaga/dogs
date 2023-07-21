import { DogListComponent } from "./components/dog-list/dog-list.component";
import { BreedComponent } from "./components/breed/breed.component";
import { SubBreedComponent } from "./components/sub-breed/sub-breed.component";
import { ErrorComponent } from "./components/error/error.component";

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
	{ path: "", redirectTo: "dogs", pathMatch: "full" },
	{ path: "dogs", component: DogListComponent },
	{ path: "dogs/breed/:breedName", component: BreedComponent },
	{ path: "dogs/breed/:breedName/:subBreedName", component: SubBreedComponent },
	{ path: "error", component: ErrorComponent },
	{ path: "**", redirectTo: "/error" },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
