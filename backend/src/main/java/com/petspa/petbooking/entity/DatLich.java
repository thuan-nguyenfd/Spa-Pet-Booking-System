package com.petspa.petbooking.entity;

import com.petspa.petbooking.entity.enums.LoaiThuCung;
import com.petspa.petbooking.entity.enums.TrangThaiDatLich;
import com.petspa.petbooking.entity.enums.TrangThaiThanhToan;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "datlich")
public class DatLich {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "madatlich")
    private Integer maDatLich;
    @Column(name = "codedatlich", nullable = false, length = 30, unique = true)
    private String codeDatLich;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "manguoidung", nullable = false)
    private NguoiDung nguoiDung;
    @Column(name = "tenlienhe", nullable = false, length = 100)
    private String tenLienHe;
    @Column(name = "sdtlienhe", nullable = false, length = 15)
    private String sdtLienHe;
    @Column(name = "emaillienhe", nullable = false, length = 100)
    private String emailLienHe;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mathucung", nullable = false)
    private ThuCung thuCung;
    @Column(name = "tenthucung", nullable = false, length = 100)
    private String tenThuCung;
    @Enumerated(EnumType.STRING) @Column(name = "loaithucung", nullable = false, length = 5)
    private LoaiThuCung loaiThuCung;
    @Column(name = "cannangthucung", nullable = false, precision = 5, scale = 2)
    private BigDecimal canNangThuCung;
    @Column(name = "ghichuthucung", columnDefinition = "TEXT")
    private String ghiChuThuCung;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "manhanvien", nullable = false)
    private NhanVien nhanVien;
    @Column(name = "ngayhen", nullable = false)
    private LocalDate ngayHen;
    @Column(name = "giobatdau", nullable = false)
    private LocalTime gioBatDau;
    @Column(name = "gioketthuc", nullable = false)
    private LocalTime gioKetThuc;
    @Column(name = "tongtien", nullable = false, precision = 12, scale = 2)
    private BigDecimal tongTien;
    @Enumerated(EnumType.STRING) @Column(name = "trangthaidatlich", nullable = false, length = 10)
    private TrangThaiDatLich trangThaiDatLich;
    @Enumerated(EnumType.STRING) @Column(name = "trangthaithanhtoan", nullable = false, length = 6)
    private TrangThaiThanhToan trangThaiThanhToan;
    @Column(name = "lydohuy", length = 255)
    private String lyDoHuy;
    @Column(name = "ngaytao", nullable = false)
    private LocalDateTime ngayTao;
    @Column(name = "ngaycapnhat", nullable = false)
    private LocalDateTime ngayCapNhat;

    public DatLich() {}
    public Integer getMaDatLich() { return maDatLich; }
    public void setMaDatLich(Integer maDatLich) { this.maDatLich = maDatLich; }
    public String getCodeDatLich() { return codeDatLich; }
    public void setCodeDatLich(String codeDatLich) { this.codeDatLich = codeDatLich; }
    public NguoiDung getNguoiDung() { return nguoiDung; }
    public void setNguoiDung(NguoiDung nguoiDung) { this.nguoiDung = nguoiDung; }
    public String getTenLienHe() { return tenLienHe; }
    public void setTenLienHe(String tenLienHe) { this.tenLienHe = tenLienHe; }
    public String getSdtLienHe() { return sdtLienHe; }
    public void setSdtLienHe(String sdtLienHe) { this.sdtLienHe = sdtLienHe; }
    public String getEmailLienHe() { return emailLienHe; }
    public void setEmailLienHe(String emailLienHe) { this.emailLienHe = emailLienHe; }
    public ThuCung getThuCung() { return thuCung; }
    public void setThuCung(ThuCung thuCung) { this.thuCung = thuCung; }
    public String getTenThuCung() { return tenThuCung; }
    public void setTenThuCung(String tenThuCung) { this.tenThuCung = tenThuCung; }
    public LoaiThuCung getLoaiThuCung() { return loaiThuCung; }
    public void setLoaiThuCung(LoaiThuCung loaiThuCung) { this.loaiThuCung = loaiThuCung; }
    public BigDecimal getCanNangThuCung() { return canNangThuCung; }
    public void setCanNangThuCung(BigDecimal canNangThuCung) { this.canNangThuCung = canNangThuCung; }
    public String getGhiChuThuCung() { return ghiChuThuCung; }
    public void setGhiChuThuCung(String ghiChuThuCung) { this.ghiChuThuCung = ghiChuThuCung; }
    public NhanVien getNhanVien() { return nhanVien; }
    public void setNhanVien(NhanVien nhanVien) { this.nhanVien = nhanVien; }
    public LocalDate getNgayHen() { return ngayHen; }
    public void setNgayHen(LocalDate ngayHen) { this.ngayHen = ngayHen; }
    public LocalTime getGioBatDau() { return gioBatDau; }
    public void setGioBatDau(LocalTime gioBatDau) { this.gioBatDau = gioBatDau; }
    public LocalTime getGioKetThuc() { return gioKetThuc; }
    public void setGioKetThuc(LocalTime gioKetThuc) { this.gioKetThuc = gioKetThuc; }
    public BigDecimal getTongTien() { return tongTien; }
    public void setTongTien(BigDecimal tongTien) { this.tongTien = tongTien; }
    public TrangThaiDatLich getTrangThaiDatLich() { return trangThaiDatLich; }
    public void setTrangThaiDatLich(TrangThaiDatLich trangThaiDatLich) { this.trangThaiDatLich = trangThaiDatLich; }
    public TrangThaiThanhToan getTrangThaiThanhToan() { return trangThaiThanhToan; }
    public void setTrangThaiThanhToan(TrangThaiThanhToan trangThaiThanhToan) { this.trangThaiThanhToan = trangThaiThanhToan; }
    public String getLyDoHuy() { return lyDoHuy; }
    public void setLyDoHuy(String lyDoHuy) { this.lyDoHuy = lyDoHuy; }
    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }
    public LocalDateTime getNgayCapNhat() { return ngayCapNhat; }
    public void setNgayCapNhat(LocalDateTime ngayCapNhat) { this.ngayCapNhat = ngayCapNhat; }
}
