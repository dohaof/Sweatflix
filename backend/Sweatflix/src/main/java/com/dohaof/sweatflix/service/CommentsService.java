package com.dohaof.sweatflix.service;

import com.dohaof.sweatflix.dto.CommentsDTO;
import com.dohaof.sweatflix.vo.CommentsVO;
import com.dohaof.sweatflix.vo.VenueVO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CommentsService {
    String addComments(CommentsDTO commentsDTO,Integer userId);

    List<CommentsVO> getCommentsByVenueId(Integer venueId);

    String addThumbUp(Integer commentsId);
}
