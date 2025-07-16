package com.dohaof.sweatflix.repository;

import com.dohaof.sweatflix.po.Favourite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavouriteRepository extends JpaRepository<Favourite, Integer> {
    List<Favourite> findByUserId(Integer userId);

    Favourite findByUserIdAndVenueId(Integer userId, Integer venueId);
}
