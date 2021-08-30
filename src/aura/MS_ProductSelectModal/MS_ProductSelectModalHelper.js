({
        fetchData: function (cmp, fetchData, numberOfRecords) {
            var dataPromise,
                latitude,
                longitude,
                fakerLib = this.mockdataLibrary.getFakerLib();

            fetchData.address = {type : function () {
                return {
                    latitude : fakerLib.address.latitude(),
                    longitude : fakerLib.address.longitude()
                };
            }};

            fetchData.confidence =  { type : function () {
                return Math.random(100);
            }};

            dataPromise = this.mockdataLibrary.lightningMockDataFaker(fetchData, numberOfRecords);
            dataPromise.then(function(results) {
                cmp.set('v.data', results);
            });
        },

        getProductsHelper:function(component,event){
                let getProducts=component.get("c.getProductsToSelect")
                getProducts.setCallback(this,function(response){
                let state=response.getState();
                let result = response.getReturnValue();
                if(state === "SUCCESS") {
                    console.log(result);
                   component.set("v.data",result);
                }
                });
                $A.enqueueAction(getProducts);
        },
        selectProduct:function(component,event){
            console.log('1')
            component.find("productsTable").set('v.selectedRows', component.get('v.selectedProducts'));
            console.log('2')

            console.log('3')

        },
        addToList: function (component,id) {
                const listSelectedProduct=component.get("v.selectedProduct");
                console.log(id);
                if(listSelectedProduct.includes(id)){
                    this.deleteFromSelectedList(component,id);
                }else{
                    listSelectedProduct.push(id);
                    component.set("v.selectedProduct",listSelectedProduct);
                }
                console.log(listSelectedProduct);
        },
        deleteFromSelectedList:function (component,id){
                 let chosenProduct=component.get("v.selectedProduct");
                 for(let index = 0; index < chosenProduct.length; index++) {
                     if(id==chosenProduct[index]){
                         chosenProduct.splice(index,1);
                     }
                 }
                 component.set('v.selectedProduct',chosenProduct);
        },
        addActuallyProductToList:function(component,event){
            console.log('srla')
            let productAllList=component.get("v.listStandardProducts")
            let pricebookProducts=component.get("v.productsToPriceBook")
            console.log(pricebookProducts.length);
            let chosenProduct=component.get("v.selectedProduct");
            for(let index = 0; index < pricebookProducts.length; index++) {
                for(let i = 0; i < productAllList.length; i++) {
                    console.log(productAllList[index].Product2Id);
                    if(pricebookProducts[index].Product2Id === productAllList[i].Product2Id) {
                        console.log('lsraa')
                        let productList = component.get("v.listStandardPriceBook");
                        productAllList[i].selected = !productAllList[i].selected;
                        chosenProduct.push(productAllList[i].Product2Id);
                        component.set('v.selectedProduct',chosenProduct);
                        component.set('v.listStandardPriceBook', productList);
                  }
               }
        }
        },
})