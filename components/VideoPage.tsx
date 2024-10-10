'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Page() {
  const [prompt, setPrompt] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would call an API endpoint here
    // For this example, we'll just use a placeholder video file
    setVideoUrl('https://www.w3schools.com/html/mov_bbb.mp4')
    setPrompt('')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Video Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the video you want to generate..."
          className="w-full"
        />
        <Button type="submit">Generate Video</Button>
      </form>
      {videoUrl && (
        <div className="mt-4">
          <video controls width="320" height="240">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  )
}