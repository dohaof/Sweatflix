package com.dohaof.sweatflix.vo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VenueVO {
    private Integer id;
    private String name;
    private String description;
    private String image;
    private List<Integer> schedulesId;
}
