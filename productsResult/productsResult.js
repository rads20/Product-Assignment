import { LightningElement, api, wire, track } from 'lwc';
import getProducts from '@salesforce/apex/fetchProducts.fetchProductList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class CarSearchResult extends LightningElement {
    @api priceBookID;

    @track products;

    @wire(getProducts, {priceBookID : '$priceBookID'})
    wiredData({data, error}){
        if(data){
            this.products= data;
            console.log('data',data);
        } else if(error){
            this.showToast('ERROR', error.body.message, 'error');
        }
    }


    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

  /*  get productList(){
       
        if(this.products){
            console.log('wiredData',wiredData.data);
            console.log('priceBookID',this.priceBookID);
            return true;
        }

        return false;
    } */
}