import PetAvatar from './PetAvatar.jsx'
import checkCircle from '../../assets/icons/booking/check-circle.svg'
import plusCircle from '../../assets/icons/booking/plus-circle.svg'

export default function PetSelectionStep({ pets, selectedPetId, onSelectPet, onAddPet, error }) {
  return (
    <section className="booking-step-content" aria-labelledby="pet-step-title">
      <div className="booking-step-heading">
        <p className="booking-step-heading__eyebrow">Bước 1 · Thú cưng</p>
        <h2 id="pet-step-title">Boss nào sẽ đi spa hôm nay?</h2>
        <p>Chọn một bạn để tụi mình chuẩn bị dịch vụ vừa vặn nhất.</p>
      </div>

      {pets.length ? (
        <div className="pet-choice-list" role="group" aria-label="Chọn thú cưng">
          {pets.map((pet) => {
            const selected = pet.id === selectedPetId
            return (
              <button
                className={`pet-choice${selected ? ' is-selected' : ''}`}
                type="button"
                key={pet.id}
                aria-pressed={selected}
                onClick={() => onSelectPet(pet.id)}
              >
                <PetAvatar pet={pet} className="pet-choice__avatar" />
                <span className="pet-choice__details">
                  <strong>{pet.name}</strong>
                  <span>{pet.breed || pet.species}</span>
                  <small>{pet.species} <span aria-hidden="true">·</span> {Number(pet.weightKg).toLocaleString('vi-VN')} kg</small>
                </span>
                <span className="pet-choice__mark" aria-hidden="true">{selected && <img src={checkCircle} alt="" />}</span>
              </button>
            )
          })}
          <button className="pet-add-action" type="button" onClick={onAddPet}>
            <img className="booking-plus-icon booking-plus-icon--pet" src={plusCircle} alt="" aria-hidden="true" />
            <span>Thêm thú cưng mới</span>
          </button>
        </div>
      ) : (
        <div className="booking-empty-state">
          <PetAvatar pet={{ species: 'Mèo', avatarTone: 'honey' }} />
          <div>
            <h3>Nhà mình chưa có hồ sơ thú cưng</h3>
            <p>Thêm thông tin của bé để xem giá và chọn dịch vụ phù hợp.</p>
            <button className="text-link booking-empty-state__add" type="button" onClick={onAddPet}><img className="booking-plus-icon" src={plusCircle} alt="" aria-hidden="true" />Thêm thú cưng đầu tiên</button>
          </div>
        </div>
      )}
      {error && <p className="booking-inline-error" role="alert">{error}</p>}
    </section>
  )
}
