package com.dohaof.sweatflix.service.serviceImpl;

import com.dohaof.sweatflix.dto.VScheduleDTO;
import com.dohaof.sweatflix.exception.SFException;
import com.dohaof.sweatflix.po.ScheduleOrder;
import com.dohaof.sweatflix.po.VenueSchedule;
import com.dohaof.sweatflix.repository.ScheduleOrderRepository;
import com.dohaof.sweatflix.repository.UserRepository;
import com.dohaof.sweatflix.repository.VenueRepository;
import com.dohaof.sweatflix.repository.VenueScheduleRepository;
import com.dohaof.sweatflix.service.VenueScheduleService;
import com.dohaof.sweatflix.util.TokenUtil;
import com.dohaof.sweatflix.vo.BookResponseDTO;
import com.dohaof.sweatflix.vo.VenueScheduleVO;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class VenusScheduleServiceImpl implements VenueScheduleService {
    private final UserRepository userRepository;
    private final VenueRepository venueRepository;
    private final VenueScheduleRepository venueScheduleRepository;
    private final ScheduleOrderRepository scheduleOrderRepository;
    private final TokenUtil tokenUtil;
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
    @Transactional
    public BookResponseDTO createOrder(Integer venueScheduleId, Integer userId) {
        VenueSchedule venueSchedule = venueScheduleRepository.findByIdForUpdate(venueScheduleId)
                .orElseThrow(() -> new SFException("409", "不存在的场地"));

        // 检查是否已预约
        boolean alreadyBooked = venueSchedule.getScheduleOrder().stream()
                .anyMatch(order ->
                        order.getUser().getId().equals(userId) &&
                                (order.getPaySuccess() == null || order.getPaySuccess())
                );
        if (alreadyBooked) throw new SFException("400", "已经预约过了");

        // 检查容量
        if (venueSchedule.getScheduleOrder().size() >= venueSchedule.getCapacity()) {
            throw new SFException("418", "预约已满");
        }

        // 创建新订单
        ScheduleOrder newOrder = new ScheduleOrder();
        newOrder.setOrderTime(LocalDateTime.now());
        newOrder.setVenueSchedule(venueSchedule);
        newOrder.setUser(userRepository.findById(userId).orElseThrow(() -> new SFException("409", "用户不存在")));
        newOrder.setPaySuccess(null);

        // 添加到列表并保存
        venueSchedule.getScheduleOrder().add(newOrder);
        scheduleOrderRepository.save(newOrder); // 级联保存关系

        return new BookResponseDTO(newOrder.getId(), "预约成功");
    }

    @Override
    public String changeOrderState(Integer scheduleOrderId, Boolean success) {
        ScheduleOrder scheduleOrder = scheduleOrderRepository.findById(scheduleOrderId).orElseThrow(() -> new SFException("409", "不存在的预约"));
        if (scheduleOrder.getPaySuccess() != null) {
            throw new SFException("409", "该订单已完成或失败");
        }
        scheduleOrder.setPaySuccess(success);
        scheduleOrderRepository.save(scheduleOrder);
        return "success is not matter";
    }
}
