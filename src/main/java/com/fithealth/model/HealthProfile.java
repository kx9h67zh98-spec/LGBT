package com.fithealth.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_profiles")
public class HealthProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "user_id",
        nullable = false,
        unique = true
    )
    private User user;

    @Column(nullable = false)
    private Integer age;

    @Column(
        nullable = false,
        length = 20
    )
    private String gender;

    @Column(
        nullable = false,
        precision = 6,
        scale = 2
    )
    private BigDecimal height;

    @Column(
        nullable = false,
        precision = 6,
        scale = 2
    )
    private BigDecimal weight;

    @Column(
        name = "activity_level",
        nullable = false,
        precision = 5,
        scale = 3
    )
    private BigDecimal activityLevel;

    @Column(
        nullable = false,
        length = 30
    )
    private String goal;

    @Column(
        precision = 6,
        scale = 2
    )
    private BigDecimal bmi;

    @Column(
        precision = 10,
        scale = 2
    )
    private BigDecimal bmr;

    @Column(
        precision = 10,
        scale = 2
    )
    private BigDecimal tdee;

    @Column(
        name = "target_calories",
        precision = 10,
        scale = 2
    )
    private BigDecimal targetCalories;

    @Column(
        name = "protein_target",
        precision = 10,
        scale = 2
    )
    private BigDecimal proteinTarget;

    @Column(
        name = "carbs_target",
        precision = 10,
        scale = 2
    )
    private BigDecimal carbsTarget;

    @Column(
        name = "fat_target",
        precision = 10,
        scale = 2
    )
    private BigDecimal fatTarget;

    @Column(
        name = "updated_at",
        insertable = false,
        updatable = false
    )
    private LocalDateTime updatedAt;


    public HealthProfile() {
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

    public Integer getAge() {
        return age;
    }

    public void setAge(
        Integer age
    ) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(
        String gender
    ) {
        this.gender = gender;
    }

    public BigDecimal getHeight() {
        return height;
    }

    public void setHeight(
        BigDecimal height
    ) {
        this.height = height;
    }

    public BigDecimal getWeight() {
        return weight;
    }

    public void setWeight(
        BigDecimal weight
    ) {
        this.weight = weight;
    }

    public BigDecimal getActivityLevel() {
        return activityLevel;
    }

    public void setActivityLevel(
        BigDecimal activityLevel
    ) {
        this.activityLevel = activityLevel;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(
        String goal
    ) {
        this.goal = goal;
    }

    public BigDecimal getBmi() {
        return bmi;
    }

    public void setBmi(
        BigDecimal bmi
    ) {
        this.bmi = bmi;
    }

    public BigDecimal getBmr() {
        return bmr;
    }

    public void setBmr(
        BigDecimal bmr
    ) {
        this.bmr = bmr;
    }

    public BigDecimal getTdee() {
        return tdee;
    }

    public void setTdee(
        BigDecimal tdee
    ) {
        this.tdee = tdee;
    }

    public BigDecimal getTargetCalories() {
        return targetCalories;
    }

    public void setTargetCalories(
        BigDecimal targetCalories
    ) {
        this.targetCalories = targetCalories;
    }

    public BigDecimal getProteinTarget() {
        return proteinTarget;
    }

    public void setProteinTarget(
        BigDecimal proteinTarget
    ) {
        this.proteinTarget = proteinTarget;
    }

    public BigDecimal getCarbsTarget() {
        return carbsTarget;
    }

    public void setCarbsTarget(
        BigDecimal carbsTarget
    ) {
        this.carbsTarget = carbsTarget;
    }

    public BigDecimal getFatTarget() {
        return fatTarget;
    }

    public void setFatTarget(
        BigDecimal fatTarget
    ) {
        this.fatTarget = fatTarget;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}