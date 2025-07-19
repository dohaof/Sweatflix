package com.dohaof.sweatflix.vo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
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


    public VenueVO(int i, String gym, String smallVenue, String image) {
        this.id = i;
        this.name = gym;
        this.description = image;
        this.image = image;
        this.schedulesId = new ArrayList<Integer>();

    }
}
