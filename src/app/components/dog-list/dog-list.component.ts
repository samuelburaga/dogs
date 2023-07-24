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
		let tree: TreeNode[] = [];

		for (let dog in data["message"]) {
			if (data["message"][dog].length > 0) {
				let node: { label: string; children: any } = { label: dog, children: [] };

				data["message"][dog].forEach((breed: string) => {
					let childrenNode: { label: string } = { label: breed };
					node.children.push(childrenNode);
				});

				tree.push(node);
			} else {
				let node: { label: string } = { label: "" };
				node.label = dog;
				tree.push(node);
			}
		}

		return tree;
	}

	onNodeSelect(event: any) {
		if (event.node.parent === undefined) {
			this.routerLink = "/dogs/breed/" + event.node.label;
		} else {
			this.routerLink = "/dogs/breed/" + event.node.parent.label + "/" + event.node.label;
		}
	}
}
