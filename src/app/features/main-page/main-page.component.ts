import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
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
  filteredOptions: Observable<IGare[]> | undefined;
  filteredTrains: any[] = [];
  allTrains: any[] = [];

  options: IGare[] = [];

  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger!: MatAutocompleteTrigger;

  constructor(private trainService: TrainService) {}

  ngOnInit(): void {
    this.trainService.getGareData().subscribe({
      next: (gares: any) => {
        console.log('gares:', gares);
        this.options = gares.data;
      },
      error: (error: any) => {
        console.error('Error fetching gare data:', error);
      },
    });

    this.trainService.getTrainData().subscribe({
      next: (trains: any) => {
        console.log('trains:', trains);
        this.allTrains = trains.data;
        this.applyFilters();
      },
      error: (error: any) => {
        console.error('Error fetching train data:', error);
      },
    });

    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterOptions(value))
    );
  }

  applyFilters(): void {
    const searchQuery = this.searchControl.value;

    if (typeof searchQuery !== 'string') {
      this.filteredTrains = this.allTrains;
      return;
    }

    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery === '') {
      this.filteredTrains = this.allTrains;
    } else {
      this.filteredTrains = this.filterTrains(this.allTrains);
    }
  }

  filterOptions(value: string): IGare[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.nom.toLowerCase().includes(filterValue)
    );
  }

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

  handleSearchOptionSelected(event: any): void {
    this.searchControl.setValue(''); // Clear the search control

    const selectedOption = event.option.value;
    console.log('searchControl:', this.searchControl.value);
    console.log('selectedOption:', selectedOption);

    this.trainService.getTrainDataByGare(selectedOption.id).subscribe({
      next: (trains: any) => {
        this.allTrains = trains.data;
        this.applyFilters(); // Apply filters after updating the train data
      },
    });
  }

  handleSearchInput(): void {
    const searchQuery = this.searchControl.value?.trim() || '';
    this.applyFilters();

    if (searchQuery === '') {
      // Reset filtered trains when search query is empty
      this.filteredTrains = this.allTrains;
    }
  }
}
