import {Component} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faFacebook, faGithub, faTwitter} from "@fortawesome/free-brands-svg-icons";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  protected readonly faFacebook = faFacebook;
  protected readonly faTwitter = faTwitter;
  protected readonly faGithub = faGithub;
}
