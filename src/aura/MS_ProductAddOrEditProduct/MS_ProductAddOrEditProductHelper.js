({
      executeQuery : function(component,event, action) {
            let nameProduct = component.get("v.name");
            if(nameProduct==""){
                 this.showToast(component,event,"Error","Name field is required","error");
            }
            action.setParams({
                name: nameProduct,
                brand: component.get("v.brand"),
                model: component.get("v.model"),
                color: component.get("v.color"),
                productCode: component.get("v.productCode"),
                cost: component.get("v.cost"),
                currentInventory: component.get("v.currentInventory"),
                installment: component.get("v.installment"),
                active: component.get("v.active"),
                description: component.get("v.description")
            });
            action.setCallback(this, function(response) {
                let state = response.getState();
                let result = response.getReturnValue();
                console.log(result)
                if(state === "SUCCESS") {
                    component.set("v.idProduct",JSON.parse(JSON.stringify(result.listProduct.Id)));
                    component.set("v.isAddPhoto",false);
                }else {
                    let messageWrong="No product added"
                    this.showToast(component,event,"Error",messageWrong,"error");
                }
            });
            $A.enqueueAction(action);
        },
         handleCancelUpload : function(component,event,recordId){
        //get all uploaded Files
                var uploadedFiles = component.get("v.uploadedFiles");
                var uploadedFileIdArr = [];
                if(uploadedFiles != null && uploadedFiles != undefined && uploadedFiles.length > 0){
                    [].forEach.call(uploadedFiles, function(file) {
                        //get all uploaded File Ids in an Array
                        uploadedFileIdArr.push(file.Id);
                    });
                }

                //get sObject record Id
                let sObjectId = component.get("v.sObjectId");
                let sObjectName = component.get("v.sObjectName");

        //controller method to delete all uploaded Files on Cancel
//               this.deletePhotoMethod(component,event,uploadedFileIdArr,recordId)
               component.set("v.isModalOpen", false);
               component.set("v.isAddPhoto",true);
            },

        showToast : function(component, event, title,message,typeToast) {
            const toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": title,
                "message": message,
                "type": typeToast
            });
            toastEvent.fire();
        },
        handleUploadFinished : function(component, event,recordId) {
            const uploadedFileArr = [];
            const sObjectAttachedFiles = component.get("v.sObjectAttachedFiles");
            const sObjectAttachedFilesArr = [];
            if(sObjectAttachedFiles != null && sObjectAttachedFiles != undefined && sObjectAttachedFiles.length > 0){
                [].forEach.call(sObjectAttachedFiles, function(file) {
                    //get all attached files on sObject in an Array
                    console.log(file+"1");
                    sObjectAttachedFilesArr.push({'Id' : file.Id,
                                                  'Title': file.Title});
                });
            }
            const uploadedFiles = event.getParam("files");
            [].forEach.call(uploadedFiles, function(file) {
                console.log(file);
                uploadedFileArr.push({'Id' : file.contentVersionId,
                                      'Name': file.name});
                sObjectAttachedFilesArr.push({'Id' : file.contentVersionId,
                                              'Title': file.name});
            });
            component.set("v.sObjectAttachedFiles", sObjectAttachedFilesArr);
            const filesUploadedPreviously = component.get('v.uploadedFiles');
            if(filesUploadedPreviously != null && filesUploadedPreviously != undefined && filesUploadedPreviously.length > 0){
                [].forEach.call(filesUploadedPreviously, function(file) {
                       console.log(file+"3");
                    uploadedFileArr.push({'Id' : file.Id,
                                          'Name': file.Name});
                });
            }
            component.set("v.uploadedFiles",uploadedFileArr);
            this.getAllPhotos(component,event,recordId);
        },

        setProfilePhoto:function (component, event,element,id,isDelete) {
            console.log("213")
         let listToDelete=component.get("v.isDeletePhotos");
          if(isDelete==false){
               component.set("v.idProfilePhoto",id);
          }else{
              listToDelete.push(id);
          }
          element.classList.add("selected");

        },

        unsetProfilePhoto:function (component, event,element,id) {
          component.set("v.idProfilePhoto","");
          element.classList.remove("selected");
        },

        toggleProfilePhoto:function (component, event,element,id_str) {
            let photoProfileId=component.get("v.idProfilePhoto");
            let isDeleted=component.get("v.idPhotoToDelete");

            if(element.classList.contains('selected')&&(id_str==photoProfileId||isDeleted==true)){
                this.unsetProfilePhoto(component, event,element,id_str)
            }else if(photoProfileId=="") {
                this.setProfilePhoto(component, event,element,id_str,isDeleted);
            }
        },

        addPhotos: function(component,event,action){
            var appEvent = $A.get("e.c:MS_ProductRefreshSlider");
             action.setParams({
                "photoId":component.get("v.idProfilePhoto"),
                "productId": component.get("v.idProduct")
             });
             if(component.get("v.idProfilePhoto")!=""){
                 action.setCallback(this, function(response) {
                    let state = response.getState();
                    let result = response.getReturnValue();
                    if(state === "SUCCESS") {
                       let message ="Product "+component.get("v.name") +" added"
                       component.set("v.isModalOpen", false);
                       appEvent.fire();
                       $A.get('e.force:refreshView').fire();
                       component.find("overlayLib").notifyClose();
                       this.showToast(component,event,"Success",message,"success");
                    }else {
                        let messageWrong="No product added"
                        this.showToast(component,event,"Error",messageWrong,"error");
                    }
                 });
                 $A.enqueueAction(action);
             }
             else{
                 this.showToast(component,event,"Error","Product must contain a photo and a selected profile photo ","error");
             }

        },
        getProductHelper:function (component,event,recordId){
            let getProductMethod = component.get("c.getProduct");
            getProductMethod.setParams({
                "id":recordId,
            })
            getProductMethod.setCallback(this, function(response) {
                let state = response.getState();
                let result = response.getReturnValue();
                console.log(result)
                    if(state === "SUCCESS"){
                      component.set("v.name",result.Name),
                      component.set("v.brand",result.brand__c),
                      component.set("v.model",result.model__c),
                      component.set("v.color",result.color__c),
                      component.set("v.productCode",result.ProductCode),
                      component.set("v.cost",result.Cost__c),
                      component.set("v.currentInventory",result.current_Inventory__c),
                      component.set("v.installment",result.is_available_installments__c),
                      component.set("v.active",result.IsActive),
                      component.set("v.description",result.Description)
                    }
            })
            $A.enqueueAction(getProductMethod);
        },
         updateRecord : function(component,event,recordId ) {
               const action = component.get("c.updateProduct");
                    let nameProduct = component.get("v.name");
                    if(nameProduct==""){
                         this.showToast(component,event,"Error","Name field is required","error");
                    }
                    action.setParams({
                        productId:recordId,
                        name: nameProduct,
                        brand: component.get("v.brand"),
                        model: component.get("v.model"),
                        color: component.get("v.color"),
                        productCode: component.get("v.productCode"),
                        cost: component.get("v.cost"),
                        currentInventory: component.get("v.currentInventory"),
                        installment: component.get("v.installment"),
//                        active: component.get("v.active"),
                        description: component.get("v.description")
                    });
                    action.setCallback(this, function(response) {
                        let state = response.getState();
                        let result = response.getReturnValue();
                        console.log(result)
                        if(state === "SUCCESS") {
                            component.set("v.idProduct",JSON.parse(JSON.stringify(result.listProduct.Id)));
                            component.set("v.isAddPhoto",false);
                        this.getAllPhotos(component,event,recordId);

                        } else {
                            let messageWrong="No product added"
                            this.showToast(component,event,"Error",messageWrong,"error");
                        }
                    });
                    $A.enqueueAction(action);
                },
                getAllPhotos:function (component,event,recordId){
                let action = component.get("c.getAllFilesOnsObjectRecord");
                    action.setParams({
                        sObjectId : recordId,
                    });
                action.setCallback(this, function(response){
                    let state = response.getState();
                    if(state === "SUCCESS"){
                        var existingFilesArr = response.getReturnValue();
                        console.log(existingFilesArr)
                        if(existingFilesArr != null && existingFilesArr != undefined && existingFilesArr.length > 0){
                            component.set("v.sObjectAttachedFiles", existingFilesArr);
                        }
                    }
                });
                this.getProfilePhoto(component,event,recordId);
                      $A.enqueueAction(action);
                      },

                getProfilePhoto:function(component,event,recordId){
                    let action = component.get("c.getProfilePhoto");
                        action.setParams({
                            productId : recordId,
                        })
                    action.setCallback(this, function(response){
                        let state = response.getState();
                        if(state === "SUCCESS"){
                            let profilePhotoUrl = response.getReturnValue();
                            console.log(profilePhotoUrl);
                            component.set("v.profilePhoto", profilePhotoUrl);
                        }
                    });
                $A.enqueueAction(action);
                },

                deletePhotoMethod:function(component,event,ids,recordId){
                    console.log('delete')
                    console.log(ids)
                    console.log(recordId)

                     var action = component.get("c.deleteFiles");
                         action.setParams({
                             filesIdArrStr : JSON.stringify(ids)
                         });
                         action.setCallback(this, function(response){
                             var state = response.getState();
                             console.log(state)
                             if(state === "SUCCESS"){
                                this.getAllPhotos(component,event,recordId)
                             }
                             //helper method for navigation
//                             this.navigateToRecordDetailPage(component, sObjectId, sObjectName);
                         });
                         $A.enqueueAction(action);
                },


})