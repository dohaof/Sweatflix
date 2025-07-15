package com.dohaof.sweatflix.repository;

import com.dohaof.sweatflix.po.Venue;
import com.dohaof.sweatflix.po.VenueSchedule;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VenueScheduleRepository extends JpaRepository<VenueSchedule, Integer> {
    List<VenueSchedule> findByVenue(Venue venue);
    @Lock(LockModeType.PESSIMISTIC_WRITE)//悲观锁
    @Query("SELECT v FROM VenueSchedule v WHERE v.id = :id")
    Optional<VenueSchedule> findByIdForUpdate(@Param("id") Integer id);
}
