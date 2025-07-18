package com.dohaof.sweatflix.service;

import com.dohaof.sweatflix.vo.NoticeVO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface NoticeService {
    void NoticeFavourUser(Integer venueId);
    void NoticeThumbsUp(Integer commentId, Integer thumbId);
    List<NoticeVO> getNotice(Integer userId);
}
