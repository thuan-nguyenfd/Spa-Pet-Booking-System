package com.petspa.petbooking.repository;

import com.petspa.petbooking.entity.ThanhToan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ThanhToanRepository extends JpaRepository<ThanhToan, Integer> {
    // TODO: Add queries when payment features are implemented.
}
