package com.dohaof.sweatflix.Service;

import com.dohaof.sweatflix.dto.BookResponseDTO;
import com.dohaof.sweatflix.dto.VScheduleDTO;
import com.dohaof.sweatflix.exception.SFException;
import com.dohaof.sweatflix.po.ScheduleOrder;
import com.dohaof.sweatflix.po.User;
import com.dohaof.sweatflix.po.Venue;
import com.dohaof.sweatflix.po.VenueSchedule;
import com.dohaof.sweatflix.repository.ScheduleOrderRepository;
import com.dohaof.sweatflix.repository.UserRepository;
import com.dohaof.sweatflix.repository.VenueRepository;
import com.dohaof.sweatflix.repository.VenueScheduleRepository;
import com.dohaof.sweatflix.service.serviceImpl.VenusScheduleServiceImpl;
import com.dohaof.sweatflix.vo.DetailOrderVO;
import com.dohaof.sweatflix.vo.VenueScheduleVO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VenueScheduleServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private VenueRepository venueRepository;
    @Mock
    private VenueScheduleRepository venueScheduleRepository;
    @Mock
    private ScheduleOrderRepository scheduleOrderRepository;

    @InjectMocks
    private VenusScheduleServiceImpl venueScheduleService;

    private VenueSchedule venueSchedule;
    private ScheduleOrder scheduleOrder;
    private User user;
    private Venue venue;

    @BeforeEach
    void setUp() {
        venue = new Venue();
        venue.setId(1);

        user = new User();
        user.setId(100);

        venueSchedule = new VenueSchedule();
        venueSchedule.setId(10);
        venueSchedule.setVenue(venue);
        venueSchedule.setCapacity(5);
        venueSchedule.setPrice(100.0);
        venueSchedule.setStartTime(LocalDateTime.now());
        venueSchedule.setEndTime(LocalDateTime.now().plusHours(2));
        venueSchedule.setScheduleOrder(new ArrayList<ScheduleOrder>() {});
        scheduleOrder = new ScheduleOrder();
        scheduleOrder.setId(20);
        scheduleOrder.setUser(user);
        scheduleOrder.setVenueSchedule(venueSchedule);
    }

    // 测试添加场地预约
    @Test
    void addCreateVenueSchedule_Success() {
        // 准备测试数据
        VScheduleDTO dto = new VScheduleDTO();
        dto.setVenueId(1);
        dto.setCapacity(10);
        dto.setPrice(200.0);
        dto.setStartTime(LocalDateTime.now());
        dto.setEndTime(LocalDateTime.now().plusHours(3));

        when(venueRepository.findById(1)).thenReturn(Optional.of(venue));

        // 执行方法
        String result = venueScheduleService.addCreateVenueSchedule(dto);

        // 验证结果
        assertEquals("创建预约时间段成功", result);
        verify(venueRepository).findById(1);
        verify(venueScheduleRepository).save(any(VenueSchedule.class));
    }

    @Test
    void addCreateVenueSchedule_VenueNotFound() {
        VScheduleDTO dto = new VScheduleDTO();
        dto.setVenueId(999);

        when(venueRepository.findById(999)).thenReturn(Optional.empty());

        SFException exception = assertThrows(SFException.class, () ->
                venueScheduleService.addCreateVenueSchedule(dto)
        );

        assertEquals("409", exception.getCode());
        assertEquals("不存在的场地", exception.getMessage());
    }

    // 测试删除预约
    @Test
    void removeScheduleOrder_Success() {
        when(venueScheduleRepository.findById(10)).thenReturn(Optional.of(venueSchedule));

        String result = venueScheduleService.removeScheduleOrder(10);

        assertEquals("删除成功", result);
        verify(venueScheduleRepository).delete(venueSchedule);
    }

    @Test
    void removeScheduleOrder_NotFound() {
        when(venueScheduleRepository.findById(99)).thenReturn(Optional.empty());

        SFException exception = assertThrows(SFException.class, () ->
                venueScheduleService.removeScheduleOrder(99)
        );

        assertEquals("409", exception.getCode());
        assertEquals("不存在的场地", exception.getMessage());
    }

    // 测试获取场地预约列表
    @Test
    void getScheduleByVenueID_Success() {
        when(venueRepository.findById(1)).thenReturn(Optional.of(venue));
        when(venueScheduleRepository.findByVenue(venue)).thenReturn(Collections.singletonList(venueSchedule));

        List<VenueScheduleVO> result = venueScheduleService.getScheduleByVenueID(1);

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        verify(venueRepository).findById(1);
    }

    @Test
    void getScheduleByVenueID_VenueNotFound() {
        when(venueRepository.findById(999)).thenReturn(Optional.empty());

        SFException exception = assertThrows(SFException.class, () ->
                venueScheduleService.getScheduleByVenueID(999)
        );

        assertEquals("409", exception.getCode());
        assertEquals("不存在的场地", exception.getMessage());
    }

    // 测试创建订单
    @Test
    void createOrder_Success() {
        when(venueScheduleRepository.findByIdForUpdate(10)).thenReturn(Optional.of(venueSchedule));
        when(userRepository.findById(100)).thenReturn(Optional.of(user));

        BookResponseDTO response = venueScheduleService.createOrder(10, 100);

        assertNotNull(response);
        assertEquals("预约成功", response.getInfo());
        verify(scheduleOrderRepository).save(any(ScheduleOrder.class));
    }

    @Test
    void createOrder_VenueScheduleNotFound() {
        when(venueScheduleRepository.findByIdForUpdate(99)).thenReturn(Optional.empty());

        SFException exception = assertThrows(SFException.class, () ->
                venueScheduleService.createOrder(99, 100)
        );

        assertEquals("409", exception.getCode());
        assertEquals("不存在的场地", exception.getMessage());
    }



    // 测试修改订单状态
    @Test
    void changeOrderState_Success() {
        when(scheduleOrderRepository.findById(20)).thenReturn(Optional.of(scheduleOrder));

        String result = venueScheduleService.changeOrderState(20, true);

        assertEquals("success is not matter", result);
        assertTrue(scheduleOrder.getPaySuccess());
        verify(scheduleOrderRepository).save(scheduleOrder);
    }

    @Test
    void changeOrderState_OrderNotFound() {
        when(scheduleOrderRepository.findById(99)).thenReturn(Optional.empty());

        SFException exception = assertThrows(SFException.class, () ->
                venueScheduleService.changeOrderState(99, true)
        );

        assertEquals("409", exception.getCode());
        assertEquals("不存在的预约", exception.getMessage());
    }

    @Test
    void changeOrderState_AlreadyProcessed() {
        scheduleOrder.setPaySuccess(true); // 标记为已处理

        when(scheduleOrderRepository.findById(20)).thenReturn(Optional.of(scheduleOrder));

        SFException exception = assertThrows(SFException.class, () ->
                venueScheduleService.changeOrderState(20, false)
        );

        assertEquals("409", exception.getCode());
        assertEquals("该订单已完成或失败", exception.getMessage());
    }

    // 测试获取用户预约列表
    @Test
    void getScheduleByUserID_Success() {
        when(scheduleOrderRepository.findScheduleOrderByUser_Id(100))
                .thenReturn(Collections.singletonList(scheduleOrder));

        List<DetailOrderVO> result = venueScheduleService.getScheduleByUSerID(100);

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }
}
