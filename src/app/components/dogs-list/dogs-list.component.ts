import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { OnInit } from "@angular/core";

@Component({
	selector: "app-dogs-list",
	templateUrl: "./dogs-list.component.html",
	styleUrls: ["./dogs-list.component.css"],
})
export class DogsListComponent {
	breeds: Object = {};
	breedsArray: string[] = [];
	url: string = "https://dog.ceo/api/breeds/list/all";
	ngOnInit(): void {
		fetch(this.url)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				this.breeds = data;
				this.breedsArray = Object.keys(data.message);
			});
	}
}
