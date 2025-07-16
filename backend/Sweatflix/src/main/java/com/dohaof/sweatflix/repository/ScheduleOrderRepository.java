package com.dohaof.sweatflix.repository;

import com.dohaof.sweatflix.po.ScheduleOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScheduleOrderRepository extends JpaRepository<ScheduleOrder, Integer> {
    List<ScheduleOrder> findScheduleOrderByUser_Id(Integer userId);

}
