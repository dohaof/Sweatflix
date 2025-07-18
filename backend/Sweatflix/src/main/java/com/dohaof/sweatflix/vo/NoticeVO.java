package com.dohaof.sweatflix.vo;

import com.dohaof.sweatflix.po.Venue;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NoticeVO {
    private Integer id;
    private String title;
    private String content;
    private Integer venueId;
    private String venueName;
    private LocalDateTime createTime;
    private Boolean read;
}
