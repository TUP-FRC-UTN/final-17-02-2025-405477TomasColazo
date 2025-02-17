import { Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {authGuard} from './guards/auth.guard';
import {GameComponent} from './components/game/game.component';
import {ScoresComponent} from './components/scores/scores.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path: '', component: LoginComponent},
  {path:'game', component: GameComponent, canActivate:[authGuard]},
  {path:'scores', component:ScoresComponent, canActivate:[authGuard]},
];
