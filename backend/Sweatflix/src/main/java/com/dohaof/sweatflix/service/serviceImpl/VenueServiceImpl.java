package com.dohaof.sweatflix.service.serviceImpl;

import com.dohaof.sweatflix.dto.ModifyVenueDTO;
import com.dohaof.sweatflix.exception.SFException;
import com.dohaof.sweatflix.po.Favourite;
import com.dohaof.sweatflix.po.Venue;
import com.dohaof.sweatflix.repository.FavouriteRepository;
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
    private final FavouriteRepository favouriteRepository;
    @Override
    public String addVenue(Venue venue) {
        venueRepository.save(venue);
        return "场地创建成功";
    }

    @Override
    public String changeVenue(ModifyVenueDTO modifyVenueDTO) {
        Venue venue=venueRepository.findById(modifyVenueDTO.getId()).orElseThrow(()->new SFException( "409","场地不存在"));
        if(modifyVenueDTO.getName()!=null && !modifyVenueDTO.getName().isEmpty()){
            venue.setName( modifyVenueDTO.getName() );
        }
        if(modifyVenueDTO.getDescription()!=null && !modifyVenueDTO.getDescription().isEmpty()){
            venue.setDescription( modifyVenueDTO.getDescription() );
        }
        if(modifyVenueDTO.getImage()!=null && !modifyVenueDTO.getImage().isEmpty()){
            venue.setImage( modifyVenueDTO.getImage() );
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

    @Override
    public VenueVO getVenueById(Integer venueId) {
        return venueRepository.findById(venueId).orElseThrow(()->new SFException( "409","场地不存在")).toVO();
    }

    @Override
    public String favour(Integer venueId, Integer userId) {
        Favourite favourite=favouriteRepository.findByUserIdAndVenueId(userId, venueId);
        if(favourite==null){
            favourite=new Favourite();
            favourite.setUserId(userId);
            favourite.setVenueId(venueId);
            favouriteRepository.save(favourite);
            return "收藏成功";
        }
        favouriteRepository.delete(favourite);
        return "取消收藏成功";
    }

    @Override
    public List<Integer> getFavourId(Integer userId) {
        return favouriteRepository.findByUserId(userId).stream().map(Favourite::getVenueId).collect(Collectors.toList());
    }
}
