import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private api: ApiService) { }

  users = [];

  lenderControl = new FormControl('', [
    Validators.required,
  ]);

  borrowerControl = new FormControl('', [
    Validators.required,
  ]);

  amountControl = new FormControl('', [
    Validators.required,
    Validators.pattern("^[0-9]*$"),
    Validators.minLength(0),
  ]);

  reasonControl = new FormControl('', [
  ]);

  ngOnInit() {

    this.api.GetUsers().subscribe(
        (data: any) => { this.users = data }, () => {}, () => {
            console.log(this.users);
        }
    )

  }

  submit() {
      console.log(this.lenderControl.value["firstName"] + " paid " + this.borrowerControl.value["firstName"] + " " + this.amountControl.value + "$ for " + this.reasonControl.value);
    
      console.log(this.lenderControl.value);
      this.api.AddTransaction(this.lenderControl.value["userId"], this.borrowerControl.value["userId"], this.amountControl.value, this.reasonControl.value); 
      this.lenderControl.reset();
      this.borrowerControl.reset();
      this.amountControl.reset();
      this.reasonControl.reset();


  }

}
