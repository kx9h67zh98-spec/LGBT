package com.fithealth.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "water_logs",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_water_user_date",
            columnNames = {
                "user_id",
                "log_date"
            }
        )
    }
)
public class WaterLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "user_id",
        nullable = false
    )
    private User user;

    @Column(
        name = "log_date",
        nullable = false
    )
    private LocalDate logDate;

    @Column(
        name = "amount_ml",
        nullable = false
    )
    private Integer amountMl;

    @Column(
        name = "created_at",
        insertable = false,
        updatable = false
    )
    private LocalDateTime createdAt;

    @Column(
        name = "updated_at",
        insertable = false,
        updatable = false
    )
    private LocalDateTime updatedAt;


    public WaterLog() {
    }


    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(
        User user
    ) {
        this.user = user;
    }

    public LocalDate getLogDate() {
        return logDate;
    }

    public void setLogDate(
        LocalDate logDate
    ) {
        this.logDate = logDate;
    }

    public Integer getAmountMl() {
        return amountMl;
    }

    public void setAmountMl(
        Integer amountMl
    ) {
        this.amountMl = amountMl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
