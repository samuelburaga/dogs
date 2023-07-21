import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
	selector: "app-breed",
	templateUrl: "./breed.component.html",
	styleUrls: ["./breed.component.css"],
})
export class BreedComponent implements OnInit {
	url: string = "https://dog.ceo/api/breed/";
	breed: Object = {};
	breedName: string = "";
	imageURL: string = "";

	subBreeds: Object = {};
	subBreedsList: string[] = [];
	subBreedUrl: string = "https://dog.ceo/api/breed/";

	constructor(
		private http: HttpClient,
		private route: ActivatedRoute,
	) {}

	ngOnInit(): void {
		this.route.paramMap.subscribe((params) => {
			const breed = params.get("breedName");
			if (breed) {
				this.breedName = breed;
			}
		});

		this.url = this.url + this.breedName + "/images";

		this.http.get<any>(this.url).subscribe({
			next: (data) => {
				this.breed = data;
				this.imageURL = data.message[0];
			},
			error: (error) => {
				console.error("Error fetching dogs:", error);
			},
		});

		// fetch sub-breed
		this.subBreedUrl = this.subBreedUrl + this.breedName + "/list";
		this.http.get<any>(this.subBreedUrl).subscribe({
			next: (data) => {
				this.subBreeds = data;
				this.subBreedsList = data.message;
			},
			error: (error) => {
				console.error("Error fetching dog sub-breed:", error);
			},
		});
	}
}
