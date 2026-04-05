'use client';

import { useState, useEffect, useRef } from 'react';
import { client } from '../../sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

const ADMIN_PASSWORD = "bilwashree2026";

const CATEGORIES = [
  { title: 'Necklace', value: 'necklaces' },
  { title: 'Haram', value: 'harams' },
  { title: 'Earrings', value: 'earrings' },
  { title: 'Pendant / Dollar', value: 'pendants' },
  { title: 'Bangles', value: 'bangles' },
  { title: 'Jadau Kundan', value: 'jadau-kundan' },
  { title: 'Combo Set', value: 'combo-sets' },
  { title: 'Other', value: 'other' },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [formState, setFormState] = useState({
    name: '',
    price: '',
    category: 'other',
    image: null,
    imageFile: null
  });
  const [isSaving, setIsSaving] = useState(false);

  // Authentication check
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      alert('Incorrect password');
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch products
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = `*[_type == "product"] | order(_createdAt desc)`;
      const data = await client.fetch(query);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
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
      category: product.category || 'other',
      image: product.images?.[0] || null,
      imageFile: null
    });
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setFormState({ name: '', price: '', category: 'other', image: null, imageFile: null });
  };

  const handleSave = async () => {
    if (!formState.name || !formState.price) {
      alert('Name and Price are required');
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
        // We handle as a single image for simplicity in UI, but schema expects an array
        productData.images = [imageAsset];
      }

      if (isAddingNew) {
        const res = await fetch('/api/admin/mutate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'create', data: productData }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
      } else {
        const res = await fetch('/api/admin/mutate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'patch',
            data: { id: editingProduct._id, ...productData }
          }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
      }

      alert('Saved successfully!');
      setEditingProduct(null);
      setIsAddingNew(false);
      fetchProducts();
    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving: ' + error.message);
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

      setShowDeleteConfirm(null);
      fetchProducts();
    } catch (error) {
      alert('Error deleting: ' + error.message);
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

  const getCategoryLabel = (val) => CATEGORIES.find(c => c.value === val)?.title || val || 'Other';

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
      </div>
    );
  }

  return (
    <div style={styles.adminContainer}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Products</h1>
        <button onClick={handleAddNew} style={styles.addButton}>+ New Product</button>
      </header>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <button
          onClick={() => setActiveFilter('all')}
          style={{...styles.filterBtn, ...(activeFilter === 'all' ? styles.filterBtnActive : {})}}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveFilter(cat.value)}
            style={{...styles.filterBtn, ...(activeFilter === cat.value ? styles.filterBtnActive : {})}}
          >
            {cat.title}
          </button>
        ))}
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
              <div style={styles.chevron}>›</div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div style={styles.noResults}>No products found in this category.</div>
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
              <div style={styles.imagePicker} onClick={() => document.getElementById('imageInput').click()}>
                {formState.image ? (
                  <img
                    src={typeof formState.image === 'string' ? formState.image : urlFor(formState.image).width(400).url()}
                    alt="Product"
                    style={styles.previewImg}
                  />
                ) : (
                  <div style={styles.uploadPlaceholder}>
                    <span>Tap to upload image</span>
                  </div>
                )}
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  capture="environment"
                />
              </div>

              <div style={styles.field}>
                <label style={styles.fieldLabel}>Name</label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  style={styles.modalInput}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.fieldLabel}>Category</label>
                <select
                  value={formState.category}
                  onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                  style={styles.modalInput}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.title}</option>
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
                />
              </div>
            </div>
            <div style={styles.modalFooter}>
              {!isAddingNew && (
                <button
                  onClick={() => setShowDeleteConfirm(editingProduct._id)}
                  style={styles.deleteBtn}
                  disabled={isSaving}
                >
                  Delete
                </button>
              )}
              <button
                onClick={handleSave}
                style={styles.saveBtn}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div style={styles.modalOverlay}>
          <div style={styles.confirmBox}>
            <p>Are you sure you want to delete this product?</p>
            <div style={styles.confirmButtons}>
              <button onClick={() => setShowDeleteConfirm(null)} style={styles.cancelBtn}>Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} style={styles.deleteConfirmBtn}>Delete</button>
            </div>
          </div>
        </div>
      )}
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
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none',
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
  },
  adminContainer: {
    minHeight: '100vh',
    background: '#f0f2f5',
    maxWidth: '600px',
    margin: '0 auto',
    paddingBottom: '80px',
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
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '14px',
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
    padding: '6px 14px',
    borderRadius: '16px',
    border: '1px solid #ddd',
    background: 'white',
    fontSize: '13px',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
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
    borderRadius: '10px',
    padding: '12px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'pointer',
  },
  productThumb: { width: '50px', height: '50px', borderRadius: '5px', overflow: 'hidden', background: '#eee', marginRight: '15px' },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover' },
  noImg: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#999' },
  productInfo: { flex: 1 },
  productName: { fontWeight: 'bold', fontSize: '16px', marginBottom: '2px' },
  productPrice: { color: '#075e54', fontWeight: 'bold' },
  categoryBadge: {
    fontSize: '10px',
    background: '#e1f5fe',
    color: '#0288d1',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  noResults: { padding: '40px', textAlign: 'center', color: '#999' },
  chevron: { color: '#bbb', fontSize: '24px' },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '20px',
  },
  modal: {
    background: 'white',
    borderRadius: '15px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: '15px 20px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: { background: 'none', border: 'none', fontSize: '20px', color: '#999', cursor: 'pointer' },
  modalBody: { padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' },
  imagePicker: {
    width: '100%',
    aspectRatio: '1',
    background: '#f8f9fa',
    borderRadius: '10px',
    border: '2px dashed #ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  previewImg: { width: '100%', height: '100%', objectFit: 'contain' },
  uploadPlaceholder: { textAlign: 'center', color: '#999' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  fieldLabel: { fontSize: '14px', fontWeight: 'bold', color: '#666' },
  modalInput: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', outline: 'none' },
  modalFooter: {
    padding: '15px 20px',
    borderTop: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
  },
  deleteBtn: { padding: '12px 20px', color: '#dc3545', background: 'none', border: '1px solid #dc3545', borderRadius: '8px', fontWeight: 'bold' },
  saveBtn: { flex: 1, padding: '12px 20px', background: '#075e54', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' },
  confirmBox: { background: 'white', padding: '20px', borderRadius: '15px', width: '100%', maxWidth: '300px', textAlign: 'center' },
  confirmButtons: { display: 'flex', gap: '10px', marginTop: '20px' },
  cancelBtn: { flex: 1, padding: '10px', background: '#eee', border: 'none', borderRadius: '8px' },
  deleteConfirmBtn: { flex: 1, padding: '10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '8px' },
};
