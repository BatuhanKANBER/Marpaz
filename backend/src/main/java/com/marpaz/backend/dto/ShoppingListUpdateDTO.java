package com.marpaz.backend.dto;

import com.marpaz.backend.model.ShoppingList;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ShoppingListUpdateDTO(
        @NotBlank(message = "Name cannot be blank") @Size(min = 6, max = 30) String name,
        boolean enabled) {
    public ShoppingList toShoppingList() {
        ShoppingList shoppingList = new ShoppingList();
        shoppingList.setName(name);
        shoppingList.setEnabled(enabled);
        return shoppingList;
    }
}