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
  const [imageUrls, setImageUrls] = useState(['https://replicate.delivery/yhqm/VXmSo78yCJpFJpWfopqkEewhzCLtSIhxzMG4L7fp5Ph8fbaOB/out-0.jpg'])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  // State for modal view
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleDownload = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const new_url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = new_url;
    a.download = 'image';
    document.body.appendChild(a);
    a.click();
  }

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
    }
    if(data.status === "failed"){
      throw new Error(data.error || 'Failed to generate image');
    }
    else{
      setImageUrls(data.output);
    }

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

      {imageUrls.length > 0 && (
        <div className="flex flex-row gap-4 mt-8">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative">
              <Image src={url} alt={`Generated_${index + 1}`}
                height={300}
                width={300}
                className="object-cover rounded cursor-pointer"
                onClick={() => setSelectedImage(url)}
              />
              <button
                onClick={() => handleDownload(url)}
                className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative">
            <Image
              src={selectedImage}
              alt="Enlarged Image"
              width={600}
              height={600}
              className="object-contain rounded"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-white bg-opacity-75 text-black px-2 py-1 rounded"
            >
              X
            </button>
          </div>
        </div>
      )}

    </div>
  )
}