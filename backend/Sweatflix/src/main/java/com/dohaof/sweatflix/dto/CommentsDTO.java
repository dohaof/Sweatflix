package com.dohaof.sweatflix.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentsDTO {
    private Integer venueId;
    private String content;
    private Integer rate;
    private List<String> images;
}
