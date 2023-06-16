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

  constructor(private http: HttpClient) {}

  getTrainData(): Observable<any> {
    const url = `http://localhost${environment.backLocation}trajets`;
    console.log(url);
    // @ts-ignore
    return this.http.get<any>(url);
  }

  getTrainDataByGare(idGare: number): Observable<any> {
    const url = `http://localhost${environment.backLocation}trajets?id_gare=` + idGare;
    console.log(url);
    // @ts-ignore
    return this.http.get<any>(url);
  }

  setTrainData(trajets: any[]): void {
    this.trainDataSubject.next(trajets);
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
}
