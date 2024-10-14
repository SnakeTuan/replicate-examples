'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function Page() {
  //image generation state
  const [inputImage, setInputImage] = useState<File|null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string|null>(null)
  //loading state + error state
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
    a.download = 'image.png';
    document.body.appendChild(a);
    a.click();
  }
  
  const handleInputImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files.length > 0){
      const file = e.target.files[0]
      setInputImage(file)
      const preview = URL.createObjectURL(file)
      setImagePreview(preview)
    }
  }

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
      if(!inputImage){
        throw new Error('No input image selected')
      }
      const base64Image = await convertFileToBase64(inputImage)
      const response = await fetch('/api/restore-image/', {
        method: 'POST',
        body: JSON.stringify({
          img: base64Image
        })
      })
  
      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }
  
      let data = await response.json();
  
      while(data.status !== "succeeded" && data.status !== "failed"){
        await sleep(1000);
        const response = await fetch('/api/restore-image/' + data.id);
  
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
        setImageUrl(data.output);
      }
    
    } catch (error: any) {
      setError(error.message || 'An error occurred while generating the image');
    }

    setIsLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Restore image</h1>

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">

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

      {imageUrl && (
        <div className="flex flex-row gap-4 mt-8">
            <div className="relative">
              <Image
                src={imageUrl}
                alt={`Generated Image`}
                width={300}
                height={300}
                className="object-cover rounded cursor-pointer"
                onClick={() => setSelectedImage(imageUrl)}
              />
              <button
                onClick={() => handleDownload(imageUrl)}
                className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded"
              >
                Download
              </button>
            </div>
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