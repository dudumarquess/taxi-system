import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxiListComponent } from './taxi-list/taxi-list.component';
import { TaxiFormComponent } from './taxi-form/taxi-form.component';
import { MotoristaListComponent } from './motorista-list/motorista-list.component';
import { MotoristaFormComponent } from './motorista-form/motorista-form.component';
import { PrecoFormComponent } from './preco-form/preco-form.component';
<<<<<<< HEAD
=======
import { CalcularCustoViagemComponent } from './calcular-custo-viagem/calcular-custo-viagem.component';
>>>>>>> 976245d50221673d5b0b8ef9860e20b6c28d5e44

const routes: Routes = [
  { path: '', redirectTo: 'taxis', pathMatch: 'full' },
  { path: 'taxis', component: TaxiListComponent },
  { path: 'taxis/novo', component: TaxiFormComponent },

  { path: '', redirectTo: 'motoristas', pathMatch: 'full' },
  { path: 'motoristas', component: MotoristaListComponent },
  { path: 'motoristas/novo', component: MotoristaFormComponent },
  
  { path: 'precos/definir', component: PrecoFormComponent },
  { path: 'calcular-custo', component: CalcularCustoViagemComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
