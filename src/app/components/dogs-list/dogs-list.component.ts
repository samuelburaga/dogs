import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiService } from "src/app/services/api.service";

@Component({
	selector: "app-dogs-list",
	templateUrl: "./dogs-list.component.html",
	styleUrls: ["./dogs-list.component.css"],
})
export class DogsListComponent {
	breeds: Object = {};
	breedsArray: string[] = [];
	url: string = "https://dog.ceo/api/breeds/list/all";

	constructor(
		private http: HttpClient,
		private apiService: ApiService,
	) {}

	ngOnInit(): void {
		this.http.get<any>(this.url).subscribe({
			next: (data) => {
				this.breeds = data;
				this.breedsArray = Object.keys(data.message);
			},
			error: (error) => {
				console.error("Error fetching dogs:", error);
			},
		});
	}
}
