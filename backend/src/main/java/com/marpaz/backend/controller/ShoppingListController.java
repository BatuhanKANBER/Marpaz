package com.marpaz.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marpaz.backend.dto.ShoppingListCreateAndUpdateDTO;
import com.marpaz.backend.dto.ShoppingListDTO;
import com.marpaz.backend.dto.ShoppingListCompletedDTO;
import com.marpaz.backend.services.ShoppingListService;
import com.marpaz.backend.shared.GenericMessage;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/shlists")
public class ShoppingListController {
    private final ShoppingListService shoppingListService;

    @PostMapping("/create")
    GenericMessage save(@Valid @RequestBody ShoppingListCreateAndUpdateDTO shoppingList) {
        if (shoppingList.clientId() == null || shoppingList.clientId().isEmpty()) {
            throw new RuntimeException("Client ID gereklidir!");
        }
        shoppingListService.save(shoppingList.toShoppingList());
        return new GenericMessage("List is created.");
    }

    @GetMapping("/active-list/{clientId}")
    Page<ShoppingListDTO> getAllActiveList(@PathVariable String clientId,
            @PageableDefault(sort = "id", direction = Direction.DESC) Pageable page) {
        return shoppingListService.getAllActiveList(clientId, page).map(ShoppingListDTO::new);
    }

    @GetMapping("/history-list/{clientId}")
    Page<ShoppingListDTO> getAllHistoryList(@PathVariable String clientId,
            @PageableDefault(sort = "id", direction = Direction.DESC) Pageable page) {
        return shoppingListService.getAllHistoryList(clientId, page).map(ShoppingListDTO::new);
    }

    @PatchMapping("/{id}/completed")
    GenericMessage completed(@PathVariable Long id,
            @Valid @RequestBody ShoppingListCompletedDTO shoppingListUpdateDTO) {
        shoppingListService.completed(id, shoppingListUpdateDTO);
        return new GenericMessage("List is completed.");
    }

    @PutMapping("/{id}/update")
    GenericMessage update(@PathVariable Long id, @Valid @RequestBody ShoppingListCreateAndUpdateDTO shoppingList) {
        shoppingListService.update(id, shoppingList);
        return new GenericMessage("List is updated.");
    }

    @DeleteMapping("/{id}/delete")
    GenericMessage delete(@PathVariable Long id) {
        shoppingListService.delete(id);
        return new GenericMessage("List is deleted.");
    }
}
