package com.dohaof.sweatflix.service.serviceImpl;

import com.dohaof.sweatflix.exception.SFException;
import com.dohaof.sweatflix.po.*;
import com.dohaof.sweatflix.repository.*;
import com.dohaof.sweatflix.service.NoticeService;
import com.dohaof.sweatflix.util.WBUtil;
import com.dohaof.sweatflix.vo.NoticeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class NoticeServiceImpl implements NoticeService {
    private final WBUtil wbUtil;
    private final FavouriteRepository favouriteRepository;
    private final VenueRepository venueRepository;
    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;
    private final CommentsRepository commentsRepository;
    @Override
    public void NoticeFavourUser(Integer venueId) {
        Venue venue=venueRepository.findById(venueId).orElseThrow(()->new SFException("409","无对应场地"));
        String title="场馆更新";
        String content="您收藏的场馆"+venue.getName()+"更新了新的时间段！！";

        favouriteRepository.findByVenueId(venueId).forEach(e -> {
            Notice notice = new Notice();
            notice.setTitle(title);
            notice.setContent(content);
            notice.setUser(userRepository.findById(e.getUserId()).orElseThrow(() -> new SFException("409", "无对应用户")));
            notice.setRead(false);
            notice.setVenue(venue);
            notice.setCreateTime(LocalDateTime.now());
            noticeRepository.save(notice);
            wbUtil.sendToUser(e.getUserId(), "{\"type\":\"NEW_NOTICE\"}");
        });
    }

    @Override
    public void NoticeThumbsUp(Integer commentId, Integer thumbId) {
        Comments comments=commentsRepository.findById(commentId).orElseThrow(()->new SFException("409","无对应评论"));
        User TBUser=userRepository.findById(thumbId).orElseThrow(()->new SFException("409","无对应用户"));
        String title="评论更新";
        String content="您的评论"+TBUser.getUsername()+"被点赞了！！";

        Notice notice=new Notice();
        notice.setTitle(title);
        notice.setContent(content);
        notice.setUser(userRepository.findById(comments.getAuthor().getId()).orElseThrow(()->new SFException("409","无对应用户")));
        notice.setVenue(comments.getVenue());
        notice.setRead(false);
        notice.setCreateTime(LocalDateTime.now());
        noticeRepository.save(notice);
        wbUtil.sendToUser(comments.getAuthor().getId(),"{\"type\":\"NEW_NOTICE\"}");
    }

    @Override
    public List<NoticeVO> getNotice(Integer userId) {
        return noticeRepository.findByUser_Id(userId).stream().map((e)->{
            e.setRead(true);
            noticeRepository.save(e);
            return e.toVO();
        }).collect(Collectors.toList());
    }
}
