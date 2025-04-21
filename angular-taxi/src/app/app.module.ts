import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { TaxiListComponent } from './taxi-list/taxi-list.component';
import { TaxiFormComponent } from './taxi-form/taxi-form.component';

import { MotoristaListComponent } from './motorista-list/motorista-list.component';
import { MotoristaFormComponent } from './motorista-form/motorista-form.component';
import { PrecoFormComponent } from './preco-form/preco-form.component';
import { CalcularCustoViagemComponent } from './calcular-custo-viagem/calcular-custo-viagem.component';

import { PorscheDesignSystemModule } from '@porsche-design-system/components-angular';

@NgModule({
  declarations: [
    AppComponent,
    TaxiListComponent,
    TaxiFormComponent,
    MotoristaListComponent,
    MotoristaFormComponent,
<<<<<<< HEAD
    PrecoFormComponent
=======
    PrecoFormComponent,
    CalcularCustoViagemComponent
>>>>>>> 976245d50221673d5b0b8ef9860e20b6c28d5e44
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    PorscheDesignSystemModule
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
