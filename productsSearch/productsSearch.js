import { LightningElement,track,wire } from 'lwc';
//import getPriceBooks from '@salesforce/apex/fetchPricebookValue.getPriceBooks';
import getProducts from '@salesforce/apex/fetchPricebookValue.getProducts';

export default class ProductResult extends LightningElement {
    @track priceBookID;
    @track products;

    priceBookSelectHandler(event){
       this.priceBookID=event.detail;
       console.log('List--',this.priceBookID);
    }
   
    @wire(getProducts, {priceBookID : '$priceBookID'})
    wiredData({data, error}){
        if(data){
            this.products= data;
            console.log('data',data);
        } else if(error){
            this.showToast('ERROR', error.body.message, 'error');
        }
    }
    
}

/*

 <div class="slds-p-around_medium lgc-bg">
                    <lightning-tile label={prd.Name} >
                        <p class="slds-truncate"> {prd.Description}</p>
                        <lightning-icon icon-name="custom:custom33" title="custom33"></lightning-icon>
                        <lightning-button-icon icon-name="utility:zoomin"    alternative-text="Zoom in"  class="slds-m-left_xx-small" title="Zoom in"></lightning-button-icon>

                    </lightning-tile>

                </div>
*/