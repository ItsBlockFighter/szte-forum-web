import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faBars, faCoffee, faHouse, faUserGear} from "@fortawesome/free-solid-svg-icons";
import {NgClass, NgIf, NgOptimizedImage} from "@angular/common";
import {MatList, MatListItem} from "@angular/material/list";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbarModule, MatButtonModule, MatIconModule, RouterModule, FontAwesomeModule, NgOptimizedImage, MatList, MatListItem, NgClass, NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  private auth: AuthService = inject(AuthService);

  isLoggedIn: boolean = false;
  isCollapsed: boolean = false;

  constructor(private router: Router) {
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  async ngOnInit(): Promise<void> {
    this.auth.user.subscribe((user) => {
      this.isLoggedIn = user !== null;
    });
  }

  protected readonly faCoffee = faCoffee;
  protected readonly faHouse = faHouse;
  protected readonly faUserGear = faUserGear;
  protected readonly faBars = faBars;

  async logout() {
    await this.router.navigate(['/logout']);
  }
}
