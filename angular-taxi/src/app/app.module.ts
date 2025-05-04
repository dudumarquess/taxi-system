import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { TaxiListComponent } from './taxi-list/taxi-list.component';
import { TaxiFormComponent } from './taxi-form/taxi-form.component';

import { MotoristaListComponent } from './motorista-list/motorista-list.component';
import { MotoristaFormComponent } from './motorista-form/motorista-form.component';
import { PrecoFormComponent } from './preco-form/preco-form.component';
import { CalcularCustoViagemComponent } from './calcular-custo-viagem/calcular-custo-viagem.component';
import { PrecosListComponent } from "./precos-list/precos-list.component";
import { EscolherPerfilComponent } from './escolher-perfil/escolher-perfil.component';
import { GestorComponent } from './gestor/gestor.component';
import { MotoristaLoginComponent } from './motorista-login/motorista-login.component';
import { MotoristaDashboardComponent } from './motorista-dashboard/motorista-dashboard.component';

import { PorscheDesignSystemModule } from '@porsche-design-system/components-angular';

@NgModule({
  declarations: [
    AppComponent,
    TaxiListComponent,
    TaxiFormComponent,
    MotoristaListComponent,
    MotoristaFormComponent,
    PrecoFormComponent,
    PrecosListComponent,
    CalcularCustoViagemComponent,
    EscolherPerfilComponent,
    GestorComponent,
    MotoristaLoginComponent,
    MotoristaDashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    PorscheDesignSystemModule,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
