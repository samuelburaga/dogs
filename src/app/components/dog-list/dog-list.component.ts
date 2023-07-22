import { Component, OnInit } from "@angular/core";
import { TreeNode } from "primeng/api/treenode";
import { ApiService } from "src/app/services/api.service";

@Component({
	selector: "app-dog-list",
	templateUrl: "./dog-list.component.html",
	styleUrls: ["./dog-list.component.css"],
})
export class DogListComponent implements OnInit {
	breedList: string[] = [];
	breedTree: TreeNode[] = [];
	constructor(private apiService: ApiService) {}

	ngOnInit(): void {
		this.prepareAllDogs();
	}

	prepareAllDogs(): void {
		this.apiService.getAllDogs().subscribe({
			next: (data) => {
				this.breedList = Object.keys(data.message);
				this.convertListToTree(data);
				// console.log(data);
				// console.log(this.breedTree);
			},
			error: (error) => {
				console.error("Error fetching dogs list:", error);
			},
		});
	}

	convertListToTree(data: any) {
		// for (let dog in data.keys) {
		// 	console.log(dog);
		// }
		for (let key in data) {
			if (typeof data[key] === "object") {
				for (let nestedKey in data[key]) {
					console.log(nestedKey);
					console.log(data[key][nestedKey]);
				}
			} else {
				console.log(key);
			}
		}
	}
}
