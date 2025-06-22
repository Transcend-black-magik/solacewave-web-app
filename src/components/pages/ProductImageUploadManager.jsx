import { useState } from 'react';
import { Upload, Download, CheckCircle, Edit2, Eye, Image, Trash2, RefreshCw, X, Plus } from 'lucide-react';

// Main component that switches between the two approaches
export default function ProductImageUploadManager() {
  const [activeTab, setActiveTab] = useState('approach1');
  
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Product Image Management</h1>
          <p className="mt-1 text-sm text-gray-500">Choose your preferred approach for uploading product images</p>
        </div>
      </header>
      
      {/* Tab navigation */}
      <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('approach1')}
              className={`${
                activeTab === 'approach1'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Approach 1: Batch Upload
            </button>
            <button
              onClick={() => setActiveTab('approach2')}
              className={`${
                activeTab === 'approach2'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Approach 2: Individual Assignment
            </button>
          </nav>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
        {activeTab === 'approach1' ? <BatchUploadApproach /> : <IndividualAssignmentApproach />}
      </div>
    </div>
  );
}

// Approach 1: Selection + Batch Upload
function BatchUploadApproach() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  const products = [
    { id: 1, name: 'Anysew AS-ES6 Table top Embroidery Machine', category: 'Fashion', price: '2300000.00', image: null },
    { id: 2, name: 'Konica Minolta Bizhub C284e', category: 'Tech', price: '672000.00', image: null },
    { id: 3, name: 'Executive Office Chair', category: 'Furniture', price: '45000.00', image: null },
    { id: 4, name: 'Air Conditioner 1.5 Ton', category: 'Home Appliances', price: '125000.00', image: null },
    { id: 5, name: 'Samsung Galaxy S21', category: 'Electronics', price: '380000.00', image: null }
  ];
  
  // Toggle product selection
  const toggleProductSelection = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };
  
  // Select/deselect all products
  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };
  
  // Handle file upload
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      // Convert files to preview format
      const fileObjects = files.map((file, index) => ({
        id: index,
        name: file.name,
        size: file.size,
        preview: URL.createObjectURL(file),
        file
      }));
      
      setUploadedFiles(fileObjects);
    }
  };
  
  // Process the upload
  const processUpload = () => {
    // Here you would send the files to your API
    // For this demo, we'll simulate the process
    setUploadStatus('uploading');
    
    setTimeout(() => {
      setUploadStatus('success');
      
      // Reset after 2 seconds
      setTimeout(() => {
        setUploadStatus(null);
        setShowUploadModal(false);
        setUploadedFiles([]);
        setSelectedProducts([]);
      }, 2000);
    }, 2000);
  };
  
  return (
    <div>
      <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
        {/* Info box */}
        <div className="bg-blue-50 p-4 border-l-4 border-blue-400">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Approach 1: Selection + Batch Upload</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Select multiple products, then upload images that will be mapped to products in order.</p>
                <ol className="list-decimal list-inside mt-2">
                  <li>Select products using checkboxes</li>
                  <li>Click "Upload Images" button</li>
                  <li>Upload images in the order corresponding to selected products</li>
                  <li>Submit to map images to products in the selected order</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions bar */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Products selected: {selectedProducts.length}</span>
            <button 
              onClick={() => setShowUploadModal(true)}
              disabled={selectedProducts.length === 0}
              className={`px-4 py-2 rounded-md flex items-center ${
                selectedProducts.length > 0 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Upload size={18} className="mr-2" />
              Upload Images
            </button>
          </div>
          <span className="text-xs text-gray-500">Images will be mapped in the same order as selected products</span>
        </div>
        
        {/* Products table */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  checked={selectedProducts.length === products.length && products.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr 
                key={product.id} 
                className={`${selectedProducts.includes(product.id) ? 'bg-green-50' : ''} hover:bg-gray-50`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Intl.NumberFormat('en-NG', { style: 'decimal' }).format(parseFloat(product.price))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.image ? (
                    <img src={product.image} alt="" className="h-8 w-8 rounded-full" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <Image size={14} className="text-gray-400" />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Upload Images for Selected Products</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            {uploadStatus === null && (
              <>
                <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Images will be matched to products in the order they are uploaded. Please ensure your upload order matches the selected products.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">Selected products ({selectedProducts.length}):</h4>
                  <div className="mt-2 border border-gray-200 rounded-md p-2 max-h-40 overflow-y-auto">
                    {selectedProducts.map((id, index) => {
                      const product = products.find(p => p.id === id);
                      return (
                        <div key={id} className="flex items-center py-1">
                          <span className="w-5 text-xs text-gray-500">{index + 1}.</span>
                          <span className="font-medium text-sm text-gray-800">{product.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">Upload images:</h4>
                  <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Image className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                          <span>Upload images</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileUpload} accept="image/*" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB each
                      </p>
                    </div>
                  </div>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700">Uploaded files ({uploadedFiles.length}):</h4>
                    <div className="mt-2 border border-gray-200 rounded-md p-2 max-h-40 overflow-y-auto">
                      {uploadedFiles.map((file, index) => (
                        <div key={file.id} className="flex items-center py-1">
                          <span className="w-5 text-xs text-gray-500">{index + 1}.</span>
                          <div className="h-8 w-8 rounded-md overflow-hidden mr-2">
                            <img src={file.preview} alt="" className="h-full w-full object-cover" />
                          </div>
                          <span className="text-sm text-gray-800">{file.name}</span>
                        </div>
                      ))}
                    </div>
                    
                    {uploadedFiles.length !== selectedProducts.length && (
                      <div className="mt-2 text-sm text-red-600">
                        Warning: Number of images ({uploadedFiles.length}) does not match number of selected products ({selectedProducts.length}).
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-5 sm:mt-6 flex justify-end space-x-2">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                      uploadedFiles.length > 0 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                    onClick={processUpload}
                    disabled={uploadedFiles.length === 0}
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
            
            {uploadStatus === 'uploading' && (
              <div className="py-10 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Uploading images...</p>
              </div>
            )}
            
            {uploadStatus === 'success' && (
              <div className="py-10 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <p className="mt-4 text-xl font-medium text-gray-900">Upload Successful!</p>
                <p className="mt-2 text-sm text-gray-600">
                  {uploadedFiles.length} images have been uploaded and mapped to the selected products.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Approach 2: Individual Product Image Assignment
function IndividualAssignmentApproach() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Anysew AS-ES6 Table top Embroidery Machine', category: 'Fashion', price: '2300000.00', image: null, imageFile: null },
    { id: 2, name: 'Konica Minolta Bizhub C284e', category: 'Tech', price: '672000.00', image: null, imageFile: null },
    { id: 3, name: 'Executive Office Chair', category: 'Furniture', price: '45000.00', image: null, imageFile: null },
    { id: 4, name: 'Air Conditioner 1.5 Ton', category: 'Home Appliances', price: '125000.00', image: null, imageFile: null },
    { id: 5, name: 'Samsung Galaxy S21', category: 'Electronics', price: '380000.00', image: null, imageFile: null }
  ]);
  
  const [uploadStatus, setUploadStatus] = useState(null);
  
  // Handle individual file upload
  const handleFileUpload = (event, productId) => {
    const file = event.target.files[0];
    if (file) {
      setProducts(products.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            image: URL.createObjectURL(file),
            imageFile: file
          };
        }
        return product;
      }));
    }
  };
  
  // Clear individual image
  const clearImage = (productId) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        if (product.image) {
          URL.revokeObjectURL(product.image);
        }
        return {
          ...product,
          image: null,
          imageFile: null
        };
      }
      return product;
    }));
  };
  
  // Process upload of all images
  const processUpload = () => {
    const hasImages = products.some(p => p.imageFile !== null);
    
    if (!hasImages) {
      alert('Please upload at least one image');
      return;
    }
    
    // Simulate API call
    setUploadStatus('uploading');
    
    setTimeout(() => {
      setUploadStatus('success');
      
      // Reset after success
      setTimeout(() => {
        setUploadStatus(null);
      }, 2000);
    }, 2000);
  };
  
  return (
    <div>
      <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
        {/* Info box */}
        <div className="bg-blue-50 p-4 border-l-4 border-blue-400">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Approach 2: Individual Product Image Assignment</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Upload images for each product individually with clear 1:1 mapping.</p>
                <ol className="list-decimal list-inside mt-2">
                  <li>For each product, click its upload button</li>
                  <li>Select an image for that specific product</li>
                  <li>Repeat for all products you want to update</li>
                  <li>Click "Submit All Images" when done</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions bar */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            {products.filter(p => p.imageFile).length} of {products.length} products have images assigned
          </span>
          <button 
            onClick={processUpload}
            disabled={!products.some(p => p.imageFile !== null)}
            className={`px-4 py-2 rounded-md flex items-center ${
              products.some(p => p.imageFile !== null)
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Upload size={18} className="mr-2" />
            Submit All Images
          </button>
        </div>
        
        {/* Products with individual image uploads */}
        <div className="divide-y divide-gray-200">
          {products.map((product) => (
            <div key={product.id} className="p-6 flex items-start">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">{product.name}</span>
                  <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-xs">ID: {product.id}</span>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  <span className="mr-3">Category: {product.category}</span>
                  <span>Price: {new Intl.NumberFormat('en-NG', { style: 'decimal' }).format(parseFloat(product.price))}</span>
                </div>
              </div>
              
              <div className="ml-6">
                {product.image ? (
                  <div className="relative group">
                    <div className="w-16 h-16 rounded-md overflow-hidden">
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <button 
                      onClick={() => clearImage(product.id)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hidden group-hover:block"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <label className="cursor-pointer text-gray-500 hover:text-gray-700 flex flex-col items-center">
                      <Plus size={20} />
                      <span className="text-xs mt-1">Add</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, product.id)}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Upload Status Overlay */}
      {uploadStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            {uploadStatus === 'uploading' && (
              <div className="text-center py-6">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Uploading images...</p>
              </div>
            )}
            
            {uploadStatus === 'success' && (
              <div className="text-center py-6">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <p className="mt-4 text-xl font-medium text-gray-900">Upload Successful!</p>
                <p className="mt-2 text-sm text-gray-600">
                  {products.filter(p => p.imageFile).length} images have been uploaded.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}