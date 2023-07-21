import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";

@Component({
	selector: "app-dog-list",
	templateUrl: "./dog-list.component.html",
	styleUrls: ["./dog-list.component.css"],
})
export class DogListComponent implements OnInit {
	breedList: string[] = [];

	constructor(private apiService: ApiService) {}

	ngOnInit(): void {
		this.prepareAllDogs();
	}

	prepareAllDogs(): void {
		this.apiService.getAllDogs().subscribe({
			next: (data) => {
				this.breedList = Object.keys(data.message);
			},
			error: (error) => {
				console.error("Error fetching dogs list:", error);
			},
		});
	}
}
