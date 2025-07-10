package com.dohaof.sweatflix.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
@Service
public interface UploadService {
    String uploadImage(MultipartFile file);
}
