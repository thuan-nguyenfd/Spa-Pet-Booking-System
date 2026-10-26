export default function PetAvatar({ pet, className = '' }) {
  const species = pet?.species?.toLowerCase()
  const isCat = species?.includes('mèo') || species?.includes('cat')

  return (
    <span className={`pet-avatar pet-avatar--${pet?.avatarTone || 'honey'} ${className}`} aria-hidden="true">
      {pet?.imageUrl ? (
        <img src={pet.imageUrl} alt="" />
      ) : (
        <svg viewBox="0 0 72 72" focusable="false">
          {isCat ? (
            <>
              <path d="M17 28 15 11l15 9a23 23 0 0 1 12 0l15-9-2 17c4 5 6 10 6 16 0 12-10 20-25 20S11 56 11 44c0-6 2-11 6-16Z" fill="currentColor" />
              <path d="M25 42h.1M47 42h.1" stroke="#fff8dc" strokeWidth="4" strokeLinecap="round" />
              <path d="M33 49q3 3 6 0m-3-2v4m-5 2-8 1m23-1 8 1" fill="none" stroke="#fff8dc" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M15 26C8 18 8 9 13 7c7-2 14 9 17 13a27 27 0 0 1 12 0C45 16 52 5 59 7c5 2 5 11-2 19 4 5 6 11 6 17 0 14-10 23-27 23S9 57 9 43c0-6 2-12 6-17Z" fill="currentColor" />
              <path d="M25 42h.1M47 42h.1" stroke="#fff8dc" strokeWidth="4" strokeLinecap="round" />
              <path d="M33 50q3 3 6 0m-3-2v4" fill="none" stroke="#fff8dc" strokeWidth="2" strokeLinecap="round" />
            </>
          )}
        </svg>
      )}
    </span>
  )
}
