package com.dohaof.sweatflix.po;

import com.dohaof.sweatflix.vo.ScheduleOrderVO;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class ScheduleOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @OneToOne
    private User user;
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private VenueSchedule venueSchedule;
    private LocalDateTime orderTime;
    private Boolean paySuccess;
    public ScheduleOrderVO toVO() {
        ScheduleOrderVO vo = new ScheduleOrderVO();
        vo.setId(id);
        vo.setOrderTime(orderTime);
        vo.setUserId(user.getId());
        vo.setVenueScheduleId(venueSchedule.getId());
        vo.setPaySuccess(paySuccess);
        return vo;
    }
}
