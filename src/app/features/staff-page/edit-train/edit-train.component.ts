import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-train',
  templateUrl: './edit-train.component.html',
  styleUrls: ['./edit-train.component.scss'],
})
export class EditTrainComponent implements OnInit {
  editTrainForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditTrainComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public trainData: any
  ) {}

  ngOnInit(): void {
    this.editTrainForm = this.formBuilder.group({
      departureTime: [this.trainData.specs.departHeure, Validators.required],
      arrivalTime: [this.trainData.specs.arriveeHeure, Validators.required],
      status: [this.trainData.status || "à l'heure", Validators.required],
    });
  }

  saveChanges(): void {
    if (this.editTrainForm.valid) {
      const updatedTrainData = {
        ...this.trainData,
        specs: {
          ...this.trainData.specs,
          departHeure: this.editTrainForm.value.departureTime,
          arriveeHeure: this.editTrainForm.value.arrivalTime,
        },
        status: this.editTrainForm.value.status,
      };

      this.dialogRef.close(updatedTrainData);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
