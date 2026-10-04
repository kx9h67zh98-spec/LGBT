package com.fithealth.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "exercises")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "muscle_group", nullable = false, length = 100)
    private String muscleGroup;

    @Column(name = "equipment", length = 100)
    private String equipment;

    @Column(name = "difficulty", length = 50)
    private String difficulty;

    @Column(name = "exercise_type", length = 50)
    private String exerciseType;

    @Column(name = "video_url", length = 500)
    private String videoUrl;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getMuscleGroup() {
        return muscleGroup;
    }

    public String getEquipment() {
        return equipment;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public String getExerciseType() {
        return exerciseType;
    }

    public String getVideoUrl() {
        return videoUrl;
    }
}
