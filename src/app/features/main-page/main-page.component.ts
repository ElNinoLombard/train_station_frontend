import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { TrainService } from 'src/app/shared/train.service';

interface IGare {
  nom: string;
  id: number;
  ville: string;
}
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  searchControl = new FormControl();
  filteredOptions: Observable<string[]> | undefined;
  filteredTrains: any[] = [];
  allTrains: any[] = [];

  options: IGare[] = []; // Add the options property and initialize it as an empty array

  constructor(private trainService: TrainService) {}

  ngOnInit(): void {
    this.trainService.getGareData().subscribe({
      next: (gares: any) => {
        console.log('gares:', gares); // Verify the data received
        this.options = gares.data;
      },
      error: (error: any) => {
        console.error('Error fetching gare data:', error);
      },
    });

    this.trainService.getTrainData().subscribe({
      next: (trains: any) => {
        console.log('trains:', trains); // Verify the data received
        this.allTrains = trains.data;
        this.applyFilters();
      },
      error: (error: any) => {
        console.error('Error fetching train data:', error);
      },
    });

    this.searchControl.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const searchQuery = this.searchControl.value?.trim() || '';
    if (searchQuery === '') {
      this.filteredTrains = this.allTrains;
    } else {
      this.filteredTrains = this.filterTrains(this.allTrains);
    }
  }

  // filterOptions(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.options.filter((option) =>
  //     option.toLowerCase().includes(filterValue)
  //   );
  // }

  filterTrains(trains: any[]): any[] {
    if (!trains || !Array.isArray(trains)) {
      return [];
    }

    const currentTime = new Date();
    const filteredTrains = trains.filter((train) => {
      if (!train) {
        return false;
      }

      const departTime = new Date(train.departureTime);
      const arrivalTime = new Date(train.arrivalTime);

      const departureLocation = train.departureLocation?.toLowerCase() || '';
      const arrivalLocation = train.arrivalLocation?.toLowerCase() || '';

      // Filter based on departure location, search query, and time constraints
      return (
        (departureLocation.includes(
          this.searchControl.value?.toLowerCase() || ''
        ) ||
          arrivalLocation.includes(
            this.searchControl.value?.toLowerCase() || ''
          )) &&
        (departTime >= currentTime || arrivalTime >= currentTime)
      );
    });

    return filteredTrains;
  }

  handleSearchOptionSelected(option: any): void {
    const selectedOptionText = option.option.viewValue;
    console.log('searchControl:', this.searchControl.value);
    console.log('selectedOptionText:', selectedOptionText);
    this.searchControl.setValue(selectedOptionText);
    this.trainService.getTrainDataByGare(option.option.value).subscribe({
      next: (trains: any) => {
        this.allTrains = trains.data;
        this.applyFilters(); // Apply filters after updating the train data
      },
    });
  }

  handleSearchInput(): void {
    this.applyFilters();
  }
}
