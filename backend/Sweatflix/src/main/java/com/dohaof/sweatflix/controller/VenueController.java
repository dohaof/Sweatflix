package com.dohaof.sweatflix.controller;
import com.dohaof.sweatflix.dto.ModifyVenueDTO;
import com.dohaof.sweatflix.dto.VenueCreationDTO;
import com.dohaof.sweatflix.service.VenueService;
import com.dohaof.sweatflix.vo.Response;
import com.dohaof.sweatflix.vo.VenueVO;
import jakarta.servlet.http.HttpServletRequest;
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
    public Response<String> modifyVenue(@RequestBody ModifyVenueDTO modifyVenueDTO) {
        return Response.buildSuccess(venueService.changeVenue(modifyVenueDTO));
    }
    @DeleteMapping("/{venue_id}")
    public Response<String> deleteVenue(@PathVariable Integer venue_id) {
        return Response.buildSuccess(venueService.removeVenue(venue_id));
    }
    @GetMapping("/get")
    public Response<List<VenueVO>> getVenues() {
        return Response.buildSuccess(venueService.getAllVenue());
    }
    @GetMapping("/{venue_id}")
    public Response<VenueVO> getVenues(@PathVariable Integer venue_id) {
        return Response.buildSuccess(venueService.getVenueById(venue_id));
    }
    @PostMapping("/favour/{venue_id}")
    public Response<String> favourVenue(@PathVariable Integer venue_id, HttpServletRequest request) {
        Integer userId= (Integer) request.getAttribute("userId");
        return Response.buildSuccess(venueService.favour(venue_id,userId));
    }
    @GetMapping("/favour")
    private Response<List<Integer>> getFavourVenuesId(HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("userId");
        return Response.buildSuccess(venueService.getFavourId(userId));
    }
}
