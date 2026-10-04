package com.fithealth.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "foods")
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "category", nullable = false, length = 100)
    private String category;

    @Column(name = "nutrition_type", nullable = false, length = 30)
    private String nutritionType;

    @Column(name = "serving_unit", length = 30)
    private String servingUnit;

    @Column(name = "serving_size", precision = 8, scale = 2)
    private BigDecimal servingSize;

    @Column(name = "calories", nullable = false, precision = 10, scale = 2)
    private BigDecimal calories;

    @Column(name = "protein", nullable = false, precision = 10, scale = 2)
    private BigDecimal protein;

    @Column(name = "carbs", nullable = false, precision = 10, scale = 2)
    private BigDecimal carbs;

    @Column(name = "fat", nullable = false, precision = 10, scale = 2)
    private BigDecimal fat;

    @Column(name = "cooking_required")
    private Boolean cookingRequired = false;

    @Column(name = "is_supplement")
    private Boolean supplement = false;

    public Food() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getNutritionType() {
        return nutritionType;
    }

    public void setNutritionType(String nutritionType) {
        this.nutritionType = nutritionType;
    }

    public String getServingUnit() {
        return servingUnit;
    }

    public void setServingUnit(String servingUnit) {
        this.servingUnit = servingUnit;
    }

    public BigDecimal getServingSize() {
        return servingSize;
    }

    public void setServingSize(BigDecimal servingSize) {
        this.servingSize = servingSize;
    }

    public BigDecimal getCalories() {
        return calories;
    }

    public void setCalories(BigDecimal calories) {
        this.calories = calories;
    }

    public BigDecimal getProtein() {
        return protein;
    }

    public void setProtein(BigDecimal protein) {
        this.protein = protein;
    }

    public BigDecimal getCarbs() {
        return carbs;
    }

    public void setCarbs(BigDecimal carbs) {
        this.carbs = carbs;
    }

    public BigDecimal getFat() {
        return fat;
    }

    public void setFat(BigDecimal fat) {
        this.fat = fat;
    }

    public Boolean getCookingRequired() {
        return cookingRequired;
    }

    public void setCookingRequired(Boolean cookingRequired) {
        this.cookingRequired = cookingRequired;
    }

    public Boolean getSupplement() {
        return supplement;
    }

    public void setSupplement(Boolean supplement) {
        this.supplement = supplement;
    }

    public boolean isCookingRequired() {
        return Boolean.TRUE.equals(cookingRequired);
    }

    public boolean isSupplement() {
        return Boolean.TRUE.equals(supplement);
    }
}
