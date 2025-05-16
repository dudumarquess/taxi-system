import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxiListComponent } from './taxi-list/taxi-list.component';
import { TaxiFormComponent } from './taxi-form/taxi-form.component';
import { MotoristaListComponent } from './motorista-list/motorista-list.component';
import { MotoristaFormComponent } from './motorista-form/motorista-form.component';
import { PrecoFormComponent } from './preco-form/preco-form.component';
import { CalcularCustoViagemComponent } from './calcular-custo-viagem/calcular-custo-viagem.component';
import { PrecosListComponent } from './precos-list/precos-list.component';
import { EscolherPerfilComponent } from './escolher-perfil/escolher-perfil.component';
import { GestorComponent } from './gestor/gestor.component';
import { MotoristaLoginComponent } from './motorista-login/motorista-login.component';
import { MotoristaDashboardComponent } from './motorista-dashboard/motorista-dashboard.component';
import { PedidosPendentesComponent } from './pedidos-pendentes/pedidos-pendentes.component';
import { RegistarViagemComponent } from './registar-viagem/registar-viagem.component';
import { ListaViagensComponent } from './lista-viagens/lista-viagens.component';
import { TurnosListComponent } from './turnos-list/turnos-list.component';
import {ClienteDashboardComponent} from "./cliente-dashboard/cliente-dashboard.component";
import {ClientePedirTaxiComponent} from "./cliente-pedir-taxi/cliente-pedir-taxi.component";
import {ClientePedidosComponent} from "./cliente-pedidos/cliente-pedidos.component";
import {RequisitarTaxiComponent} from "./requisitar-taxi/requisitar-taxi.component";
import {ClienteLoginComponent} from "./cliente-login/cliente-login.component";
import { EditarTaxiComponent } from './editar-taxi/editar-taxi.component';

const routes: Routes = [
  { path: '', component: EscolherPerfilComponent },

  {
    path: 'gestor',
    component: GestorComponent,
    children: [
      { path: 'taxis', component: TaxiListComponent },
      { path: 'taxis/novo', component: TaxiFormComponent },
      { path: 'taxis/editar', component: EditarTaxiComponent},

      { path: '', redirectTo: 'taxis', pathMatch: 'full' },
      { path: 'motoristas', component: MotoristaListComponent },
      { path: 'motoristas/novo', component: MotoristaFormComponent },

      { path: 'precos', component: PrecosListComponent },
      { path: 'precos/definir', component: PrecoFormComponent },
      { path: 'calcular_custo', component: CalcularCustoViagemComponent },
    ]
  },
  { path: 'motorista-login', component: MotoristaLoginComponent },
  {
    path: 'motorista',
    component: MotoristaDashboardComponent,
    children: [
      { path: 'requisitar-turno', component: RequisitarTaxiComponent },
      { path: 'turnos', component: TurnosListComponent },
      { path: 'pedidos', component: PedidosPendentesComponent },
      { path: 'registar-viagem', component: RegistarViagemComponent },
      { path: 'viagens', component: ListaViagensComponent },
      { path: '', redirectTo: 'requisitar', pathMatch: 'full' }
    ]
  },
  {
    path:'cliente',
    component: ClienteDashboardComponent,
    children: [
      { path: '', component: ClienteLoginComponent },
      { path: 'pedir-taxi', component: ClientePedirTaxiComponent },
      { path: 'pedido', component: ClientePedidosComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
