package com.dohaof.sweatflix.controller;

import com.dohaof.sweatflix.dto.ModifyVenueDTO;
import com.dohaof.sweatflix.dto.VenueCreationDTO;
import com.dohaof.sweatflix.service.VenueService;
import com.dohaof.sweatflix.vo.Response;
import com.dohaof.sweatflix.vo.VenueVO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VenueControllerTest {

    @Mock
    private VenueService venueService;
    @InjectMocks
    private VenueController venueController;

    // 创建模拟请求并设置userId属性
    private MockHttpServletRequest createAuthenticatedRequest(Integer userId) {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setAttribute("userId", userId);
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));
        return request;
    }

    @Test
    void createVenue() {
        // 准备测试数据
        VenueCreationDTO dto = new VenueCreationDTO();
        dto.setName("Test Venue");

        when(venueService.addVenue(any())).thenReturn("Venue created");

        // 执行测试
        Response<String> response = venueController.createVenue(dto);

        // 验证结果
        assertEquals("Venue created", response.getData());
        verify(venueService).addVenue(any());
    }

    @Test
    void modifyVenue() {
        // 准备测试数据
        ModifyVenueDTO dto = new ModifyVenueDTO();
        dto.setId(1);
        dto.setName("Updated Venue");

        when(venueService.changeVenue(dto)).thenReturn("Venue updated");

        // 执行测试
        Response<String> response = venueController.modifyVenue(dto);

        // 验证结果
        assertEquals("Venue updated", response.getData());
        verify(venueService).changeVenue(dto);
    }

    @Test
    void deleteVenue() {
        int venueId = 1;
        when(venueService.removeVenue(venueId)).thenReturn("Venue deleted");

        Response<String> response = venueController.deleteVenue(venueId);

        assertEquals("Venue deleted", response.getData());
        verify(venueService).removeVenue(venueId);
    }

    @Test
    void getVenues() {
        // 模拟返回数据
        VenueVO venue1 = new VenueVO();
        venue1.setId(1);
        VenueVO venue2 = new VenueVO();
        venue2.setId(2);

        when(venueService.getAllVenue()).thenReturn(Arrays.asList(venue1, venue2));

        // 执行测试
        Response<List<VenueVO>> response = venueController.getVenues();

        // 验证结果
        assertEquals(2, response.getData().size());
        assertEquals(1, response.getData().get(0).getId());
        verify(venueService).getAllVenue();
    }

    @Test
    void getVenueById() {
        int venueId = 1;
        VenueVO venue = new VenueVO();
        venue.setId(venueId);

        when(venueService.getVenueById(venueId)).thenReturn(venue);

        Response<VenueVO> response = venueController.getVenues(venueId);

        assertEquals(venueId, response.getData().getId());
        verify(venueService).getVenueById(venueId);
    }

    @Test
    void favourVenue() {
        // 设置认证上下文
        MockHttpServletRequest request = createAuthenticatedRequest(1001);
        int venueId = 5;

        when(venueService.favour(venueId, 1001)).thenReturn("Favour success");

        // 执行测试
        Response<String> response = venueController.favourVenue(venueId, request);

        // 验证结果
        assertEquals("Favour success", response.getData());
        verify(venueService).favour(venueId, 1001);
    }

}