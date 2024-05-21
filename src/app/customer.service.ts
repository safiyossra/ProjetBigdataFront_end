import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Customer } from './customer.model'; // Assurez-vous d'importer le modèle


@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:8081/customers';

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError<Customer[]>('getCustomers', []))
      );
  }
  getPredictionAccuracy(): Observable<{ correct: number; incorrect: number }> {
    return this.getCustomers().pipe(
      map((customers: Customer[]) => { // Explicit type declaration for customers
        let correct = 0;
        let incorrect = 0;
        customers.forEach((customer: Customer) => { // Explicit type declaration for customer
          if (customer.churn === customer.prediction) {
            correct++;
          } else {
            incorrect++;
          }
        });
        return { correct, incorrect };
      })
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
  
  getCustomersByPrediction(customer: Customer): Observable<Customer[]> {
    return this.http.post<Customer[]>(this.apiUrl + '/getPredictions', customer);
  }
}
