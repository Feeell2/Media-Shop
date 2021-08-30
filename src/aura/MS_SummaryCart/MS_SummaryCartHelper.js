({
    initDo:function(component,event){
        this.getProductsToList(component,event);

    },

    getProductsToList:function(component,event){
              let action = component.get('c.getProductsToCart');
              action.setCallback(this, function(response) {
                let state=response.getState();
                let result = response.getReturnValue();
                if(state==='SUCCESS'){
                    console.log(result.products);
                    component.set('v.list_product',result.products);
                    this.recalculatePrice(component,event);
                }
              })
              $A.enqueueAction(action);
    },

    getProductsFromEvent:function(component,event,helper){
       let list = event.getParam("list_products");
       component.set('v.listProducts',list);
    },

    recalculatePrice:function(component,event){
      let listProducts=component.get('v.list_product');
      console.log(listProducts)
      let price=0;
      console.log(price);
      for(let i=0;i<listProducts.length;i++){
          console.log('price');
          let productPrice=0;

          productPrice=listProducts[i].product.UnitPrice*listProducts[i].quantity;
          price=price+productPrice;
      }
      console.log(price);
      component.set('v.sumPrice',price);
    },

})