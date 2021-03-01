import { Injectable } from '@angular/core';
import { AlertService } from 'ngx-alerts';

@Injectable()
export class GlobalsService {

    darkmode:boolean = false;
    
    constructor(private alertService: AlertService,){
    }

    showSuccessAlert(msg){
        this.alertService.success(msg);
    }
    
    showErrorAlert(msg){
        console.log(3);
        this.alertService.danger(msg);
    }

    checkValue(event: any){
        if(event == 'dark'){
            this.darkmode = true;
        } else {
            this.darkmode = false;
        }
     }

}
    
