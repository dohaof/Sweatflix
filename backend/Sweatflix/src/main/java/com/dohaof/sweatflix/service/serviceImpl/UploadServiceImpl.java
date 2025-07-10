package com.dohaof.sweatflix.service.serviceImpl;

import com.dohaof.sweatflix.exception.SFException;
import com.dohaof.sweatflix.service.UploadService;
import com.dohaof.sweatflix.util.OssUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UploadServiceImpl implements UploadService {
    private final OssUtil ossUtil;
    public String uploadImage(MultipartFile file) {
        try {
            return ossUtil.uploadImage(file.getOriginalFilename(),file.getInputStream());
        }catch (Exception e){
            e.printStackTrace();
            throw new SFException("418","上传失败");
        }
    }

}
