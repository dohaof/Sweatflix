package com.dohaof.sweatflix.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrderDTO {
    private Integer userId;
    private Integer venueScheduleId;
}
