'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function Page() {
  //image generation state
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('Photographic')
  const [inputImages, setInputImages] = useState<File|null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [numOutputs, setNumOutputs] = useState(1)
  const [imageUrls, setImageUrls] = useState([])
  //loading state + error state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  const handleInputImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files.length > 0){
      const file = e.target.files[0]
      setInputImages(file)
      const preview = URL.createObjectURL(file)
      setImagePreview(preview)
    }
  }

  // Utility function to convert File to Base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject('Failed to convert file to base64.')
        }
      }
      reader.onerror = error => reject(error)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try{
      if(!inputImages){
        throw new Error('No input image selected')
      }
      const base64Images = await convertFileToBase64(inputImages);
      const response = await fetch('/api/image-to-image/', {
        method: 'POST',
        body: JSON.stringify({ prompt, style, inputImages: base64Images, numOutputs })
      })
  
      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }
  
      let data = await response.json();
  
      while(data.status !== "succeeded" && data.status !== "failed"){
        await sleep(1000);
        const response = await fetch('/api/image-to-image/' + data.id);
  
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
    
    } catch (error: any) {
      setError(error.message || 'An error occurred while generating the image');
    }

    setIsLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Image to Image Generator</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          className="w-full"
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium">Output number</label>
          <select
            value={numOutputs}
            onChange={(e) => setNumOutputs(Number(e.target.value))}
            className="w-full border rounded-md p-2"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full border rounded-md p-2"
          >
            <option value="Photographic">Photographic</option>
            <option value="Line art">Line art</option>
            <option value="Lowpoly">Lowpoly</option>
            <option value="Comic book">Comic book</option>
            <option value="Enhance">Enhance</option>
            <option value="Neonpunk">Neonpunk</option>
            <option value="Fantasy art">Fantasy art</option>
            <option value="Digital Art">Digital Art</option>
            <option value="Disney Charactor">Disney Charactor</option>
            <option value="Cinematic">Cinematic</option>
            <option value="(No style)">(No style)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Input Image</label>
          <input type="file" accept="image/*" className="w-full border rounded-md p-2" 
            required onChange={handleInputImage} />
        </div>

        {imagePreview && (
          <div className="flex space-x-4">
            <Image
              src={imagePreview}
              alt="Selected Image"
              width={100}
              height={100}
              className="object-cover rounded"
            />
          </div>
        )}


        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating....' : 'Generate Image'}
        </Button>

      </form>

      {error && <p className="text-red-500">{error}</p>}

      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-8">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative">
              <Image src={url} alt={`Generated_${index + 1}`}
                width={300}
                height={300}
                className="object-cover rounded cursor-pointer"
                onClick={() => handleDownload(url)}
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



    </div>
  )
}