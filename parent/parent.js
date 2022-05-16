import { LightningElement } from 'lwc';

export default class Parent extends LightningElement {
    qty = 0;
    
    quantityCtrl(event) {
        this.qty = event.detail;
    }

}