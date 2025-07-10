package com.dohaof.sweatflix.controller;

import com.dohaof.sweatflix.service.UploadService;
import com.dohaof.sweatflix.vo.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UploadController {
    private final UploadService uploadService;
    @PostMapping("/images")
    public Response<String> uploadImage(@RequestParam MultipartFile file){
        return Response.buildSuccess(uploadService.uploadImage(file));
    }
}
