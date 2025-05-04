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

const routes: Routes = [
  { path: '', component: EscolherPerfilComponent },

  {
    path: 'gestor',
    component: GestorComponent,
    children: [
      { path: 'taxis', component: TaxiListComponent },
      { path: 'taxis/novo', component: TaxiFormComponent },

      { path: '', redirectTo: 'taxis', pathMatch: 'full' },
      { path: 'motoristas', component: MotoristaListComponent },
      { path: 'motoristas/novo', component: MotoristaFormComponent },

      { path: 'precos', component: PrecosListComponent },
      { path: 'precos/definir', component: PrecoFormComponent },
      { path: 'calcular_custo', component: CalcularCustoViagemComponent },
    ]
  },
  { path: 'motorista-login', component: MotoristaLoginComponent },
  {path: 'motorista-dashboard', component: MotoristaDashboardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
