package com.dohaof.sweatflix.vo;

import com.dohaof.sweatflix.po.User;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
public class CommentsVO {
    private Integer id;
    private String content;
    private Integer venueId;
    private String userName;
    private String userAvatar;
    private Integer rate;
    private List<String> images;
    private LocalDateTime createdAt;
    private Integer thumbUpCount;
}
