package com.dohaof.sweatflix.controller;

import com.dohaof.sweatflix.dto.CommentsDTO;
import com.dohaof.sweatflix.service.CommentsService;
import com.dohaof.sweatflix.vo.CommentsVO;
import com.dohaof.sweatflix.vo.Response;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentsController {
    private final CommentsService commentsService;
    @PostMapping("")
    public Response<String> createComments(@RequestBody CommentsDTO commentsDTO,HttpServletRequest request) {
        Integer userId= (Integer) request.getAttribute("userId");
        return Response.buildSuccess(commentsService.addComments(commentsDTO,userId));
    }
    @GetMapping("/{venue_id}")
    public Response<List<CommentsVO>> getComments(@PathVariable Integer venue_id) {
        return Response.buildSuccess(commentsService.getCommentsByVenueId(venue_id));
    }
    @PostMapping("/thumbs/{comments_id}")
    public Response<String> thumbUp(@PathVariable Integer comments_id) {
        return Response.buildSuccess(commentsService.addThumbUp(comments_id));
    }
}
