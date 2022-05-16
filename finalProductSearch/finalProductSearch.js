import { LightningElement,api } from 'lwc';
import getPriceBooks from '@salesforce/apex/fetchPricebookValue.getPriceBooks';
import getProducts from '@salesforce/apex/fetchPricebookValue.getProducts';
import insertOrder from '@salesforce/apex/fetchPricebookValue.insertOrder';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class FinalProductSearch extends LightningElement {
    pbOptions;
    allProducts;
    displayProd;
    showSpinner;
    showProds;
    cartProds = [];
    cartProdIds = [];
    total = 0;
    showCart = false;
    search;
    @api recordId;
    product2=[];

    connectedCallback(){
        //super();
        // to get price book records--
        getPriceBooks()
            .then(result => {
                if(result){
                    let options = [];
                    for(let i = 0; i < result.length; i++){
                        options.push({label: result[i].Name, value: result[i].Id});
                    }
                    if(options){
                        this.pbOptions = options;
                        this.showSpinner = false;
                        this.showProds = true;
                    }
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
    // to get products--
    
    pbOnChange(event){
        this.showSpinner = true;
        getProducts({priceBookId:event.detail.value})
            .then(result => {
                if(result){
                    this.allProducts = result;
                    //Check if product already present in cart or not
                    if(this.cartProds && this.cartProds.length > 0){
                        for(let i = 0; i < this.result.length; i++){
                            if(!this.cartProdIds.includes(result[i].Product2Id)){
                                this.displayProd.push(result[i]);
                            }
                        }
                    }
                    else{
                        this.displayProd = result;
                    }
                    this.showSpinner = false;
                }
            })
            .catch(error => {
                console.error("error>>> ",error);
        });
    }

    searchProdcuts(event){
        this.showSpinner = true;
        let search = event.detail.value;
        this.search = search;
        console.log('search--',search);
        this.searchProds(search);
        
    }

    searchProds(search){
        console.log("inside search-- ",search);
        let allProds = this.allProducts;
        let displayProd = [];
        let cartProds = this.cartProds;
        for(let i = 0; i < allProds.length; i++){
            if(allProds[i].Product2.Name.toLowerCase().startsWith(search.toLowerCase())){
                console.log("inside search prods>> ",allProds[i].Product2);
                if(cartProds){
                    if(!this.cartProdIds.includes(allProds[i].Product2Id)){
                        console.log("product not in cart so add to disp");
                        displayProd.push(allProds[i]);
                    }
                }
                else{
                    displayProd.push(allProds[i]);
                }
            }
        }
        if(displayProd.length == 0){
            this.showProds = false;
        }
        else{
            this.displayProd = displayProd;
            this.showProds = true;
        }
        this.showSpinner = false;
    }
    addToCart(event){
        let displayProd = [];
        let allProds = [];
        this.showSpinner = true;
        for(let i = 0; i < this.displayProd.length; i++){
            if(event.currentTarget.dataset.id == this.displayProd[i].Product2Id){
                console.log(">>> ",this.displayProd[i].Quantity);
                let obj = {};
                obj.Quantity = 1;
                let merged = {...obj, ...this.displayProd[i]};
                this.cartProds.push(merged);

                this.cartProdIds.push(this.displayProd[i].Product2Id);
                this.total = this.total + (this.displayProd[i].UnitPrice);
            }
            else{
                displayProd.push(this.displayProd[i]);
            }
        }
        this.displayProd = displayProd;
        this.showCart = true;
        this.showSpinner = false;
    }
    deleteFromCart(event){
        let cartProds = [];
        let cartProdId= [];
        //let allProds  = this.allProducts;
        let addToDisp = false;
        this.showSpinner = true;
        for(let i = 0; i < this.cartProds.length; i++){
            if(event.currentTarget.dataset.id == this.cartProds[i].Product2Id){
                let quant = this.cartProds[i].Quantity;
                this.total = this.total - (this.cartProds[i].UnitPrice * quant );
                if(this.search && this.cartProds[i].Product2.Name.toLowerCase().startsWith(this.search.toLowerCase())){
                    addToDisp = true;
                }
            }
            else{
                cartProds.push(this.cartProds[i]);
                cartProdId.push(this.cartProds[i].Product2Id);
            }
        }
        this.cartProds = cartProds; this.cartProdIds= cartProdId;
        if(addToDisp){
            console.log("inside searching from delting ",this.allProducts);
            console.log("updated cart after del>> ",this.cartProds);
            this.searchProds(this.search);
        }
        else{
            let allProds = this.allProducts;
            let displayProd=[];
            for(let i = 0; i < allProds.length; i++){
                if(cartProds){
                    if(!this.cartProdIds.includes(allProds[i].Product2Id)){
                        console.log("product not in cart so add to disp");
                        displayProd.push(allProds[i]);
                    }
                }
                else{
                    displayProd.push(allProds[i]);
                }
            }
            this.displayProd = displayProd;
            if(displayProd.length == 0){
                this.showProds = false;
            }
            else{
                this.displayProd = displayProd;
                this.showProds = true;
            }
        }
        this.showSpinner = false;
    }
    updateQuantity(event){
        console.log("onclick!!", this.cartProds);
        let cartProd = this.cartProds;
        for(let i = 0; i < cartProd.length; i++){
            if(event.currentTarget.dataset.id == cartProd[i].Product2Id){
                console.log("kk--",cartProd[i].Quantity);
                this.total = this.total + (cartProd[i].UnitPrice * (event.detail.value - cartProd[i].Quantity));
                console.log('total',this.total);
                cartProd[i].Quantity = event.detail.value;
                
            }
        }
        this.cartProds = cartProd;
    }

    placeOrder(){
        console.table(this.cartProds);
        console.log("check accountID---",this.recordId);
        let cartPrd = this.cartProds;
        
        for(let i = 0; i < cartPrd.length; i++){
                console.log("productID--",cartPrd[i].Product2Id);
                 this.product2.push(cartPrd[i].Product2Id);
        }
       console.log('product2--',this.product2);
     
       
        
       // to place an order
    
       insertOrder({accountId: this.recordId, product2: this.product2})
            .then(result => {
                if(result){
                    console.log('order placed--',result);
                    const event = new ShowToastEvent({
                        title: 'Order Placed',
                        message: 'Order Placed',
                        variant: 'success'
                    });
                    this.dispatchEvent(event);
                }
            })
            .catch(error => {
                console.error("error>>> ",error);
        });

      
   }
}