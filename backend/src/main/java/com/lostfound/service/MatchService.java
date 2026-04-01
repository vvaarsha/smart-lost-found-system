package com.lostfound.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lostfound.entity.*;
import com.lostfound.repository.*;

@Service
public class MatchService {

    @Autowired
    private LostItemRepository lostRepo;

    @Autowired
    private FoundItemRepository foundRepo;

    @Autowired
    private MatchRepository matchRepo;

    public List<Match> findMatches() {

        List<LostItem> lostItems = lostRepo.findByStatus("PENDING");
        List<FoundItem> foundItems = foundRepo.findByStatus("PENDING");

        List<Match> matches = new ArrayList<>();

        for (LostItem lost : lostItems) {
            for (FoundItem found : foundItems) {

            	boolean isMatch =
            	        lost.getItemName() != null &&
            	        found.getItemName() != null &&
            	        lost.getItemName().trim().equalsIgnoreCase(found.getItemName().trim()) &&

            	        lost.getLocation() != null &&
            	        found.getLocation() != null &&
            	        lost.getLocation().trim().equalsIgnoreCase(found.getLocation().trim()) &&

            	        (
            	            lost.getColor() == null ||
            	            found.getColor() == null ||
            	            lost.getColor().trim().equalsIgnoreCase(found.getColor().trim())
            	        );
            	
            	System.out.println("LOST  -> " +
            	        lost.getItemName() + " | " +
            	        lost.getColor() + " | " +
            	        lost.getLocation());

            	System.out.println("FOUND -> " +
            	        found.getItemName() + " | " +
            	        found.getColor() + " | " +
            	        found.getLocation());

                if (isMatch && !matchRepo.existsByLostItemAndFoundItem(lost, found)) {

                    Match match = new Match();
                    match.setLostItem(lost);
                    match.setFoundItem(found);
                    match.setStatus("MATCHED");
                    match.setConfidenceScore(0.90);

                    matches.add(matchRepo.save(match));

                    lost.setStatus("MATCHED");
                    found.setStatus("MATCHED");

                    lostRepo.save(lost);
                    foundRepo.save(found);
                }
            }
        }
        return matchRepo.findAll();
    }
}

