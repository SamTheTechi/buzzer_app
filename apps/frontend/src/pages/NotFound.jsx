import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main>
      <h1>Not found</h1>
      <p>This page does not exist.</p>
      <Link to="/">Back to home</Link>
    </main>
  )
}
