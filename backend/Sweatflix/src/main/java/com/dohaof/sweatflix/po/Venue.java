package com.dohaof.sweatflix.po;

import com.dohaof.sweatflix.vo.VenueVO;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
public class Venue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String description;
    private String image;

    @OneToMany(mappedBy = "venue", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VenueSchedule> schedules;
    public VenueVO toVO() {
        VenueVO vo = new VenueVO();
        vo.setId(id);
        vo.setName(name);
        vo.setDescription(description);
        vo.setImage(image);
        vo.setSchedulesId(schedules.stream().map(VenueSchedule::getId).collect(Collectors.toList()));
        return vo;
    }
}
