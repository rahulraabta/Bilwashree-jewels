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
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [formState, setFormState] = useState({ name: '', price: '', image: null, imageFile: null });
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
      image: product.images?.[0] || null,
      imageFile: null
    });
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setFormState({ name: '', price: '', image: null, imageFile: null });
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

      {loading ? (
        <div style={styles.loading}>Loading items...</div>
      ) : (
        <div style={styles.productList}>
          {products.map((product) => (
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
                <div style={styles.productPrice}>₹{product.price}</div>
              </div>
              <div style={styles.chevron}>›</div>
            </div>
          ))}
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
                <label>Name</label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  style={styles.modalInput}
                />
              </div>

              <div style={styles.field}>
                <label>Price (₹)</label>
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
  modalInput: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' },
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
