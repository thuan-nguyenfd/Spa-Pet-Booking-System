function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null)
}

function numericId(value) {
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

function numericValue(value, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function mapService(service = {}) {
  const serviceId = numericId(firstDefined(service.serviceId, service.madichvu, service.id))
  return {
    id: serviceId,
    serviceId,
    bookingDetailId: numericId(firstDefined(service.bookingDetailId, service.detailId, service.id)),
    name: firstDefined(service.name, service.serviceName, service.tendichvu, ''),
    price: numericValue(firstDefined(service.price, service.gia)),
    durationMinutes: numericValue(firstDefined(service.durationMinutes, service.duration, service.thoiluongphut)),
  }
}

export function mapBookingResponse(response = {}) {
  const contactSource = response.contact ?? response.contactSnapshot ?? {}
  const petSource = response.pet ?? response.petSnapshot ?? {}
  const employeeSource = response.employee ?? {}
  const appointmentSource = response.appointment ?? {}
  const paymentSource = response.payment ?? {}
  const reviewSource = response.review ?? null
  const bookingStatus = String(firstDefined(response.bookingStatus, response.status, response.trangthaidatlich, 'PENDING')).toUpperCase()
  const paymentStatus = String(firstDefined(response.paymentStatus, response.trangthaithanhtoan, 'UNPAID')).toUpperCase()
  const rawServices = firstDefined(response.services, response.bookingDetails, response.details, response.chitietdatlich, [])
  const petType = firstDefined(petSource.type, petSource.petType, petSource.loaithucung, '')

  return {
    id: numericId(firstDefined(response.id, response.bookingId, response.madatlich)),
    code: firstDefined(response.code, response.bookingCode, response.codedatlich, ''),
    userId: numericId(firstDefined(response.userId, response.manguoidung)),
    contact: {
      name: firstDefined(contactSource.name, response.contactName, response.tenlienhe, ''),
      phone: firstDefined(contactSource.phone, response.contactPhone, response.sdtlienhe, ''),
      email: firstDefined(contactSource.email, response.contactEmail, response.emaillienhe, ''),
    },
    pet: {
      id: numericId(firstDefined(petSource.id, petSource.petId, response.petId, response.mathucung)),
      name: firstDefined(petSource.name, petSource.petName, response.petName, response.tenthucung, ''),
      type: petType,
      species: firstDefined(petSource.species, petType === 'CAT' ? 'Mèo' : petType === 'DOG' ? 'Chó' : petType, ''),
      breed: firstDefined(petSource.breed, response.petBreed, ''),
      weight: numericValue(firstDefined(petSource.weight, petSource.weightKg, response.petWeight, response.cannangthucung)),
      imageUrl: firstDefined(petSource.imageUrl, petSource.image, response.petImage, ''),
      avatarTone: firstDefined(petSource.avatarTone, 'honey'),
    },
    employee: {
      id: numericId(firstDefined(employeeSource.id, employeeSource.employeeId, response.employeeId, response.manhanvien)),
      name: firstDefined(employeeSource.name, employeeSource.employeeName, response.employeeName, ''),
    },
    appointment: {
      date: firstDefined(appointmentSource.date, appointmentSource.appointmentDate, response.appointmentDate, response.ngayhen, ''),
      startTime: firstDefined(appointmentSource.startTime, response.startTime, response.giobatdau, ''),
      endTime: firstDefined(appointmentSource.endTime, response.endTime, response.gioketthuc, ''),
    },
    services: Array.isArray(rawServices) ? rawServices.map(mapService) : [],
    note: firstDefined(response.note, response.ghichu, ''),
    totalPrice: numericValue(firstDefined(response.totalPrice, response.tongtien)),
    bookingStatus,
    paymentStatus,
    payment: {
      id: numericId(firstDefined(paymentSource.id, paymentSource.paymentId, response.paymentId)),
      method: firstDefined(paymentSource.method, paymentSource.paymentMethod, response.paymentMethod, 'CASH'),
      amount: numericValue(firstDefined(paymentSource.amount, paymentSource.paymentAmount, response.paymentAmount, response.totalPrice, response.tongtien)),
      transactionStatus: firstDefined(paymentSource.transactionStatus, response.transactionStatus, paymentStatus === 'PAID' ? 'SUCCESS' : 'PENDING'),
    },
    cancellationReason: firstDefined(response.cancellationReason, response.lydohuy, null),
    review: reviewSource ? {
      id: numericId(firstDefined(reviewSource.id, reviewSource.reviewId)),
      rating: numericValue(reviewSource.rating),
      comment: reviewSource.comment ?? '',
      hidden: Boolean(reviewSource.hidden),
      createdAt: reviewSource.createdAt ?? '',
    } : null,
    createdAt: firstDefined(response.createdAt, response.ngaytao, ''),
    updatedAt: firstDefined(response.updatedAt, response.ngaycapnhat, ''),
  }
}
