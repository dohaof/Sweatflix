package com.dohaof.sweatflix.po;

import com.dohaof.sweatflix.vo.CommentsVO;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
public class Comments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String content;
    @ManyToOne
    @JoinColumn(name = "venue_id")
    private Venue venue;
    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;
    @Min(1)
    @Max(5)
    private Integer rate;
    @ElementCollection
    private List<String> images;
    private LocalDateTime createdAt;
    private Integer thumbUpCount;
    public CommentsVO toVO() {
        CommentsVO vo = new CommentsVO();
        vo.setId(id);
        vo.setContent(content);
        vo.setUserName(author.getUsername());
        vo.setUserAvatar(author.getImage());
        vo.setRate(rate);
        vo.setCreatedAt(createdAt);
        vo.setImages(images);
        vo.setThumbUpCount(thumbUpCount);
        return vo;
    }
}
