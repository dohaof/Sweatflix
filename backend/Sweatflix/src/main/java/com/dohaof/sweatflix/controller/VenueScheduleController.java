package com.dohaof.sweatflix.controller;

import com.dohaof.sweatflix.dto.VScheduleDTO;
import com.dohaof.sweatflix.service.VenueScheduleService;
import com.dohaof.sweatflix.dto.BookResponseDTO;
import com.dohaof.sweatflix.vo.Response;
import com.dohaof.sweatflix.vo.VenueScheduleVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venue_schedule")
@RequiredArgsConstructor
public class VenueScheduleController {
    private final VenueScheduleService venueScheduleService;
    @PostMapping("")
    public Response<String> createVenueSchedule(@RequestBody VScheduleDTO VScheduleDTO) {
        return Response.buildSuccess(venueScheduleService.addCreateVenueSchedule(VScheduleDTO));
    }

    @DeleteMapping("/{venue_schedule_id}")
    public Response<String> deleteVenue(@PathVariable Integer venue_schedule_id) {
        return Response.buildSuccess(venueScheduleService.removeScheduleOrder(venue_schedule_id));
    }
    @GetMapping("/{venue_id}")
    public Response<List<VenueScheduleVO>> getVenueSchedules(@PathVariable Integer venue_id) {
        return Response.buildSuccess(venueScheduleService.getScheduleByVenueID(venue_id));
    }
    @PostMapping("/{venue_schedule_id}")
    public Response<BookResponseDTO> bookVenue(@PathVariable Integer venue_schedule_id, HttpServletRequest request) {
        Integer userId= (Integer) request.getAttribute("userId");
        return Response.buildSuccess(venueScheduleService.createOrder(venue_schedule_id, userId));
    }
    @PostMapping("/notify/{schedule_order_id}/{success}")
    public Response<String> payNotify(@PathVariable Integer schedule_order_id,@PathVariable Boolean success) {
        return Response.buildSuccess(venueScheduleService.changeOrderState(schedule_order_id,success));
    }
}
