import { Component, OnInit } from '@angular/core';
import { TrainService } from 'src/app/shared/train.service';

@Component({
  selector: 'app-ceo',
  templateUrl: './ceo.component.html',
  styleUrls: ['./ceo.component.scss'],
})
export class CeoComponent implements OnInit {
  ca: number = 0;

  constructor(private trainService: TrainService) {}

  ngOnInit(): void {
    this.getRevenue();
  }

  private getRevenue(): void {
    this.trainService.getCA().subscribe({
      next: (response) => {
        console.log('Revenue fetched:', response);
        this.ca = response.data;
      },
      error: (error) => {
        console.log('Error fetching revenue:', error);
      },
    });
  }
}
