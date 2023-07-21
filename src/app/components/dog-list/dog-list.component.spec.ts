import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DogsListComponent } from "./dog-list.component";

describe("DogsListComponent", () => {
	let component: DogsListComponent;
	let fixture: ComponentFixture<DogsListComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [DogsListComponent],
		});
		fixture = TestBed.createComponent(DogsListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
