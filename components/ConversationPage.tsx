'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function Page() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would call an API endpoint here
    // For this example, we'll just simulate a response
    setResponse(`AI: Here's a response to "${input}"`)
    setInput('')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Conversation Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your message here..."
          className="w-full"
        />
        <Button type="submit">Generate Response</Button>
      </form>
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p>{response}</p>
        </div>
      )}
    </div>
  )
}