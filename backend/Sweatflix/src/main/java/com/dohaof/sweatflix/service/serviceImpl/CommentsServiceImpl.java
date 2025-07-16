package com.dohaof.sweatflix.service.serviceImpl;

import com.dohaof.sweatflix.dto.CommentsDTO;
import com.dohaof.sweatflix.exception.SFException;
import com.dohaof.sweatflix.po.Comments;
import com.dohaof.sweatflix.repository.CommentsRepository;
import com.dohaof.sweatflix.repository.UserRepository;
import com.dohaof.sweatflix.repository.VenueRepository;
import com.dohaof.sweatflix.service.CommentsService;
import com.dohaof.sweatflix.vo.CommentsVO;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentsServiceImpl implements CommentsService {
    private final CommentsRepository commentsRepository;
    private final UserRepository userRepository;
    private final VenueRepository venueRepository;
    @Override
    public String addComments(CommentsDTO commentsDTO,Integer userId) {
        Comments comments = new Comments();
        comments.setAuthor(userRepository.findById(userId).orElseThrow(()->new SFException("409","用户不存在")));
        comments.setVenue(venueRepository.findById(commentsDTO.getVenueId()).orElseThrow(()->new SFException( "409","场地不存在")));
        comments.setContent(commentsDTO.getContent());
        comments.setImages(commentsDTO.getImages());
        comments.setRate(commentsDTO.getRate());
        comments.setThumbUpCount(0);
        comments.setCreatedAt(LocalDateTime.now());
        commentsRepository.save(comments);
        return "评论成功";
    }

    @Override
    public List<CommentsVO> getCommentsByVenueId(Integer venueId) {
        return commentsRepository.findByVenue_Id(venueId).stream().map(Comments::toVO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public String addThumbUp(Integer commentsId) {
        Comments comments=commentsRepository.findByIdForUpdate(commentsId).orElseThrow(()->new SFException("409","评论不存在"));
        comments.setThumbUpCount(comments.getThumbUpCount()+1);
        commentsRepository.save(comments);
        return "点赞成功";
    }
}
