package com.petspa.petbooking.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "chitietcombo")
public class ChiTietCombo {
    @EmbeddedId
    private ChiTietComboId id;
    @MapsId("maCombo")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "macombo", nullable = false)
    private DichVu combo;
    @MapsId("maDichVuCon")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "madichvucon", nullable = false)
    private DichVu dichVuCon;

    public ChiTietCombo() {}
    public ChiTietComboId getId() { return id; }
    public void setId(ChiTietComboId id) { this.id = id; }
    public DichVu getCombo() { return combo; }
    public void setCombo(DichVu combo) { this.combo = combo; }
    public DichVu getDichVuCon() { return dichVuCon; }
    public void setDichVuCon(DichVu dichVuCon) { this.dichVuCon = dichVuCon; }
}
