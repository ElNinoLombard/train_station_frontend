import { Component, OnInit } from '@angular/core';
import { TrainService } from 'src/app/shared/train.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  searchQuery: string = '';
  filteredTrains: any[] = [];
  allTrains: any[] = [];

  options: string[] = ['Option 1', 'Option 2', 'Option 3']; // Replace with your actual options

  constructor(private trainService: TrainService) {}

  ngOnInit(): void {
    this.trainService.getTrainData().subscribe({
      next: (trains: any) => {
        console.log(trains); // Verify the data received
        this.allTrains = trains.data;
        this.applyFilters();
      },
      error: (error: any) => {
        console.error('Error fetching train data:', error);
      },
    });
  }

  applyFilters(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredTrains = this.allTrains;
    } else {
      this.filteredTrains = this.filterTrains(this.allTrains);
    }
  }

  filterTrains(trains: any): any[] {
    if (!trains || !Array.isArray(trains)) {
      return [];
    }

    const currentTime = new Date();
    const filteredTrains = trains.filter((train) => {
      const departTime = new Date(train.depart_heure);
      const arrivalTime = new Date(train.arrivee_heure);
      const delayInMs = train.delai * 60 * 1000;

      // Calculate the expected arrival time based on departure time and delay
      const expectedArrivalTime = new Date(departTime.getTime() + delayInMs);

      // Filter based on departure location, search query, and time constraints
      return (
        (train.gare_depart
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
          train.gare_arrivee
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())) &&
        (departTime >= currentTime ||
          expectedArrivalTime >= currentTime ||
          arrivalTime >= currentTime)
      );
    });

    return filteredTrains;
  }

  handleSearchInput(): void {
    this.applyFilters();
  }
}
