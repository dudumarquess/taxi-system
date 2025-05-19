import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RouterModule } from '@angular/router';

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
import { RequisitarTaxiComponent } from './requisitar-taxi/requisitar-taxi.component';
import { TurnosListComponent } from './turnos-list/turnos-list.component';
import { ClienteDashboardComponent } from './cliente-dashboard/cliente-dashboard.component';
import { ClientePedirTaxiComponent } from './cliente-pedir-taxi/cliente-pedir-taxi.component';
import { ClientePedidosComponent } from './cliente-pedidos/cliente-pedidos.component';
import { RegistarViagemComponent } from './registar-viagem/registar-viagem.component';
import { ListaViagensComponent } from './lista-viagens/lista-viagens.component';
import { PorscheDesignSystemModule } from '@porsche-design-system/components-angular';
import { EditarTaxiComponent } from './editar-taxi/editar-taxi.component';
import { EditarMotoristaComponent } from './editar-motorista/editar-motorista.component';

import { PedidosPendentesComponent } from './pedidos-pendentes/pedidos-pendentes.component';
import { ClienteLoginComponent } from './cliente-login/cliente-login.component';



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
    MotoristaDashboardComponent,
    RequisitarTaxiComponent,
    TurnosListComponent,
    ClienteDashboardComponent,
    ClientePedirTaxiComponent,
    ClientePedidosComponent,
    PedidosPendentesComponent,
    RegistarViagemComponent,
    ListaViagensComponent,
    ClienteLoginComponent,
    EditarTaxiComponent,
    EditarMotoristaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    PorscheDesignSystemModule,
    RouterModule,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
