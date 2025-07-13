package com.dohaof.sweatflix.dto;

import com.dohaof.sweatflix.po.Venue;
import lombok.Data;

import java.util.ArrayList;

@Data
public class VenueCreationDTO {
    private String name;
    private String description;
    private String image;
    public Venue toVenue() {
        Venue venue = new Venue();
        venue.setName(name);
        venue.setDescription(description);
        venue.setImage(image);
        venue.setSchedules(new ArrayList<>());
        return venue;
    }
}
