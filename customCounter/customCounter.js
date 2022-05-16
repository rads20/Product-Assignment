import { LightningElement, api } from 'lwc';

export default class CustomCounter extends LightningElement {
    
    qty = 0;
    qtyVal = '';

    setDecrementCounter(event) {
        if(this.qty == 0)   this.qty = 0;
        else    this.qty = this.qty - 1;
        let quantity = this.qty.toString();
        this.qtyVal = quantity + ' ' + this.qtyMeasure;
        const decrementEvent = new CustomEvent(
                                 'decrement', 
                                 { detail: this.qty }
                               );
        this.dispatchEvent(decrementEvent);
    }

    setIncrementCounter(event) {
        this.qty = this.qty + 1;
        let quantity = this.qty.toString();
        this.qtyVal = quantity + ' ' + this.qtyMeasure;
        const incrementEvent = new CustomEvent(
                                  'increment', 
                                  { detail: this.qty }
                               );
        this.dispatchEvent(incrementEvent);
    }

    @api 
    get qtyMeasure() {
        return this._qtyMeasure;
    }

    set qtyMeasure(value) {
        if (value) {
            this._qtyMeasure = value;
            let qty = this.qty.toString();
            this.qtyVal = qty + ' ' + this.qtyMeasure;
        }else{
            this.qtyVal = '';
        }
    }
}