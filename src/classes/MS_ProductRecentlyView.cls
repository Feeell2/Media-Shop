public with sharing class MS_ProductRecentlyView {
    @AuraEnabled
    public static ProductsRecentlyViewWrapper getRecentlyViewProduct() {
        ProductsRecentlyViewWrapper productsWrapper = new ProductsRecentlyViewWrapper();
        try {

            List<RecentlyViewed> listRecentlyViewedsProduct = new List<RecentlyViewed>();
            listRecentlyViewedsProduct = [SELECT ID FROM RecentlyViewed WHERE Type = 'Product2' AND LastViewedDate != null LIMIT 10];
            List<String> listIdProducts = new List<String>();
            for (RecentlyViewed recentlyViewed : listRecentlyViewedsProduct) {
                listIdProducts.add(recentlyViewed.id);
            }
            String idStandardPrice = [SELECT ID FROM Pricebook2 WHERE Name = 'Standard Price Book'].ID;
            List<PricebookEntry> listPricebookEntries = [SELECT Id,Percentage_of_the_price__c,UnitPrice,Product2Id,Pricebook2Id,Product2.Name,Product2.brand__c,Product2.model__c,Product2.Photo_Id__c FROM PricebookEntry WHERE Product2Id = :listIdProducts AND Pricebook2Id = :idStandardPrice ORDER BY Product2.LastViewedDate DESC];
            Set<PricebookEntry> setPricebookEntries = new Set<PricebookEntry>(listPricebookEntries);
            List<PricebookEntry> listResults = new List<PricebookEntry>(setPricebookEntries);
            productsWrapper.listResults = listResults;
            productsWrapper.userType = UserInfo.getUserType();
        } catch (DmlException e) {
            System.debug(e.getMessage());
        }
        return productsWrapper;
    }

    public class ProductsRecentlyViewWrapper {
        @AuraEnabled public String userType;
        @AuraEnabled public List<PricebookEntry> listResults;
    }
}