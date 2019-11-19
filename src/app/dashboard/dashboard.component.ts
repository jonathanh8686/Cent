import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { strictEqual } from 'assert';

import { ApiService } from "../api.service";
import { throwToolbarMixedModesError } from '@angular/material';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    animations: [

        // Trigger animation cards array
        trigger('cardAnimation', [
            // Transition from any state to any state
            transition('* => *', [
                // Initially the all cards are not visible
                query(':enter', style({ opacity: 0 }), { optional: true }),

                // Each card will appear sequentially with the delay of 300ms
                query(':enter', stagger('300ms', [
                    animate('.5s ease-in', keyframes([
                        style({ opacity: 0, transform: 'translateY(-50%)', offset: 0 }),
                        style({ opacity: .5, transform: 'translateY(-10px) scale(1.1)', offset: 0.3 }),
                        style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),
                    ]))]), { optional: true }),

                // Cards will disappear sequentially with the delay of 300ms
                query(':leave', stagger('300ms', [
                    animate('500ms ease-out', keyframes([
                        style({ opacity: 1, transform: 'scale(1.1)', offset: 0 }),
                        style({ opacity: .5, transform: 'scale(.5)', offset: 0.3 }),
                        style({ opacity: 0, transform: 'scale(0)', offset: 1 }),
                    ]))]), { optional: true })
            ]),
        ]),
    ]
})


export class DashboardComponent implements OnInit {
    index = 0;
    transactions = [];
    users = [];
    userBal = {};

    cards = [];
    constructor(private api: ApiService) { }

    ngOnInit() {

        this.api.GetUsers().subscribe(
            (data: any) => { this.users = data }, () => { }, () => {
                console.log(this.users);


                for (var i = 0; i < this.users.length; i++) {

                    this.userBal[this.users[i]["userId"]] = 0; // start everyone off with 0 balance.
                    console.log(this.users[i]["userId"]);
                }

                this.api.GetTransactions().subscribe(
                    (data: any) => { this.transactions = data }, () => { }, () => {
                        console.log(this.transactions);

                        for (var i = 0; i < this.transactions.length; i++) {
                            console.log(this.transactions[i]);
                            var amt = this.transactions[i]["amount"];
                            this.userBal[this.transactions[i]["user1"]] += amt;
                            this.userBal[this.transactions[i]["user2"]] -= amt;
                        }

                        console.log(this.userBal);

                        for (var i = 0; i < this.users.length; i++) {
                            this.cards.push(
                                {
                                    "name": this.users[i]["firstName"] + " " + this.users[i]["lastName"],
                                    "balance": this.userBal[this.users[i]["userId"]]
                                });
                        }
                    }
                );


            }
        );





    }

}
