({
        init: function (cmp, event, helper) {
//            cmp.set('v.columns', [
//                {label: 'Name', fieldName: 'name', type: 'text'},
//                {label: 'Brand', fieldName: 'brand', type: 'text'},
//                {label: 'Price', fieldName: 'unitPrice', type: 'currency'},
//                {label: 'Modal', fieldName: 'model', type: 'text'}
//            ]);
            cmp.set('v.isOpenAddProductModal', true);
            if(cmp.get("v.updateMode")){
                  helper.addActuallyProductToList(cmp, event);
                  console.log('dziala')

            }

//            cmp.set('v.selectedRowsList', cmp.get('v.selectedProducts'));
        },

        updateSelectedText: function (cmp, event) {
            var selectedRows = event.getParam('selectedRows');
            console.log(selectedRows)
            cmp.set('v.selectedRowsCount', selectedRows.length);
        },

//        handleOpenDialogToAdd : function(component, event, helper) {
//
//            component.set('v.isOpenAddProductModal', true);
////            component.find("productsTable").set('v.selectedRowsList', component.get('v.selectedProducts'))
//            helper.selectProduct(component,event);
//        },

        handleCloseDialogToAdd : function(component, event, helper) {
            component.set('v.isOpenAddProductModal', false);
            let a=component.get('v.selectedProducts')
            let b=component.get('v.listStandardProducts')
            let c=component.get('v.productsToPriceBook')
            console.log(a)
            console.log(b)
            console.log(c)
        },
        chooseProductToNewPriceBook: function(component, event, helper) {
                    let c = event.currentTarget;
                    let id_str = c.dataset.value;
                    helper.addToList(component,id_str)
        },
})