package com.dohaof.sweatflix.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class CommentsDTO {
    private Integer venueId;
    private String content;
    private Integer rate;
    private List<String> images;
}
