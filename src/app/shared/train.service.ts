import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainService {
  private trainDataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );

  constructor() {}

  getTrainData(): Observable<any[]> {
    return this.trainDataSubject.asObservable();
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
