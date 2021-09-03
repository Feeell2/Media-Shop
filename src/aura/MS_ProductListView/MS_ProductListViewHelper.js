({
//    executeQuery : function(component,event, action) {
//        let nameProduct = component.get("v.name");
//        if(nameProduct==""){
//             this.showToast(component,event,"Error","Name field is required","error");
//        }
//        console.log(component.get("v.model"))
//        action.setParams({
//            name: nameProduct,
//            brand: component.get("v.brand"),
//            model: component.get("v.model"),
//            color: component.get("v.color"),
//            productCode: component.get("v.productCode"),
//            cost: component.get("v.cost"),
//            currentInventory: component.get("v.currentInventory"),
//            installment: component.get("v.installment"),
//            active: component.get("v.active"),
//            description: component.get("v.description")
//        });
//        action.setCallback(this, function(response) {
//            let state = response.getState();
//            let result = response.getReturnValue();
//            if(state === "SUCCESS") {
//                component.set("v.idProduct",JSON.parse(JSON.stringify(result.listProduct.Id)));
//                component.set("v.isAddPhoto",false);
//            }else {
//                let messageWrong="No product added"
//                this.showToast(component,event,"Error",messageWrong,"error");
//            }
//        });
//        $A.enqueueAction(action);
//    },
//     handleCancelUpload : function(component){
//    //get all uploaded Files
//            var uploadedFiles = component.get("v.uploadedFiles");
//            var uploadedFileIdArr = [];
//            if(uploadedFiles != null && uploadedFiles != undefined && uploadedFiles.length > 0){
//                [].forEach.call(uploadedFiles, function(file) {
//                    //get all uploaded File Ids in an Array
//                    uploadedFileIdArr.push(file.Id);
//                });
//            }
//
//            //get sObject record Id
//            var sObjectId = component.get("v.sObjectId");
//            var sObjectName = component.get("v.sObjectName");
//
//    //controller method to delete all uploaded Files on Cancel
//            var action = component.get("c.deleteFiles");
//            action.setParams({
//                filesIdArrStr : JSON.stringify(uploadedFileIdArr)
//            });
//
//            action.setCallback(this, function(response){
//                var state = response.getState();
//                  component.set("v.isModalOpen", false);
//                  component.set("v.isAddPhoto",true);
//                    $A.get('e.force:refreshView').fire();
//                //helper method for navigation
//                this.navigateToRecordDetailPage(component, sObjectId, sObjectName);
//            });
//            $A.enqueueAction(action);
//        },
//
//    showToast : function(component, event, title,message,typeToast) {
//        const toastEvent = $A.get("e.force:showToast");
//        toastEvent.setParams({
//            "title": title,
//            "message": message,
//            "type": typeToast
//        });
//        toastEvent.fire();
//    },
//    handleUploadFinished : function(component, event) {
//        const uploadedFileArr = [];
//        const sObjectAttachedFiles = component.get("v.sObjectAttachedFiles");
//        const sObjectAttachedFilesArr = [];
//        if(sObjectAttachedFiles != null && sObjectAttachedFiles != undefined && sObjectAttachedFiles.length > 0){
//            [].forEach.call(sObjectAttachedFiles, function(file) {
//                //get all attached files on sObject in an Array
//                sObjectAttachedFilesArr.push({'Id' : file.Id,
//                                              'Title': file.Title});
//            });
//        }
//        const uploadedFiles = event.getParam("files");
//        [].forEach.call(uploadedFiles, function(file) {
//            uploadedFileArr.push({'Id' : file.contentVersionId,
//                                  'Name': file.name});
//            sObjectAttachedFilesArr.push({'Id' : file.contentVersionId,
//                                          'Title': file.name});
//        });
//        component.set("v.sObjectAttachedFiles", sObjectAttachedFilesArr);
//        const filesUploadedPreviously = component.get('v.uploadedFiles');
//        if(filesUploadedPreviously != null && filesUploadedPreviously != undefined && filesUploadedPreviously.length > 0){
//            [].forEach.call(filesUploadedPreviously, function(file) {
//                uploadedFileArr.push({'Id' : file.Id,
//                                      'Name': file.Name});
//            });
//        }
//        component.set("v.uploadedFiles",uploadedFileArr);
//    },
//    setProfilePhoto:function (component, event,element,id) {
//      component.set("v.idProfilePhoto",id);
//      element.classList.add("selected");
//    },
//    unsetProfilePhoto:function (component, event,element,id) {
//      component.set("v.idProfilePhoto","");
//      element.classList.remove("selected");
//    },
//    toggleProfilePhoto:function (component, event,document,id_str) {
//        let photoProfileId=component.get("v.idProfilePhoto");
//        if(document.classList.contains('selected')&&id_str==photoProfileId){
//            this.unsetProfilePhoto(component, event,document,id_str)
//        }else if(photoProfileId===""){
//            this.setProfilePhoto(component, event,document,id_str);
//        }
//    },
//    addPhotos: function(component,event,action){
//         action.setParams({
//            "photoId":component.get("v.idProfilePhoto"),
//            "productId": component.get("v.idProduct")
//         });
//         if(component.get("v.idProfilePhoto")!=""){
//             action.setCallback(this, function(response) {
//                let state = response.getState();
//                let result = response.getReturnValue();
//                if(state === "SUCCESS") {
//                   let message ="Product "+component.get("v.name") +" added"
//                   component.set("v.isModalOpen", false);
//                   $A.get('e.force:refreshView').fire();
//                   this.showToast(component,event,"Success",message,"success");
//                }else {
//                    let messageWrong="No product added"
//                    this.showToast(component,event,"Error",messageWrong,"error");
//                }
//             });
//             $A.enqueueAction(action);
//         }
//         else{
//             this.showToast(component,event,"Error","Product must contain a photo and a selected profile photo ","error");
//         }
//
//    }

})