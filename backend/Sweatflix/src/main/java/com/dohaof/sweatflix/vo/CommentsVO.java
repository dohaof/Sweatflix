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

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CommentsVO {
    private Integer id;
    private String content;
    private Integer authorId;
    private Integer rate;
    private String image;
    private LocalDateTime createdAt;
    private Integer thumbUpCount;
}
