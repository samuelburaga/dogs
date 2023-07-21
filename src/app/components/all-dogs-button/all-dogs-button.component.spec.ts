import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AllDogsButtonComponent } from "./all-dogs-button.component";

describe("AllDogsButtonComponent", () => {
	let component: AllDogsButtonComponent;
	let fixture: ComponentFixture<AllDogsButtonComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [AllDogsButtonComponent],
		});
		fixture = TestBed.createComponent(AllDogsButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
