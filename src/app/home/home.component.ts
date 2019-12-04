import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { MatStepper } from '@angular/material';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    animations: [

        trigger('cardAnimation', [
            transition('* => *', [
                query(':enter', style({ opacity: 0 }), { optional: true }),
                query(':enter', stagger('75ms', [
                    animate('.5s ease-in', keyframes([
                        style({ opacity: 0, transform: 'translateY(-50%)', offset: 0 }),
                        style({ opacity: .5, transform: 'translateY(-10px) scale(1.13)', offset: 0.3 }),
                        style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
                    ]))]), { optional: true }),
            ]),
        ]),
    ]
})
export class HomeComponent implements OnInit {
    constructor(private api: ApiService) { }

    users = [];
    transactions = [];

    cards = [];
    index = 0;

    lenderControl = new FormControl('', [
        Validators.required,
    ]);

    borrowerControl = new FormControl('', [
        Validators.required,
    ]);

    amountControl = new FormControl('', [
        Validators.required,
        Validators.max(1000),
        Validators.minLength(0),
    ]);

    reasonControl = new FormControl('', [
    ]);

    ngOnInit() {

        this.api.GetUsers().subscribe(
            (data: any) => {
                this.users = data;
                this.users.sort((a, b) => (a["firstName"] > b["firstName"]) ? 1 : -1)
            }, () => { }, () => {
                console.log(this.users);
            }
        )

        this.api.GetTransactions().subscribe(
            (data: any) => {
                this.transactions = data;
                this.transactions.sort((a, b) => (a["time"] > b["time"]) ? 1 : -1);
            }, () => { },
            () => {
                this.updateCards();
            }
        )

    }

    updateCards() {

        this.api.GetTransactions().subscribe(
            (data: any) => {
                this.transactions = data;
                this.transactions.sort((a, b) => (a["time"] > b["time"]) ? 1 : -1);
            }, () => { },
            () => {
                this.cards = [];
                this.index = 0;
                for (var i = this.transactions.length - 1; i >= this.transactions.length - 5; i--) {
                    this.cards.push(
                        {
                            "lender": this.getUserName(this.transactions[i]["user1"]),
                            "borrower": this.getUserName(this.transactions[i]["user2"]),
                            "amount": this.transactions[i]["amount"],
                            "time": this.transactions[i]["time"],
                            "reason": this.transactions[i]["reason"]
                        });
                }
            }
        )
    }

    getUserName(id: Number) {
        for (var i = 0; i < this.users.length; i++)
            if (this.users[i]["userId"] == id) return (this.users[i]["firstName"] + " " + this.users[i]["lastName"]);
    }

    submit(stepper: MatStepper) {


        if (!this.lenderControl.valid || !this.borrowerControl.valid)
            stepper.selectedIndex = 0;
        else if (!this.amountControl.valid)
            stepper.selectedIndex = 1;
        else if (!this.reasonControl.valid)
            stepper.selectedIndex = 2;
        else {
            stepper.reset();
            console.log(this.lenderControl.value["firstName"] + " paid " + this.borrowerControl.value["firstName"] + " " + this.amountControl.value + "$ for " + this.reasonControl.value);

            this.api.AddTransaction(this.lenderControl.value["userId"], this.borrowerControl.value["userId"], this.amountControl.value, this.reasonControl.value).subscribe(
                () => { }, () => { },
                () => {
                    this.updateCards();
                }
            );
            this.lenderControl.reset();
            this.borrowerControl.reset();
            this.amountControl.reset();
            this.reasonControl.reset(); 3

            this.updateCards();

        }
    }

}
