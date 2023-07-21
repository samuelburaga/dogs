import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";

@Component({
	selector: "app-dogs-list",
	templateUrl: "./dogs-list.component.html",
	styleUrls: ["./dogs-list.component.css"],
})
export class DogsListComponent implements OnInit {
	breedsList: string[] = [];
	url: string = "https://dog.ceo/api/breeds/list/all";

	constructor(private apiService: ApiService) {}

	ngOnInit(): void {
		this.prepareAllDogs();
	}

	prepareAllDogs() {
		this.apiService.getData(this.url).subscribe({
			next: (data) => {
				this.breedsList = Object.keys(data.message);
			},
			error: (error) => {
				console.error("Error fetching dogs list:", error);
			},
		});
	}
}
