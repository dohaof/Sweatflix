package com.dohaof.sweatflix.repository;

import com.dohaof.sweatflix.po.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VenueRepository extends JpaRepository<Venue, Integer> {
}
