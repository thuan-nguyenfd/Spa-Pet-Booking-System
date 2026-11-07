export const PET_TYPES = { DOG: 'Chó', CAT: 'Mèo', OTHER: 'Khác' }
// SQL correspondence only; the eventual REST DTO must be agreed with the backend.
export function mapUserRow(row) {
  return {
    id: Number(row.manguoidung),
    email: row.email,
    fullName: row.hoten,
    phone: row.sodienthoai,
    provider: row.nhacungcap,
    role: row.vaitro,
    status: Number(row.trangthai),
    createdAt: row.ngaytao,
    updatedAt: row.ngaycapnhat,
  }
}
export function mapPetRow(row) {
  return {
    id: Number(row.mathucung),
    ownerId: Number(row.manguoidung),
    name: row.tenthucung,
    type: row.loaithucung,
    species: PET_TYPES[row.loaithucung],
    breed: row.giong,
    weightKg: Number(row.cannang),
    imageUrl: row.hinhanh || '',
    status: Number(row.trangthai),
    createdAt: row.ngaytao,
    updatedAt: row.ngaycapnhat,
    avatarTone: 'honey',
  }
}
