import golden from '../../../../assets/images/editorial/golden.jpg'
import portrait from '../../../../assets/images/editorial/portrait.jpg'
// Editorial imagery for the catalogue only; booking retains its approved assets.
export function servicePhoto(service) {
  return service.id === 2
    ? golden
    : service.id === 4
      ? portrait
      : service.imageUrl
}
