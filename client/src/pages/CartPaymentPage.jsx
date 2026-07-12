import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaMobileAlt, FaDesktop, FaQrcode, FaShoppingBag } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { API_URL } from '../api';

const UPI_ID = 'shivanshkashyap27-2@oksbi';

const CartPaymentPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mobile'); // 'mobile' or 'qr'
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [userDetails, setUserDetails] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.mobile || ''
  });

  // Authentication & Cart Empty check
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          from: `/payment/cart`,
          message: 'Please log in to proceed with payment'
        } 
      });
      return;
    }
    
    if (cartItems.length === 0 && !paymentSuccess) {
      navigate('/student-dashboard');
    }
  }, [isAuthenticated, cartItems, navigate, paymentSuccess]);

  // Sync user details when user state loads
  useEffect(() => {
    if (user) {
      setUserDetails({
        fullName: user.name || '',
        email: user.email || '',
        phone: user.mobile || ''
      });
    }
  }, [user]);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const generateUpiLink = () => {
    if (cartItems.length === 0) return '';
    
    const amount = cartTotal;
    const courseNames = cartItems.map(item => item.subject || item.title).join(', ').slice(0, 50);
    const transactionRef = `AW${Date.now().toString().slice(-6)}`;
    
    return `upi://pay?pa=${UPI_ID}&pn=AcademyWale&mc=0000&tid=${transactionRef}&tn=${encodeURIComponent(courseNames)}&am=${amount}&cu=INR`;
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentVerification = async (e) => {
    e.preventDefault();
    
    if (!transactionId) {
      alert('Please enter your UPI transaction ID/reference number');
      return;
    }

    if (!userDetails.phone) {
      alert('Please provide a contact phone number for verification updates');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      // Record all purchases from cart in the database
      const purchaseRes = await fetch(`${API_URL}/api/purchase/cart-purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user?.id || user?._id,
          cartItems: cartItems,
          transactionId: transactionId,
          amount: cartTotal,
          userDetails: {
            name: userDetails.fullName || user?.name,
            email: userDetails.email || user?.email,
            phone: userDetails.phone
          }
        })
      });
      
      const data = await purchaseRes.json();
      
      if (purchaseRes.ok) {
        // Clear cart
        clearCart();
        
        // Show success and redirect
        setPaymentSuccess(true);
        setTimeout(() => {
          navigate('/student-dashboard');
        }, 4000);
      } else {
        setError(data.message || 'Failed to submit payment verification request.');
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setError('Server error during payment submission. Please check your internet connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-teal-200">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-[#20b2aa] text-5xl" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Payment Submitted!</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your verification request has been successfully recorded. 
            Our admin team will verify the payment against Transaction ID: <strong className="text-gray-800">{transactionId}</strong>.
            Your courses will be activated shortly.
          </p>
          <div className="text-sm text-gray-500 animate-pulse">
            Redirecting to student dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7f4] via-purple-50 to-yellow-50 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-teal-700 hover:text-teal-800 font-semibold mb-6 transition-all"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-teal-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#20b2aa] to-[#126862] px-6 py-5 text-white flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <FaShoppingBag className="mr-3" /> Checkout Cart
              </h1>
              <p className="text-teal-100 text-sm mt-1">UPI Payment Gateway</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-teal-100 block">Total Price ({cartItems.length} items)</span>
              <span className="text-2xl font-extrabold">₹{cartTotal.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-200">
                {error}
              </div>
            )}
            
            {/* Cart summary list */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-150">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wider">Items in Order</h3>
              <div className="divide-y divide-gray-200 max-h-48 overflow-y-auto pr-1">
                {cartItems.map((item, i) => (
                  <div key={item.uniqueId || i} className="py-3 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-bold text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-500">
                        Mode: {item.mode || 'Standard'} | Validity: {item.attempt || 'Standard'} | Faculty: {item.facultyName}
                      </p>
                    </div>
                    <span className="font-bold text-gray-900">₹{Number(item.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* User Details Verification Form */}
            <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100/50 mb-6">
              <h3 className="font-semibold text-[#126862] mb-3">Billing & Verification Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={userDetails.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#20b2aa]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userDetails.email}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#20b2aa]"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Mobile / Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={userDetails.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#20b2aa]"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Choose Payment Method</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('mobile')}
                  className={`flex-1 flex items-center justify-center py-3.5 rounded-xl border-2 transition-all ${
                    paymentMethod === 'mobile' 
                      ? 'border-[#20b2aa] bg-teal-50 text-[#126862]' 
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <FaMobileAlt className="mr-2 text-lg" />
                  <span className="font-bold">Pay via Mobile UPI App</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('qr')}
                  className={`flex-1 flex items-center justify-center py-3.5 rounded-xl border-2 transition-all ${
                    paymentMethod === 'qr' 
                      ? 'border-[#20b2aa] bg-teal-50 text-[#126862]' 
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <FaQrcode className="mr-2 text-lg" />
                  <span className="font-bold">Scan QR Code</span>
                </button>
              </div>
            </div>
            
            {/* Payment Instructions */}
            {paymentMethod === 'mobile' && (
              <div className="bg-teal-50/70 p-5 rounded-xl mb-6 border border-teal-100">
                <h3 className="font-bold text-[#126862] mb-3">Pay using Mobile UPI App</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1.5 text-sm">
                  <li>Click the <strong>Pay Now</strong> button below.</li>
                  <li>It will open your default UPI payment app (PhonePe, GPay, Paytm, etc.).</li>
                  <li>Complete the payment of <strong>₹{cartTotal.toLocaleString()}</strong>.</li>
                  <li>Return to this page, enter the transaction Reference ID, and click verify.</li>
                </ul>
                
                <div className="flex justify-center my-3">
                  <a 
                    href={generateUpiLink()}
                    className="bg-gradient-to-r from-[#20b2aa] to-[#126862] text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg flex items-center justify-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaMobileAlt className="mr-2 text-lg" /> Pay Now ₹{cartTotal.toLocaleString()}
                  </a>
                </div>
              </div>
            )}
            
            {paymentMethod === 'qr' && (
              <div className="bg-teal-50/70 p-5 rounded-xl mb-6 border border-teal-100">
                <h3 className="font-bold text-[#126862] mb-3">Scan QR Code to Pay</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1.5 text-sm">
                  <li>Open any UPI app on your phone (GPay, PhonePe, Paytm, BHIM).</li>
                  <li>Scan the QR code below.</li>
                  <li>Enter the exact amount: <strong>₹{cartTotal.toLocaleString()}</strong>.</li>
                  <li>Complete the payment and enter the Reference ID below.</li>
                </ul>
                
                <div className="flex flex-col items-center my-4">
                  <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-150 mb-3">
                    <img src="/qr.jpg" alt="UPI QR Code" className="w-48 h-48 object-contain" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">UPI ID: <strong className="text-gray-900">{UPI_ID}</strong></p>
                    <button
                      type="button"
                      onClick={copyUpiId}
                      className={`text-xs font-bold mt-1 ${copySuccess ? 'text-green-600' : 'text-teal-600 hover:text-teal-800'}`}
                    >
                      {copySuccess ? 'Copied ✓' : 'Copy UPI ID'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Transaction Verification Form */}
            <form onSubmit={handlePaymentVerification} className="border-t border-gray-200 pt-6">
              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Enter UPI Transaction ID / Reference Number
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. 320492847293 or UTR number"
                  className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:border-[#20b2aa] focus:ring-1 focus:ring-[#20b2aa] font-medium"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Usually a 12-digit numeric reference code found in your payment transaction details.
                </p>
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className={`w-full font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center text-lg ${
                  submitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#20b2aa] to-[#126862] text-white hover:from-[#17817a] hover:to-[#105c56]'
                }`}
              >
                {submitting ? (
                  <span>Verifying Payment...</span>
                ) : (
                  <span>Verify and Activate Courses</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPaymentPage;
