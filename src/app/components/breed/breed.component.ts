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
	cardWidth: number = 0;
	cardHeight: number = 0;
	subBreedList: string[] = [];
	isVisible: boolean = true;

	constructor(
		private apiService: ApiService,
		private activatedRoute: ActivatedRoute,
	) {}

	ngOnInit(): void {
		this.prepareNamesFromURL();
	}

	prepareNamesFromURL(): void {
		this.activatedRoute.paramMap.subscribe((params) => {
			this.breedName = params.get("breedName");
		});
		this.prepareBreed();
		this.prepareSubBreedList();
	}

	prepareBreed(): void {
		this.apiService.getBreedImages(this.breedName).subscribe({
			next: (data) => {
				this.imageURL = data.message[0];
				this.getImageSize();
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

	getImageSize(): void {
		let image: HTMLImageElement = new Image();
		image.src = this.imageURL;

		image.onload = () => {
			this.cardWidth = image.width + 100;
			this.cardHeight = image.height + 100;
			console.log(`The image is ${image.width} pixels wide and ${image.height} pixels tall.`);
		};
	}
}
