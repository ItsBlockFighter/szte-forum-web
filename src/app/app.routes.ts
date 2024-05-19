import {Routes} from '@angular/router';
import {MainComponent} from "./pages/main/main.component";
import {LoginComponent} from "./pages/login/login.component";
import {RegisterComponent} from "./pages/register/register.component";
import {LogoutComponent} from "./pages/logout/logout.component";
import {ForumComponent} from "./pages/forum/forum.component";
import {ThreadComponent} from "./pages/thread/thread.component";
import {ProfileComponent} from "./pages/profile/profile.component";
import {NewThreadComponent} from "./pages/new-thread/new-thread.component";
import {authGuard} from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: [authGuard]
  },
  {
    path: 'forum/:id',
    component: ForumComponent,
  },
  {
    path: 'thread/:id',
    component: ThreadComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
