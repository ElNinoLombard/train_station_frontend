import {Component, Inject, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {TrainService} from "../../../shared/train.service";

@Component({
  selector: 'app-edit-train',
  templateUrl: './edit-train.component.html',
  styleUrls: ['./edit-train.component.scss'],
})
export class EditTrainComponent implements OnInit {
  editTrainForm!: FormGroup;
  isDelayed: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditTrainComponent>,
    private formBuilder: FormBuilder,
    private trainService: TrainService,
    @Inject(MAT_DIALOG_DATA) public trainData: any
  ) {}

  ngOnInit(): void {
    this.editTrainForm = this.formBuilder.group({
      departureTime: [this.trainData.depart_heure, Validators.required],
      arrivalTime: [this.trainData.arrivee_heure, Validators.required],
      status: [this.trainData.status || "à l'heure", Validators.required],
      delayTime: [{ value: '', disabled: this.trainData.status !== 'delayed' }],
    });
    this.isDelayed = this.trainData.status === 'delayed';
  }

  saveChanges(): void {
    if (this.editTrainForm.valid) {
      const selectedStatus = this.editTrainForm.value.status;
      const commentaire = this.editTrainForm.value.commentaire;
      const duree = this.editTrainForm.value.duree;
      let status = selectedStatus;

      if (selectedStatus === 'En retard') {
        this.trainService.setTrainRetard(this.trainData.id, duree, commentaire);
      } else if (selectedStatus === 'Annulé') {
        this.trainService.setTrainAnnulation(this.trainData.id, commentaire);
      }

      const updatedTrainData = {
        ...this.trainData,
        specs: {
          ...this.trainData.specs,
        },
        status: status,
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
      this.editTrainForm.get('delayTime')?.enable();
      this.isDelayed = true;
    } else {
      this.editTrainForm.get('delayTime')?.disable();
      this.isDelayed = false;
    }
  }
}
