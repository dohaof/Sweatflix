package com.dohaof.sweatflix.po;

import com.dohaof.sweatflix.vo.DetailOrderVO;
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
    @ManyToOne
    private User user;
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "venue_schedule_id")
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
    public DetailOrderVO toDetailVO() {
        DetailOrderVO vo = new DetailOrderVO();
        vo.setId(id);
        vo.setOrderTime(orderTime);
        vo.setUserId(user.getId());
        vo.setVenueScheduleId(venueSchedule.getId());
        vo.setPaySuccess(paySuccess);
        vo.setVenueId(venueSchedule.getVenue().getId());
        vo.setVenueImage(venueSchedule.getVenue().getImage());
        vo.setVenueName(venueSchedule.getVenue().getName());
        vo.setStartTime(venueSchedule.getStartTime());
        vo.setEndTime(venueSchedule.getEndTime());
        vo.setPrice(venueSchedule.getPrice());
        return vo;
    }
}
