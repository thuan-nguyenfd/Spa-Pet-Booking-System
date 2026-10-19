package com.petspa.petbooking.repository;

import com.petspa.petbooking.entity.GiaDichVu;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GiaDichVuRepository extends JpaRepository<GiaDichVu, Integer> {
    // TODO: Add queries when weight-based price lookup is implemented.
}
