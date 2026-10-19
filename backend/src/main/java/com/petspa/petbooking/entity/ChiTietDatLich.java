package com.petspa.petbooking.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "chitietdatlich", uniqueConstraints = @UniqueConstraint(
        name = "uq_chitietdatlich", columnNames = {"madatlich", "madichvu"}))
public class ChiTietDatLich {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "madatlich", nullable = false)
    private DatLich datLich;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "madichvu", nullable = false)
    private DichVu dichVu;
    @Column(name = "tendichvu", nullable = false, length = 150)
    private String tenDichVu;
    @Column(name = "gia", nullable = false, precision = 12, scale = 2)
    private BigDecimal gia;
    @Column(name = "thoiluongphut", nullable = false)
    private Integer thoiLuongPhut;

    public ChiTietDatLich() {}
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public DatLich getDatLich() { return datLich; }
    public void setDatLich(DatLich datLich) { this.datLich = datLich; }
    public DichVu getDichVu() { return dichVu; }
    public void setDichVu(DichVu dichVu) { this.dichVu = dichVu; }
    public String getTenDichVu() { return tenDichVu; }
    public void setTenDichVu(String tenDichVu) { this.tenDichVu = tenDichVu; }
    public BigDecimal getGia() { return gia; }
    public void setGia(BigDecimal gia) { this.gia = gia; }
    public Integer getThoiLuongPhut() { return thoiLuongPhut; }
    public void setThoiLuongPhut(Integer thoiLuongPhut) { this.thoiLuongPhut = thoiLuongPhut; }
}
