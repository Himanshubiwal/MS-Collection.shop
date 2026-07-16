import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import Product from './models/Product.js';
import User from './models/User.js';
import Order from './models/Order.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to parse RFC 4180 CSV strings
function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) return [];
  
  const parseRow = (rowStr) => {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < rowStr.length; i++) {
      const char = rowStr[i];
      if (char === '"') {
        if (inQuotes && rowStr[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(cur);
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur);
    return result;
  };

  const headers = parseRow(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseRow(lines[i]);
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[j] !== undefined ? values[j] : '';
    }
    rows.push(obj);
  }
  return rows;
}

const COLOR_HEX_MAP = {
  'black': '#000000',
  'washed black': '#1C1C1E',
  'white': '#FFFFFF',
  'natural': '#F8F6F0',
  'cream': '#FAF8F5',
  'stone': '#D6D3C4',
  'sand': '#E6E2D8',
  'navy': '#1E293B',
  'blue': '#2563EB',
  'royal blue': '#1D4ED8',
  'true blue': '#1D4ED8',
  'baby blue': '#93C5FD',
  'red': '#EF4444',
  'wine': '#7F1D1D',
  'burgundy': '#831843',
  'brown': '#4A3B32',
  'chocolate': '#3E2723',
  'bronze': '#CD7F32',
  'yellow': '#EAB308',
  'forest green': '#14532D',
  'ash grey': '#CBD5E1',
  'heather grey': '#E2E8F0',
  'dark grey': '#475569',
  'gun metal': '#334155',
  'dusty pink': '#F4C2C2'
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('[Seeder]: Cleared previous database records...');

    // Create Admin and Sample Customer Users
    const createdUsers = await User.create([
      {
        name: 'MS Collection Admin',
        email: 'admin@mscollection.com',
        password: 'adminpassword123',
        role: 'admin',
        addresses: [
          {
            street: 'Station Road, Piprali Circle',
            city: 'Sikar',
            state: 'Rajasthan',
            postalCode: '332001',
            country: 'India',
            isDefault: true,
          },
        ],
      },
      {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        password: 'customerpassword123',
        role: 'customer',
        addresses: [
          {
            street: 'Bajaj Road, Near Clock Tower',
            city: 'Sikar',
            state: 'Rajasthan',
            postalCode: '332001',
            country: 'India',
            isDefault: true,
          },
        ],
      },
    ]);

    console.log('[Seeder]: Created Admin & Customer test accounts...');

    // Resolve path to scraped data directory
    const possiblePaths = [
      path.resolve(__dirname, '../../../../universal-web-scraper/data'),
      path.resolve(__dirname, '../../../universal-web-scraper/data'),
      'd:/AnitGravity/universal-web-scraper/data'
    ];

    let dataDir = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p) && fs.existsSync(path.join(p, 'products.json'))) {
        dataDir = p;
        break;
      }
    }

    if (!dataDir) {
      throw new Error('Unable to locate universal-web-scraper/data directory containing products.json');
    }

    console.log(`[Seeder]: Loading scraped dataset from ${dataDir}...`);

    const productsJsonRaw = fs.readFileSync(path.join(dataDir, 'products.json'), 'utf-8');
    const productsList = JSON.parse(productsJsonRaw);

    const variantsCsvRaw = fs.readFileSync(path.join(dataDir, 'variants.csv'), 'utf-8');
    const variantsList = parseCSV(variantsCsvRaw);

    const imagesCsvRaw = fs.readFileSync(path.join(dataDir, 'product_images.csv'), 'utf-8');
    const imagesList = parseCSV(imagesCsvRaw);

    console.log(`[Seeder]: Parsed ${productsList.length} products, ${variantsList.length} variants, and ${imagesList.length} product images.`);

    const transformedProducts = productsList.map((prod, index) => {
      // Determine category strictly matching schema enum ['Tops', 'Bottoms', 'Accessories', 'Outerwear', 'Lookbook']
      let category = 'Tops';
      const typeLower = (prod.product_type || '').toLowerCase();
      const tagsLower = (prod.tags || '').toLowerCase();
      const titleLower = (prod.title || '').toLowerCase();

      if (
        typeLower === 'outerwear' ||
        tagsLower.includes('pullover') ||
        tagsLower.includes('outerwear') ||
        titleLower.includes('hoodie') ||
        titleLower.includes('crewneck') ||
        titleLower.includes('jacket') ||
        titleLower.includes('fleece')
      ) {
        category = 'Outerwear';
      } else if (typeLower === 'lookbook') {
        category = 'Lookbook';
      } else if (typeLower === 'accessories' || tagsLower.includes('accessories') || titleLower.includes('socks') || titleLower.includes('bottle') || titleLower.includes('cap') || titleLower.includes('beanie')) {
        category = 'Accessories';
      } else if (typeLower === 'bottoms' || tagsLower.includes('bottoms') || titleLower.includes('shorts') || titleLower.includes('tights') || titleLower.includes('pants')) {
        category = 'Bottoms';
      }

      // Extract description
      let description = (prod.description_text || '').trim();
      if (!description && prod.body_html) {
        description = prod.body_html.replace(/<[^>]+>/g, '').trim();
      }
      if (!description) {
        description = `High-performance athletic ${prod.title} crafted for endurance, warmth, and resilience.`;
      }

      // Derive subtitle
      let subtitle = 'MS Collection Luxury Fashion & Lifestyle';
      if (prod.tags) {
        const firstTag = prod.tags.split(',')[0].trim();
        if (firstTag && firstTag.length > 3 && firstTag.length < 40) {
          subtitle = firstTag;
        }
      }

      // Filter variants matching this product
      const prodVariantsRows = variantsList.filter(v => v.product_handle === prod.handle);
      const variants = prodVariantsRows.map((v, vIndex) => {
        let rawSize = (v.option2 || v.option3 || '').toUpperCase().trim();
        let size = 'ONE SIZE';
        if (['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'].includes(rawSize)) {
          size = rawSize;
        } else if (rawSize === 'OS' || rawSize === 'O/S' || !rawSize || rawSize === 'NAN') {
          size = 'ONE SIZE';
        } else if (rawSize === 'S-M' || rawSize === 'S/M' || rawSize.startsWith('S')) {
          size = 'S';
        } else if (rawSize === 'L-XL' || rawSize === 'L/XL' || rawSize.startsWith('XL')) {
          size = 'XL';
        } else if (rawSize.startsWith('L')) {
          size = 'L';
        } else if (rawSize.startsWith('M')) {
          size = 'M';
        }

        const colorName = v.option1 || 'Standard';
        const colorHex = COLOR_HEX_MAP[colorName.toLowerCase().trim()] || '#71717A';
        const sku = v.sku || `${prod.handle.toUpperCase()}-${vIndex + 1}`;
        const stockQuantity = (v.available === 'True' || v.available === 'true' || v.available === true) ? 15 : 0;

        return {
          sku,
          size,
          colorName,
          colorHex,
          priceAdjustment: 0,
          stockQuantity
        };
      });

      // If no variants found, add a fallback variant
      if (variants.length === 0) {
        variants.push({
          sku: `${prod.handle.toUpperCase()}-STD`,
          size: 'ONE SIZE',
          colorName: 'Standard',
          colorHex: '#71717A',
          priceAdjustment: 0,
          stockQuantity: 15
        });
      }

      // Determine base price
      let price = 75.0;
      if (prodVariantsRows.length > 0 && prodVariantsRows[0].price) {
        const parsedPrice = parseFloat(prodVariantsRows[0].price);
        if (!isNaN(parsedPrice) && parsedPrice > 0) {
          price = parsedPrice;
        }
      }

      // Filter images matching this product
      const prodImagesRows = imagesList
        .filter(img => img.product_handle === prod.handle)
        .sort((a, b) => parseInt(a.position || 0, 10) - parseInt(b.position || 0, 10));

      let images = prodImagesRows.map((img, imgIndex) => ({
        url: img.image_url,
        altText: img.alt || `${prod.title} View ${imgIndex + 1}`,
        isPrimary: imgIndex === 0
      }));

      if (images.length === 0 && prod.featured_image_url) {
        images = [
          {
            url: prod.featured_image_url,
            altText: prod.title,
            isPrimary: true
          }
        ];
      }

      return {
        name: prod.title,
        slug: prod.handle,
        subtitle,
        description,
        philosophyText: 'Timeless garments shaped by rich Indian heritage and contemporary lifestyle. Designed in Sikar, Rajasthan for resilience, comfort, and distinction.',
        price: Math.round(price * 83),
        currency: 'INR',
        category,
        images,
        variants,
        fabricDetails: {
          material: category === 'Accessories' ? 'High-grade Performance Materials' : '100% Organic Heavyweight Cotton / Italian Performance Mesh',
          origin: 'Made in Sikar, Rajasthan, India',
          careInstructions: 'Machine wash cold with like colors. Hang dry or tumble dry low. Do not iron directly on graphic.'
        },
        isFeatured: index < 8,
        rating: Number((4.6 + Math.random() * 0.4).toFixed(1)),
        numReviews: Math.floor(Math.random() * 35) + 12
      };
    });

    await Product.insertMany(transformedProducts);
    console.log(`[Seeder]: Successfully seeded all ${transformedProducts.length} MS Collection products & ${variantsList.length} variants!`);
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedData();
