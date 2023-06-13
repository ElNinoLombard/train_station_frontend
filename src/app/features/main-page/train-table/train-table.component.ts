import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-train-table',
  templateUrl: './train-table.component.html',
  styleUrls: ['./train-table.component.scss'],
})
export class TrainTableComponent implements OnInit {
  trajets: any[] = [
    {
      trainName: 'Train A',
      specs: {
        departLieu: 'Paris',
        departHeure: '10:00',
        arriveeLieu: 'Lyon',
        arriveeHeure: '12:00',
      },
      placesMax: 100,
      placesReservees: 63,
    },
    {
      trainName: 'Train B',
      specs: {
        departLieu: 'Nantes',
        departHeure: '09:35',
        arriveeLieu: 'La Rochelle',
        arriveeHeure: '11:47',
      },
      placesMax: 50,
      placesReservees: 18,
    },
    {
      trainName: 'Train C',
      specs: {
        departLieu: 'Bordeaux',
        departHeure: '14:20',
        arriveeLieu: 'Toulouse',
        arriveeHeure: '17:45',
      },
      placesMax: 80,
      placesReservees: 25,
    },
    {
      trainName: 'Train D',
      specs: {
        departLieu: 'Lille',
        departHeure: '08:15',
        arriveeLieu: 'Strasbourg',
        arriveeHeure: '10:45',
      },
      placesMax: 120,
      placesReservees: 120,
    },
    {
      trainName: 'Train E',
      specs: {
        departLieu: 'Nice',
        departHeure: '12:30',
        arriveeLieu: 'Marseille',
        arriveeHeure: '15:15',
      },
      placesMax: 90,
      placesReservees: 4,
    },
    {
      trainName: 'Train F',
      specs: {
        departLieu: 'Rennes',
        departHeure: '11:10',
        arriveeLieu: 'Brest',
        arriveeHeure: '13:00',
      },
      placesMax: 70,
      placesReservees: 15,
    },
    {
      trainName: 'Train G',
      specs: {
        departLieu: 'Toulon',
        departHeure: '09:55',
        arriveeLieu: 'Cannes',
        arriveeHeure: '12:35',
      },
      placesMax: 150,
      placesReservees: 146,
    },
    {
      trainName: 'Train H',
      specs: {
        departLieu: 'Biarritz',
        departHeure: '10:20',
        arriveeLieu: 'Bayonne',
        arriveeHeure: '11:00',
      },
      placesMax: 40,
      placesReservees: 36,
    },
    {
      trainName: 'Train I',
      specs: {
        departLieu: 'Limoges',
        departHeure: '13:45',
        arriveeLieu: 'Poitiers',
        arriveeHeure: '15:10',
      },
      placesMax: 60,
      placesReservees: 42,
    },
    {
      trainName: 'Train J',
      specs: {
        departLieu: 'Dijon',
        departHeure: '08:45',
        arriveeLieu: 'Lyon',
        arriveeHeure: '10:20',
      },
      placesMax: 80,
      placesReservees: 36,
    },
  ];

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    // this.productService.getProductsMini().then((data) => {
    //     this.products = data;
    // });
  }

  getSeverity(placesReservees: number, placesMax: number): string {
    const percentage = (placesReservees / placesMax) * 100;

    if (percentage >= 75) {
      return 'danger'; // High percentage of places reserved
    } else if (percentage >= 50) {
      return 'warning'; // Moderate percentage of places reserved
    } else {
      return 'success'; // Low percentage of places reserved
    }
  }

  openConfirmationModal(trajet: any) {
    const trajetWithSpecs = { ...trajet, specs: trajet.specs };
    this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: trajetWithSpecs,
    });
  }
}
