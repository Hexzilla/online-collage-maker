import { Component } from '@angular/core';
// import { AuthService } from './auth.service';
import { NeworderService } from './services/neworder.service';
import { NewOrder } from 'src/datamodel/newOrder';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

const SMALL_WITH_BREAKPOINT = 720;
declare var gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  items: any[] = [];

  constructor(
    // private authSvc: AuthService,
    private nos: NeworderService,
    private router: Router
  ) {
    // const navEndEvents = router.events.pipe(
    //   filter(event => event instanceof NavigationEnd),
    // );
    // navEndEvents.subscribe((event: NavigationEnd) => {
    //   const page_path = '/canvas-prints' + event.urlAfterRedirects;
    //   gtag('config', 'UA-52889646-1', {
    //     'page_path': page_path
    //   });
    // });
    // this.authSvc.isAuthenticated().subscribe(r => {
    //   if (r) {
    //     // console.log('user is authenticated');
    //   } else {
    //     // console.log('user is not authenticated');
    //   }
    // });
  }

  getOrder(): NewOrder {
    return this.nos.newOrder;
  }
}
