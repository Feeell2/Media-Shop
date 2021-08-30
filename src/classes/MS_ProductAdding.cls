public with sharing class MS_ProductAdding {
    @AuraEnabled
    public static ResponseAddProduct addProduct(String name, String brand, String model, String productCode, String cost, String currentInventory, String description, Boolean active, Boolean installment, String color) {
        ResponseAddProduct responseAddProduct = new ResponseAddProduct();
        List<Product2> productList = new List<Product2>();
        try {
            Pricebook2 pricebook = [SELECT Id FROM Pricebook2 WHERE isStandard = true LIMIT 1];
            PricebookEntry pricebookEntry = new PricebookEntry();

            Product2 product = New Product2();
            product.Name = name;
            product.brand__c = brand;
            product.model__c = model;
            product.ProductCode = productCode;
//            String costString = (Decimal.valueOf(cost == null || cost.trim() == '' ? '0' : cost).setScale(2) + 0.001).format();
//            product.Cost__c = Decimal.valueOf(costString.substring(0, costString.length() - 1));
            product.current_Inventory__c = Decimal.valueOf(currentInventory);
            product.Description = description;
            product.color__c = color;
            product.IsActive = active;
            product.is_available_installments__c = installment;
            insert product;
            Product2 newProduct2 = [SELECT Id,Name,CreatedDate,model__c FROM Product2 WHERE Name = :name AND model__c = :model ORDER BY CreatedDate DESC LIMIT 1];
            pricebookEntry.Product2Id = newProduct2.id;
            pricebookEntry.Pricebook2Id = pricebook.id;
            pricebookEntry.UnitPrice = Decimal.valueOf(cost);
//            pricebookEntry.UseStandardPrice=true;
            pricebookEntry.IsActive = true;

            insert pricebookEntry;
            responseAddProduct.state = 'Success';
            responseAddProduct.message = 'Add Product';
            responseAddProduct.listProduct = newProduct2;
        } catch (DmlException e) {
            responseAddProduct.state = 'Error';
            responseAddProduct.message = e.getMessage();
        }
        return responseAddProduct;
    }
    @AuraEnabled
    public static List<ContentDocument> getAllFilesOnsObjectRecord(Id sObjectId) {
        List<ContentDocument> contentDocumentListToReturn = new List<ContentDocument>();
        List<ContentDocumentLink> contentDocLinkOnsObjectList = new List<ContentDocumentLink>();

//query for the ContentDocumentLink for provided sObject ID
        contentDocLinkOnsObjectList = [Select id, ContentDocumentId, LinkedEntityId From ContentDocumentLink Where LinkedEntityId = :sObjectId];
        Set<Id> contentDocIdSet = new Set<Id>();

//check if the ContentDocumentLinks for provided sObject Id is found
        if (contentDocLinkOnsObjectList != null && !contentDocLinkOnsObjectList.isEmpty()) {
            for (ContentDocumentLink conDocLink : contentDocLinkOnsObjectList) {
                //get contentDocument Ids from the ContentDocumentLinks found on the sObject record
                contentDocIdSet.add(conDocLink.ContentDocumentId);
            }
        }

//check contentDocumentIds Set is not empty
        if (contentDocIdSet != null && !contentDocIdSet.isEmpty()) {
//get all ContentDocuments on the sObject record
            contentDocumentListToReturn = [Select id, Title,LatestPublishedVersionId From ContentDocument Where ID IN :contentDocIdSet];
        }

//check if the contentDocument List that needs to be returned is not Empty
        if (contentDocumentListToReturn != null && !contentDocumentListToReturn.isEmpty()) {
            return contentDocumentListToReturn;
        } else {
            return null;
        }
    }

    @AuraEnabled
    public static void deleteFiles(String filesIdArrStr) {
        List<ContentDocument> contentDocumentToDelete = new List<ContentDocument>();
        Set<Id> filesIdSet = new Set<Id>();

//check if the JSON formatted String of ContentDocument Ids is not Blank
        if (filesIdArrStr != null && filesIdArrStr != '') {
//get all ContentDocument Ids in a set
            filesIdSet = (Set<Id>) JSON.deserialize(filesIdArrStr, Set<Id>.class);
        }
        //check if the ContentDocument Ids set is not empty
        if (filesIdSet != null && !filesIdSet.isEmpty()) {

//query to get all ContentDocument that needs to be deleted
            contentDocumentToDelete = [Select id,LatestPublishedVersionId From ContentDocument Where LatestPublishedVersionId IN :filesIdSet];
            if (contentDocumentToDelete != null && !contentDocumentToDelete.isEmpty()) {
                try {
                    delete contentDocumentToDelete;
                } catch (Exception ex) {
                    System.debug('Exception--' + ex.getMessage());
                }
            }
        }
    }
    @AuraEnabled
    public static ResponseAddProduct addProfilePhoto(String photoId, String productId) {
        ResponseAddProduct responseAddProduct = new ResponseAddProduct();
        try {
            Product2 product2 = [SELECT Id,Photo_Id__c FROM Product2 WHERE Id = :productId];
            product2.Photo_Id__c = photoId;
            update product2;
            responseAddProduct.state = 'Success';
            responseAddProduct.message = 'Add Product';
            responseAddProduct.listProduct = product2;
        } catch (DmlException e) {
            responseAddProduct.state = 'Error';
            responseAddProduct.message = e.getMessage();
        }
        return ResponseAddProduct;
    }


    @AuraEnabled
    public static List<ContentVersion> getProductPhotos(String productId) {
        List<ContentDocument> contentDocuments = getAllFilesOnsObjectRecord(productId);
        Set<String> documentsId = new Set<String>();
        List<ContentVersion> photosId = new List<ContentVersion>();
        for (ContentDocument contentDocument : contentDocuments) {
            documentsId.add(contentDocument.id);
        }
        photosId = [Select Id,ContentDocumentId from ContentVersion Where ContentDocumentId IN:documentsId];
        return photosId;
    }

    @AuraEnabled
    public static String getProfilePhoto(String productId) {
        Product2 product2 = [SELECT Id,Photo_Id__c FROM Product2 WHERE Id = :productId];
        return product2.Photo_Id__c;
    }

    @AuraEnabled
    public static List<PricebookEntry> getProducts() {

        List<PricebookEntry> searchedProducts = new List<PricebookEntry>();
        Pricebook2 pricebookStandard = [SELECT Id FROM Pricebook2 WHERE isStandard = true LIMIT 1];
        searchedProducts = [SELECT Id,Product2.Name, Product2.brand__c, Product2.model__c, UnitPrice, Product2.is_available_installments__c,Product2.color__c, Product2.Photo_Id__c, Product2.current_Inventory__c, Product2.Category__c FROM PricebookEntry WHERE Pricebook2Id = :pricebookStandard.id];
        return searchedProducts;
    }
    @AuraEnabled
    public static List<ResponseProducts> getProductsToSelect() {
        List<ResponseProducts> responseProducts = new List<ResponseProducts>();
        List<PricebookEntry> searchedProducts = new List<PricebookEntry>();
        searchedProducts = getProducts();
        for (PricebookEntry pricebookEntry : searchedProducts) {
            ResponseProducts newResponseProduct = new ResponseProducts();
            newResponseProduct.productId = pricebookEntry.Product2Id;
            newResponseProduct.name = pricebookEntry.Product2.Name;
            newResponseProduct.brand = pricebookEntry.Product2.brand__c;
            newResponseProduct.model = pricebookEntry.Product2.model__c;
            newResponseProduct.unitPrice = pricebookEntry.UnitPrice;
            responseProducts.add(newResponseProduct);
        }
        return responseProducts;
    }

    @AuraEnabled
    public static List<PricebookEntry> getProductsToPriceBook(String idPriceBook) {
        List<PricebookEntry> searchedProducts = new List<PricebookEntry>();
        searchedProducts = [SELECT Id,Percentage_of_the_price__c,Pricebook2Id,Product2.Name, Product2.brand__c, Product2.model__c, UnitPrice, Product2.is_available_installments__c,Product2.color__c, Product2.Photo_Id__c, Product2.current_Inventory__c, Product2.Category__c FROM PricebookEntry WHERE Pricebook2Id = :idPriceBook];
        return searchedProducts;
    }

    @AuraEnabled
    public static List<PriceBook2> getListOfPriceBooks() {
        List<PriceBook2> searchedPriceBooks = new List<PriceBook2>();
        searchedPriceBooks = [SELECT Id,Name,isStandard,Description,discount__c,IsActive FROM Pricebook2];
        return searchedPriceBooks;
    }

    @AuraEnabled
    public static Product2 getProduct(String id) {
        Product2 searchedProducts = new Product2();
        searchedProducts = [SELECT Name, brand__c, model__c, Cost__c, is_available_installments__c,color__c,id,Photo_Id__c, current_Inventory__c, Category__c FROM Product2 Where id = :id];
        return searchedProducts;
    }

    @AuraEnabled
    public static ResponsePriceProduct deletePriceBooks(String id) {
        ResponsePriceProduct responsePriceProduct = new ResponsePriceProduct();
        try {
            Pricebook2 pricebook = new Pricebook2();
            pricebook = [SELECT Id FROM Pricebook2 WHERE Id = :id];
            delete pricebook;
            responsePriceProduct.state = 'Success';
            responsePriceProduct.message = 'Delete PriceBook';
        } catch (DmlException e) {
            responsePriceProduct.state = 'Error';
            responsePriceProduct.message = e.getMessage();
        }
        return responsePriceProduct;
    }

    @AuraEnabled
    public static ResponsePriceProduct addPriceBookApex(String name, String discount, String description, String idProductsToCreate) {
        ResponsePriceProduct responsePriceProduct = new ResponsePriceProduct();
        List<PricebookEntry> pricebookEntries = new List<PricebookEntry>();
        List<String> ids = (List<String>) JSON.deserialize(idProductsToCreate, List<String>.class);
        List<PricebookEntry> newPricebookEntries = new List<PricebookEntry>();
        Map<String, PricebookEntry> mapStandardPricebookEntries = new Map<String, PricebookEntry>();
        Decimal partOfPrice = Decimal.valueOf(discount);
        System.debug('to tutaj' + ids.get(0));
        try {
            Pricebook2 pricebook = new Pricebook2();
            pricebook.discount__c = Decimal.valueOf(discount);
            pricebook.name = name;
            pricebook.description = description;
            pricebook.IsActive = true;
            insert pricebook;
            responsePriceProduct.message = 'created Price Book';
            responsePriceProduct.state = 'Success';
            Pricebook2 newPricebook = [SELECT Id,Name,CreatedDate FROM Pricebook2 WHERE Name = :name ORDER BY CreatedDate DESC LIMIT 1];
            responsePriceProduct.pricebook = newPricebook;
            pricebookEntries = getProducts();
            for (PricebookEntry standardPricebookEntry : pricebookEntries) {
                mapStandardPricebookEntries.put(standardPricebookEntry.Product2Id, standardPricebookEntry);
            }
            if (String.isEmpty(idProductsToCreate)) {
                for (PricebookEntry standardPricebookEntry : pricebookEntries) {
                    PricebookEntry newPricebookEntry = new PricebookEntry();
                    newPricebookEntry.Product2Id = standardPricebookEntry.Product2Id;
                    newPricebookEntry.Pricebook2Id = newPricebook.Id;
                    newPricebookEntry.Percentage_of_the_price__c = partOfPrice;
                    newPricebookEntry.UnitPrice = (standardPricebookEntry.UnitPrice * partOfPrice) / 100;
                    newPricebookEntry.IsActive = true;
                    newPricebookEntries.add(newPricebookEntry);
                }
            } else {
                List<PricebookEntry> selectedPricebookEntries = new List<PricebookEntry>();

                for (String idProduct : ids) {
                    if (mapStandardPricebookEntries.get(idProduct) != null) {
                        PricebookEntry newPricebookEntry = new PricebookEntry();
                        newPricebookEntry.Product2Id = idProduct;
                        newPricebookEntry.Pricebook2Id = newPricebook.Id;
                        newPricebookEntry.Percentage_of_the_price__c = partOfPrice;
                        newPricebookEntry.UnitPrice = (mapStandardPricebookEntries.get(idProduct).UnitPrice * partOfPrice) / 100;
                        newPricebookEntry.IsActive = true;
                        newPricebookEntries.add(newPricebookEntry);
                    }
                }
            }
            insert newPricebookEntries;
        } catch (DmlException e) {
            responsePriceProduct.message = e.getMessage();
            responsePriceProduct.state = 'Error';
        }

//        searchedProducts = [SELECT Name, brand__c, model__c, Cost__c, is_available_installments__c,color__c,id,Photo_Id__c, current_Inventory__c, Category__c FROM Product2 Where id = :id];
        return responsePriceProduct;
    }
    @AuraEnabled
    public static ResponsePriceProduct updatePriceBookApex(String id, String name, String discount, String description, String idProductsToCreate) {
        ResponsePriceProduct responsePriceProduct = new ResponsePriceProduct();
        List<PricebookEntry> standardPricebookEntries = new List<PricebookEntry>();
        List<PricebookEntry> existingPricebookEntries = new List<PricebookEntry>();
        Set<String> ids = (Set<String>) JSON.deserialize(idProductsToCreate, Set<String>.class);
        Map<String, PricebookEntry> mapStandardPricebookEntries = new Map<String, PricebookEntry>();
        Map<String, PricebookEntry> mapExistingPricebookEntries = new Map<String, PricebookEntry>();
        System.debug(ids);
        Decimal partOfPrice = Decimal.valueOf(discount);
        try {
            Pricebook2 pricebook = new Pricebook2();
            pricebook = [SELECT Id,Name,discount__c,Description FROM Pricebook2 WHERE Id = :id];
            pricebook.discount__c = partOfPrice;
            pricebook.name = name;
            pricebook.description = description;
            pricebook.IsActive = true;
            update pricebook;
            responsePriceProduct.message = 'created Price Book';
            responsePriceProduct.state = 'Success';
            responsePriceProduct.pricebook = pricebook;
//            if (pricebook.discount__c != partOfPrice) {
            standardPricebookEntries = getProducts();
            for (PricebookEntry standardPricebookEntry : standardPricebookEntries) {
                mapStandardPricebookEntries.put(standardPricebookEntry.Product2Id, standardPricebookEntry);
            }
            existingPricebookEntries = getProductsToPriceBook(id);
            for (PricebookEntry existPricebookEntry : existingPricebookEntries) {
                mapExistingPricebookEntries.put(existPricebookEntry.Product2Id, existPricebookEntry);
            }
            for (PricebookEntry existPricebookEntry : existingPricebookEntries) {
                if (mapStandardPricebookEntries.get(existPricebookEntry.Product2Id) != null) {
                    existPricebookEntry.Percentage_of_the_price__c = partOfPrice;
                    Decimal standardPrice = mapStandardPricebookEntries.get(existPricebookEntry.Product2Id).UnitPrice;
                    existPricebookEntry.UnitPrice = (standardPrice * partOfPrice) / 100;
                }
            }
            update existingPricebookEntries;

            List<PricebookEntry> newPricebookEntries = new List<PricebookEntry>();
            for (String idProduct : ids) {
                if (mapStandardPricebookEntries.get(idProduct) != null && mapExistingPricebookEntries.get(idProduct) == null) {
                    PricebookEntry newPricebookEntry = new PricebookEntry();
                    newPricebookEntry.Product2Id = idProduct;
                    newPricebookEntry.Pricebook2Id = id;
                    newPricebookEntry.Percentage_of_the_price__c = partOfPrice;
                    newPricebookEntry.UnitPrice = (mapStandardPricebookEntries.get(idProduct).UnitPrice * partOfPrice) / 100;
                    newPricebookEntry.IsActive = true;
                    newPricebookEntries.add(newPricebookEntry);
                }
            }
            insert newPricebookEntries;
//            if (existingPricebookEntries.size() > ids.size()) {
                List<PricebookEntry> pricebookEntriesToDelete = new List<PricebookEntry>();
                List<String> idsPrincebook = new List<String>();
                for (PricebookEntry pricebookEntry : existingPricebookEntries) {
                    if (ids.contains(pricebookEntry.Product2Id) == false) {
                        pricebookEntriesToDelete.add(pricebookEntry);
                    }
//                }
                delete pricebookEntriesToDelete;
            }
        } catch (DmlException e) {
            responsePriceProduct.message = e.getMessage();
            responsePriceProduct.state = 'Error';
        }

//        searchedProducts = [SELECT Name, brand__c, model__c, Cost__c, is_available_installments__c,color__c,id,Photo_Id__c, current_Inventory__c, Category__c FROM Product2 Where id = :id];
        return responsePriceProduct;
    }
    @AuraEnabled
    public static ResponsePriceProduct updatePriceInProduct(String id, String discount, String idProductsToCreate) {
        ResponsePriceProduct responsePriceProduct = new ResponsePriceProduct();
        List<PricebookEntry> standardPricebookEntries = new List<PricebookEntry>();
        List<PricebookEntry> existingPricebookEntries = new List<PricebookEntry>();
        Set<String> ids = (Set<String>) JSON.deserialize(idProductsToCreate, Set<String>.class);
        Map<String, PricebookEntry> mapStandardPricebookEntries = new Map<String, PricebookEntry>();
        Map<String, PricebookEntry> mapExistingPricebookEntries = new Map<String, PricebookEntry>();
        Decimal partOfPrice = Decimal.valueOf(discount);
        try {
            standardPricebookEntries = getProducts();
            for (PricebookEntry standardPricebookEntry : standardPricebookEntries) {
                mapStandardPricebookEntries.put(standardPricebookEntry.Product2Id, standardPricebookEntry);
            }
            existingPricebookEntries = getProductsToPriceBook(id);
            for (PricebookEntry existPricebookEntry : existingPricebookEntries) {
                mapExistingPricebookEntries.put(existPricebookEntry.Product2Id, existPricebookEntry);
            }
            List<PricebookEntry> newPricebookEntries = new List<PricebookEntry>();
            for (String idProduct : ids) {
                if (mapStandardPricebookEntries.get(idProduct) != null&&mapExistingPricebookEntries.get(idProduct) != null) {
                    PricebookEntry newPricebookEntry = mapExistingPricebookEntries.get(idProduct);
                    newPricebookEntry.Percentage_of_the_price__c = partOfPrice;
                    newPricebookEntry.UnitPrice = (mapStandardPricebookEntries.get(idProduct).UnitPrice * partOfPrice) / 100;
                    newPricebookEntries.add(newPricebookEntry);
                }
            }
            update newPricebookEntries;
        } catch (DmlException e) {
            responsePriceProduct.message = e.getMessage();
            responsePriceProduct.state = 'Error';
        }

//        searchedProducts = [SELECT Name, brand__c, model__c, Cost__c, is_available_installments__c,color__c,id,Photo_Id__c, current_Inventory__c, Category__c FROM Product2 Where id = :id];
        return responsePriceProduct;
    }

    @AuraEnabled
    public static ResponseAddProduct updateProduct(String productId, String name, String brand, String model, String productCode, String cost, String currentInventory, String description, Boolean active, Boolean installment, String color) {
        ResponseAddProduct responseAddProduct = new ResponseAddProduct();
        List<Product2> productList = new List<Product2>();
        try {
            Product2 product = new Product2();
            product = [SELECT Id,Name,brand__c,model__c,ProductCode,Cost__c,current_Inventory__c,Description,color__c,IsActive,is_available_installments__c FROM Product2 WHERE id = :productId ORDER BY CreatedDate DESC LIMIT 1];
            product.Name = name;
            product.brand__c = brand;
            product.model__c = model;
            product.ProductCode = productCode;
            String costString = (Decimal.valueOf(cost == null || cost.trim() == '' ? '0' : cost).setScale(2) + 0.001).format();
            product.Cost__c = Decimal.valueOf(costString.substring(0, costString.length() - 1));
            product.current_Inventory__c = Decimal.valueOf(currentInventory);
            product.Description = description;
            product.color__c = color;
            product.is_available_installments__c = installment;
            update product;

            responseAddProduct.state = 'Success';
            responseAddProduct.message = 'Update Product';
            responseAddProduct.listProduct = product;
        } catch (DmlException e) {
            responseAddProduct.state = 'Error';
            responseAddProduct.message = e.getMessage();
        }
        return responseAddProduct;
    }


    public class ResponseAddProduct {
        @AuraEnabled public String state;
        @AuraEnabled public Product2 listProduct;
        @AuraEnabled public String message;
    }

    public class ResponsePriceProduct {
        @AuraEnabled public String state;
        @AuraEnabled public Pricebook2 pricebook;
        @AuraEnabled public String message;
    }

    public class ResponseProducts {
        @AuraEnabled public String productId;
        @AuraEnabled public String name;
        @AuraEnabled public String model;
        @AuraEnabled public String brand;
        @AuraEnabled public Decimal unitPrice;


    }
}