'use client';

import { useState, useEffect, useRef } from 'react';
import { client } from '../../sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

const ADMIN_PASSWORD = "bilwashree2026";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showManageCategories, setShowManageCategories] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [toast, setToast] = useState({ message: '', type: '' });
  const [isDesktop, setIsDesktop] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [catToDelete, setCatToDelete] = useState(null);

  const [formState, setFormState] = useState({
    name: '',
    price: '',
    category: '',
    image: null,
    imageFile: null
  });

  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  // Authentication check
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      showToast('Logged in successfully');
    } else {
      showToast('Incorrect password', 'error');
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    // Check if desktop
    setIsDesktop(!/Mobi|Android/i.test(navigator.userAgent));
  }, []);

  // Fetch products and categories
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        client.fetch(`*[_type == "product"] | order(_createdAt desc)`),
        client.fetch(`*[_type == "category"] | order(title asc)`)
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      if (categoriesData.length > 0 && !formState.category) {
        setFormState(prev => ({ ...prev, category: categoriesData[0].slug?.current || categoriesData[0].title.toLowerCase() }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Mutations
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormState({
      name: product.name,
      price: product.price,
      category: product.category || (categories[0]?.slug?.current || ''),
      image: product.images?.[0] || null,
      imageFile: null
    });
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setFormState({
      name: '',
      price: '',
      category: categories[0]?.slug?.current || categories[0]?.title?.toLowerCase() || '',
      image: null,
      imageFile: null
    });
  };

  const handleSave = async () => {
    if (!formState.name || !formState.price) {
      showToast('Name and Price are required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      let imageAsset = null;

      // Handle image upload if a new file was selected
      if (formState.imageFile) {
        const formData = new FormData();
        formData.append('file', formState.imageFile);
        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.error) throw new Error(uploadData.error);
        imageAsset = {
          _type: 'image',
          asset: { _type: 'reference', _ref: uploadData._id }
        };
      }

      const productData = {
        name: formState.name,
        price: Number(formState.price),
        category: formState.category,
      };

      if (imageAsset) {
        productData.images = [imageAsset];
      }

      if (isAddingNew) {
        const res = await fetch('/api/admin/mutate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'create', data: { ...productData, _type: 'product' } }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        showToast('Product created successfully');
      } else {
        const res = await fetch('/api/admin/mutate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'patch',
            data: { id: editingProduct._id, _type: 'product', ...productData }
          }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        showToast('Product updated successfully');
      }

      setEditingProduct(null);
      setIsAddingNew(false);
      fetchData();
    } catch (error) {
      console.error('Save error:', error);
      showToast('Error saving: ' + error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch('/api/admin/mutate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', data: { id } }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      showToast('Product deleted successfully');
      setShowDeleteConfirm(null);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      showToast('Error deleting: ' + error.message, 'error');
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/mutate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          data: { _type: 'category', title: newCatName.trim() }
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      showToast('Category added');
      setNewCatName('');
      fetchData();
    } catch (error) {
      showToast('Error: ' + error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const res = await fetch('/api/admin/mutate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', data: { id } }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      showToast('Category deleted');
      setCatToDelete(null);
      fetchData();
    } catch (error) {
      showToast('Error: ' + error.message, 'error');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormState({ ...formState, imageFile: file, image: URL.createObjectURL(file) });
    }
  };

  const filteredProducts = activeFilter === 'all'
    ? products
    : products.filter(p => p.category === activeFilter);

  const getCategoryLabel = (val) => categories.find(c => (c.slug?.current || c.title?.toLowerCase()) === val)?.title || val || 'Other';

  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h1 style={styles.title}>Bilwashree Admin</h1>
          <p style={styles.subtitle}>Enter password to manage products</p>
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              autoFocus
            />
            <button type="submit" style={styles.button}>Login</button>
          </form>
        </div>
        {toast.message && <div style={{...styles.toast, background: toast.type === 'error' ? '#f44336' : '#4caf50'}}>{toast.message}</div>}
      </div>
    );
  }

  return (
    <div style={styles.adminContainer}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Admin Panel</h1>
        <div style={{display: 'flex', gap: '10px'}}>
          <button onClick={() => setShowManageCategories(true)} style={styles.secondaryHeaderBtn}>Categories</button>
          <button onClick={handleAddNew} style={styles.addButton}>+ New</button>
        </div>
      </header>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <button
          onClick={() => setActiveFilter('all')}
          style={{...styles.filterBtn, ...(activeFilter === 'all' ? styles.filterBtnActive : {})}}
        >
          All
        </button>
        {categories.map(cat => {
          const val = cat.slug?.current || cat.title.toLowerCase();
          return (
            <button
              key={cat._id}
              onClick={() => setActiveFilter(val)}
              style={{...styles.filterBtn, ...(activeFilter === val ? styles.filterBtnActive : {})}}
            >
              {cat.title}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={styles.loading}>Loading items...</div>
      ) : (
        <div style={styles.productList}>
          {filteredProducts.map((product) => (
            <div key={product._id} style={styles.productItem} onClick={() => handleEdit(product)}>
              <div style={styles.productThumb}>
                {product.images?.[0] ? (
                  <img src={urlFor(product.images[0]).width(100).height(100).url()} alt="" style={styles.thumbImg} />
                ) : (
                  <div style={styles.noImg}>No Image</div>
                )}
              </div>
              <div style={styles.productInfo}>
                <div style={styles.productName}>{product.name}</div>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <div style={styles.productPrice}>₹{product.price}</div>
                  {product.category && (
                    <span style={styles.categoryBadge}>{getCategoryLabel(product.category)}</span>
                  )}
                </div>
              </div>
              <button
                style={styles.itemDeleteBtn}
                onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(product); }}
                aria-label="Delete product"
              >
                🗑️
              </button>
              <div style={styles.chevron}>›</div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div style={styles.noResults}>No products found.</div>
          )}
        </div>
      )}

      {/* Edit/Add Modal */}
      {(editingProduct || isAddingNew) && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>{isAddingNew ? 'Add Product' : 'Edit Product'}</h3>
              <button onClick={() => { setEditingProduct(null); setIsAddingNew(false); }} style={styles.closeBtn}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.imageSection}>
                <div style={styles.imagePreviewWrap}>
                  {formState.image ? (
                    <img
                      src={typeof formState.image === 'string' ? formState.image : urlFor(formState.image).width(400).url()}
                      alt="Product"
                      style={styles.previewImg}
                    />
                  ) : (
                    <div style={styles.uploadPlaceholder}>No image selected</div>
                  )}
                </div>

                <div style={styles.uploadActions}>
                  <button onClick={() => galleryInputRef.current.click()} style={styles.uploadBtn}>📁 Gallery</button>
                  {!isDesktop && (
                    <button onClick={() => cameraInputRef.current.click()} style={styles.uploadBtn}>📷 Camera</button>
                  )}
                </div>

                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.fieldLabel}>Product Name</label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  style={styles.modalInput}
                  placeholder="e.g. Gold Plated Necklace"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.fieldLabel}>Category</label>
                <select
                  value={formState.category}
                  onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                  style={styles.modalInput}
                >
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.slug?.current || cat.title.toLowerCase()}>{cat.title}</option>
                  ))}
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.fieldLabel}>Price (₹)</label>
                <input
                  type="number"
                  value={formState.price}
                  onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                  style={styles.modalInput}
                  placeholder="0"
                />
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button
                onClick={() => { setEditingProduct(null); setIsAddingNew(false); }}
                style={styles.cancelBtnLarge}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={styles.saveBtn}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Categories Modal */}
      {showManageCategories && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>Manage Categories</h3>
              <button onClick={() => setShowManageCategories(false)} style={styles.closeBtn}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.addCatRow}>
                <input
                  type="text"
                  placeholder="New Category Name"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  style={styles.catInput}
                />
                <button onClick={handleAddCategory} style={styles.addCatBtn} disabled={isSaving}>Add</button>
              </div>
              <div style={styles.catList}>
                {categories.map(cat => (
                  <div key={cat._id} style={styles.catItem}>
                    <span>{cat.title}</span>
                    <button style={styles.catDeleteBtn} onClick={() => setCatToDelete(cat)}>🗑️</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Product Confirmation */}
      {showDeleteConfirm && (
        <div style={styles.modalOverlay}>
          <div style={styles.confirmBox}>
            <p style={{marginBottom: '20px', fontWeight: 'bold'}}>
              Are you sure you want to delete "{showDeleteConfirm.name}"? This cannot be undone.
            </p>
            <div style={styles.confirmButtons}>
              <button onClick={() => setShowDeleteConfirm(null)} style={styles.cancelBtnLarge}>Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm._id)} style={styles.deleteConfirmBtn}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation */}
      {catToDelete && (
        <div style={styles.modalOverlay}>
          <div style={styles.confirmBox}>
            <p style={{marginBottom: '20px', fontWeight: 'bold'}}>
              Delete category "{catToDelete.title}"?
            </p>
            <div style={styles.confirmButtons}>
              <button onClick={() => setCatToDelete(null)} style={styles.cancelBtnLarge}>Cancel</button>
              <button onClick={() => handleDeleteCategory(catToDelete._id)} style={styles.deleteConfirmBtn}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast.message && <div style={{...styles.toast, background: toast.type === 'error' ? '#f44336' : '#4caf50'}}>{toast.message}</div>}
    </div>
  );
}

const styles = {
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#f0f2f5',
    padding: '20px',
  },
  loginCard: {
    background: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: { margin: '0 0 10px', fontSize: '24px', color: '#111' },
  subtitle: { margin: '0 0 20px', color: '#666', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: {
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none',
    height: '48px',
  },
  button: {
    padding: '12px',
    background: '#128c7e',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    height: '48px',
  },
  adminContainer: {
    minHeight: '100vh',
    background: '#f0f2f5',
    maxWidth: '600px',
    margin: '0 auto',
    paddingBottom: '100px',
  },
  header: {
    padding: '15px',
    background: '#075e54',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  headerTitle: { fontSize: '20px', margin: 0 },
  addButton: {
    background: '#25d366',
    color: 'white',
    border: 'none',
    padding: '0 16px',
    borderRadius: '24px',
    fontWeight: 'bold',
    fontSize: '14px',
    height: '40px',
  },
  secondaryHeaderBtn: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: 'none',
    padding: '0 16px',
    borderRadius: '24px',
    fontSize: '14px',
    height: '40px',
  },
  filterBar: {
    display: 'flex',
    gap: '8px',
    padding: '12px',
    overflowX: 'auto',
    background: 'white',
    borderBottom: '1px solid #eee',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
  },
  filterBtn: {
    padding: '0 16px',
    borderRadius: '20px',
    border: '1px solid #ddd',
    background: 'white',
    fontSize: '13px',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    height: '36px',
  },
  filterBtnActive: {
    background: '#075e54',
    color: 'white',
    borderColor: '#075e54',
  },
  loading: { padding: '40px', textAlign: 'center', color: '#666' },
  productList: { padding: '10px' },
  productItem: {
    background: 'white',
    borderRadius: '12px',
    padding: '12px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    position: 'relative',
  },
  productThumb: { width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', background: '#f8f9fa', marginRight: '15px' },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover' },
  noImg: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#999' },
  productInfo: { flex: 1 },
  productName: { fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' },
  productPrice: { color: '#075e54', fontWeight: 'bold' },
  categoryBadge: {
    fontSize: '10px',
    background: '#e1f5fe',
    color: '#0288d1',
    padding: '2px 8px',
    borderRadius: '10px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  itemDeleteBtn: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    padding: '10px',
    marginRight: '5px',
    cursor: 'pointer',
  },
  noResults: { padding: '40px', textAlign: 'center', color: '#999' },
  chevron: { color: '#bbb', fontSize: '24px' },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '15px',
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  },
  modalHeader: {
    padding: '15px 20px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#f8f9fa',
  },
  closeBtn: { background: 'none', border: 'none', fontSize: '24px', color: '#999', cursor: 'pointer' },
  modalBody: { padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' },
  imageSection: { display: 'flex', flexDirection: 'column', gap: '15px' },
  imagePreviewWrap: {
    width: '100%',
    aspectRatio: '1',
    background: '#f1f3f4',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    border: '1px solid #eee',
  },
  previewImg: { width: '100%', height: '100%', objectFit: 'contain' },
  uploadPlaceholder: { color: '#999', fontSize: '14px' },
  uploadActions: { display: 'flex', gap: '10px' },
  uploadBtn: {
    flex: 1,
    height: '48px',
    borderRadius: '8px',
    border: '1px solid #075e54',
    background: 'white',
    color: '#075e54',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  fieldLabel: { fontSize: '14px', fontWeight: 'bold', color: '#555' },
  modalInput: {
    padding: '0 15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none',
    height: '48px',
    background: '#fff',
  },
  modalFooter: {
    padding: '20px',
    borderTop: '1px solid #eee',
    display: 'flex',
    gap: '12px',
    background: '#f8f9fa',
  },
  cancelBtnLarge: {
    flex: 1,
    height: '48px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    background: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  saveBtn: {
    flex: 2,
    height: '48px',
    background: '#075e54',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  addCatRow: { display: 'flex', gap: '10px', marginBottom: '20px' },
  catInput: { flex: 1, height: '48px', padding: '0 15px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' },
  addCatBtn: { width: '80px', height: '48px', background: '#25d366', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' },
  catList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  catItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 15px',
    background: '#f8f9fa',
    borderRadius: '8px'
  },
  catDeleteBtn: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' },
  confirmBox: { background: 'white', padding: '25px', borderRadius: '16px', width: '100%', maxWidth: '350px', textAlign: 'center' },
  confirmButtons: { display: 'flex', gap: '12px' },
  deleteConfirmBtn: {
    flex: 1,
    height: '48px',
    background: '#d32f2f',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold'
  },
  toast: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '12px 24px',
    borderRadius: '30px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    zIndex: 1000,
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
  },
};
