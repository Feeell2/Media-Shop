public with sharing class MS_OrderHandler {

    @AuraEnabled
    public static MS_ShoppingCartHandler.Cart getProductsFromCart() {

        return MS_ShoppingCartHandler.getProductsToCart();
    }

    @AuraEnabled
    public static Id createOrder(String amountOrder) {
        MS_ShoppingCartHandler.Cart cart = MS_ShoppingCartHandler.getProductsToCart();
        Order order = new Order();

        order.AccountId = [SELECT Contact.AccountId FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1].Contact.AccountId;
        order.Pricebook2Id = [SELECT Pricebook2Id FROM PricebookEntry WHERE Id=:cart.products.get(0).product.id Limit 1].Pricebook2Id;
        order.OwnerId = UserInfo.getUserId();
        order.Status = 'Draft';
        order.EffectiveDate = Date.today();
        insert order;
        List<OrderItem> orderItems = new List<OrderItem>();
        for (MS_ShoppingCartHandler.Item item : cart.products) {
            OrderItem orderItem = new OrderItem();
            orderItem.OrderId = order.Id;
            orderItem.Product2Id = item.product.Product2Id;
            orderItem.Quantity = item.quantity;
            orderItem.UnitPrice = item.product.UnitPrice;
            orderItem.PricebookEntryId = item.product.Id;
            orderItems.add(orderItem);
        }
        insert orderItems;
        return order.ID;
    }

    @AuraEnabled
    public static OrderWrapper getContactDetails() {
        OrderWrapper orderWrapper=new OrderWrapper();
        String idContact=[SELECT ContactId FROM User WHERE Id =: UserInfo.getUserId() LIMIT 1].ContactId;
        Contact contact=[SELECT ID,FirstName,LastName,Email,MailingCity,MailingState,MailingStreet,MailingPostalCode,MailingCountry FROM Contact WHERE id=:idContact LIMIT 1];
        orderWrapper.id=contact.Id;
        orderWrapper.firstName=contact.FirstName;
        orderWrapper.lastName=contact.LastName;
        orderWrapper.email=contact.Email;
        orderWrapper.city=contact.MailingCity;
        orderWrapper.state=contact.MailingState;
        orderWrapper.street=contact.MailingStreet;
        orderWrapper.postalCode=contact.MailingPostalCode;
        orderWrapper.country=contact.MailingCountry;
        return orderWrapper;
    }

    @AuraEnabled
    public static String saveOrder(String wrapper,String bankChoose) {
        OrderWrapper orderWrapper=new OrderWrapper();
       String message;
        try {
            orderWrapper=(OrderWrapper) JSON.deserialize(wrapper,OrderWrapper.class);
            System.debug(orderWrapper);
            Contact contact = [SELECT ID,FirstName,LastName,Email,MailingCity,MailingState,MailingStreet,MailingPostalCode,MailingCountry FROM Contact WHERE id = :orderWrapper.id LIMIT 1];
            contact.FirstName = orderWrapper.firstName;
            contact.LastName = orderWrapper.lastName;
            contact.Email = orderWrapper.email;
            contact.MailingCity = orderWrapper.city;
            contact.MailingState = orderWrapper.state;
            contact.MailingStreet = orderWrapper.street;
            contact.MailingPostalCode = orderWrapper.postalCode;
            contact.MailingCountry = orderWrapper.country;
            update contact;
            Order order = new Order();
            order = [SELECT ID,Status,Payment_Method__c,Payment_Bank__c,Delivery_Method__c FROM Order WHERE ID = :orderWrapper.orderId LIMIT 1];
            order.Status = 'Activated';
            order.Payment_Method__c = orderWrapper.paymentMethod;
            order.Payment_Bank__c = bankChoose;
            order.Delivery_Method__c = orderWrapper.deliveryMethod;
            order.ShippingStreet=orderWrapper.street;
            order.ShippingCity=orderWrapper.city;
            order.ShippingState=orderWrapper.state;
            order.ShippingPostalCode=orderWrapper.postalCode;
            order.ShippingCountry=orderWrapper.country;
            update order;
            clearCart();
            message='Success';
        }catch (DmlException e){
            message=e.getMessage();
        }
//        MS_ShoppingCartHandler.
        return message;
    }

    @AuraEnabled
    public static void clearCart() {
        String partitionInput = 'local.ShoppingCart';
        String keyInput = 'Cart';
        Cache.SessionPartition sessionPartition = Cache.Session.getPartition(partitionInput);
        sessionPartition.put(keyInput, JSON.serialize(new MS_ShoppingCartHandler.Cart()));
    }

    public class OrderWrapper {
        @AuraEnabled public String id;
        @AuraEnabled public String orderId;
        @AuraEnabled public String firstName;
        @AuraEnabled public String lastName;
        @AuraEnabled public String email;
        @AuraEnabled public String city;
        @AuraEnabled public String state;
        @AuraEnabled public String street;
        @AuraEnabled public String postalCode;
        @AuraEnabled public String country;
        @AuraEnabled public String deliveryMethod;
        @AuraEnabled public String paymentMethod;
    }
}