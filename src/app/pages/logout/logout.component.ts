import {Component, inject, OnInit} from '@angular/core';
import {LoadingComponent} from "../../components/loading/loading.component";
import {AuthService} from '../../services/auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [
    LoadingComponent
  ],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit {

  private authService: AuthService = inject(AuthService);

  constructor(private router: Router) {
  }

  async ngOnInit() {
    await this.authService.logout();
    await this.router.navigate(['/']);
  }
}
