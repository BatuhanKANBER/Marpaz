package com.marpaz.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.marpaz.backend.model.Item;

public interface ItemRepository extends JpaRepository<Item, Long> {

}
