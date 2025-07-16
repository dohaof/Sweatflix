package com.dohaof.sweatflix.repository;

import com.dohaof.sweatflix.po.Comments;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CommentsRepository extends CrudRepository<Comments, Integer> {
    List<Comments> findByVenue_Id(Integer venueId);
    @Lock(LockModeType.PESSIMISTIC_WRITE)//悲观锁
    @Query("SELECT v FROM Comments v WHERE v.id = :id")
    Optional<Comments> findByIdForUpdate(@Param("id") Integer id);
}
