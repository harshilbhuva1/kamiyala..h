import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Helper functions for localStorage
const loadCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem('martok_cart');
    return cartData ? JSON.parse(cartData) : { items: [], total: 0, itemCount: 0 };
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return { items: [], total: 0, itemCount: 0 };
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('martok_cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

// Calculate cart totals
const calculateCartTotals = (items) => {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce((total, item) => total + (item.discountedPrice * item.quantity), 0);
  
  return { itemCount, total: Math.round(total * 100) / 100 };
};

// Initial state
const initialState = {
  ...loadCartFromStorage(),
  loading: false,
  error: null,
  isOpen: false, // For cart drawer/modal
  appliedCoupon: null,
  couponDiscount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      
      // Check if product already exists in cart
      const existingItemIndex = state.items.findIndex(item => item.productId === product._id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if product exists
        const existingItem = state.items[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        
        // Check stock availability
        if (newQuantity > product.stock) {
          toast.error(`Only ${product.stock} items available in stock`);
          return;
        }
        
        state.items[existingItemIndex].quantity = newQuantity;
        toast.success(`Updated ${product.name} quantity in cart`);
      } else {
        // Add new item to cart
        if (quantity > product.stock) {
          toast.error(`Only ${product.stock} items available in stock`);
          return;
        }
        
        const cartItem = {
          productId: product._id,
          name: product.name,
          image: product.images[0]?.url || '',
          price: product.price,
          discountedPrice: product.discountedPrice || product.price,
          quantity,
          stock: product.stock,
          brand: product.brand || '',
        };
        
        state.items.push(cartItem);
        toast.success(`${product.name} added to cart`);
      }
      
      // Recalculate totals
      const totals = calculateCartTotals(state.items);
      state.itemCount = totals.itemCount;
      state.total = totals.total;
      
      // Save to localStorage
      saveCartToStorage({
        items: state.items,
        total: state.total,
        itemCount: state.itemCount,
      });
    },
    
    removeFromCart: (state, action) => {
      const productId = action.payload;
      const itemIndex = state.items.findIndex(item => item.productId === productId);
      
      if (itemIndex >= 0) {
        const item = state.items[itemIndex];
        state.items.splice(itemIndex, 1);
        toast.success(`${item.name} removed from cart`);
        
        // Recalculate totals
        const totals = calculateCartTotals(state.items);
        state.itemCount = totals.itemCount;
        state.total = totals.total;
        
        // Save to localStorage
        saveCartToStorage({
          items: state.items,
          total: state.total,
          itemCount: state.itemCount,
        });
      }
    },
    
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.productId === productId);
      
      if (itemIndex >= 0) {
        const item = state.items[itemIndex];
        
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          state.items.splice(itemIndex, 1);
          toast.success(`${item.name} removed from cart`);
        } else if (quantity > item.stock) {
          toast.error(`Only ${item.stock} items available in stock`);
          return;
        } else {
          // Update quantity
          state.items[itemIndex].quantity = quantity;
        }
        
        // Recalculate totals
        const totals = calculateCartTotals(state.items);
        state.itemCount = totals.itemCount;
        state.total = totals.total;
        
        // Save to localStorage
        saveCartToStorage({
          items: state.items,
          total: state.total,
          itemCount: state.itemCount,
        });
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      state.appliedCoupon = null;
      state.couponDiscount = 0;
      
      // Clear localStorage
      localStorage.removeItem('martok_cart');
      toast.success('Cart cleared');
    },
    
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    
    openCart: (state) => {
      state.isOpen = true;
    },
    
    closeCart: (state) => {
      state.isOpen = false;
    },
    
    applyCoupon: (state, action) => {
      const { coupon, discount } = action.payload;
      state.appliedCoupon = coupon;
      state.couponDiscount = discount;
      toast.success(`Coupon "${coupon.code}" applied! You saved ₹${discount}`);
    },
    
    removeCoupon: (state) => {
      const couponCode = state.appliedCoupon?.code;
      state.appliedCoupon = null;
      state.couponDiscount = 0;
      if (couponCode) {
        toast.success(`Coupon "${couponCode}" removed`);
      }
    },
    
    syncCartWithAuth: (state, action) => {
      // This can be used to sync cart when user logs in
      // For now, we'll keep the current cart as is
      // In a real app, you might want to merge server cart with local cart
      const { userCart } = action.payload || {};
      
      if (userCart && userCart.items && userCart.items.length > 0) {
        // Merge logic can be implemented here
        // For now, we'll keep local cart
      }
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  applyCoupon,
  removeCoupon,
  syncCartWithAuth,
  setLoading,
  setError,
  clearError,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartItemCount = (state) => state.cart.itemCount;
export const selectCartIsOpen = (state) => state.cart.isOpen;
export const selectAppliedCoupon = (state) => state.cart.appliedCoupon;
export const selectCouponDiscount = (state) => state.cart.couponDiscount;
export const selectFinalTotal = (state) => state.cart.total - state.cart.couponDiscount;

export default cartSlice.reducer;