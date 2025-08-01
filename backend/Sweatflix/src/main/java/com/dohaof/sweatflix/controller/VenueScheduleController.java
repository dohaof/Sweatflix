package com.dohaof.sweatflix.controller;

import com.dohaof.sweatflix.dto.VScheduleDTO;
import com.dohaof.sweatflix.service.NoticeService;
import com.dohaof.sweatflix.service.VenueScheduleService;
import com.dohaof.sweatflix.dto.BookResponseDTO;
import com.dohaof.sweatflix.vo.DetailOrderVO;
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
    private final NoticeService noticeService;
    @PostMapping("")
    public Response<String> createVenueSchedule(@RequestBody VScheduleDTO VScheduleDTO) {
        Response<String> response = Response.buildSuccess(venueScheduleService.addCreateVenueSchedule(VScheduleDTO));
        noticeService.NoticeFavourUser(VScheduleDTO.getVenueId());
        return response;
    }

    @DeleteMapping("/{venue_schedule_id}")
    public Response<String> deleteVenue(@PathVariable Integer venue_schedule_id) {
        return Response.buildSuccess(venueScheduleService.removeSchedule(venue_schedule_id));
    }
    @GetMapping("/{venue_id}")
    public Response<List<VenueScheduleVO>> getVenueSchedules(@PathVariable Integer venue_id) {
        return Response.buildSuccess(venueScheduleService.getScheduleByVenueID(venue_id));
    }
    @GetMapping("/orders/{user_id}")
    public Response<List<DetailOrderVO>> getOrdersByUSerID(@PathVariable Integer user_id) {
        return Response.buildSuccess(venueScheduleService.getScheduleByUSerID(user_id));
    }
    @PostMapping("/{venue_schedule_id}")
    public Response<BookResponseDTO> bookVenue(@PathVariable Integer venue_schedule_id, HttpServletRequest request) {
        Integer userId= (Integer) request.getAttribute("userId");
        return Response.buildSuccess(venueScheduleService.createOrder(venue_schedule_id, userId));
    }
    @DeleteMapping("/order/{order_id}")
    public Response<String> deleteVenueSchedule(@PathVariable Integer order_id) {
        return Response.buildSuccess(venueScheduleService.removeOrder(order_id));
    }
    @PostMapping("/notify/{schedule_order_id}/{success}")
    public Response<String> payNotify(@PathVariable Integer schedule_order_id,@PathVariable Boolean success) {
        return Response.buildSuccess(venueScheduleService.changeOrderState(schedule_order_id,success));
    }
}
