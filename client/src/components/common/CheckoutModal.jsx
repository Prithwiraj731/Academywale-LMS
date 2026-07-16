import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaTrashAlt, FaEdit, FaCheckCircle, FaTimes, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { API_URL } from '../../api';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

export default function CheckoutModal({ 
  user, 
  onClose, 
  onProceed, 
  itemsSummary = [], 
  totalAmount, 
  courseInfo = null 
}) {
  const [personalDetails, setPersonalDetails] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  
  // Name update states
  const [initialName, setInitialName] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [nameUpdatedSuccess, setNameUpdatedSuccess] = useState(false);

  // Form states for adding/editing address
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    pinCode: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 1. Prefill user profile details
  useEffect(() => {
    if (user) {
      setPersonalDetails({
        fullName: user.name || '',
        email: user.email || '',
        phone: user.mobile || ''
      });
      setInitialName(user.name || '');
      
      // Load saved addresses from localStorage
      const userAddressesKey = `academywale_addresses_${user.id || user._id}`;
      const saved = localStorage.getItem(userAddressesKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAddresses(parsed);
          // Auto select first address if available
          if (parsed.length > 0) {
            setSelectedAddressId(parsed[0].id);
          }
        } catch (e) {
          console.error('Error parsing saved addresses', e);
        }
      }
    }
  }, [user]);

  // Save address list to local storage
  const saveAddressesToStorage = useCallback((addressList) => {
    if (user) {
      const userAddressesKey = `academywale_addresses_${user.id || user._id}`;
      localStorage.setItem(userAddressesKey, JSON.stringify(addressList));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateName = async () => {
    if (!personalDetails.fullName.trim()) return;
    setIsUpdatingName(true);
    setNameUpdatedSuccess(false);
    try {
      const response = await fetch(`${API_URL}/api/auth/update-name`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: personalDetails.fullName.trim() })
      });
      if (response.ok) {
        setInitialName(personalDetails.fullName.trim());
        setNameUpdatedSuccess(true);
        // Force update of the user name on the window object or auth context if stored globally
        if (user) {
          user.name = personalDetails.fullName.trim();
        }
        setTimeout(() => setNameUpdatedSuccess(false), 3000);
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to update name');
      }
    } catch (err) {
      console.error('Error updating name:', err);
      alert('Error updating profile name');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleAddressFormChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
  };

  // Add or Edit Address
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.pinCode) {
      alert('Please fill in all address fields');
      return;
    }

    let updatedAddresses;
    if (editingAddressId) {
      // Edit mode
      updatedAddresses = addresses.map(addr => 
        addr.id === editingAddressId ? { ...addressForm, id: editingAddressId } : addr
      );
      setEditingAddressId(null);
    } else {
      // Add mode
      const newAddress = {
        ...addressForm,
        id: Date.now().toString()
      };
      updatedAddresses = [...addresses, newAddress];
      setSelectedAddressId(newAddress.id);
    }

    setAddresses(updatedAddresses);
    saveAddressesToStorage(updatedAddresses);
    
    // Reset form
    setAddressForm({ street: '', city: '', state: '', pinCode: '' });
    setShowAddressForm(false);
  };

  const handleEditAddressClick = (addr, e) => {
    e.stopPropagation(); // Prevent select trigger
    setAddressForm({
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pinCode: addr.pinCode
    });
    setEditingAddressId(addr.id);
    setShowAddressForm(true);
  };

  const handleDeleteAddressClick = (id, e) => {
    e.stopPropagation(); // Prevent select trigger
    const updated = addresses.filter(addr => addr.id !== id);
    setAddresses(updated);
    saveAddressesToStorage(updated);
    if (selectedAddressId === id) {
      setSelectedAddressId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const handleProceed = async () => {
    if (!personalDetails.fullName || !personalDetails.email) {
      setError('Please fill in your name and email.');
      return;
    }

    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
    if (!selectedAddress) {
      setError('Please add and select a shipping/billing address.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Pre-payment API notification (asynchronous background call)
    const courseName = courseInfo?.title || courseInfo?.subject || itemsSummary.join(', ') || 'LMS Courses';
    
    const payload = {
      courseName,
      courseId: courseInfo?.id || 'cart',
      userDetails: {
        fullName: personalDetails.fullName,
        email: personalDetails.email,
        phone: personalDetails.phone,
        address: selectedAddress
      },
      selectedMode: courseInfo?.selectedMode || 'Cart checkout',
      selectedValidity: courseInfo?.selectedValidity || 'Cart checkout',
      price: totalAmount
    };

    fetch(`${API_URL}/api/notify/course-interest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch(err => console.error('Failed to notify course interest:', err));

    // Redirect to payment immediately
    onProceed(personalDetails, selectedAddress);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-3 md:p-4 z-[9999] backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-5 md:p-7 max-w-xl w-full mx-auto my-8 animate-fadeIn max-h-[90vh] overflow-y-auto relative">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaUser className="text-[#20b2aa] text-lg md:text-xl" />
            Checkout Information
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-all"
            aria-label="Close"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded text-sm mb-4">
            {error}
          </div>
        )}

        <div className="space-y-6">
          
          {/* Section 1: Personal Details */}
          <div className="bg-teal-50/30 p-4 rounded-xl border border-teal-100/50">
            <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center text-xs font-bold">1</span>
              Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    value={personalDetails.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-300 rounded-lg py-2 pr-20 pl-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#20b2aa]"
                    required
                  />
                  {personalDetails.fullName !== initialName && personalDetails.fullName.trim() !== '' && (
                    <button
                      type="button"
                      onClick={handleUpdateName}
                      disabled={isUpdatingName}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#20b2aa] hover:bg-[#126862] text-white text-xs font-bold py-1 px-2.5 rounded transition-all disabled:opacity-50"
                    >
                      {isUpdatingName ? 'Saving...' : 'Update'}
                    </button>
                  )}
                </div>
                {personalDetails.fullName !== initialName && personalDetails.fullName.trim() !== '' && (
                  <p className="text-[11px] text-amber-600 mt-1 font-semibold">
                    ⚠️ Click "Update" to save name changes before proceeding.
                  </p>
                )}
                {nameUpdatedSuccess && (
                  <p className="text-xs text-green-600 mt-1 font-medium">✓ Profile name updated successfully!</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={personalDetails.email}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#20b2aa]"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Phone Number (Cannot be changed)</label>
                <input
                  type="tel"
                  name="phone"
                  value={personalDetails.phone}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-700 cursor-not-allowed focus:outline-none"
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Section 2: Address Section */}
          <div className="bg-blue-50/20 p-4 rounded-xl border border-blue-100/30">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800 text-sm md:text-base flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                Billing & Shipping Address
              </h3>
              {!showAddressForm && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingAddressId(null);
                    setAddressForm({ street: '', city: '', state: '', pinCode: '' });
                    setShowAddressForm(true);
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#126862] hover:text-[#20b2aa] transition-colors"
                >
                  <FaPlus className="text-xs" /> Add New
                </button>
              )}
            </div>

            {/* Address Edit/Add Form */}
            {showAddressForm && (
              <form onSubmit={handleSaveAddress} className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-inner space-y-3">
                <h4 className="font-bold text-gray-700 text-xs uppercase">
                  {editingAddressId ? 'Edit Address' : 'New Address Details'}
                </h4>
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={addressForm.street}
                    onChange={handleAddressFormChange}
                    placeholder="House/Flat No, Area, Landmark"
                    className="w-full border border-gray-300 rounded-lg py-1.5 px-3 text-sm text-gray-800 focus:outline-none focus:border-[#20b2aa]"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">City</label>
                    <input
                      type="text"
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressFormChange}
                      placeholder="City"
                      className="w-full border border-gray-300 rounded-lg py-1.5 px-3 text-sm text-gray-800 focus:outline-none focus:border-[#20b2aa]"
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">State</label>
                    <select
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressFormChange}
                      className="w-full border border-gray-300 rounded-lg py-1.5 px-3 text-sm text-gray-800 focus:outline-none focus:border-[#20b2aa] bg-white"
                      required
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Pincode</label>
                    <input
                      type="text"
                      name="pinCode"
                      value={addressForm.pinCode}
                      onChange={handleAddressFormChange}
                      placeholder="Pin Code"
                      className="w-full border border-gray-300 rounded-lg py-1.5 px-3 text-sm text-gray-800 focus:outline-none focus:border-[#20b2aa]"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="border border-gray-300 text-gray-600 font-medium py-1 px-3 rounded-lg text-xs hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#20b2aa] text-white font-medium py-1 px-3 rounded-lg text-xs hover:bg-[#126862] transition-colors"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            {/* List Saved Addresses */}
            {addresses.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-sm bg-white rounded-xl border border-dashed border-gray-300">
                <FaMapMarkerAlt className="mx-auto text-gray-300 text-2xl mb-2" />
                No addresses saved yet. Please add a shipping address.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {addresses.map((addr) => {
                  const isSelected = addr.id === selectedAddressId;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`cursor-pointer bg-white border-2 rounded-xl p-3 flex justify-between items-center transition-all ${
                        isSelected 
                          ? 'border-green-500 shadow-sm ring-1 ring-green-100' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {isSelected ? (
                            <FaCheckCircle className="text-green-500 text-base" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                          )}
                        </div>
                        <div className="text-xs md:text-sm text-gray-700">
                          <p className="font-semibold text-gray-800">{addr.street}</p>
                          <p className="text-gray-500">{addr.city}, {addr.state} - {addr.pinCode}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          type="button"
                          onClick={(e) => handleEditAddressClick(addr, e)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded"
                          title="Edit Address"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteAddressClick(addr.id, e)}
                          className="p-1.5 text-red-300 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete Address"
                        >
                          <FaTrashAlt className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 3: Course / Cart summary */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-gray-200 text-gray-800 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              Order Summary
            </h3>
            {courseInfo ? (
              <div className="text-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-gray-900">{courseInfo.title || courseInfo.subject}</div>
                  <div className="font-semibold text-gray-800">₹{totalAmount}</div>
                </div>
                <div className="text-xs text-gray-500 flex flex-wrap gap-x-2 gap-y-1">
                  {courseInfo.selectedMode && (
                    <span><strong>Mode:</strong> {courseInfo.selectedMode}</span>
                  )}
                  {courseInfo.selectedAttempt && (
                    <span>• <strong>Attempt:</strong> {courseInfo.selectedAttempt}</span>
                  )}
                  {courseInfo.selectedValidity && (
                    <span>• <strong>Validity:</strong> {courseInfo.selectedValidity}</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm">
                <div className="space-y-1 mb-3">
                  {itemsSummary.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-gray-700">
                      <span>• {item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-semibold text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-base text-[#126862]">₹{totalAmount}</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-800 font-bold py-2.5 rounded-xl hover:bg-gray-200 transition-colors text-center text-sm md:text-base"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleProceed}
            disabled={isSubmitting || addresses.length === 0 || !selectedAddressId || personalDetails.fullName !== initialName}
            className="flex-1 bg-gradient-to-r from-[#20b2aa] to-[#126862] text-white font-bold py-2.5 rounded-xl hover:from-[#20b2aa] hover:to-[#0f544f] transition-all flex items-center justify-center gap-1.5 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </div>

      </div>
    </div>
  );
}
