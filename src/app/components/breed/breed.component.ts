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
	subBreed: Object = {};
	imageURL: string = "";
	breedName: string = "hound";

	constructor(
		private http: HttpClient,
		private route: ActivatedRoute,
	) {}

	ngOnInit(): void {
		this.route.paramMap.subscribe((params) => {
			const breed = params.get("name");
			if (breed) {
				this.breedName = breed;
			}
		});
		this.url = this.url + this.breedName + "/images";

		this.http.get<any>(this.url).subscribe({
			next: (data) => {
				this.subBreed = data;
				this.imageURL = data.message[0];
			},
			error: (error) => {
				console.error("Error fetching dogs:", error);
			},
		});
	}
}
