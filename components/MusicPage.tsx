'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Page() {
  const [prompt, setPrompt] = useState('')
  const [audioUrl, setAudioUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would call an API endpoint here
    // For this example, we'll just use a placeholder audio file
    setAudioUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')
    setPrompt('')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Music Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the music you want to generate..."
          className="w-full"
        />
        <Button type="submit">Generate Music</Button>
      </form>
      {audioUrl && (
        <div className="mt-4">
          <audio controls src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  )
}