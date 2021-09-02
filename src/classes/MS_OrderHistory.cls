public with sharing class MS_OrderHistory {

    @AuraEnabled
    public static OrdersWrapper getUserOrders(){
        OrdersWrapper orderWrappers=new OrdersWrapper();
        List<Order> orders=new List<Order>();
        orders=[SELECT Id,OrderNumber,TotalAmount,Status,ShippingAddress,EffectiveDate,Payment_Method__c,Delivery_Method__c FROM Order WHERE OwnerId=:UserInfo.getUserId() AND Status='Activated'  ORDER BY CreatedDate DESC];
        orderWrappers.results=orders;
        return orderWrappers;
    }

    public class OrdersWrapper{
        @AuraEnabled public List<Order> results;
    }

}