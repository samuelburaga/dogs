import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "src/app/services/api.service";

@Component({
	selector: "app-breed",
	templateUrl: "./breed.component.html",
	styleUrls: ["./breed.component.css"],
})
export class BreedComponent implements OnInit {
	url: string = "https://dog.ceo/api/breed/";
	breedName: string | null = "";
	imageURL: string = "";
	subBreedsList: string[] = [];
	subBreedsUrl: string = "https://dog.ceo/api/breed/";
	isVisible: boolean = true;

	constructor(
		private apiService: ApiService,
		private route: ActivatedRoute,
	) {}

	ngOnInit(): void {
		this.route.paramMap.subscribe((params) => {
			this.breedName = params.get("breedName");
		});
		this.prepareBreed();
		this.prepareSubBreedsList();
	}

	prepareBreed() {
		this.url = this.url + this.breedName + "/images";
		this.apiService.getData(this.url).subscribe({
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

	prepareSubBreedsList() {
		this.subBreedsUrl = this.subBreedsUrl + this.breedName + "/list";
		this.apiService.getData(this.subBreedsUrl).subscribe({
			next: (data) => {
				this.subBreedsList = data.message;
			},
			error: (error) => {
				console.error("Error fetching dog sub-breed:", error);
			},
		});
	}
}
