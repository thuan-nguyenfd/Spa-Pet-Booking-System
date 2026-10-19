package com.petspa.petbooking.entity;

import com.petspa.petbooking.entity.enums.LoaiThuCung;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "thucung")
public class ThuCung {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mathucung")
    private Integer maThuCung;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "manguoidung", nullable = false)
    private NguoiDung nguoiDung;
    @Column(name = "tenthucung", nullable = false, length = 100)
    private String tenThuCung;
    @Enumerated(EnumType.STRING) @Column(name = "loaithucung", nullable = false, length = 5)
    private LoaiThuCung loaiThuCung;
    @Column(name = "giong", length = 100)
    private String giong;
    @Column(name = "cannang", nullable = false, precision = 5, scale = 2)
    private BigDecimal canNang;
    @Column(name = "hinhanh", length = 255)
    private String hinhAnh;
    @JdbcTypeCode(SqlTypes.TINYINT) @Column(name = "trangthai", nullable = false)
    private Integer trangThai;
    @Column(name = "ngaytao", nullable = false)
    private LocalDateTime ngayTao;
    @Column(name = "ngaycapnhat", nullable = false)
    private LocalDateTime ngayCapNhat;

    public ThuCung() {}
    public Integer getMaThuCung() { return maThuCung; }
    public void setMaThuCung(Integer maThuCung) { this.maThuCung = maThuCung; }
    public NguoiDung getNguoiDung() { return nguoiDung; }
    public void setNguoiDung(NguoiDung nguoiDung) { this.nguoiDung = nguoiDung; }
    public String getTenThuCung() { return tenThuCung; }
    public void setTenThuCung(String tenThuCung) { this.tenThuCung = tenThuCung; }
    public LoaiThuCung getLoaiThuCung() { return loaiThuCung; }
    public void setLoaiThuCung(LoaiThuCung loaiThuCung) { this.loaiThuCung = loaiThuCung; }
    public String getGiong() { return giong; }
    public void setGiong(String giong) { this.giong = giong; }
    public BigDecimal getCanNang() { return canNang; }
    public void setCanNang(BigDecimal canNang) { this.canNang = canNang; }
    public String getHinhAnh() { return hinhAnh; }
    public void setHinhAnh(String hinhAnh) { this.hinhAnh = hinhAnh; }
    public Integer getTrangThai() { return trangThai; }
    public void setTrangThai(Integer trangThai) { this.trangThai = trangThai; }
    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }
    public LocalDateTime getNgayCapNhat() { return ngayCapNhat; }
    public void setNgayCapNhat(LocalDateTime ngayCapNhat) { this.ngayCapNhat = ngayCapNhat; }
}
