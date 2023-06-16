import {Component, Inject, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TrainService } from 'src/app/shared/train.service';

@Component({
  selector: 'app-edit-train',
  templateUrl: './edit-train.component.html',
  styleUrls: ['./edit-train.component.scss'],
})
export class EditTrainComponent implements OnInit {
  editTrainForm!: FormGroup;
  isOnTime: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<EditTrainComponent>,
    private formBuilder: FormBuilder,
    private trainService: TrainService,
    @Inject(MAT_DIALOG_DATA) public trainData: any
  ) {}

  ngOnInit(): void {
    console.log(this.trainData);
    this.editTrainForm = this.formBuilder.group({
      departureTime: [this.trainData.depart_heure, Validators.required],
      arrivalTime: [this.trainData.arrivee_heure, Validators.required],
      status: [this.trainData.status || "à l'heure", Validators.required],
      delayTime: [{ value: '', enabled: this.trainData.status == 'Retard' }],
      delayReason: '',
    });
    this.isOnTime = this.trainData.status === 'Retard';
  }

  saveChanges(): void {
    if (this.editTrainForm.valid) {
      const selectedStatus = this.editTrainForm.value.status;
      const commentaire = this.editTrainForm.value.delayReason;
      const duree = this.editTrainForm.value.delayTime;
      let status = selectedStatus;

      console.log(status);
      console.log(this.trainData.id_trajet);
      console.log(duree);
      console.log(commentaire);
      if (selectedStatus === 'En retard') {
        this.trainService.setTrainRetard(this.trainData.id_trajet, duree, commentaire).subscribe(
          response => {
            console.log(response);
          },
          error => {console.log(error);}
        );
      } else if (selectedStatus === 'Annulé') {
        this.trainService.setTrainAnnulation(this.trainData.id_trajet, commentaire);
      }
    } else {
      const updatedTrainData = {
        ...this.trainData,
        status: status
      };

      this.dialogRef.close(updatedTrainData);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  toggleDelay() {
    const selectedStatus = this.editTrainForm.value.status;
    if (selectedStatus === 'En retard') {
      this.isOnTime = false;
    } else {
      this.isOnTime = true;
    }
  }
}
