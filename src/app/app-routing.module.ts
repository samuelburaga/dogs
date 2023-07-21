import { DogsListComponent } from "./components/dogs-list/dogs-list.component";
import { BreedComponent } from "./components/breed/breed.component";
import { SubBreedComponent } from "./components/sub-breed/sub-breed.component";

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
	{ path: "dogs", component: DogsListComponent },
	{ path: "dogs/breed/:breedName", component: BreedComponent },
	{ path: "dogs/breed/:breedName/:subBreed", component: SubBreedComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
