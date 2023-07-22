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
				this.breedTree = this.convertListToTree(data);
			},
			error: (error) => {
				console.error("Error fetching dogs list:", error);
			},
		});
	}

	convertListToTree(data2: any) {
		let tree: TreeNode[] = [];
		for (let dog in data2["message"]) {
			if (data2["message"][dog].length > 0) {
				let node: { label: string; children: any } = { label: "", children: [] };
				node.label = dog;
				data2["message"][dog].forEach((element: string) => {
					let sNode: { label: string } = { label: "" };
					sNode.label = element;
					node.children.push(sNode);
				});

				//console.log(node);
				tree.push(node);
			} else {
				let node2: { label: string } = { label: "" };
				node2.label = dog;
				tree.push(node2);
			}
		}
		console.log(tree);
		return tree;
	}
}
