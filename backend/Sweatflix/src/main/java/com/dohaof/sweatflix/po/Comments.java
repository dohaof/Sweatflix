package com.dohaof.sweatflix.po;

import com.dohaof.sweatflix.vo.CommentsVO;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Comments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String content;
    @OneToOne
    private User author;
    @Min(1)
    @Max(5)
    private Integer rate;
    private String image;
    private LocalDateTime createdAt;
    public CommentsVO toVO() {
        CommentsVO vo = new CommentsVO();
        vo.setId(id);
        vo.setContent(content);
        vo.setAuthorId(author.getId());
        vo.setRate(rate);
        vo.setCreatedAt(createdAt);
        vo.setImage(image);
        return vo;
    }
}
