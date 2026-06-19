import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Package, FolderOpen, Warehouse, LayoutGrid, Users, 
  Inbox, Truck, Star, LogOut, Plus, Trash2, Edit2, Check, X, ShieldAlert 
} from 'lucide-react';
import { authManager } from '../firebase/authManager';
import { dataManager } from '../firebase/dataManager';
import { isDemoMode } from '../firebase/config';
import SEO from '../components/SEO';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  // Data lists
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [projects, setProjects] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);

  // Forms and Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', category: 'Wall Tiles', subcategory: '', brand: '', size: '', boxCoverage: '', 
    piecesPerBox: '', finish: 'Glossy', surface: '', color: '', material: '', priceType: 'per-box', 
    price: '', stock: '', images: '', description: '', featured: false, status: 'Available',
    seoTitle: '', seoDescription: '', seoKeywords: ''
  });

  // Simple category form
  const [newCatName, setNewCatName] = useState('');

  // Simple project form
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '', location: '', customerType: 'Residential', area: '', materialsUsed: '',
    completionDate: '', description: '', beforeImages: '', afterImages: '', category: 'Living Room'
  });

  // Load user status
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authManager.getCurrentUser();
      if (!currentUser) {
        navigate('/admin/login');
      } else {
        setUser(currentUser);
      }
    };
    checkAuth();
  }, [navigate]);

  // Load ERP datasets
  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats, inv, projs, custs, inqs, sups, revs] = await Promise.all([
        dataManager.getProducts(),
        dataManager.getCategories(),
        dataManager.getInventory(),
        dataManager.getProjects(),
        dataManager.getCustomers(),
        dataManager.getInquiries(),
        dataManager.getSuppliers(),
        dataManager.getReviews()
      ]);
      setProducts(prods);
      setCategories(cats);
      setInventory(inv);
      setProjects(projs);
      setCustomers(custs);
      setInquiries(inqs);
      setSuppliers(sups);
      setReviews(revs);
    } catch (e) {
      console.error("Error loading ERP dashboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  // Auth logout trigger
  const handleLogout = async () => {
    await authManager.logout();
    navigate('/admin/login');
  };

  // ==========================================
  // PRODUCT OPERATIONS
  // ==========================================
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      boxCoverage: Number(productForm.boxCoverage),
      piecesPerBox: Number(productForm.piecesPerBox),
      images: productForm.images.split(',').map(img => img.trim()).filter(Boolean),
      seo: {
        title: productForm.seoTitle || productForm.name,
        description: productForm.seoDescription || productForm.description,
        keywords: productForm.seoKeywords || ''
      }
    };

    try {
      if (editingProduct) {
        await dataManager.updateProduct(editingProduct.id, data);
      } else {
        await dataManager.addProduct(data);
      }
      setShowProductModal(false);
      resetProductForm();
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const editProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      subcategory: prod.subcategory || '',
      brand: prod.brand || '',
      size: prod.size || '',
      boxCoverage: prod.boxCoverage || '',
      piecesPerBox: prod.piecesPerBox || '',
      finish: prod.finish || 'Glossy',
      surface: prod.surface || '',
      color: prod.color || '',
      material: prod.material || '',
      priceType: prod.priceType || 'per-box',
      price: prod.price || '',
      stock: prod.stock || '',
      images: prod.images ? prod.images.join(', ') : '',
      description: prod.description || '',
      featured: prod.featured || false,
      status: prod.status || 'Available',
      seoTitle: prod.seo?.title || '',
      seoDescription: prod.seo?.description || '',
      seoKeywords: prod.seo?.keywords || ''
    });
    setShowProductModal(true);
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await dataManager.deleteProduct(id);
      loadData();
    }
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: '', category: 'Wall Tiles', subcategory: '', brand: '', size: '', boxCoverage: '', 
      piecesPerBox: '', finish: 'Glossy', surface: '', color: '', material: '', priceType: 'per-box', 
      price: '', stock: '', images: '', description: '', featured: false, status: 'Available',
      seoTitle: '', seoDescription: '', seoKeywords: ''
    });
  };

  // ==========================================
  // INVENTORY STOCK ADJUSTMENT
  // ==========================================
  const handleStockUpdate = async (productId, currentStock, change) => {
    const newStock = Number(currentStock) + Number(change);
    if (newStock < 0) return;
    await dataManager.updateStock(productId, newStock);
    loadData();
  };

  // ==========================================
  // CRM STATUS CONTROLS
  // ==========================================
  const handleCustomerStatusChange = async (id, status) => {
    await dataManager.updateCustomer(id, { status });
    loadData();
  };

  const handleInquiryStatusChange = async (id, status) => {
    await dataManager.updateInquiryStatus(id, status);
    loadData();
  };

  // ==========================================
  // CATEGORIES OPERATIONS
  // ==========================================
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName) return;
    await dataManager.addCategory({ name: newCatName, description: 'Added via ERP Dashboard' });
    setNewCatName('');
    loadData();
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Delete this category?")) {
      await dataManager.deleteCategory(id);
      loadData();
    }
  };

  // ==========================================
  // REVIEWS MODERATION
  // ==========================================
  const approveReview = async (id) => {
    await dataManager.approveReview(id);
    loadData();
  };

  const deleteReview = async (id) => {
    if (window.confirm("Delete this testimonial?")) {
      await dataManager.deleteReview(id);
      loadData();
    }
  };

  // ==========================================
  // PROJECT PORTFOLIO OPERATIONS
  // ==========================================
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...projectForm,
      materialsUsed: projectForm.materialsUsed.split(',').map(m => m.trim()).filter(Boolean),
      beforeImages: projectForm.beforeImages.split(',').map(img => img.trim()).filter(Boolean),
      afterImages: projectForm.afterImages.split(',').map(img => img.trim()).filter(Boolean)
    };
    await dataManager.addProject(data);
    setShowProjectModal(false);
    setProjectForm({
      title: '', location: '', customerType: 'Residential', area: '', materialsUsed: '',
      completionDate: '', description: '', beforeImages: '', afterImages: '', category: 'Living Room'
    });
    loadData();
  };

  const deleteProject = async (id) => {
    if (window.confirm("Delete this completed project?")) {
      await dataManager.deleteProject(id);
      loadData();
    }
  };

  if (!user) return null;

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col md:flex-row text-left font-sans select-none">
      <SEO title="Admin ERP Dashboard" />

      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-primary text-gray-300 flex flex-col justify-between py-6 flex-shrink-0 border-r border-white/5 relative z-10">
        <div>
          {/* Header */}
          <div className="px-6 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-primary shadow-lg shadow-accent/20">
              <Warehouse className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold text-white leading-tight">ERP Dashboard</span>
              <span className="text-[9px] uppercase tracking-wider text-accent font-semibold">Arshad Showroom</span>
            </div>
          </div>

          {/* Nav list */}
          <nav className="flex flex-col gap-1 px-4">
            {[
              { name: 'Dashboard', icon: <Home className="w-4 h-4" /> },
              { name: 'Products', icon: <Package className="w-4 h-4" /> },
              { name: 'Categories', icon: <FolderOpen className="w-4 h-4" /> },
              { name: 'Inventory', icon: <Warehouse className="w-4 h-4" /> },
              { name: 'Projects', icon: <LayoutGrid className="w-4 h-4" /> },
              { name: 'Customers', icon: <Users className="w-4 h-4" /> },
              { name: 'Inquiries', icon: <Inbox className="w-4 h-4" /> },
              { name: 'Suppliers', icon: <Truck className="w-4 h-4" /> },
              { name: 'Reviews', icon: <Star className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.name ? 'bg-accent text-primary shadow-lg shadow-accent/15' : 'hover:bg-white/5 hover:text-white'}`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="px-4 mt-8">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-grow p-6 sm:p-10 max-h-screen overflow-y-auto">
        
        {/* Top Info Banner */}
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-serif font-extrabold text-primary">{activeTab} Panel</h1>
            <p className="text-xs text-gray-500 mt-1">Real-time database sync status: <span className="font-bold text-green-600">Active</span></p>
          </div>
          {isDemoMode && (
            <div className="bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              Running in Demo Mode
            </div>
          )}
        </header>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <span className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : (
          <div>
            
            {/* TABS COMPONENT CONFIGURATION */}
            {/* ========================================== */}
            {/* 1. OVERVIEW DASHBOARD */}
            {/* ========================================== */}
            {activeTab === 'Dashboard' && (
              <div className="flex flex-col gap-8">
                {/* Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: 'Total Products', val: products.length, desc: 'Active showroom listings', color: 'border-l-blue-500' },
                    { title: 'Low Stock warnings', val: products.filter(p => p.stock < 20).length, desc: 'Items with < 20 boxes', color: 'border-l-red-500 text-red-600' },
                    { title: 'Customer CRM Leads', val: customers.length, desc: 'Leads registered', color: 'border-l-purple-500' },
                    { title: 'Pending Quote Requests', val: inquiries.filter(i => i.status === 'Pending').length, desc: 'Needs followup contact', color: 'border-l-amber-500' }
                  ].map((stat, i) => (
                    <div key={i} className={`bg-white p-6 rounded-2xl border border-gray-200 shadow-sm border-l-4 ${stat.color} text-left`}>
                      <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block">{stat.title}</span>
                      <h3 className="text-3xl font-black text-primary mt-1.5">{stat.val}</h3>
                      <span className="text-[10px] text-gray-400 mt-1 block">{stat.desc}</span>
                    </div>
                  ))}
                </div>

                {/* Grid Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Stock Alert list */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-left">
                    <h3 className="font-serif font-bold text-primary mb-4 pb-2 border-b border-gray-100">Critical Stock Warnings</h3>
                    <div className="flex flex-col gap-3">
                      {products.filter(p => p.stock < 20).length > 0 ? (
                        products.filter(p => p.stock < 20).slice(0, 5).map(prod => (
                          <div key={prod.id} className="flex items-center justify-between text-xs py-1">
                            <span className="font-bold text-primary">{prod.name} ({prod.brand})</span>
                            <span className={`px-2 py-0.5 rounded font-bold ${prod.stock === 0 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                              {prod.stock} boxes left
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 italic">No low stock warnings. Inventory levels are stable.</p>
                      )}
                    </div>
                  </div>

                  {/* Most Visited Analytics */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-left">
                    <h3 className="font-serif font-bold text-primary mb-4 pb-2 border-b border-gray-100">Most Viewed Catalog Items</h3>
                    <div className="flex flex-col gap-3">
                      {[...products].sort((a,b) => (b.views || 0) - (a.views || 0)).slice(0, 5).map(prod => (
                        <div key={prod.id} className="flex items-center justify-between text-xs py-1">
                          <span className="font-semibold text-primary">{prod.name} ({prod.brand})</span>
                          <span className="text-gray-400 font-bold">{prod.views || 0} page views</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* 2. PRODUCTS PANEL */}
            {/* ========================================== */}
            {activeTab === 'Products' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-serif font-bold text-lg text-primary">Catalog Listing</h3>
                  <button 
                    onClick={() => { resetProductForm(); setShowProductModal(true); }}
                    className="btn bg-accent text-primary font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 hover:bg-accent-dark transition-all shadow-md shadow-accent/20"
                  >
                    <Plus className="w-4 h-4" /> Add Showroom Product
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-gray-400 uppercase tracking-wider border-b border-gray-200">
                        <th className="p-4">Image</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Brand</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Size</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map(prod => (
                        <tr key={prod.id} className="hover:bg-slate-50">
                          <td className="p-4">
                            <img src={prod.images?.[0] || '/logo-icon.png'} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-50 border" />
                          </td>
                          <td className="p-4 font-bold text-primary">{prod.name}</td>
                          <td className="p-4 text-gray-500">{prod.brand}</td>
                          <td className="p-4 text-gray-500">{prod.category}</td>
                          <td className="p-4 text-gray-500">{prod.size}</td>
                          <td className="p-4 font-bold">PKR {prod.price}</td>
                          <td className="p-4 font-semibold">{prod.stock} boxes</td>
                          <td className="p-4 flex gap-2">
                            <button onClick={() => editProduct(prod)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => deleteProduct(prod.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* 3. CATEGORIES PANEL */}
            {/* ========================================== */}
            {activeTab === 'Categories' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Category Add Form */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-left h-fit">
                  <h3 className="font-serif font-bold text-primary mb-4">Create Category</h3>
                  <form onSubmit={handleAddCategory} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Category Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Wall Panels"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <button type="submit" className="w-full bg-primary text-white font-bold py-2.5 rounded-xl text-xs hover:bg-primary-light transition-all">
                      Add Category
                    </button>
                  </form>
                </div>

                {/* Categories Table list */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="font-serif font-bold text-primary mb-4">Available Showroom Categories</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-gray-400 uppercase border-b border-gray-100">
                          <th className="p-3">Name</th>
                          <th className="p-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {categories.map((cat) => (
                          <tr key={cat.id}>
                            <td className="p-3 font-semibold text-primary">{cat.name}</td>
                            <td className="p-3">
                              <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-600 p-1 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* 4. INVENTORY STOCK MANAGEMENT */}
            {/* ========================================== */}
            {activeTab === 'Inventory' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-serif font-bold text-lg text-primary mb-6">Stock Ledger & Adjustments</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-gray-400 uppercase border-b border-gray-200">
                        <th className="p-4">Product Name</th>
                        <th className="p-4">Total Stock</th>
                        <th className="p-4">Sold Invoices</th>
                        <th className="p-4">Current Stock</th>
                        <th className="p-4">Quick Adjust Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {inventory.map(inv => (
                        <tr key={inv.id} className="hover:bg-slate-50">
                          <td className="p-4 font-bold text-primary">{inv.productName}</td>
                          <td className="p-4 text-gray-500">{inv.totalStock} boxes</td>
                          <td className="p-4 text-gray-500">{inv.sold} boxes</td>
                          <td className="p-4">
                            <span className={`font-bold ${inv.remaining < 20 ? 'text-red-500' : 'text-green-600'}`}>
                              {inv.remaining} boxes
                            </span>
                          </td>
                          <td className="p-4 flex items-center gap-1.5">
                            <button onClick={() => handleStockUpdate(inv.productId, inv.remaining, 10)} className="bg-slate-100 hover:bg-slate-200 font-bold px-2.5 py-1.5 rounded-lg border">+10</button>
                            <button onClick={() => handleStockUpdate(inv.productId, inv.remaining, -10)} className="bg-slate-100 hover:bg-slate-200 font-bold px-2.5 py-1.5 rounded-lg border">-10</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* 5. PORTFOLIO & GALLERY */}
            {/* ========================================== */}
            {activeTab === 'Projects' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-serif font-bold text-primary">Showroom Installations Portfolio</h3>
                  <button 
                    onClick={() => setShowProjectModal(true)}
                    className="btn bg-accent text-primary font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 hover:bg-accent-dark transition-all shadow-md shadow-accent/20"
                  >
                    <Plus className="w-4 h-4" /> Add Portfolio Project
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-gray-400 uppercase border-b border-gray-100">
                        <th className="p-4">Image</th>
                        <th className="p-4">Title</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Customer Type</th>
                        <th className="p-4">Area</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {projects.map(proj => (
                        <tr key={proj.id} className="hover:bg-slate-50">
                          <td className="p-4">
                            <img src={proj.afterImages?.[0] || '/logo-icon.png'} alt="" className="w-10 h-10 rounded-lg object-cover border" />
                          </td>
                          <td className="p-4 font-bold text-primary">{proj.title}</td>
                          <td className="p-4 text-gray-500">{proj.category}</td>
                          <td className="p-4 text-gray-500">{proj.customerType}</td>
                          <td className="p-4 text-gray-500">{proj.area}</td>
                          <td className="p-4 text-gray-400">{proj.location}</td>
                          <td className="p-4">
                            <button onClick={() => deleteProject(proj.id)} className="text-red-600 p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* 6. CUSTOMERS CRM LOGS */}
            {/* ========================================== */}
            {activeTab === 'Customers' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-serif font-bold text-lg text-primary mb-6">Customer Follow-Up Ledger (CRM)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-gray-400 uppercase border-b border-gray-200">
                        <th className="p-4">Name</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">City</th>
                        <th className="p-4">Product Interest</th>
                        <th className="p-4">Lead Status</th>
                        <th className="p-4">Internal Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {customers.map(cust => (
                        <tr key={cust.id} className="hover:bg-slate-50">
                          <td className="p-4 font-bold text-primary">{cust.name}</td>
                          <td className="p-4 text-gray-500 font-semibold">{cust.phone}</td>
                          <td className="p-4 text-gray-500">{cust.city}</td>
                          <td className="p-4 font-semibold text-primary">{cust.interestedProduct}</td>
                          <td className="p-4">
                            <select
                              value={cust.status}
                              onChange={(e) => handleCustomerStatusChange(cust.id, e.target.value)}
                              className="px-2 py-1 rounded bg-slate-50 border text-xs font-bold"
                            >
                              <option value="New">New</option>
                              <option value="Follow Up Required">Follow Up Required</option>
                              <option value="Won">Won</option>
                              <option value="Lost">Lost</option>
                            </select>
                          </td>
                          <td className="p-4 text-gray-400 italic max-w-xs truncate" title={cust.notes}>{cust.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* 7. INBOUND CUSTOMER INQUIRIES */}
            {/* ========================================== */}
            {activeTab === 'Inquiries' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-serif font-bold text-lg text-primary mb-6">Quote & Lead Inquiries</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-gray-400 uppercase border-b border-gray-200">
                        <th className="p-4">Customer</th>
                        <th className="p-4">Contact Details</th>
                        <th className="p-4">Product Selected</th>
                        <th className="p-4">Inquiry Message</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {inquiries.map(inq => (
                        <tr key={inq.id} className="hover:bg-slate-50">
                          <td className="p-4 font-bold text-primary">{inq.customerName}</td>
                          <td className="p-4 text-gray-500 leading-normal">
                            Phone: <span className="font-semibold">{inq.phone}</span><br />
                            City: {inq.city}
                          </td>
                          <td className="p-4 font-semibold text-primary">{inq.productName}</td>
                          <td className="p-4 text-gray-600 max-w-xs">{inq.message}</td>
                          <td className="p-4">
                            <select
                              value={inq.status}
                              onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value)}
                              className="px-2 py-1 rounded bg-slate-50 border text-xs font-bold"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* 8. SUPPLIERS */}
            {/* ========================================== */}
            {activeTab === 'Suppliers' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-serif font-bold text-lg text-primary mb-6">Suppliers Ledger</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-gray-400 uppercase border-b border-gray-200">
                        <th className="p-4">Supplier Name</th>
                        <th className="p-4">Company Name</th>
                        <th className="p-4">Contact Phone</th>
                        <th className="p-4">Category Supplies</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4">Balance Due</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {suppliers.map(sup => (
                        <tr key={sup.id} className="hover:bg-slate-50">
                          <td className="p-4 font-bold text-primary">{sup.name}</td>
                          <td className="p-4 text-gray-500 font-semibold">{sup.company}</td>
                          <td className="p-4 text-gray-500">{sup.phone}</td>
                          <td className="p-4">
                            <div className="flex gap-1.5 flex-wrap">
                              {sup.products.map((p, i) => (
                                <span key={i} className="bg-slate-100 px-2 py-0.5 rounded text-[10px] text-gray-500 font-bold">{p}</span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 font-bold">{sup.paymentStatus}</td>
                          <td className="p-4 text-red-500 font-bold">PKR {sup.outstandingBalance?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* 9. REVIEWS MODERATION */}
            {/* ========================================== */}
            {activeTab === 'Reviews' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-serif font-bold text-lg text-primary mb-6">Testimonials Moderation</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-gray-400 uppercase border-b border-gray-200">
                        <th className="p-4">Reviewer</th>
                        <th className="p-4">Rating</th>
                        <th className="p-4">Review Text</th>
                        <th className="p-4">Approved Status</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {reviews.map(rev => (
                        <tr key={rev.id} className="hover:bg-slate-50">
                          <td className="p-4 font-bold text-primary">{rev.author}</td>
                          <td className="p-4">
                            <span className="font-bold text-accent-dark">{rev.rating} ★</span>
                          </td>
                          <td className="p-4 text-gray-600 max-w-xs">{rev.text}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1.5 rounded-lg font-bold text-[10px] ${rev.approved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                              {rev.approved ? 'Approved' : 'Pending'}
                            </span>
                          </td>
                          <td className="p-4 flex gap-2">
                            {!rev.approved && (
                              <button onClick={() => approveReview(rev.id)} className="p-1 bg-green-50 hover:bg-green-100 text-green-700 rounded"><Check className="w-4 h-4" /></button>
                            )}
                            <button onClick={() => deleteReview(rev.id)} className="p-1 bg-red-50 hover:bg-red-100 text-red-700 rounded"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      {/* PRODUCT FORM MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-primary text-white p-6 rounded-t-3xl flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold">{editingProduct ? 'Edit Showroom Product' : 'Add Showroom Product'}</h3>
              <button onClick={() => setShowProductModal(false)} className="text-gray-300 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="flex-grow p-6 overflow-y-auto text-left flex flex-col gap-6 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name</label>
                  <input type="text" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} required className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                  <select value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none bg-slate-50">
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subcategory</label>
                  <input type="text" value={productForm.subcategory} onChange={(e) => setProductForm({...productForm, subcategory: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Brand</label>
                  <input type="text" value={productForm.brand} onChange={(e) => setProductForm({...productForm, brand: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Size</label>
                  <input type="text" placeholder="e.g. 120x60 cm" value={productForm.size} onChange={(e) => setProductForm({...productForm, size: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Box Coverage (sq ft)</label>
                  <input type="number" step="0.1" value={productForm.boxCoverage} onChange={(e) => setProductForm({...productForm, boxCoverage: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pcs/Box</label>
                  <input type="number" value={productForm.piecesPerBox} onChange={(e) => setProductForm({...productForm, piecesPerBox: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Finish</label>
                  <input type="text" placeholder="e.g. Glossy / Matt" value={productForm.finish} onChange={(e) => setProductForm({...productForm, finish: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Color</label>
                  <input type="text" value={productForm.color} onChange={(e) => setProductForm({...productForm, color: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price</label>
                  <input type="number" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} required className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price Unit</label>
                  <select value={productForm.priceType} onChange={(e) => setProductForm({...productForm, priceType: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none bg-slate-50">
                    <option value="per-box">per box</option>
                    <option value="per-sqft">per sq ft</option>
                    <option value="per-piece">per piece</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock (Boxes)</label>
                  <input type="number" value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} required className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Availability status</label>
                  <select value={productForm.status} onChange={(e) => setProductForm({...productForm, status: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none bg-slate-50">
                    <option value="Available">Available</option>
                    <option value="Limited Stock">Limited Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="New Arrival">New Arrival</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URLs (comma separated)</label>
                <input type="text" placeholder="https://unsplash.com/..., https://unsplash.com/..." value={productForm.images} onChange={(e) => setProductForm({...productForm, images: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Description</label>
                <textarea rows="3" value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none resize-none"></textarea>
              </div>

              {/* SEO Subfields */}
              <div className="border-t border-gray-100 pt-4 flex flex-col gap-4">
                <h4 className="font-bold text-primary font-serif">SEO Configurations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">SEO Title</label>
                    <input type="text" value={productForm.seoTitle} onChange={(e) => setProductForm({...productForm, seoTitle: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">SEO Keywords</label>
                    <input type="text" value={productForm.seoKeywords} onChange={(e) => setProductForm({...productForm, seoKeywords: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">SEO Description</label>
                  <textarea rows="2" value={productForm.seoDescription} onChange={(e) => setProductForm({...productForm, seoDescription: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none resize-none"></textarea>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" checked={productForm.featured} onChange={(e) => setProductForm({...productForm, featured: e.target.checked})} className="rounded text-accent focus:ring-accent" />
                <label className="text-xs font-bold text-gray-600 uppercase">Mark as Featured Product</label>
              </div>

              <div className="border-t border-gray-150 pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowProductModal(false)} className="btn bg-slate-100 hover:bg-slate-200 px-6 py-2.5 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="btn bg-accent text-primary px-8 py-2.5 rounded-xl font-bold hover:bg-accent-dark">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PORTFOLIO PROJECT MODAL */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-primary text-white p-6 rounded-t-3xl flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold">Add Completed Installation Project</h3>
              <button onClick={() => setShowProjectModal(false)} className="text-gray-300 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleProjectSubmit} className="flex-grow p-6 overflow-y-auto text-left flex flex-col gap-6 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Project Title</label>
                  <input type="text" value={projectForm.title} onChange={(e) => setProjectForm({...projectForm, title: e.target.value})} required className="w-full px-3 py-2 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gallery Category</label>
                  <select value={projectForm.category} onChange={(e) => setProjectForm({...projectForm, category: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-slate-50">
                    <option value="Bathroom Designs">Bathroom Designs</option>
                    <option value="Kitchen Designs">Kitchen Designs</option>
                    <option value="Living Room">Living Room</option>
                    <option value="Commercial Projects">Commercial Projects</option>
                    <option value="Outdoor">Outdoor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Client Type</label>
                  <select value={projectForm.customerType} onChange={(e) => setProjectForm({...projectForm, customerType: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-slate-50">
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Covered Area (sq ft)</label>
                  <input type="text" placeholder="e.g. 2500 sq ft" value={projectForm.area} onChange={(e) => setProjectForm({...projectForm, area: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                  <input type="text" placeholder="e.g. Shabqadar" value={projectForm.location} onChange={(e) => setProjectForm({...projectForm, location: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Materials Used (comma separated)</label>
                  <input type="text" placeholder="Royal Marble, Oak Wood Planks" value={projectForm.materialsUsed} onChange={(e) => setProjectForm({...projectForm, materialsUsed: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Completion Date</label>
                  <input type="date" value={projectForm.completionDate} onChange={(e) => setProjectForm({...projectForm, completionDate: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Before Images (URLs, comma separated)</label>
                <input type="text" value={projectForm.beforeImages} onChange={(e) => setProjectForm({...projectForm, beforeImages: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">After Images (URLs, comma separated)</label>
                <input type="text" value={projectForm.afterImages} onChange={(e) => setProjectForm({...projectForm, afterImages: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea rows="3" value={projectForm.description} onChange={(e) => setProjectForm({...projectForm, description: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 resize-none"></textarea>
              </div>

              <div className="border-t border-gray-150 pt-4 flex justify-end gap-3 mt-auto">
                <button type="button" onClick={() => setShowProjectModal(false)} className="btn bg-slate-100 hover:bg-slate-200 px-6 py-2.5 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="btn bg-accent text-primary px-8 py-2.5 rounded-xl font-bold hover:bg-accent-dark">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
