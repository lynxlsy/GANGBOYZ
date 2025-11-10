"use client"

import { EditableButton } from '@/components/editable-button'
import { useEditMode } from '@/lib/edit-mode-context'

export default function EditableButtonDemo() {
  const { isEditMode } = useEditMode()
  
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Editable Button Demo
          </h1>
          <p className="text-lg text-gray-600">
            Try editing the buttons below in edit mode
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Edit Mode: <span className="font-bold">{isEditMode ? 'ON' : 'OFF'}</span>
            </p>
            <p className="text-sm text-blue-800 mt-2">
              Click on buttons to edit their text when in edit mode
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Primary Action Buttons</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Call to Action</h3>
              <EditableButton
                id="cta-button-1"
                defaultText="Get Started Now"
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => alert('CTA Button 1 clicked!')}
              />
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Learn More</h3>
              <EditableButton
                id="cta-button-2"
                defaultText="Learn More"
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => alert('CTA Button 2 clicked!')}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Secondary Action Buttons</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Contact Us</h3>
              <EditableButton
                id="secondary-button-1"
                defaultText="Contact Us"
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={() => alert('Contact Us button clicked!')}
              />
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">View Products</h3>
              <EditableButton
                id="secondary-button-2"
                defaultText="View Products"
                className="bg-purple-600 text-white hover:bg-purple-700"
                onClick={() => alert('View Products button clicked!')}
              />
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Special Offer</h3>
              <EditableButton
                id="secondary-button-3"
                defaultText="Special Offer"
                className="bg-yellow-500 text-gray-900 hover:bg-yellow-600"
                onClick={() => alert('Special Offer button clicked!')}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Toggle edit mode using the admin controls to enable button editing.
          </p>
          <p className="mt-2">
            Changes are saved in real-time to Firebase and will persist across sessions.
          </p>
        </div>
      </div>
    </div>
  )
}