package com.lostfound.items;

import com.lostfound.entity.FoundItem;
import com.lostfound.service.FoundItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/found-items")
public class FoundItemController {

    @Autowired
    private FoundItemService foundItemService;

    // CREATE FOUND ITEM
    @PostMapping
    public FoundItem createFoundItem(@RequestBody FoundItem foundItem) {
    	foundItem.setStatus("PENDING");
        return foundItemService.save(foundItem);
    }

    // GET ALL FOUND ITEMS
    @GetMapping
    public List<FoundItem> getAllFoundItems() {
        return foundItemService.getAll();
    }
}


