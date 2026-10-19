package com.petspa.petbooking.entity;

import com.petspa.petbooking.entity.enums.PhuongThucThanhToan;
import com.petspa.petbooking.entity.enums.TrangThaiGiaoDich;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "thanhtoan")
public class ThanhToan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mathanhtoan")
    private Integer maThanhToan;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "madatlich", nullable = false)
    private DatLich datLich;
    @Enumerated(EnumType.STRING) @Column(name = "phuongthuc", nullable = false, length = 5)
    private PhuongThucThanhToan phuongThuc;
    @Column(name = "sotien", nullable = false, precision = 12, scale = 2)
    private BigDecimal soTien;
    @Column(name = "vnp_txn_ref", length = 100, unique = true)
    private String vnpTxnRef;
    @Column(name = "vnp_transaction_no", length = 100, unique = true)
    private String vnpTransactionNo;
    @Enumerated(EnumType.STRING) @Column(name = "trangthai", nullable = false, length = 9)
    private TrangThaiGiaoDich trangThai;
    @Column(name = "vnp_response_code", length = 10)
    private String vnpResponseCode;
    @Column(name = "vnp_transaction_status", length = 10)
    private String vnpTransactionStatus;
    @Column(name = "vnp_bank_code", length = 20)
    private String vnpBankCode;
    @Column(name = "vnp_bank_tran_no", length = 255)
    private String vnpBankTranNo;
    @Column(name = "vnp_card_type", length = 20)
    private String vnpCardType;
    @Column(name = "message", length = 255)
    private String message;
    @Column(name = "thoigianthanhtoan")
    private LocalDateTime thoiGianThanhToan;
    @Column(name = "ngaytao", nullable = false)
    private LocalDateTime ngayTao;
    @Column(name = "ngaycapnhat", nullable = false)
    private LocalDateTime ngayCapNhat;

    public ThanhToan() {}
    public Integer getMaThanhToan() { return maThanhToan; }
    public void setMaThanhToan(Integer maThanhToan) { this.maThanhToan = maThanhToan; }
    public DatLich getDatLich() { return datLich; }
    public void setDatLich(DatLich datLich) { this.datLich = datLich; }
    public PhuongThucThanhToan getPhuongThuc() { return phuongThuc; }
    public void setPhuongThuc(PhuongThucThanhToan phuongThuc) { this.phuongThuc = phuongThuc; }
    public BigDecimal getSoTien() { return soTien; }
    public void setSoTien(BigDecimal soTien) { this.soTien = soTien; }
    public String getVnpTxnRef() { return vnpTxnRef; }
    public void setVnpTxnRef(String vnpTxnRef) { this.vnpTxnRef = vnpTxnRef; }
    public String getVnpTransactionNo() { return vnpTransactionNo; }
    public void setVnpTransactionNo(String vnpTransactionNo) { this.vnpTransactionNo = vnpTransactionNo; }
    public TrangThaiGiaoDich getTrangThai() { return trangThai; }
    public void setTrangThai(TrangThaiGiaoDich trangThai) { this.trangThai = trangThai; }
    public String getVnpResponseCode() { return vnpResponseCode; }
    public void setVnpResponseCode(String vnpResponseCode) { this.vnpResponseCode = vnpResponseCode; }
    public String getVnpTransactionStatus() { return vnpTransactionStatus; }
    public void setVnpTransactionStatus(String vnpTransactionStatus) { this.vnpTransactionStatus = vnpTransactionStatus; }
    public String getVnpBankCode() { return vnpBankCode; }
    public void setVnpBankCode(String vnpBankCode) { this.vnpBankCode = vnpBankCode; }
    public String getVnpBankTranNo() { return vnpBankTranNo; }
    public void setVnpBankTranNo(String vnpBankTranNo) { this.vnpBankTranNo = vnpBankTranNo; }
    public String getVnpCardType() { return vnpCardType; }
    public void setVnpCardType(String vnpCardType) { this.vnpCardType = vnpCardType; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public LocalDateTime getThoiGianThanhToan() { return thoiGianThanhToan; }
    public void setThoiGianThanhToan(LocalDateTime thoiGianThanhToan) { this.thoiGianThanhToan = thoiGianThanhToan; }
    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }
    public LocalDateTime getNgayCapNhat() { return ngayCapNhat; }
    public void setNgayCapNhat(LocalDateTime ngayCapNhat) { this.ngayCapNhat = ngayCapNhat; }
}
