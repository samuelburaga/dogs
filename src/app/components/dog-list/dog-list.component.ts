import { Component, OnInit } from "@angular/core";
import { TreeNode } from "primeng/api/treenode";
import { ApiService } from "src/app/services/api.service";

@Component({
	selector: "app-dog-list",
	templateUrl: "./dog-list.component.html",
	styleUrls: ["./dog-list.component.css"],
})
export class DogListComponent implements OnInit {
	breedTree: TreeNode[] = [];
	routerLink: string = "";
	constructor(private apiService: ApiService) {}

	ngOnInit(): void {
		this.prepareAllDogs();
	}

	prepareAllDogs(): void {
		this.apiService.getAllDogs().subscribe({
			next: (data) => {
				this.breedTree = this.convertListToTree(data);
			},
			error: (error) => {
				console.error("Error fetching dogs list:", error);
			},
		});
	}

	convertListToTree(data: any) {
		return Object.keys(data.message).map((breed) => ({
			label: breed,
			children: data.message[breed].map((subBreed: string) => ({
				label: subBreed,
			})),
		}));
	}

	onNodeSelect(event: any): void {
		this.routerLink = "/dogs/breed/";

		if (event.node.parent) {
			this.routerLink += event.node.parent.label + "/";
		}

		this.routerLink += event.node.label;
	}
}
