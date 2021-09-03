public with sharing class MS_ShoppingCartHandler {

    @AuraEnabled
    public static Cart addProductToCache(PricebookEntry product, String quantity) {

        String partitionInput = 'local.ShoppingCart';
        String keyInput = 'Cart';
        Item item = new Item();
        item.product = product;
        item.quantity = Decimal.valueOf(quantity);
        Cache.SessionPartition sessionPartition = Cache.Session.getPartition(partitionInput);
        if (sessionPartition.contains(keyInput)) {
            String message = (String) sessionPartition.get(keyInput);
            Cart cartFromSession = (Cart) JSON.deserialize(message, Cart.class);
            cartFromSession.products.add(item);
            sessionPartition.put(keyInput, JSON.serialize(cartFromSession));
        } else {
            Cart newCart = new Cart();
            newCart.products.add(item);
            sessionPartition.put(keyInput, JSON.serialize(newCart));
        }
        String sessionValue = (String) sessionPartition.get(keyInput);
        System.debug(sessionValue);
        Cart sessionCart = (Cart) JSON.deserialize(sessionValue, Cart.class);
        return sessionCart;
    }

    @AuraEnabled
    public static Cart getProductsToCart() {
        String partitionInput = 'local.ShoppingCart';
        String keyInput = 'Cart';
        Cart sessionCart = new Cart();
        Cache.SessionPartition sessionPartition = Cache.Session.getPartition(partitionInput);
        String sessionValue = (String) sessionPartition.get(keyInput);
        if (String.isNotBlank(sessionValue)) {
            sessionCart = (Cart) JSON.deserialize(sessionValue, Cart.class);
        }
        try {
            Order order = [SELECT Id, OwnerId FROM Order WHERE OwnerId = :UserInfo.getUserId() AND Status = 'Draft' ORDER BY CreatedDate DESC LIMIT 1];
            List<OrderItem> items = [SELECT Id, UnitPrice, Quantity, Product2Id, PricebookEntry.Pricebook2Id, Product2.Name, Product2.Photo_Id__c FROM OrderItem WHERE OrderId = :order.Id];
            if (String.isBlank(sessionValue)) {
                for (OrderItem item : items) {
                    PricebookEntry pricebookEntry = new PricebookEntry();
                    Product2 product = new Product2();
                    product.Name = item.Product2.Name;
                    product.Photo_Id__c = item.Product2.Photo_Id__c;
                    product.Id = item.Product2Id;
                    pricebookEntry.Product2Id = item.Product2Id;
                    pricebookEntry.UnitPrice = item.UnitPrice;
                    pricebookEntry.Pricebook2Id = item.PricebookEntry.Pricebook2Id;
                    pricebookEntry.Id = item.PricebookEntryId;
                    pricebookEntry.Product2 = product;
                    addProductToCache(pricebookEntry, String.valueOf(item.Quantity));
                }
            }
            delete items;
            delete order;
        } catch (Exception e) {
            System.debug(e.getMessage());
        }
        return sessionCart;
    }

    @AuraEnabled
    public static Cart deleteProduct(String id) {
        String partitionInput = 'local.ShoppingCart';
        String keyInput = 'Cart';
        Cache.SessionPartition sessionPartition = Cache.Session.getPartition(partitionInput);
        String sessionBody = (String) sessionPartition.get(keyInput);
        Cart cartFromSession = (Cart) JSON.deserialize(sessionBody, Cart.class);
        for (Integer i = 0; i < cartFromSession.products.size(); i++) {
            if (cartFromSession.products.get(i).product.Product2Id == id) {
                sessionPartition.remove(keyInput);
                cartFromSession.products.remove(i);
                sessionPartition.put(keyInput, JSON.serialize(cartFromSession));
            }
        }
        return cartFromSession;
    }
    @AuraEnabled
    public static void clearCart() {
        String partitionInput = 'local.ShoppingCart';
        String keyInput = 'Cart';
        Cache.SessionPartition sessionPartition = Cache.Session.getPartition(partitionInput);
        sessionPartition.put(keyInput, JSON.serialize(new Cart()));
    }

    @AuraEnabled
    public static Cart changeQuantity(String id, String quantity) {
        String partitionInput = 'local.ShoppingCart';
        String counterKeyInput = 'Cart';
        Cache.SessionPartition sessionPartition = Cache.Session.getPartition(partitionInput);
        String message = (String) sessionPartition.get(counterKeyInput);
        Cart cartFromSession = (Cart) JSON.deserialize(message, Cart.class);
        for (Integer i = 0; i < cartFromSession.products.size(); i++) {
            if (cartFromSession.products.get(i).product.Product2Id == id) {
                cartFromSession.products.get(i).quantity = Decimal.valueOf(quantity);
                sessionPartition.put(counterKeyInput, JSON.serialize(cartFromSession));
            }
        }
        return cartFromSession;
    }

    public class Item {
        @AuraEnabled public PricebookEntry product;
        @AuraEnabled public Decimal quantity;
    }

    public class Cart {
        @AuraEnabled public List<Item> products;

        public Cart() {
            products = new List<Item>();
        }
    }
}