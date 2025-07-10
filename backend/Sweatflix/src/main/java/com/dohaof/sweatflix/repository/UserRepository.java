package com.dohaof.sweatflix.repository;

import com.dohaof.sweatflix.po.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

}
