package com.marpaz.backend.services;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.marpaz.backend.dto.ShoppingListUpdateDTO;
import com.marpaz.backend.model.ShoppingList;
import com.marpaz.backend.repositories.ShoppingListRepository;

import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShoppingListService {
    private final ShoppingListRepository shoppingListRepository;
    private final ItemService itemService;

    @Transactional
    public void save(ShoppingList shoppingList) {
        try {
            shoppingList.setCreatedDate(new Date());
            shoppingList.setEnabled(true);
            shoppingListRepository.saveAndFlush(shoppingList);
            itemService.save(shoppingList.getItems());
        } catch (ValidationException exception) {
            throw new ValidationException();
        }

    }

    @Transactional
    public Page<ShoppingList> getAllList(Pageable page) {
        return shoppingListRepository.findAll(page);
    }

    @Transactional
    public Page<ShoppingList> getAllActiveList(Pageable page) {
        return shoppingListRepository.findByEnabledTrue(page);
    }

    @Transactional
    public ShoppingList getList(Long id) {
        return shoppingListRepository.findById(id).orElseThrow(() -> new RuntimeException(id + " not found"));
    }

    @Transactional
    public void update(Long id, ShoppingListUpdateDTO shoppingListUpdateDTO) {
        try {
            ShoppingList inDbShoppingList = getList(id);
            inDbShoppingList.setName(shoppingListUpdateDTO.name());
            inDbShoppingList.setEnabled(shoppingListUpdateDTO.enabled());
            shoppingListRepository.save(inDbShoppingList);
        } catch (ValidationException exception) {
            throw new ValidationException();
        }

    }

    @Transactional
    public void remove(Long id) {
        ShoppingList inDbShoppingList = getList(id);
        shoppingListRepository.delete(inDbShoppingList);
    }

}
