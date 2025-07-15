package com.dohaof.sweatflix.vo;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VenueScheduleVO {
    private Integer id;
    private String venueName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer capacity;
    private Double price;
    private List<ScheduleOrderVO> scheduleOrders;
}
