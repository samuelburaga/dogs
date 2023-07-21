import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "src/app/services/api.service";

@Component({
	selector: "app-sub-breed",
	templateUrl: "./sub-breed.component.html",
	styleUrls: ["./sub-breed.component.css"],
})
export class SubBreedComponent {
	url: string = "https://dog.ceo/api/breed/";
	breedName: string | null = "";
	subBreedName: string | null = "";
	imageURL: string = "";

	constructor(
		private apiService: ApiService,
		private route: ActivatedRoute,
	) {}

	ngOnInit(): void {
		this.route.paramMap.subscribe((params) => {
			this.breedName = params.get("breedName");
			this.subBreedName = params.get("subBreedName");
		});

		this.prepareSubBreed();
	}

	prepareSubBreed() {
		this.url = this.url + this.breedName + "/" + this.subBreedName + "/images";
		this.apiService.getData(this.url).subscribe({
			next: (data) => {
				this.imageURL = data.message[1];
			},
			error: (error) => {
				console.error("Error fetching dogs:", error);
			},
		});
	}
}
