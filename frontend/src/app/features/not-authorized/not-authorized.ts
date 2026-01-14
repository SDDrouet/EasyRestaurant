import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-not-authorized',
  imports: [RouterLink, Button],
  templateUrl: './not-authorized.html',
})
export class NotAuthorized {

}
