import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CustomerService } from '../customer.service';
import { Customer } from '../customer.model';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  standalone: true,
  imports: [CommonModule,FormsModule]
})
export class FormComponent {
  model: Customer = {
    id: '',
    accountLength: 0,
    areaCode: 0,
    churn: 0,
    customerServiceCalls: 0,
    internationalPlan: 0,
    numberVmailMessages: 0,
    prediction: 0,
    state: 0,
    totalDayCalls: 0,
    totalDayCharge: 0,
    totalDayMinutes: 0,
    totalEveCalls: 0,
    totalEveCharge: 0,
    totalEveMinutes: 0,
    totalIntlCalls: 0,
    totalIntlCharge: 0,
    totalIntlMinutes: 0,
    totalNightCalls: 0,
    totalNightCharge: 0,
    totalNightMinutes: 0,
    voiceMailPlan: 0
};
prediction: string | null = null;
  errorMessage: string | null = null;
  formVisible: boolean = true;

  constructor(private customerService: CustomerService) {}

  onSubmit(event: Event): void {
    console.log('Form submitted!');
  event.preventDefault();
    this.customerService.getCustomersByPrediction(this.model).subscribe({
      next: (customers) => {
        if (customers && customers.length > 0) {
          this.prediction = 'Prédiction basée sur vos entrées : ' + JSON.stringify(customers);
          this.formVisible = false;  // Hide form on successful prediction
        } else {
          this.errorMessage = "Aucune donnée correspondante dans la base de données";
          this.formVisible = true;  // Keep form visible to allow corrections
        }
      },
      error: (err) => {
        this.errorMessage = "Erreur lors de la récupération des données: " + err.message;
        this.formVisible = true;
      }
    });
  }
}