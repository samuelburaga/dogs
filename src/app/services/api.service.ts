import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class ApiService {
	constructor(private http: HttpClient) {}

	getAllDogs(): Observable<any> {
		return this.http.get<any>("https://dog.ceo/api/breeds/list/all");
	}

	getBreedImages(breedName: string | null): Observable<any> {
		return this.http.get<any>("https://dog.ceo/api/breed/" + breedName + "/images");
	}

	getSubBreedList(breedName: string | null): Observable<any> {
		return this.http.get<any>("https://dog.ceo/api/breed/" + breedName + "/list");
	}

	getSubBreedImages(breedName: string | null, subBreedName: string | null): Observable<any> {
		return this.http.get<any>("https://dog.ceo/api/breed/" + breedName + "/" + subBreedName + "/images");
	}
}
