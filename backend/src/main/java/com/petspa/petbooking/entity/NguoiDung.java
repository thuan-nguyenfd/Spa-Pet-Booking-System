package com.petspa.petbooking.entity;

import com.petspa.petbooking.entity.enums.NhaCungCap;
import com.petspa.petbooking.entity.enums.VaiTro;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;

@Entity
@Table(name = "nguoidung")
public class NguoiDung {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "manguoidung")
    private Integer maNguoiDung;

    @Column(name = "email", nullable = false, length = 100, unique = true)
    private String email;
    @Column(name = "matkhau", length = 255)
    private String matKhau;
    @Column(name = "hoten", nullable = false, length = 100)
    private String hoTen;
    @Column(name = "sodienthoai", length = 15, unique = true)
    private String soDienThoai;
    @Column(name = "googleid", length = 255, unique = true)
    private String googleId;
    @Enumerated(EnumType.STRING) @Column(name = "nhacungcap", nullable = false, length = 6)
    private NhaCungCap nhaCungCap;
    @Enumerated(EnumType.STRING) @Column(name = "vaitro", nullable = false, length = 8)
    private VaiTro vaiTro;
    @JdbcTypeCode(SqlTypes.TINYINT) @Column(name = "trangthai", nullable = false)
    private Integer trangThai;
    @Column(name = "ngaytao", nullable = false)
    private LocalDateTime ngayTao;
    @Column(name = "ngaycapnhat", nullable = false)
    private LocalDateTime ngayCapNhat;

    public NguoiDung() {}
    public Integer getMaNguoiDung() { return maNguoiDung; }
    public void setMaNguoiDung(Integer maNguoiDung) { this.maNguoiDung = maNguoiDung; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMatKhau() { return matKhau; }
    public void setMatKhau(String matKhau) { this.matKhau = matKhau; }
    public String getHoTen() { return hoTen; }
    public void setHoTen(String hoTen) { this.hoTen = hoTen; }
    public String getSoDienThoai() { return soDienThoai; }
    public void setSoDienThoai(String soDienThoai) { this.soDienThoai = soDienThoai; }
    public String getGoogleId() { return googleId; }
    public void setGoogleId(String googleId) { this.googleId = googleId; }
    public NhaCungCap getNhaCungCap() { return nhaCungCap; }
    public void setNhaCungCap(NhaCungCap nhaCungCap) { this.nhaCungCap = nhaCungCap; }
    public VaiTro getVaiTro() { return vaiTro; }
    public void setVaiTro(VaiTro vaiTro) { this.vaiTro = vaiTro; }
    public Integer getTrangThai() { return trangThai; }
    public void setTrangThai(Integer trangThai) { this.trangThai = trangThai; }
    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }
    public LocalDateTime getNgayCapNhat() { return ngayCapNhat; }
    public void setNgayCapNhat(LocalDateTime ngayCapNhat) { this.ngayCapNhat = ngayCapNhat; }
}
