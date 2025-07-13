package com.dohaof.sweatflix.controller;
import com.dohaof.sweatflix.dto.VenueCreationDTO;
import com.dohaof.sweatflix.service.VenueService;
import com.dohaof.sweatflix.vo.Response;
import com.dohaof.sweatflix.vo.VenueVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venue")
@RequiredArgsConstructor
public class VenueController {
    private final VenueService venueService;
    @PostMapping("")
    public Response<String> createVenue(@RequestBody VenueCreationDTO creationDTO) {
        return Response.buildSuccess(venueService.addVenue(creationDTO.toVenue()));
    }
    @PutMapping("")
    public Response<String> modifyVenue(@RequestBody VenueVO venueVO) {
        return Response.buildSuccess(venueService.changeVenue(venueVO));
    }
    @DeleteMapping("/{venue_id}")
    public Response<String> deleteVenue(@PathVariable Integer venue_id) {
        return Response.buildSuccess(venueService.removeVenue(venue_id));
    }
    @GetMapping("/get")
    public Response<List<VenueVO>> getVenues() {
        return Response.buildSuccess(venueService.getAllVenue());
    }
}
