import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
	selector: "app-sub-breed",
	templateUrl: "./sub-breed.component.html",
	styleUrls: ["./sub-breed.component.css"],
})
export class SubBreedComponent {
	url: string = "https://dog.ceo/api/breed/";
	subBreed: Object = {};
	subBreedName: string = "";
	breedName: string = "";
	imageURL: string = "";

	constructor(
		private http: HttpClient,
		private route: ActivatedRoute,
	) {}

	ngOnInit(): void {
		this.route.paramMap.subscribe((params) => {
			const breed = params.get("breedName");
			const subBreed = params.get("subBreed");

			if (breed) {
				this.breedName = breed;
			}
			if (subBreed) {
				this.subBreedName = subBreed;
			}
		});

		this.url = this.url + this.breedName + "/" + this.subBreedName + "/images";
		console.log(this.url);
		this.http.get<any>(this.url).subscribe({
			next: (data) => {
				this.subBreed = data;
				this.imageURL = data.message[1];
			},
			error: (error) => {
				console.error("Error fetching dogs:", error);
			},
		});
	}
}
