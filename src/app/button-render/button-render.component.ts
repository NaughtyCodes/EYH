import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
//import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid';

@Component({
  selector: 'app-button-renderer',
  template: `
    <button class="btn" style="padding:0px 0px !important;margin-left:-15px;color:#00af66" type="button" (click)="onClick($event)"><i class="pi pi-info-circle" style="font-size:1.65em"></i></button>
    `
})

export class ButtonRendererComponent implements ICellRendererAngularComp {

  params;
  label: string;

  agInit(params): void {
    this.params = params;
    this.label = this.params.label || null;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event) {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
        // ...something
      }
      this.params.onClick(params);

    }
  }
}