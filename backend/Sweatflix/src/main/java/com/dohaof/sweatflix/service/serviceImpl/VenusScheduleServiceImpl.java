package com.dohaof.sweatflix.service.serviceImpl;

import com.dohaof.sweatflix.dto.VScheduleDTO;
import com.dohaof.sweatflix.exception.SFException;
import com.dohaof.sweatflix.po.Venue;
import com.dohaof.sweatflix.po.VenueSchedule;
import com.dohaof.sweatflix.repository.ScheduleOrderRepository;
import com.dohaof.sweatflix.repository.VenueRepository;
import com.dohaof.sweatflix.repository.VenueScheduleRepository;
import com.dohaof.sweatflix.service.VenueScheduleService;
import com.dohaof.sweatflix.service.VenueService;
import com.dohaof.sweatflix.vo.VenueScheduleVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class VenusScheduleServiceImpl implements VenueScheduleService {
    private final VenueRepository venueRepository;
    private final VenueScheduleRepository venueScheduleRepository;
    private final ScheduleOrderRepository scheduleOrderRepository;
    @Override
    public String addCreateVenueSchedule(VScheduleDTO vScheduleDTO) {
        VenueSchedule venueSchedule = new VenueSchedule();
        venueSchedule.setVenue(venueRepository.findById(vScheduleDTO.getVenueId()).orElseThrow(()-> new SFException("409", "不存在的场地")));
        venueSchedule.setCapacity(vScheduleDTO.getCapacity());
        venueSchedule.setPrice(vScheduleDTO.getPrice());
        venueSchedule.setStartTime(vScheduleDTO.getStartTime());
        venueSchedule.setEndTime(vScheduleDTO.getEndTime());

        venueScheduleRepository.save(venueSchedule);
        return "创建预约时间段成功";
    }

    @Override
    public String removeScheduleOrder(Integer venueScheduleId) {
        VenueSchedule venueSchedule=venueScheduleRepository.findById(venueScheduleId).orElseThrow(()-> new SFException("409", "不存在的场地"));
        venueScheduleRepository.delete(venueSchedule);
        return "删除成功";
    }

    @Override
    public List<VenueScheduleVO> getScheduleByVenueID(Integer venueId) {
        List<VenueSchedule> venueSchedules=venueScheduleRepository.findByVenue(venueRepository.findById(venueId).orElseThrow(()-> new SFException("409", "不存在的场地")));
        return venueSchedules.stream().map(VenueSchedule::toVenueScheduleVO).collect(Collectors.toList());
    }

    @Override
    public String createOrder(Integer venueScheduleId) {
        return "";
    }

    @Override
    public String changeOrderState(Integer scheduleOrderId, Boolean success) {
        return "";
    }
}
