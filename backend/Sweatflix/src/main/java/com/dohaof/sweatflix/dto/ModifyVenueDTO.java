package com.dohaof.sweatflix.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ModifyVenueDTO {
    private Integer id;
    private String name;
    private String description;
    private String image;

}
