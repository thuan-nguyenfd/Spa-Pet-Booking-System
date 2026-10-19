package com.petspa.petbooking.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;

@Entity
@Table(name = "danhgia")
public class DanhGia {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "madanhgia")
    private Integer maDanhGia;
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "madatlich", nullable = false, unique = true)
    private DatLich datLich;
    @JdbcTypeCode(SqlTypes.TINYINT) @Column(name = "sosao", nullable = false)
    private Integer soSao;
    @Column(name = "binhluan", columnDefinition = "TEXT")
    private String binhLuan;
    @JdbcTypeCode(SqlTypes.TINYINT) @Column(name = "is_hidden", nullable = false)
    private Integer isHidden;
    @Column(name = "ngaytao", nullable = false)
    private LocalDateTime ngayTao;
    @Column(name = "ngaycapnhat", nullable = false)
    private LocalDateTime ngayCapNhat;

    public DanhGia() {}
    public Integer getMaDanhGia() { return maDanhGia; }
    public void setMaDanhGia(Integer maDanhGia) { this.maDanhGia = maDanhGia; }
    public DatLich getDatLich() { return datLich; }
    public void setDatLich(DatLich datLich) { this.datLich = datLich; }
    public Integer getSoSao() { return soSao; }
    public void setSoSao(Integer soSao) { this.soSao = soSao; }
    public String getBinhLuan() { return binhLuan; }
    public void setBinhLuan(String binhLuan) { this.binhLuan = binhLuan; }
    public Integer getIsHidden() { return isHidden; }
    public void setIsHidden(Integer isHidden) { this.isHidden = isHidden; }
    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }
    public LocalDateTime getNgayCapNhat() { return ngayCapNhat; }
    public void setNgayCapNhat(LocalDateTime ngayCapNhat) { this.ngayCapNhat = ngayCapNhat; }
}
