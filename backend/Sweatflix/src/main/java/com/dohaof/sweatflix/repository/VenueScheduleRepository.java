package com.dohaof.sweatflix.repository;

import com.dohaof.sweatflix.po.Venue;
import com.dohaof.sweatflix.po.VenueSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VenueScheduleRepository extends JpaRepository<VenueSchedule, Integer> {
    List<VenueSchedule> findByVenue(Venue venue);
}
