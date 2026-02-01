import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

// Example: How to add a rental product via API
const testAddProduct = async () => {
  const formData = new FormData();
  
  // Basic information
  formData.append('name', 'Professional Sound System Package');
  formData.append('description', 'Complete DJ sound system with 2000W power output. Includes speakers, mixer, microphones, and all necessary cables.');
  formData.append('category', 'Sound & Lighting');
  
  // Rental pricing
  formData.append('pricePerDay', '250');
  formData.append('depositAmount', '500');
  formData.append('minimumRentalDays', '1');
  
  // Inventory
  formData.append('quantity', '5');
  formData.append('availableQuantity', '5');
  formData.append('isAvailable', 'true');
  
  // Features (as JSON array)
  formData.append('features', JSON.stringify([
    '2000W total power',
    '2 x 12-inch speakers',
    'Professional mixer with effects',
    '2 wireless microphones',
    'Bluetooth connectivity',
    'All cables included'
  ]));
  
  // Specifications
  formData.append('specifications', '2000W professional sound system with dual 12-inch speakers. Frequency response: 40Hz - 20kHz. Includes 4-channel digital mixer with built-in effects, Bluetooth 5.0 connectivity, and 2 wireless microphones. Suitable for events up to 200 people.');
  
  // Tags (as JSON array)
  formData.append('tags', JSON.stringify(['sound system', 'DJ', 'audio', 'speakers', 'party']));
  
  // Optional fields
  formData.append('bestseller', 'false');
  formData.append('collegeMerchandise', '');
  
  // If you have images, uncomment and provide paths:
  // formData.append('image1', fs.createReadStream('./path/to/image1.jpg'));
  // formData.append('image2', fs.createReadStream('./path/to/image2.jpg'));
  
  try {
    const response = await fetch('http://localhost:5000/api/product/add', {
      method: 'POST',
      body: formData,
      headers: {
        // Add your admin token here
        'token': 'YOUR_ADMIN_TOKEN_HERE'
      }
    });
    
    const result = await response.json();
    console.log('Response:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Example: How to get products by category
const testGetByCategory = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/product/category/Sound & Lighting');
    const result = await response.json();
    console.log('Products in Sound & Lighting category:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Uncomment to test:
// testAddProduct();
// testGetByCategory();

console.log('Test functions ready. Uncomment to use.');
