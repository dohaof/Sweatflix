package com.dohaof.sweatflix.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ScheduleOrderVO {
    private Integer id;
    private Integer userId;
    private Integer venueScheduleId;
    private LocalDateTime orderTime;
    private Boolean paySuccess;
}
