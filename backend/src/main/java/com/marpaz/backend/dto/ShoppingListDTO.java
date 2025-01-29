package com.marpaz.backend.dto;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.marpaz.backend.model.Item;
import com.marpaz.backend.model.ShoppingList;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ShoppingListDTO {
    private Long id;
    private String name;
    private Date createdDate;
    private boolean enabled;
    private List<Item> items;

    public ShoppingListDTO(ShoppingList shoppingList) {
        setId(shoppingList.getId());
        setName(shoppingList.getName());
        setCreatedDate(shoppingList.getCreatedDate());
        setEnabled(shoppingList.isEnabled());
        setItems(shoppingList.getItems().stream()
                .map(item -> new Item(item.getId(), item.getName()))
                .collect(Collectors.toList()));
    }
}
