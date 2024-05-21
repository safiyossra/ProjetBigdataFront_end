
import { ContactComponent } from './contact/contact.component';
import { FormComponent } from './form/form.component';
import { HomeComponent } from './home/home.component';
import { GRAPHComponent } from './graph/graph.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'predict', component: FormComponent },
    { path: 'Graph', component: GRAPHComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'customers', component: CustomersComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirection vers la page "home" par défaut
    { path: '**', redirectTo: '/home' } // Redirection vers la page "home" pour les routes inexistantes
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutes{ }