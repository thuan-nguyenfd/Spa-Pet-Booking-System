package com.petspa.petbooking.entity;

import com.petspa.petbooking.entity.enums.LoaiDichVu;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;

@Entity
@Table(name = "dichvu")
public class DichVu {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "madichvu")
    private Integer maDichVu;
    @Column(name = "ten", nullable = false, length = 150)
    private String ten;
    @Enumerated(EnumType.STRING) @Column(name = "loaidichvu", nullable = false, length = 6)
    private LoaiDichVu loaiDichVu;
    @Column(name = "thoiluongphut", nullable = false)
    private Integer thoiLuongPhut;
    @Column(name = "hinhanh", length = 255)
    private String hinhAnh;
    @Column(name = "mota", columnDefinition = "TEXT")
    private String moTa;
    @JdbcTypeCode(SqlTypes.TINYINT) @Column(name = "trangthai", nullable = false)
    private Integer trangThai;
    @Column(name = "ngaytao", nullable = false)
    private LocalDateTime ngayTao;
    @Column(name = "ngaycapnhat", nullable = false)
    private LocalDateTime ngayCapNhat;

    public DichVu() {}
    public Integer getMaDichVu() { return maDichVu; }
    public void setMaDichVu(Integer maDichVu) { this.maDichVu = maDichVu; }
    public String getTen() { return ten; }
    public void setTen(String ten) { this.ten = ten; }
    public LoaiDichVu getLoaiDichVu() { return loaiDichVu; }
    public void setLoaiDichVu(LoaiDichVu loaiDichVu) { this.loaiDichVu = loaiDichVu; }
    public Integer getThoiLuongPhut() { return thoiLuongPhut; }
    public void setThoiLuongPhut(Integer thoiLuongPhut) { this.thoiLuongPhut = thoiLuongPhut; }
    public String getHinhAnh() { return hinhAnh; }
    public void setHinhAnh(String hinhAnh) { this.hinhAnh = hinhAnh; }
    public String getMoTa() { return moTa; }
    public void setMoTa(String moTa) { this.moTa = moTa; }
    public Integer getTrangThai() { return trangThai; }
    public void setTrangThai(Integer trangThai) { this.trangThai = trangThai; }
    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }
    public LocalDateTime getNgayCapNhat() { return ngayCapNhat; }
    public void setNgayCapNhat(LocalDateTime ngayCapNhat) { this.ngayCapNhat = ngayCapNhat; }
}
