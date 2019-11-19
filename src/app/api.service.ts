import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) { }
    GetUsers() {
        return this.http.get("https://localhost:44357/api/Users");
    }

    GetUserID(firstName: string, lastName: string) {

    }

    GetUserFromID(id: number){
        return this.http.get("https://localhost:44357/api/Users" + id.toString());
    }

    GetTransactions() {
        return this.http.get("https://localhost:44357/api/Transactions");
    }


    AddTransaction(lender: string, borrower: string, amount: number, reason: string) {
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
        this.http.post('https://localhost:44357/api/Transactions', bodyString, { headers: hdr }).subscribe();
    }

}
