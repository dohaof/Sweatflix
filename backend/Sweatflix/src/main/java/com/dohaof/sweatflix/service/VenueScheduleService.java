package com.dohaof.sweatflix.service;

import com.dohaof.sweatflix.dto.VScheduleDTO;
import com.dohaof.sweatflix.dto.BookResponseDTO;
import com.dohaof.sweatflix.vo.DetailOrderVO;
import com.dohaof.sweatflix.vo.VenueScheduleVO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface VenueScheduleService {
    String addCreateVenueSchedule(VScheduleDTO vScheduleDTO);

    String removeSchedule(Integer venueScheduleId);

    List<VenueScheduleVO> getScheduleByVenueID(Integer venueId);

    BookResponseDTO createOrder(Integer venueScheduleId, Integer userId);

    String changeOrderState(Integer scheduleOrderId, Boolean success);

    List<DetailOrderVO> getScheduleByUSerID(Integer userId);

    String removeOrder(Integer orderId);
}
