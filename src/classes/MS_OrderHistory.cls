public with sharing class MS_OrderHistory {

    @AuraEnabled
    public static OrdersWrapper getUserOrders(){
        OrdersWrapper orderWrappers=new OrdersWrapper();
        List<Order> orders=new List<Order>();
        String idContact=[SELECT ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1].ContactId;
        orders=[SELECT Id,Contact__r.Name,OrderNumber,TotalAmount,Status,ShippingAddress,EffectiveDate,Payment_Method__c,Delivery_Method__c FROM Order WHERE Contact__c=:idContact AND Status='Activated'  ORDER BY CreatedDate DESC];
        orderWrappers.results=orders;
        return orderWrappers;
    }

    public class OrdersWrapper{
        @AuraEnabled public List<Order> results;
    }

}