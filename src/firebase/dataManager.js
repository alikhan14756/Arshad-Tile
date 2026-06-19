import { db, isDemoMode } from './config';
import { 
  collection, doc, getDocs, getDoc, addDoc, updateDoc, 
  deleteDoc, query, where, orderBy, increment, limit
} from 'firebase/firestore';

// ==========================================
// 1. INITIAL MOCK DATA (For Demo Mode fallback)
// ==========================================
const mockCategories = [
  { id: 'cat-1', name: 'Wall Tiles', slug: 'wall-tiles', description: 'Premium wall designs' },
  { id: 'cat-2', name: 'Floor Tiles', slug: 'floor-tiles', description: 'Durable flooring solutions' },
  { id: 'cat-3', name: 'Washroom Tiles', slug: 'washroom-tiles', description: 'Anti-slip bathroom tiles' },
  { id: 'cat-4', name: 'Kitchen Tiles', slug: 'kitchen-tiles', description: 'Stain-resistant tiles' },
  { id: 'cat-5', name: 'Outdoor Tiles', slug: 'outdoor-tiles', description: 'Heavy-duty tiles' },
  { id: 'cat-6', name: 'Wall Panels', slug: 'wall-panels', description: 'Waterproof PVC wall panels' },
  { id: 'cat-7', name: 'Sanitary Ware', slug: 'sanitary-ware', description: 'Commodes, basins, and fixtures' },
  { id: 'cat-8', name: 'Bathroom Accessories', slug: 'bathroom-accessories', description: 'Premium taps and accessories' }
];

const mockProducts = [
  {
    id: 'prod-1',
    name: 'Royal Marble White',
    slug: 'royal-marble-white',
    category: 'Floor Tiles',
    subcategory: 'Porcelain Double Loaded',
    brand: 'Master Tiles',
    size: '120x60 cm',
    boxCoverage: 15.5,
    piecesPerBox: 4,
    finish: 'Glossy',
    surface: 'Glazed Polished',
    color: 'White',
    material: 'Porcelain',
    priceType: 'per-box',
    price: 3200,
    stock: 380,
    images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop'],
    description: 'High-quality marble texture tile with a brilliant polished glossy surface, perfect for high-traffic living spaces.',
    featured: true,
    status: 'Available',
    seo: {
      title: 'Royal Marble White 120x60 cm | Arshad Tiles',
      description: 'Shop the premium Royal Marble White floor tiles by Master Tiles at Arshad Tiles & Sanitary Shabqadar.',
      keywords: 'floor tile, white marble, master tiles, shabqadar'
    },
    views: 342,
    inquiriesCount: 15,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Oak Wood Plank Tile',
    slug: 'oak-wood-plank-tile',
    category: 'Floor Tiles',
    subcategory: 'Ceramic Wood Series',
    brand: 'Shabbir Tiles',
    size: '20x100 cm',
    boxCoverage: 12.9,
    piecesPerBox: 6,
    finish: 'Matt',
    surface: 'Textured Wood Grain',
    color: 'Brown',
    material: 'Ceramic',
    priceType: 'per-box',
    price: 2600,
    stock: 15,
    images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop'],
    description: 'Bring the natural warmth of real hardwood into your rooms with this highly durable wood texture ceramic tile.',
    featured: true,
    status: 'Limited Stock',
    seo: {
      title: 'Oak Wood Plank Floor Tile | Arshad Tiles',
      description: 'Get durable oak wood plank ceramic tiles by Shabbir Tiles in Shabqadar.',
      keywords: 'wood tile, shabbir tiles, brown tile'
    },
    views: 189,
    inquiriesCount: 9,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'Matt Slate Grey',
    slug: 'matt-slate-grey',
    category: 'Wall Tiles',
    subcategory: 'Modern Concept',
    brand: 'Stile',
    size: '30x60 cm',
    boxCoverage: 14.2,
    piecesPerBox: 8,
    finish: 'Matt',
    surface: 'Smooth Matt',
    color: 'Grey',
    material: 'Ceramic',
    priceType: 'per-box',
    price: 1950,
    stock: 0,
    images: ['https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop'],
    description: 'Minimalistic grey wall tile, ideal for designing luxury walk-in showers and modern kitchen backsplashes.',
    featured: false,
    status: 'Out of Stock',
    seo: {
      title: 'Matt Slate Grey Wall Tile | Arshad Tiles',
      description: 'Premium modern grey wall tiles by Stile available at Arshad Tiles & Sanitary.',
      keywords: 'grey tile, wall tiles, stile tiles, kitchen tiles'
    },
    views: 95,
    inquiriesCount: 4,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'Porta One-Piece Commode',
    slug: 'porta-one-piece-commode',
    category: 'Sanitary Ware',
    subcategory: 'Bathroom Suite',
    brand: 'Porta',
    size: 'Standard',
    boxCoverage: 0,
    piecesPerBox: 1,
    finish: 'Glossy Ceramic',
    surface: 'Antibacterial Glazed',
    color: 'White',
    material: 'Vitreaous China',
    priceType: 'per-piece',
    price: 18500,
    stock: 22,
    images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop'],
    description: 'Modern luxury one-piece commode with dual flush mechanism, silent close lid, and water-saving design.',
    featured: true,
    status: 'Best Seller',
    seo: {
      title: 'Porta One-Piece Dual Flush Commode | Arshad Tiles',
      description: 'Shop luxury Porta sanitary ware and toilets in Shabqadar at Arshad Tiles.',
      keywords: 'porta commode, sanitary item, toilet suite, shabqadar'
    },
    views: 412,
    inquiriesCount: 24,
    createdAt: new Date().toISOString()
  }
];

const mockInventory = [
  { id: 'inv-1', productId: 'prod-1', productName: 'Royal Marble White', totalStock: 500, sold: 120, remaining: 380 },
  { id: 'inv-2', productId: 'prod-2', productName: 'Oak Wood Plank Tile', totalStock: 100, sold: 85, remaining: 15 },
  { id: 'inv-3', productId: 'prod-3', productName: 'Matt Slate Grey', totalStock: 250, sold: 250, remaining: 0 },
  { id: 'inv-4', productId: 'prod-4', productName: 'Porta One-Piece Commode', totalStock: 30, sold: 8, remaining: 22 }
];

const mockCustomers = [
  { id: 'cust-1', name: 'Ali Khan', phone: '03459123456', city: 'Shabqadar', interestedProduct: 'Royal Marble White', productId: 'prod-1', status: 'Follow Up Required', date: new Date().toISOString(), notes: 'Interested in buying 350 boxes for new house project. Follow up next week.' },
  { id: 'cust-2', name: 'Kamran Shah', phone: '03009567890', city: 'Peshawar', interestedProduct: 'Porta One-Piece Commode', productId: 'prod-4', status: 'New', date: new Date().toISOString(), notes: 'Submitted quote request online. Needs price details for 3 toilets.' }
];

const mockInquiries = [
  { id: 'inq-1', customerName: 'Ali Khan', phone: '03459123456', city: 'Shabqadar', productId: 'prod-1', productName: 'Royal Marble White', message: 'Hello, what is the best discount you can offer on 350 boxes of Royal Marble White? Delivery is in Shabqadar.', status: 'Pending', createdAt: new Date().toISOString() },
  { id: 'inq-2', customerName: 'Kamran Shah', phone: '03009567890', city: 'Peshawar', productId: 'prod-4', productName: 'Porta One-Piece Commode', message: 'Please send quote for 3 pieces including transport to Peshawar.', status: 'Contacted', createdAt: new Date().toISOString() }
];

const mockSuppliers = [
  { id: 'sup-1', name: 'Bilal Gujranwala', company: 'Master Tiles Distributor', phone: '03217654321', products: ['Floor Tiles', 'Wall Tiles'], paymentStatus: 'Paid', outstandingBalance: 0, notes: 'Direct factory supplier. Delivers in 3 days.' },
  { id: 'sup-2', name: 'Zahid Lahore', company: 'Porta Sanitary Imports', phone: '03338765432', products: ['Sanitary Ware'], paymentStatus: 'Pending', outstandingBalance: 45000, notes: 'Payment due on next stock arrival.' }
];

const mockProjects = [
  {
    id: 'proj-1',
    title: 'Modern House Installation',
    location: 'Shabqadar, Phase 1',
    customerType: 'Residential',
    area: '2500 sq ft',
    materialsUsed: ['Royal Marble White', 'Oak Wood Plank Tile'],
    completionDate: '2026-04-10',
    description: 'Complete tile installations for a luxury 5-marla double story house. Applied glossy marble tiles in lounge areas and rustic wood planks in bedrooms.',
    beforeImages: ['https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800&auto=format&fit=crop'],
    afterImages: ['https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&auto=format&fit=crop'],
    category: 'Living Room',
    createdAt: new Date().toISOString()
  }
];

const mockReviews = [
  { id: 'rev-1', author: 'Muhammad Aslam', rating: 5, text: 'Excellent tile quality and top-notch sanitary ware. Arshad Tiles delivered everything to my construction site in Shabqadar right on time. Highly recommended!', approved: true, createdAt: new Date().toISOString() },
  { id: 'rev-2', author: 'Sardar Khan', rating: 4, text: 'Great customer service and expert advice. The showroom staff helped me calculate my box coverage requirements correctly, preventing wastage.', approved: true, createdAt: new Date().toISOString() }
];

// Helper to initialize local storage data
const getLocalData = (key, defaultData) => {
  if (typeof window === 'undefined') return defaultData;
  const existing = localStorage.getItem(key);
  if (!existing) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(existing);
};

const setLocalData = (key, data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// ==========================================
// 2. DATA UTILITY WRAPPER (Demo & Firebase)
// ==========================================
export const dataManager = {
  // PRODUCTS
  async getProducts() {
    if (isDemoMode) {
      return getLocalData('arshad_products', mockProducts);
    }
    const snap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getProductBySlug(slug) {
    if (isDemoMode) {
      const prods = getLocalData('arshad_products', mockProducts);
      return prods.find(p => p.slug === slug) || null;
    }
    const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
  },

  async addProduct(productData) {
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProd = {
      ...productData,
      slug,
      views: 0,
      inquiriesCount: 0,
      createdAt: new Date().toISOString()
    };

    if (isDemoMode) {
      const prods = getLocalData('arshad_products', mockProducts);
      newProd.id = 'prod-' + Date.now();
      prods.unshift(newProd);
      setLocalData('arshad_products', prods);

      // Create matching inventory record
      const invs = getLocalData('arshad_inventory', mockInventory);
      invs.push({
        id: 'inv-' + Date.now(),
        productId: newProd.id,
        productName: newProd.name,
        totalStock: productData.stock || 0,
        sold: 0,
        remaining: productData.stock || 0
      });
      setLocalData('arshad_inventory', invs);
      return newProd;
    }

    const docRef = await addDoc(collection(db, 'products'), newProd);
    // Create inventory record
    await addDoc(collection(db, 'inventory'), {
      productId: docRef.id,
      productName: newProd.name,
      totalStock: productData.stock || 0,
      sold: 0,
      remaining: productData.stock || 0
    });
    return { id: docRef.id, ...newProd };
  },

  async updateProduct(id, productData) {
    if (isDemoMode) {
      const prods = getLocalData('arshad_products', mockProducts);
      const index = prods.findIndex(p => p.id === id);
      if (index !== -1) {
        prods[index] = { ...prods[index], ...productData };
        setLocalData('arshad_products', prods);
        // Sync product name in inventory
        const invs = getLocalData('arshad_inventory', mockInventory);
        const invIndex = invs.findIndex(i => i.productId === id);
        if (invIndex !== -1) {
          invs[invIndex].productName = productData.name;
          invs[invIndex].remaining = productData.stock;
          invs[invIndex].totalStock = invs[invIndex].sold + productData.stock;
          setLocalData('arshad_inventory', invs);
        }
      }
      return true;
    }
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, productData);
    return true;
  },

  async deleteProduct(id) {
    if (isDemoMode) {
      const prods = getLocalData('arshad_products', mockProducts);
      const filtered = prods.filter(p => p.id !== id);
      setLocalData('arshad_products', filtered);
      
      const invs = getLocalData('arshad_inventory', mockInventory);
      setLocalData('arshad_inventory', invs.filter(i => i.productId !== id));
      return true;
    }
    await deleteDoc(doc(db, 'products', id));
    // Ideally delete matching inventory doc too
    return true;
  },

  async trackProductView(id) {
    if (isDemoMode) {
      const prods = getLocalData('arshad_products', mockProducts);
      const p = prods.find(item => item.id === id);
      if (p) {
        p.views = (p.views || 0) + 1;
        setLocalData('arshad_products', prods);
      }
      return;
    }
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, { views: increment(1) });
  },

  // CATEGORIES
  async getCategories() {
    if (isDemoMode) {
      return getLocalData('arshad_categories', mockCategories);
    }
    const snap = await getDocs(collection(db, 'categories'));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async addCategory(catData) {
    if (isDemoMode) {
      const cats = getLocalData('arshad_categories', mockCategories);
      const newCat = { ...catData, id: 'cat-' + Date.now(), slug: catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') };
      cats.push(newCat);
      setLocalData('arshad_categories', cats);
      return newCat;
    }
    const docRef = await addDoc(collection(db, 'categories'), catData);
    return { id: docRef.id, ...catData };
  },

  async deleteCategory(id) {
    if (isDemoMode) {
      const cats = getLocalData('arshad_categories', mockCategories);
      setLocalData('arshad_categories', cats.filter(c => c.id !== id));
      return true;
    }
    await deleteDoc(doc(db, 'categories', id));
    return true;
  },

  // INVENTORY
  async getInventory() {
    if (isDemoMode) {
      return getLocalData('arshad_inventory', mockInventory);
    }
    const snap = await getDocs(collection(db, 'inventory'));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async updateStock(productId, newStock) {
    if (isDemoMode) {
      const invs = getLocalData('arshad_inventory', mockInventory);
      const index = invs.findIndex(i => i.productId === productId);
      if (index !== -1) {
        invs[index].remaining = Number(newStock);
        invs[index].totalStock = invs[index].sold + Number(newStock);
        setLocalData('arshad_inventory', invs);
      }
      
      const prods = getLocalData('arshad_products', mockProducts);
      const pIndex = prods.findIndex(p => p.id === productId);
      if (pIndex !== -1) {
        prods[pIndex].stock = Number(newStock);
        prods[pIndex].status = Number(newStock) === 0 ? 'Out of Stock' : (Number(newStock) < 20 ? 'Limited Stock' : 'Available');
        setLocalData('arshad_products', prods);
      }
      return true;
    }
    // Update in Firestore
    const q = query(collection(db, 'inventory'), where('productId', '==', productId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const invDoc = snap.docs[0];
      const currentSold = invDoc.data().sold || 0;
      await updateDoc(doc(db, 'inventory', invDoc.id), {
        remaining: Number(newStock),
        totalStock: currentSold + Number(newStock)
      });
    }
    const prodDocRef = doc(db, 'products', productId);
    const status = Number(newStock) === 0 ? 'Out of Stock' : (Number(newStock) < 20 ? 'Limited Stock' : 'Available');
    await updateDoc(prodDocRef, { stock: Number(newStock), status });
    return true;
  },

  // CRM CUSTOMERS
  async getCustomers() {
    if (isDemoMode) {
      return getLocalData('arshad_customers', mockCustomers);
    }
    const snap = await getDocs(collection(db, 'customers'));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async updateCustomer(id, customerData) {
    if (isDemoMode) {
      const custs = getLocalData('arshad_customers', mockCustomers);
      const index = custs.findIndex(c => c.id === id);
      if (index !== -1) {
        custs[index] = { ...custs[index], ...customerData };
        setLocalData('arshad_customers', custs);
      }
      return true;
    }
    await updateDoc(doc(db, 'customers', id), customerData);
    return true;
  },

  // INQUIRIES
  async getInquiries() {
    if (isDemoMode) {
      return getLocalData('arshad_inquiries', mockInquiries);
    }
    const snap = await getDocs(query(collection(db, 'inquiries'), orderBy('createdAt', 'desc')));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async addInquiry(inquiryData) {
    const newInq = {
      ...inquiryData,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    if (isDemoMode) {
      const inqs = getLocalData('arshad_inquiries', mockInquiries);
      newInq.id = 'inq-' + Date.now();
      inqs.unshift(newInq);
      setLocalData('arshad_inquiries', inqs);

      // Log/update customer CRM
      const custs = getLocalData('arshad_customers', mockCustomers);
      const existingCust = custs.find(c => c.phone === inquiryData.phone);
      if (existingCust) {
        existingCust.status = 'New';
        existingCust.interestedProduct = inquiryData.productName;
        existingCust.notes = inquiryData.message;
        existingCust.date = new Date().toISOString();
      } else {
        custs.unshift({
          id: 'cust-' + Date.now(),
          name: inquiryData.customerName,
          phone: inquiryData.phone,
          city: inquiryData.city,
          interestedProduct: inquiryData.productName,
          productId: inquiryData.productId,
          status: 'New',
          date: new Date().toISOString(),
          notes: inquiryData.message
        });
      }
      setLocalData('arshad_customers', custs);

      // Increment product inquiry counter
      const prods = getLocalData('arshad_products', mockProducts);
      const p = prods.find(item => item.id === inquiryData.productId);
      if (p) {
        p.inquiriesCount = (p.inquiriesCount || 0) + 1;
        setLocalData('arshad_products', prods);
      }
      return newInq;
    }

    const docRef = await addDoc(collection(db, 'inquiries'), newInq);
    
    // CRM addition/updating logic
    const q = query(collection(db, 'customers'), where('phone', '==', inquiryData.phone));
    const snap = await getDocs(q);
    if (!snap.empty) {
      await updateDoc(doc(db, 'customers', snap.docs[0].id), {
        status: 'New',
        interestedProduct: inquiryData.productName,
        notes: inquiryData.message,
        date: new Date().toISOString()
      });
    } else {
      await addDoc(collection(db, 'customers'), {
        name: inquiryData.customerName,
        phone: inquiryData.phone,
        city: inquiryData.city,
        interestedProduct: inquiryData.productName,
        productId: inquiryData.productId,
        status: 'New',
        date: new Date().toISOString(),
        notes: inquiryData.message
      });
    }

    // Increment views/inquiries on product
    const prodDocRef = doc(db, 'products', inquiryData.productId);
    await updateDoc(prodDocRef, { inquiriesCount: increment(1) });
    return { id: docRef.id, ...newInq };
  },

  async updateInquiryStatus(id, status) {
    if (isDemoMode) {
      const inqs = getLocalData('arshad_inquiries', mockInquiries);
      const index = inqs.findIndex(i => i.id === id);
      if (index !== -1) {
        inqs[index].status = status;
        setLocalData('arshad_inquiries', inqs);
      }
      return true;
    }
    await updateDoc(doc(db, 'inquiries', id), { status });
    return true;
  },

  // SUPPLIERS
  async getSuppliers() {
    if (isDemoMode) {
      return getLocalData('arshad_suppliers', mockSuppliers);
    }
    const snap = await getDocs(collection(db, 'suppliers'));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async addSupplier(supplierData) {
    if (isDemoMode) {
      const sups = getLocalData('arshad_suppliers', mockSuppliers);
      const newSup = { ...supplierData, id: 'sup-' + Date.now() };
      sups.push(newSup);
      setLocalData('arshad_suppliers', sups);
      return newSup;
    }
    const docRef = await addDoc(collection(db, 'suppliers'), supplierData);
    return { id: docRef.id, ...supplierData };
  },

  async updateSupplier(id, supplierData) {
    if (isDemoMode) {
      const sups = getLocalData('arshad_suppliers', mockSuppliers);
      const index = sups.findIndex(s => s.id === id);
      if (index !== -1) {
        sups[index] = { ...sups[index], ...supplierData };
        setLocalData('arshad_suppliers', sups);
      }
      return true;
    }
    await updateDoc(doc(db, 'suppliers', id), supplierData);
    return true;
  },

  async deleteSupplier(id) {
    if (isDemoMode) {
      const sups = getLocalData('arshad_suppliers', mockSuppliers);
      setLocalData('arshad_suppliers', sups.filter(s => s.id !== id));
      return true;
    }
    await deleteDoc(doc(db, 'suppliers', id));
    return true;
  },

  // PROJECTS (PORTFOLIO)
  async getProjects() {
    if (isDemoMode) {
      return getLocalData('arshad_projects', mockProjects);
    }
    const snap = await getDocs(query(collection(db, 'projects'), orderBy('createdAt', 'desc')));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async addProject(projectData) {
    const newProj = {
      ...projectData,
      createdAt: new Date().toISOString()
    };
    if (isDemoMode) {
      const projs = getLocalData('arshad_projects', mockProjects);
      newProj.id = 'proj-' + Date.now();
      projs.unshift(newProj);
      setLocalData('arshad_projects', projs);
      return newProj;
    }
    const docRef = await addDoc(collection(db, 'projects'), newProj);
    return { id: docRef.id, ...newProj };
  },

  async deleteProject(id) {
    if (isDemoMode) {
      const projs = getLocalData('arshad_projects', mockProjects);
      setLocalData('arshad_projects', projs.filter(p => p.id !== id));
      return true;
    }
    await deleteDoc(doc(db, 'projects', id));
    return true;
  },

  // REVIEWS
  async getReviews() {
    if (isDemoMode) {
      return getLocalData('arshad_reviews', mockReviews);
    }
    const snap = await getDocs(query(collection(db, 'reviews'), orderBy('createdAt', 'desc')));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async addReview(reviewData) {
    const newReview = {
      ...reviewData,
      approved: false, // require admin approval by default
      createdAt: new Date().toISOString()
    };
    if (isDemoMode) {
      const revs = getLocalData('arshad_reviews', mockReviews);
      newReview.id = 'rev-' + Date.now();
      revs.unshift(newReview);
      setLocalData('arshad_reviews', revs);
      return newReview;
    }
    const docRef = await addDoc(collection(db, 'reviews'), newReview);
    return { id: docRef.id, ...newReview };
  },

  async approveReview(id) {
    if (isDemoMode) {
      const revs = getLocalData('arshad_reviews', mockReviews);
      const index = revs.findIndex(r => r.id === id);
      if (index !== -1) {
        revs[index].approved = true;
        setLocalData('arshad_reviews', revs);
      }
      return true;
    }
    await updateDoc(doc(db, 'reviews', id), { approved: true });
    return true;
  },

  async deleteReview(id) {
    if (isDemoMode) {
      const revs = getLocalData('arshad_reviews', mockReviews);
      setLocalData('arshad_reviews', revs.filter(r => r.id !== id));
      return true;
    }
    await deleteDoc(doc(db, 'reviews', id));
    return true;
  }
};
