package com.petspa.petbooking.entity;

import com.petspa.petbooking.entity.enums.GioiTinh;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;

@Entity
@Table(name = "nhanvien")
public class NhanVien {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "manhanvien")
    private Integer maNhanVien;
    @Column(name = "ten", nullable = false, length = 100)
    private String ten;
    @Enumerated(EnumType.STRING) @Column(name = "gioitinh", nullable = false, length = 6)
    private GioiTinh gioiTinh;
    @Column(name = "sodienthoai", nullable = false, length = 15, unique = true)
    private String soDienThoai;
    @Column(name = "email", length = 100, unique = true)
    private String email;
    @JdbcTypeCode(SqlTypes.TINYINT) @Column(name = "trangthai", nullable = false)
    private Integer trangThai;
    @Column(name = "ngaytao", nullable = false)
    private LocalDateTime ngayTao;
    @Column(name = "ngaycapnhat", nullable = false)
    private LocalDateTime ngayCapNhat;

    public NhanVien() {}
    public Integer getMaNhanVien() { return maNhanVien; }
    public void setMaNhanVien(Integer maNhanVien) { this.maNhanVien = maNhanVien; }
    public String getTen() { return ten; }
    public void setTen(String ten) { this.ten = ten; }
    public GioiTinh getGioiTinh() { return gioiTinh; }
    public void setGioiTinh(GioiTinh gioiTinh) { this.gioiTinh = gioiTinh; }
    public String getSoDienThoai() { return soDienThoai; }
    public void setSoDienThoai(String soDienThoai) { this.soDienThoai = soDienThoai; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Integer getTrangThai() { return trangThai; }
    public void setTrangThai(Integer trangThai) { this.trangThai = trangThai; }
    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }
    public LocalDateTime getNgayCapNhat() { return ngayCapNhat; }
    public void setNgayCapNhat(LocalDateTime ngayCapNhat) { this.ngayCapNhat = ngayCapNhat; }
}
