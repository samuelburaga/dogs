import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "src/app/services/api.service";

@Component({
	selector: "app-sub-breed",
	templateUrl: "./sub-breed.component.html",
	styleUrls: ["./sub-breed.component.css"],
})
export class SubBreedComponent implements OnInit {
	breedName: string | null = "";
	subBreedName: string | null = "";
	imageURL: string = "";

	constructor(
		private apiService: ApiService,
		private activatedRoute: ActivatedRoute,
	) {}

	ngOnInit(): void {
		this.activatedRoute.paramMap.subscribe((params) => {
			this.breedName = params.get("breedName");
			this.subBreedName = params.get("subBreedName");
		});

		this.prepareSubBreed();
	}

	prepareSubBreed(): void {
		this.apiService.getSubBreedImages(this.breedName, this.subBreedName).subscribe({
			next: (data) => {
				this.imageURL = data.message[1];
			},
			error: (error) => {
				console.error("Error fetching dogs:", error);
				this.subBreedName = this.subBreedName + " sub breed doesn't exist!";
			},
		});
	}
}
