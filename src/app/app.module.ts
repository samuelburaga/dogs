import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FirstComponent } from './components/first/first.component';
import { SecondComponent } from './components/second/second.component';
import { DogsListComponent } from './components/dogs-list/dogs-list.component';

@NgModule({
	declarations: [AppComponent, FirstComponent, SecondComponent, DogsListComponent],
	imports: [BrowserModule, AppRoutingModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
