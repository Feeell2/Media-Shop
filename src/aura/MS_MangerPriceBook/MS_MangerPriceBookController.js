({
    init:function(component,event,helper){
        helper.doInit(component,event);
    },
    addPriceBook:function(component,event,helper){
        if(component.get('v.addMode')){
            helper.addPricebookHelper(component,event);
        }else{
            helper.showToast(component,event,"Error", "Choose product to Price Book" ,"error")
        }

    },
    setDiplayPriceBook: function(component, event, helper) {
        let ctarget = event.currentTarget;
        let id_str = ctarget.dataset.value;
        helper.changePriceBook(component, event,id_str);
    },
    handleOpenDialogToDelete : function(component, event, helper) {
        component.set('v.isOpenModal', true);
        component.set('v.editPriceForSelectedProductStep', true);
    },
    handleOpenDialogToEdit : function(component, event, helper) {
            component.set('v.isOpenModal', true);

    },
    handleConfirmDialogYes : function(component, event, helper) {
        helper.deletePriceBookHelper(component,event)
        component.set('v.isOpenModal', false);
    },
    handleConfirmDialogNo : function(component, event, helper) {
        component.set('v.isOpenModal', false);
//        component.set('v.isEditModal', false);
    },
    handleConfirmDialogToUpdate : function(component, event, helper) {
              component.set('v.isOpenModal', false);
              helper.updatePriceBookHelper(component, event);
    },
    handleMoveToToUpdate : function(component, event, helper) {
        component.set('v.editPriceForSelectedProductStep', false);
//        helper.updatePriceBookHelper(component, event);
    },

    confirmUpdatePriceBook:function(component,event,helper){
             helper.updatePriceBookHelper(component, event);
             component.set('v.isOpenAddProductModal', false);
    },

    chooseProductToNewPriceBook: function(component, event, helper) {
          let c = event.currentTarget;
          let id_str = c.dataset.value;
          helper.addToList(component,id_str)

    },

    handleOpenDialogToAdd : function(component, event, helper) {
        component.set('v.isOpenAddProductModal', true);
        let btnCLicket=event.getSource()
        let btnlabel=btnCLicket.get('v.value')
        if(btnlabel=="Add"){
            component.set('v.editPriceForSelectedProductStep',false);
            component.set('v.addMode',true);
            component.set('v.selectedProduct',[]);
            helper.selectAll(component, event,false)
            console.log()
        }else{
            component.set('v.nameToUpdate',component.get('v.nameDisplayedPriceBook'));
            component.set('v.discountToUpdate',component.get('v.discountFromPriceBook'));
            component.set('v.editPriceForSelectedProductStep',true);
        }
    },

    handleChangeEditMode:function(component,event,helper){
        if(component.get('v.editPriceProducts')==true){
            component.set('v.selectedProduct',[]);
        }else{
            helper.addActuallyProductToList(component,event);
        }
    },

    confirmUpdatePrice:function(component,event,helper){
        helper.updatePriceInProductsHelper(component,event);
    },

    handleCloseDialogToAdd : function(component, event, helper) {
        component.set('v.isOpenAddProductModal', false);
    },

    handleCloseDialogToEdit : function(component, event, helper) {
         component.set('v.isOpenAddProductModal', false);
         component.set('v.editPriceProducts', false);
         component.set('v.isSelectAll', false);
    },

    handleCheckAllRecord : function(component, event, helper) {
        if(component.get('v.isSelectAll')==true){
            helper.selectAll(component, event,true)
        }else{
            helper.selectAll(component, event,false);
            helper.addActuallyProductToList(component,event);
        }

    },


})