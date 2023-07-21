import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DogsListComponent } from "./components/dogs-list/dogs-list.component";
import { BreedComponent } from "./components/breed/breed.component";
import { SubBreedComponent } from './components/sub-breed/sub-breed.component';
import { AllDogsButtonComponent } from './components/all-dogs-button/all-dogs-button.component';

@NgModule({
	declarations: [AppComponent, DogsListComponent, BreedComponent, SubBreedComponent, AllDogsButtonComponent],
	imports: [BrowserModule, AppRoutingModule, HttpClientModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
