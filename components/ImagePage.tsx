'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function Page() {
  //image generation state
  const [prompt, setPrompt] = useState('')
  const [numOutputs, setNumOutputs] = useState(1)
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [outputFormat, setOutputFormat] = useState('webp')

  //image generation state
  const [imageUrls, setImageUrls] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

      const response = await fetch('/api/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt, numOutputs, aspectRatio, outputFormat })
      })

      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }
      
      let data = await response.json();

      while(data.status !== "succeeded" && data.status !== "failed"){
        await sleep(1000);
        const response = await fetch('/api/image/' + data.id);

        if(!response.ok){
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch image');
        }

        data = await response.json();

        if(data.status === "failed"){
          throw new Error(data.error || 'Failed to generate image');
        }
      }
      
      setImageUrls(data.output);

    // setPrompt('')
    setIsLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Image Generator</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          className="w-full"
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium">Number of Outputs</label>
          <input
            type="number"
            min={1}
            max={4}
            value={numOutputs}
            onChange={(e) => setNumOutputs(Number(e.target.value))}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Aspect Ratio</label>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            className="w-full border rounded-md p-2"
          >
            <option value="1:1">1:1</option>
            <option value="16:9">16:9</option>
            <option value="21:9">21:9</option>
            <option value="3:2">3:2</option>
            <option value="2:3">2:3</option>
            <option value="4:5">4:5</option>
            <option value="5:4">5:4</option>
            <option value="3:4">3:4</option>
            <option value="4:3">4:3</option>
            <option value="9:16">9:16</option>
            <option value="9:21">9:21</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Output Format</label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="w-full border rounded-md p-2"
          >
            <option value="webp">WebP</option>
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
          </select>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating....' : 'Generate Image'}
        </Button>

      </form>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-2 gap-4 mt-8">
        {imageUrls.length > 0 && (
          imageUrls.map((url, index) => (
            <img key={index} src={url} alt={`Generated Image ${index + 1}`} className="w-full h-auto" />
          ))
        )}
      </div>
    </div>
  )
}