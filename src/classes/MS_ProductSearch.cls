public with sharing class MS_ProductSearch {
    @AuraEnabled
    public static List<PricebookEntry> getProducts() {
        List<PricebookEntry> searchedProducts = new List<PricebookEntry>();
        Pricebook2 pricebookStandard = [SELECT Id FROM Pricebook2 WHERE isStandard = true LIMIT 1];
        searchedProducts = [SELECT Id,Product2.Name, Product2.brand__c, Product2.model__c, UnitPrice, Product2.is_available_installments__c,Product2.color__c, Product2.Photo_Id__c, Product2.current_Inventory__c, Product2.Category__c FROM PricebookEntry WHERE Pricebook2Id = :pricebookStandard.id];
        return searchedProducts;
    }

    @AuraEnabled
    public static List<PricebookEntry> searchProducts(String name, String brand, String model, String minPrice, String maxPrice) {
        List<PricebookEntry> searchedProducts = new List<PricebookEntry>();
        searchedProducts = Database.query(createQuery(name, brand, model, minPrice, maxPrice));
        return searchedProducts;
    }

    @AuraEnabled
    public static String createQuery(String name, String brand, String model, String minPrice, String maxPrice) {
        return queryBuilder(createListOfQuery(name, brand, model, minPrice, maxPrice));
    }

    @AuraEnabled
    public static String queryBuilder(List<String> listOfQuery) {
        String searchQuery = 'SELECT Product2.Name, Product2.brand__c, Product2.model__c, UnitPrice, Product2.is_available_installments__c,Product2.color__c, Product2.Photo_Id__c, Product2.current_Inventory__c, Product2.Category__c FROM PricebookEntry WHERE ';
        searchQuery += String.join(listOfQuery, ' AND ');
        return searchQuery;
    }


    @AuraEnabled
    public static List<String> createListOfQuery(String name, String brand, String model, String minPrice, String maxPrice) {
        List<String> listOfQuery = new List<String>();
        if (!String.isBlank(name)) {
            listOfQuery.add('Product2.Name LIKE \'%' + String.escapeSingleQuotes(name) + '%\'');
        }
        if (!String.isBlank(brand)) {
            listOfQuery.add('Product2.brand__c LIKE \'%' + String.escapeSingleQuotes(brand) + '%\'');
        }
        if (!String.isBlank(model)) {
            listOfQuery.add('Product2.model__c LIKE \'%' + String.escapeSingleQuotes(model) + '%\'');
        }
        if (!String.isBlank(minPrice)) {
            listOfQuery.add('UnitPrice >= ' + String.escapeSingleQuotes(minPrice) + '');
        }
        if (!String.isBlank(maxPrice)) {
            listOfQuery.add('UnitPrice <= ' + String.escapeSingleQuotes(maxPrice) + '');
        }
        return listOfQuery;
    }
}