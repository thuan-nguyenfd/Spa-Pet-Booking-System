export default function PlaceholderPage({ title }) {
  return (
    <section className="placeholder-page" aria-labelledby="placeholder-title">
      <h1 id="placeholder-title">{title}</h1>
      <p>This page is a placeholder for a future project feature.</p>
    </section>
  )
}
