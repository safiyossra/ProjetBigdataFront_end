import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';
import { CustomerService } from './customer.service';
import { GRAPHComponent } from './graph/graph.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule, provideHttpClient,withFetch} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppRoutes, routes } from './app.routes';
import { ServerModule } from '@angular/platform-server';
import { BaseChartDirective,provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { CustomersComponent } from './customers/customers.component';


@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    GRAPHComponent,
    CustomersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    AppModule,
    ServerModule,
    BaseChartDirective,
    AppRoutes,
    NgModule,
  
     


    

  ],
  providers: [provideCharts(withDefaultRegisterables())],
  bootstrap: [AppComponent]
})
export class AppModule { }
