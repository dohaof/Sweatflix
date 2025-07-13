package com.dohaof.sweatflix.service;

import com.dohaof.sweatflix.po.Venue;
import com.dohaof.sweatflix.vo.VenueVO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface VenueService {
    String addVenue(Venue venue);

    String changeVenue(VenueVO venueVO);

    String removeVenue(Integer venueId);

    List<VenueVO> getAllVenue();
}
