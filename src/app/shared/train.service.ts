import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class TrainService {
  private trainDataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );
  private baseUrl: string = `http://localhost${environment.backLocation}`;

  constructor(private http: HttpClient) { }

  getTrainData(): Observable<any> {
    const apiUrl = `${this.baseUrl}trajets`;
    return this.http.get<any[]>(apiUrl);
  }
  getGareData(): Observable<any> {
    const apiUrl = `${this.baseUrl}gares`;
    return this.http.get<any>(apiUrl);
  }

  getTrainDataByGare(idGare: number): Observable<any> {
    const url = `http://localhost${environment.backLocation}trajets?id_gare=` + idGare;
    console.log(url);
    // @ts-ignore
    return this.http.get<any>(url);
  }

  getTrainRetard(id: number) {
    const url = `http://localhost${environment.backLocation}retard?id=` + id;
    console.log(url);
    // @ts-ignore
    return this.http.get<any>(url);
  }

  getTrainAnnulation(id: number) {
    const url = `http://localhost${environment.backLocation}annulation?id=` + id;
    console.log(url);
    // @ts-ignore
    return this.http.get<any>(url);
  }

  setTrainRetard(id: number, duree: number, commentaire: string) {
    const url = `http://localhost${environment.backLocation}retard`;
    console.log(url);
    const args = {
      id,
      duree,
      commentaire
    }
    // @ts-ignore
    return this.http.post<any>(url, args);
  }
  setTrainAnnulation(id: number, commentaire: string) {
    const url = `http://localhost${environment.backLocation}annulation`;
    console.log(url);
    const args = {
      id,
      commentaire
    }
    // @ts-ignore
    return this.http.post<any>(url, args);
  }

  updateTrainData(updatedTrainData: any): void {
    const trajets = this.trainDataSubject.getValue();
    const index = trajets.findIndex(
      (t) => t.trainName === updatedTrainData.trainName
    );
    if (index !== -1) {
      trajets[index] = updatedTrainData;
      this.trainDataSubject.next(trajets);
    }
  }

  getCA() {
      const apiUrl = `${this.baseUrl}ca`;
      return this.http.get<any>(apiUrl);
  }
}
