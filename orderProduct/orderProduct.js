import { LightningElement, wire,track } from 'lwc';
import {getRecord} from 'lightning/uiRecordApi';
import PRODUCT_NAME from '@salesforce/schema/Product2.Name';
import PRODUCT_PRICE from '@salesforce/schema/Product2.Price__c';
const fieldArray=[PRODUCT_NAME,PRODUCT_PRICE];
export default class OrderProduct extends LightningElement {
    productId;
    @track selectedTabValue;

    @wire(getRecord, {recordID:'$productID', fields:fieldArray})
    prds;

    changeHandler(event){
       this.selectedTabValue=event.target.value;
    }
}