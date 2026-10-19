package com.petspa.petbooking.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ChiTietComboId implements Serializable {
    @Column(name = "macombo")
    private Integer maCombo;
    @Column(name = "madichvucon")
    private Integer maDichVuCon;

    public ChiTietComboId() {}
    public ChiTietComboId(Integer maCombo, Integer maDichVuCon) {
        this.maCombo = maCombo;
        this.maDichVuCon = maDichVuCon;
    }
    public Integer getMaCombo() { return maCombo; }
    public void setMaCombo(Integer maCombo) { this.maCombo = maCombo; }
    public Integer getMaDichVuCon() { return maDichVuCon; }
    public void setMaDichVuCon(Integer maDichVuCon) { this.maDichVuCon = maDichVuCon; }

    @Override
    public boolean equals(Object object) {
        if (this == object) return true;
        if (!(object instanceof ChiTietComboId that)) return false;
        return Objects.equals(maCombo, that.maCombo) && Objects.equals(maDichVuCon, that.maDichVuCon);
    }

    @Override
    public int hashCode() {
        return Objects.hash(maCombo, maDichVuCon);
    }
}
