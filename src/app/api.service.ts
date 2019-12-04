import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) { }
    GetUsers() {
        return this.http.get(environment.ApiUrl + "/api/Users");
    }

    GetUserID(firstName: string, lastName: string) {

    }

    GetUserFromID(id: number){
        return this.http.get(environment.ApiUrl + "/api/Users/" + id.toString());
    }

    GetTransactions() {
        return this.http.get(environment.ApiUrl + "/api/Transactions");
    }


    AddTransaction(lender: string, borrower: string, amount: number, reason: string) {

        amount = Math.round(amount * 100) / 100;

        var newTrans = {
            "User1": lender,
            "User2": borrower,
            "Amount": amount,
            "Reason": reason
        };

        console.log(newTrans);

        var hdr = new HttpHeaders({ "Content-Type": "application/json" });

        var bodyString = JSON.stringify(newTrans);
        console.log(bodyString);
        return this.http.post(environment.ApiUrl + '/api/Transactions', bodyString, { headers: hdr });
    }

}
