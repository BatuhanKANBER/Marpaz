package com.marpaz.backend.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.marpaz.backend.model.ShoppingList;

public interface ShoppingListRepository extends JpaRepository<ShoppingList, Long> {
    Page<ShoppingList> findByEnabledTrue(Pageable pageable);

    Page<ShoppingList> findByEnabledFalse(Pageable pageable);
}
