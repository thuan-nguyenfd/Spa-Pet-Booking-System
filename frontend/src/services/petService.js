import { MOCK_PETS } from '../mocks/pets.js'
import { copyMockData, mockRequest } from './mockRequest.js'

const STORAGE_KEY = 'meomeo:booking-pets'
let sessionPets = null

function normalizePetIds(pets) {
  const toNumericId = (id) => {
    if (Number.isSafeInteger(id) && id > 0) return id
    if (typeof id !== 'string' || !/^\d+$/.test(id)) return null
    const parsedId = Number(id)
    return Number.isSafeInteger(parsedId) && parsedId > 0 ? parsedId : null
  }
  const candidateIds = pets.map((pet) => toNumericId(pet.id)).filter((id) => id !== null)
  let nextId = Math.max(100, ...candidateIds) + 1
  const usedIds = new Set()

  return pets.map((pet) => {
    const candidateId = toNumericId(pet.id)
    const id = candidateId !== null && !usedIds.has(candidateId) ? candidateId : nextId++
    usedIds.add(id)
    return pet.id === id ? pet : { ...pet, id }
  })
}

function readSessionPets() {
  if (sessionPets) return sessionPets
  try {
    const savedPets = window.sessionStorage.getItem(STORAGE_KEY)
    const parsedPets = savedPets ? JSON.parse(savedPets) : copyMockData(MOCK_PETS)
    const storedPets = Array.isArray(parsedPets) ? parsedPets : copyMockData(MOCK_PETS)
    sessionPets = normalizePetIds(storedPets)
    if (sessionPets.some((pet, index) => pet.id !== storedPets[index]?.id)) {
      persistSessionPets(sessionPets)
    }
  } catch {
    sessionPets = copyMockData(MOCK_PETS)
  }
  return sessionPets
}

function persistSessionPets(pets) {
  sessionPets = pets
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pets))
  } catch {
    // Keep the temporary pet in memory if this browser blocks session storage.
  }
}

export const petService = {
  async getMyPets() {
    return mockRequest(copyMockData(readSessionPets()))
  },

  async createPet(input) {
    const pets = readSessionPets()
    const pet = {
      id: pets.reduce((maxId, item) => Math.max(maxId, item.id), 100) + 1,
      name: input.name.trim(),
      species: input.species,
      breed: input.breed.trim(),
      weightKg: Number(input.weightKg),
      imageUrl: input.imageUrl ?? '',
      avatarTone: 'honey',
    }
    persistSessionPets([...pets, pet])
    return mockRequest(copyMockData(pet), 180)
  },
}
