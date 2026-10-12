const API_URL = 'https://jsonplaceholder.typicode.com/users'

export async function fetchUsers() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return await response.json()
}

export async function fetchUserById(id) {
  const response = await fetch(`${API_URL}/${id}`)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return await response.json()
}