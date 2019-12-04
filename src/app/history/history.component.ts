import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { ApiService } from "../api.service";

export interface TransactionData {
    id: number;
    lender: string;
    borrower: string;
    amount: number;
    reason: string;
}

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

    constructor(private api: ApiService) { }
    transactions = [];
    users = [];

    dataSource: MatTableDataSource<TransactionData>;
    displayedColumns = ["id", "lender", "borrower", "amount", "reason"];

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    ngOnInit() {


        this.api.GetTransactions().subscribe((data: any) => { this.transactions = data }, () => { }, () => {
            var u1 = "";
            var u2 = "";

            var newTrans = [];
            for (let i = 0; i < this.transactions.length; i++) {

                this.api.GetUserFromID(this.transactions[i]["user1"]).subscribe((data: any) => { u1 = data; }, () => { }, () => {
                    this.api.GetUserFromID(this.transactions[i]["user2"]).subscribe((data: any) => { u2 = data; }, () => { }, () => {
                        newTrans.push({
                            "id": this.transactions[i]["id"],
                            "user1": u1["firstName"] + " " + u1["lastName"],
                            "user2": u2["firstName"] + " " + u2["lastName"],
                            "amount": this.transactions[i]["amount"],
                            "reason": this.transactions[i]["reason"]
                        });
                        this.dataSource = new MatTableDataSource(newTrans);

                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    });
                });
            }
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }


}
