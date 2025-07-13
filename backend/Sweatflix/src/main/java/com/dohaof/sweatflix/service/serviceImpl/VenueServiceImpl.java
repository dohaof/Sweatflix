package com.dohaof.sweatflix.service.serviceImpl;

import com.dohaof.sweatflix.exception.SFException;
import com.dohaof.sweatflix.po.Venue;
import com.dohaof.sweatflix.repository.VenueRepository;
import com.dohaof.sweatflix.service.VenueService;
import com.dohaof.sweatflix.vo.VenueVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VenueServiceImpl implements VenueService {
    private final VenueRepository venueRepository;
    @Override
    public String addVenue(Venue venue) {
        venueRepository.save(venue);
        return "场地创建成功";
    }

    @Override
    public String changeVenue(VenueVO venueVO) {
        Venue venue=venueRepository.findById(venueVO.getId()).orElseThrow(()->new SFException( "409","场地不存在"));
        if(venueVO.getName()==null || venueVO.getName().isEmpty()){
            venue.setName( venueVO.getName() );
        }
        if(venueVO.getDescription()==null || venueVO.getDescription().isEmpty()){
            venue.setDescription( venueVO.getDescription() );
        }
        if(venueVO.getImage()==null || venueVO.getImage().isEmpty()){
            venue.setImage( venueVO.getImage() );
        }
        venueRepository.save(venue);

        return "场地修改成功";
    }

    @Override
    public String removeVenue(Integer venueId) {
        Venue venue=venueRepository.findById(venueId).orElseThrow(()->new SFException( "409","场地不存在"));
        venueRepository.delete(venue);
        return "场地删除成功";
    }

    @Override
    public List<VenueVO> getAllVenue() {
        return venueRepository.findAll().stream().map(Venue::toVO).collect(Collectors.toList());
    }
}
