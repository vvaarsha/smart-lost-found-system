package com.lostfound.items;

import java.io.File;
import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.lostfound.entity.LostItem;
import com.lostfound.entity.User;
import com.lostfound.repository.UserRepository;
import com.lostfound.service.LostItemService;


@RestController
@RequestMapping("/api/lost-items")
public class LostItemController {


@Autowired
private LostItemService lostItemService;
@Autowired
private UserRepository UserRepository;

// Add Lost Item
@PostMapping(consumes = "multipart/form-data")
public ResponseEntity<?> addLostItemMultipart(
        @RequestParam String itemName,
        @RequestParam String category,
        @RequestParam String description,
        @RequestParam String contactInfo,
        @RequestParam String dateLost,
        @RequestParam String location,
        @RequestParam Long userId,
        @RequestParam(required = false) MultipartFile image
) {
    try {
        LostItem item = new LostItem();

        item.setItemName(itemName);
        item.setCategory(category);
        item.setDescription(description);
        item.setContactInfo(contactInfo);
        item.setLocation(location);
        item.setDateLost(LocalDate.parse(dateLost));

        // ✅ SET USER
        User user = UserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        item.setUser(user);

        // Image upload
        if (image != null && !image.isEmpty()) {

            String uploadDir = System.getProperty("user.dir") + "/uploads/";
            File uploadFolder = new File(uploadDir);

            if (!uploadFolder.exists()) {
                uploadFolder.mkdirs();
            }

            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            File file = new File(uploadDir + fileName);

            image.transferTo(file);

            item.setImagePath(fileName);
        }

        return ResponseEntity.ok(lostItemService.saveLostItem(item));

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Error saving lost item");
    }
}
//GET ALL LOST ITEMS
@GetMapping
public List<LostItem> getAllLostItems() {
 return lostItemService.getAllLostItems();
}

// Get Lost Items by User
@GetMapping("/user/{userId}")
public List<LostItem> getLostItemsByUser(@PathVariable Long userId) {
return lostItemService.getLostItemsByUser(userId);
}
}