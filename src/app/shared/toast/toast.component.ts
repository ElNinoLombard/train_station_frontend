import { Component, OnInit } from '@angular/core';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {
  constructor(public toastService: ToastService) {}

  closeToast() {
    this.toastService.hide();
  }

  ngOnInit() {
    // Automatically hide the toast after 3 seconds
    setTimeout(() => this.toastService.hide(), 3000);
  }
}
