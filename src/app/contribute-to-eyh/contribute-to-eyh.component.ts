import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Payment } from '../models/payment';
import { Socialusers } from '../models/socialusers';
import { formatDate } from '@angular/common';
import { stringify } from '@angular/compiler/src/util';
import { Identifiers } from '@angular/compiler';
import { EyhUserhandlerService } from '../service/eyh-userhandler.service';
import { PaymentshandlerService } from '../service/paymentshandler.service';
import { MenuhandlerService } from '../service/menuhandler.service';
import { EyhUser } from '../models/eyh-user';
import { GridOptions } from "ag-grid-community";

@Component({
  selector: 'app-contribute-to-eyh',
  templateUrl: './contribute-to-eyh.component.html',
  styleUrls: ['./contribute-to-eyh.component.css']
})
export class ContributeToEYHComponent implements OnInit {

  constructor() { 

  }

  ngOnInit() {

  }


}