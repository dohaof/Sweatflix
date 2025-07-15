package com.dohaof.sweatflix.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class VScheduleDTO {
    private Integer venueId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer capacity;
    private Double price;
}
