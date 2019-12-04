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
                }

                this.api.GetTransactions().subscribe(
                    (data: any) => { this.transactions = data }, () => { }, () => {
                        for (var i = 0; i < this.transactions.length; i++) {
                            var amt = this.transactions[i]["amount"];
                            if (this.transactions[i]["user1"] in this.userBal && this.transactions[i]["user2"] in this.userBal) {
                                this.userBal[this.transactions[i]["user1"]] += amt;
                                this.userBal[this.transactions[i]["user2"]] -= amt;
                            }
                            else {
                                console.log("Invalid Transaction Found:");
                                console.log(this.transactions[i]);
                            }
                        }

                        var sortingList = [];
                        for (let [key, value] of Object.entries(this.userBal)) {
                            sortingList.push([value, key]);
                        }
                        sortingList.sort((a, b) => (Math.abs(a[0]) > Math.abs(b[0])) ? -1 : 1)
                        for (var i = 0; i < sortingList.length; i++) {
                            this.cards.push(
                                {

                                    "name": this.users[sortingList[i][1] - 1]["firstName"] + " " + this.users[sortingList[i][1] - 1]["lastName"],
                                    "balance": this.userBal[this.users[sortingList[i][1] - 1]["userId"]]
                                });
                        }
                    }
                );


            }
        );





    }

}
