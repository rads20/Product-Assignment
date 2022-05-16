import { LightningElement,wire,track } from 'lwc';
import getPriceBooks from '@salesforce/apex/fetchPricebookValue.getPriceBooks';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SelectPriceBook extends LightningElement {
@track priceBook;
    @wire(getPriceBooks)
    wiredPriceBook({data, error}){
        if(data){
            this.priceBook = [{value:'', label:''}];
            data.forEach(element => {
                const price = {};
                console.log('elememt',element.Name);
                price.label = element.Name;
                price.value = element.Id;
                this.priceBook.push(price);
            });
        } else if(error){
            this.showToast('ERROR', error.body.message, 'error');
        }
    }

    handleValueUpdate(event){
        const priceBookId=event.detail.value;
       
        const selectedPriceBook = new CustomEvent('selectpricebook', {detail : priceBookId});
        this.dispatchEvent(selectedPriceBook);
        console.log('Yeahhhh',priceBookId);

    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }


}