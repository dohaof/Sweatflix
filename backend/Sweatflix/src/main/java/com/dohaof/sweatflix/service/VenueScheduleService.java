package com.dohaof.sweatflix.service;

import com.dohaof.sweatflix.dto.VScheduleDTO;
import com.dohaof.sweatflix.vo.VenueScheduleVO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface VenueScheduleService {
    String addCreateVenueSchedule(VScheduleDTO vScheduleDTO);

    String removeScheduleOrder(Integer venueScheduleId);

    List<VenueScheduleVO> getScheduleByVenueID(Integer venueId);

    String createOrder(Integer venueScheduleId);

    String changeOrderState(Integer scheduleOrderId, Boolean success);
}
