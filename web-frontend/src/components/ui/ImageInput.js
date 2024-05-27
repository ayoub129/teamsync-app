import React from 'react'

const ImageInput = ({label , handleFileChange , supported , support}) => {
  return (
    <div className="mt-[2rem]">
        <label className="block text-[#0F2239] font-semibold mb-4">{label}</label>
         <div className="border-dashed border-2 border-gray-400 rounded-lg p-4 text-center">
                <input
                    type="file"
                    id="groupImage"
                    onChange={handleFileChange}
                    className="hidden"
                    accept={supported}
                />
                <label
                    htmlFor="groupImage"
                    className="block text-blue-500 cursor-pointer mt-2"
                >
                    <div className="text-center">
                        <p>Select File here</p>
                        <p className="text-gray-500">Files Supported: {support}</p>
                        <div className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 inline-block">
                            Choose File
                        </div>
                    </div>
                </label>
          </div>
    </div>
)
}

export default ImageInput
