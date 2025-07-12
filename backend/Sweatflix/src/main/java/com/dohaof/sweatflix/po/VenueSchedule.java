package com.dohaof.sweatflix.po;
import com.dohaof.sweatflix.vo.VenueScheduleVO;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
public class VenueSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;
    @Column(nullable = false)
    private Integer capacity;
    @Column(nullable = false)
    private Double price;
    @Column
    private Boolean autoRenew;
    // 关联到具体的订单
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ScheduleOrder> scheduleOrder;
    public VenueScheduleVO toVenueScheduleVO() {
        VenueScheduleVO vo = new VenueScheduleVO();
        vo.setId(id);
        vo.setVenueId(venue.getId());
        vo.setStartTime(startTime);
        vo.setEndTime(endTime);
        vo.setCapacity(capacity);
        vo.setPrice(price);
        vo.setAutoRenew(autoRenew);
        vo.setScheduleOrdersId(scheduleOrder.stream().map(ScheduleOrder::getId).collect(Collectors.toList()));
        return vo;
    }
}