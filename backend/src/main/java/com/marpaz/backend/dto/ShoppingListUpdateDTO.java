package com.marpaz.backend.dto;

import com.marpaz.backend.model.ShoppingList;

public record ShoppingListUpdateDTO(
        boolean enabled) {
    public ShoppingList toShoppingList() {
        ShoppingList shoppingList = new ShoppingList();
        shoppingList.setEnabled(enabled);
        return shoppingList;
    }
}