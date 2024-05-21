import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from '../app.component';
import { routes } from '../app.routes';
// Assurez-vous d'importer vos routes ici

@NgModule({
  declarations: [
   // AppComponent
    // autres composants
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes) // Importez RouterModule et utilisez la méthode forRoot avec vos routes
  ],
  providers: [],
  //bootstrap: [AppComponent]
})
export class AppModule { }
