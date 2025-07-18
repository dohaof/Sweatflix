package com.dohaof.sweatflix.po;

import com.dohaof.sweatflix.vo.NoticeVO;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Notice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String title;
    private String content;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "venue_id")
    private Venue venue;
    private LocalDateTime createTime;
    private Boolean read;
    public NoticeVO toVO(){
        NoticeVO vo = new NoticeVO();
        vo.setId(this.id);
        vo.setTitle(this.title);
        vo.setContent(this.content);
        vo.setVenueId(this.venue.getId());
        vo.setVenueName(this.venue.getName());
        vo.setCreateTime(this.createTime);
        vo.setRead(this.read);
        return vo;
    }
}
