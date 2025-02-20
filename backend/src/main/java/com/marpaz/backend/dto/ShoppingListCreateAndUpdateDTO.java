package com.marpaz.backend.dto;

import java.util.List;

import com.marpaz.backend.model.Item;
import com.marpaz.backend.model.ShoppingList;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ShoppingListCreateAndUpdateDTO(
        @NotBlank(message = "Name cannot be blank") @Size(min = 5, max = 30) String name,
        List<Item> items,
        String clientId) {

    public ShoppingList toShoppingList() {
        ShoppingList shoppingList = new ShoppingList();
        shoppingList.setName(name);
        shoppingList.setItems(items);
        shoppingList.setClientId(clientId);
        return shoppingList;
    }
}
