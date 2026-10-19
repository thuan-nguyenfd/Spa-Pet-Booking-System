package com.petspa.petbooking.repository;

import com.petspa.petbooking.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NhanVienRepository extends JpaRepository<NhanVien, Integer> {
    // TODO: Add queries when staff management is implemented.
}
