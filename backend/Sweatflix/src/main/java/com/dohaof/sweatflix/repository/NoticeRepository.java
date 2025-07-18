package com.dohaof.sweatflix.repository;

import com.dohaof.sweatflix.po.Notice;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface NoticeRepository extends CrudRepository<Notice, Integer> {
    List<Notice> findByUser_Id(Integer userId);
}
