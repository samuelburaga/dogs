import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "src/app/services/api.service";

@Component({
	selector: "app-breed",
	templateUrl: "./breed.component.html",
	styleUrls: ["./breed.component.css"],
})
export class BreedComponent implements OnInit {
	breedName: string | null = "";
	imageURL: string = "";
	subBreedList: string[] = [];
	isVisible: boolean = true;

	constructor(
		private apiService: ApiService,
		private activatedRoute: ActivatedRoute,
	) {}

	ngOnInit(): void {
		this.prepareNamesFromURL();
	}

	prepareNamesFromURL() {
		this.activatedRoute.paramMap.subscribe((params) => {
			this.breedName = params.get("breedName");
		});
		this.prepareBreed();
		this.prepareSubBreedList();
		this.getImageSize();
	}

	prepareBreed(): void {
		this.apiService.getBreedImages(this.breedName).subscribe({
			next: (data) => {
				this.imageURL = data.message[0];
			},
			error: (error) => {
				console.error("Error fetching dogs:", error);
				this.breedName = this.breedName + " breed doesn't exist!";
				this.isVisible = false;
			},
		});
	}

	prepareSubBreedList(): void {
		this.apiService.getSubBreedList(this.breedName).subscribe({
			next: (data) => {
				this.subBreedList = data.message;
			},
			error: (error) => {
				console.error("Error fetching dog sub-breed:", error);
			},
		});
	}

	getImageSize() {
		// Create a new Image object
		const img = new Image();

		// Set the source of the image
		img.src = this.imageURL;

		// Wait for the image to load
		img.onload = () => {
			// Get the width and height of the image
			const width = img.width;
			const height = img.height;

			// Do something with the width and height (e.g., display them on the page)
			console.log(`The image is ${width} pixels wide and ${height} pixels tall.`);
		};
	}
}
