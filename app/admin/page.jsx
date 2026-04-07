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
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [catToDelete, setCatToDelete] = useState(null);

  const [formState, setFormState] = useState({
    name: '',
    price: '',
    category: '',
    image: null,
    imageFile: null,
    imageUrl: null
  });

  // Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  // Authentication check
  const handleLogin = (e) => {
    try {
      e.preventDefault();
      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_auth', 'true');
        showToast('Logged in successfully');
      } else {
        showToast('Incorrect password', 'error');
      }
    } catch (err) {
      showToast('Login error: ' + err.message, 'error');
    }
  };

  useEffect(() => {
    try {
      const auth = localStorage.getItem('admin_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    } catch (err) {}
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
      const productsQuery = `*[_type == "product"] | order(_createdAt desc){
        _id,
        name,
        slug,
        price,
        category,
        "imageUrl": images[0].asset->url,
        "imageAsset": images[0].asset
      }`;

      const [productsData, categoriesData] = await Promise.all([
        client.fetch(productsQuery),
        client.fetch(`*[_type == "category"] | order(title asc)`)
      ]);

      setProducts(productsData ?? []);
      setCategories(categoriesData ?? []);

      if ((categoriesData ?? []).length > 0 && !formState.category) {
        setFormState(prev => ({ ...prev, category: categoriesData[0].slug?.current || categoriesData[0].title?.toLowerCase() || '' }));
      }
    } catch (error) {
      showToast('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Mutations
  const handleEdit = (product) => {
    if (!product) return;
    setEditingProduct(product);
    setFormState({
      name: product?.name || '',
      price: product?.price || 0,
      category: product?.category || (categories?.[0]?.slug?.current || categories?.[0]?.title?.toLowerCase() || ''),
      image: null,
      imageFile: null,
      imageUrl: product?.imageUrl || null
    });
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    const firstCat = categories?.[0];
    setFormState({
      name: '',
      price: '',
      category: firstCat?.slug?.current || firstCat?.title?.toLowerCase() || '',
      image: null,
      imageFile: null,
      imageUrl: null
    });
  };

  const handleSave = async () => {
    setSaveError('');
    if (!formState.name) {
      setSaveError('Product name is required');
      return;
    }
    if (!formState.price && formState.price !== 0) {
      setSaveError('Price is required');
      return;
    }

    setIsSaving(true);
    try {
      let imageAssetRef = null;

      if (formState.imageFile) {
        const formData = new FormData();
        formData.append('file', formState.imageFile);
        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.error) throw new Error(uploadData.error);
        imageAssetRef = {
          _type: 'image',
          asset: { _type: 'reference', _ref: uploadData._id }
        };
      }

      const productData = {
        name: formState.name,
        price: Number(formState.price),
        category: formState.category,
      };

      if (imageAssetRef) {
        productData.images = [imageAssetRef];
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
            data: { id: editingProduct?._id, _type: 'product', ...productData }
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
      setSaveError('Error saving: ' + error.message);
      showToast('Error saving: ' + error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
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
      setProducts(prev => (prev ?? []).filter(p => p?._id !== id));
    } catch (error) {
      showToast('Error deleting: ' + error.message, 'error');
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    setIsSaving(true);
    setSaveError('');
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
      setSaveError('Error: ' + error.message);
      showToast('Error: ' + error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!id) return;
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

  // BUG 2 FIX: Unified image change handler for preview
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormState({
        ...formState,
        imageFile: file,
        imageUrl: URL.createObjectURL(file)
      });
      showToast('Image selected');
    }
  };

  const filteredProducts = activeFilter === 'all'
    ? products
    : (products ?? []).filter(p => p?.category === activeFilter);

  const getCategoryLabel = (val) => (categories ?? []).find(c => (c?.slug?.current || c?.slug || c?.title?.toLowerCase()) === val)?.title || val || 'Other';

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
        <h1 style={styles.headerTitle}>Admin</h1>
        <div style={{display: 'flex', gap: '8px'}}>
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
          {(filteredProducts ?? []).map((product) => (
            <div
              key={product?._id}
              style={{
                ...styles.productItem,
                borderLeft: (product?.price === 0 || !product?.price) ? '5px solid #d32f2f' : 'none'
              }}
              onClick={() => handleEdit(product)}
            >
              <div style={styles.productThumb}>
                {product?.imageUrl ? (
                  <img src={product?.imageUrl} alt="" style={styles.thumbImg} />
                ) : (
                  <div style={styles.noImg}>No Image</div>
                )}
              </div>
              <div style={styles.productInfo}>
                <div style={styles.productName}>{product?.name}</div>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  {/* Price highlighting fix */}
                  {(product?.price === 0 || !product?.price) ? (
                    <div style={styles.missingPrice}>Price Missing</div>
                  ) : (
                    <div style={styles.productPrice}>₹{product?.price}</div>
                  )}
                  {product?.category && (
                    <span style={styles.categoryBadge}>{getCategoryLabel(product?.category)}</span>
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
          {(filteredProducts ?? []).length === 0 && (
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
                  {formState.imageUrl ? (
                    <img
                      src={formState.imageUrl}
                      alt="Product"
                      style={styles.previewImg}
                    />
                  ) : (
                    <div style={styles.uploadPlaceholder}>No image selected</div>
                  )}
                </div>

                {/* BUG 2 FIX: Two separate visible buttons */}
                <div style={styles.uploadButtonsGrid}>
                  <label style={styles.uploadLabelGallery}>
                    📁 Gallery
                    <input
                      type="file"
                      accept="image/*"
                      style={{display:'none'}}
                      onChange={handleImageSelect}
                    />
                  </label>

                  <label style={styles.uploadLabelCamera} className="camera-btn">
                    📷 Camera
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      style={{display:'none'}}
                      onChange={handleImageSelect}
                    />
                  </label>
                </div>
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
              {saveError && <p style={{color: '#e53e3e', fontSize: '14px', marginBottom: '10px', textAlign: 'left'}}>{saveError}</p>}
              <div style={{display: 'flex', gap: '12px'}}>
                <button
                  onClick={() => { setEditingProduct(null); setIsAddingNew(false); setSaveError(''); }}
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
              Are you sure you want to delete &quot;{showDeleteConfirm.name}&quot;? This cannot be undone.
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
              Delete category &quot;{catToDelete.title}&quot;?
            </p>
            <div style={styles.confirmButtons}>
              <button onClick={() => setCatToDelete(null)} style={styles.cancelBtnLarge}>Cancel</button>
              <button onClick={() => handleDeleteCategory(catToDelete._id)} style={styles.deleteConfirmBtn}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast.message && <div style={{...styles.toast, background: toast.type === 'error' ? '#f44336' : '#4caf50'}}>{toast.message}</div>}

      {/* BUG 2 FIX: Hide camera btn on desktop */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (hover: hover) {
          .camera-btn {
            display: none !important;
          }
        }
      `}} />
    </div>
  );
}

const styles = {
  loginContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5', padding: '20px' },
  loginCard: { background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' },
  title: { margin: '0 0 10px', fontSize: '24px', color: '#111' },
  subtitle: { margin: '0 0 20px', color: '#666', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', outline: 'none', height: '48px' },
  button: { padding: '12px', background: '#128c7e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', height: '48px' },
  adminContainer: { minHeight: '100vh', background: '#f0f2f5', maxWidth: '600px', margin: '0 auto', paddingBottom: '100px', position: 'relative' },
  header: { padding: '12px 16px', background: '#075e54', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, flexWrap: 'wrap', gap: '10px' },
  headerTitle: { fontSize: '18px', margin: 0, fontWeight: '800' },
  addButton: { background: '#25d366', color: 'white', border: 'none', padding: '0 14px', borderRadius: '24px', fontWeight: 'bold', fontSize: '13px', height: '36px' },
  secondaryHeaderBtn: { background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '0 14px', borderRadius: '24px', fontSize: '13px', height: '36px' },
  filterBar: { display: 'flex', gap: '6px', padding: '10px 12px', overflowX: 'auto', background: 'white', borderBottom: '1px solid #eee', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' },
  filterBtn: { padding: '0 12px', borderRadius: '18px', border: '1px solid #ddd', background: 'white', fontSize: '12px', whiteSpace: 'nowrap', cursor: 'pointer', height: '32px', transition: 'all 0.2s' },
  filterBtnActive: { background: '#075e54', color: 'white', borderColor: '#075e54' },
  loading: { padding: '40px', textAlign: 'center', color: '#666' },
  productList: { padding: '10px' },
  productItem: { background: 'white', borderRadius: '12px', padding: '10px', marginBottom: '8px', display: 'flex', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', cursor: 'pointer', position: 'relative', overflow: 'hidden' },
  productThumb: { width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', background: '#f8f9fa', marginRight: '12px', flexShrink: 0 },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover' },
  noImg: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#999', textAlign: 'center', padding: '2px' },
  productInfo: { flex: 1, minWidth: 0 },
  productName: { fontWeight: 'bold', fontSize: '15px', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  productPrice: { color: '#075e54', fontWeight: 'bold', fontSize: '14px' },
  missingPrice: { color: '#d32f2f', fontWeight: 'bold', fontSize: '12px' },
  categoryBadge: { fontSize: '9px', background: '#e1f5fe', color: '#0288d1', padding: '1px 6px', borderRadius: '8px', fontWeight: 'bold', textTransform: 'uppercase' },
  itemDeleteBtn: { background: 'none', border: 'none', fontSize: '18px', padding: '8px', marginRight: '2px', cursor: 'pointer', flexShrink: 0 },
  noResults: { padding: '40px', textAlign: 'center', color: '#999' },
  chevron: { color: '#bbb', fontSize: '20px', flexShrink: 0 },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '15px' },
  modal: { background: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' },
  modalHeader: { padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa' },
  closeBtn: { background: 'none', border: 'none', fontSize: '24px', color: '#999', cursor: 'pointer' },
  modalBody: { padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' },
  imageSection: { display: 'flex', flexDirection: 'column', gap: '12px' },
  imagePreviewWrap: { width: '100%', aspectRatio: '1', background: '#f1f3f4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #eee' },
  previewImg: { width: '100%', height: '100%', objectFit: 'contain' },
  uploadPlaceholder: { color: '#999', fontSize: '14px' },
  uploadButtonsGrid: { display: 'flex', gap: '8px' },
  uploadLabelGallery: { flex: 1, minHeight: '44px', padding: '12px 8px', background: '#f0f0f0', borderRadius: '10px', textAlign: 'center', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  uploadLabelCamera: { flex: 1, minHeight: '44px', padding: '12px 8px', background: '#e8f5e9', borderRadius: '10px', textAlign: 'center', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  fieldLabel: { fontSize: '13px', fontWeight: 'bold', color: '#555' },
  modalInput: { padding: '0 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', outline: 'none', height: '44px', background: '#fff' },
  modalFooter: { padding: '16px', borderTop: '1px solid #eee', display: 'flex', gap: '10px', background: '#f8f9fa' },
  cancelBtnLarge: { flex: 1, height: '44px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' },
  saveBtn: { flex: 2, height: '44px', background: '#075e54', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' },
  addCatRow: { display: 'flex', gap: '10px', marginBottom: '20px' },
  catInput: { flex: 1, height: '48px', padding: '0 15px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' },
  addCatBtn: { width: '80px', height: '48px', background: '#25d366', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' },
  catList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  catItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', background: '#f8f9fa', borderRadius: '8px' },
  catDeleteBtn: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' },
  confirmBox: { background: 'white', padding: '25px', borderRadius: '16px', width: '100%', maxWidth: '350px', textAlign: 'center' },
  confirmButtons: { display: 'flex', gap: '12px' },
  deleteConfirmBtn: { flex: 1, height: '48px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' },
  toast: { position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', padding: '12px 24px', borderRadius: '30px', color: 'white', fontSize: '14px', fontWeight: 'bold', zIndex: 1000, boxShadow: '0 4px 10px rgba(0,0,0,0.2)', transition: 'all 0.3s ease' },
};
